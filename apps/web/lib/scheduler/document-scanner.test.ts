import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetDocuments = vi.fn();

// Mock dependencies before imports
vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    paperlessDocument: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    processingQueue: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@repo/paperless-client', () => ({
  PaperlessClient: class MockPaperlessClient {
    getDocuments = mockGetDocuments;
  },
}));

vi.mock('@/lib/crypto/encryption', () => ({
  decrypt: vi.fn((token: string) => `decrypted-${token}`),
}));

vi.mock('cron-parser', () => ({
  CronExpressionParser: {
    parse: vi.fn().mockReturnValue({
      next: vi.fn().mockReturnValue({
        toDate: vi.fn().mockReturnValue(new Date('2024-01-15T11:00:00Z')),
      }),
    }),
  },
}));

import { prisma } from '@repo/database';
import { scanInstance, calculateNextScanTime, scanDueInstances } from './document-scanner';
import { QueueStatus } from './types';

describe('document-scanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateNextScanTime', () => {
    it('parses cron expression and returns next date', () => {
      const result = calculateNextScanTime('*/30 * * * *');
      expect(result).toEqual(new Date('2024-01-15T11:00:00Z'));
    });
  });

  describe('scanInstance', () => {
    const mockInstance = {
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'http://localhost:8000',
      apiToken: 'test-token',
      importFilterTags: [],
      scanCronExpression: '*/30 * * * *',
      defaultAiBotId: 'bot-1',
      defaultAiBot: { id: 'bot-1', name: 'Test Bot' },
    };

    it('returns error when instance not found', async () => {
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue(null);

      const result = await scanInstance('non-existent');

      expect(result).toEqual({
        instanceId: 'non-existent',
        instanceName: 'Unknown',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
        error: 'Instance not found',
      });
    });

    it('returns error when no default AI bot configured', async () => {
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue({
        ...mockInstance,
        defaultAiBotId: null,
        defaultAiBot: null,
      } as never);
      vi.mocked(prisma.paperlessInstance.update).mockResolvedValue({} as never);

      const result = await scanInstance('instance-1');

      expect(result).toEqual({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 0,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
        error: 'No default AI bot configured',
      });
      expect(prisma.paperlessInstance.update).toHaveBeenCalledWith({
        where: { id: 'instance-1' },
        data: expect.objectContaining({ lastScanAt: expect.any(Date) }),
      });
    });

    it('queues new documents from Paperless', async () => {
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue(mockInstance as never);
      vi.mocked(prisma.paperlessDocument.findMany).mockResolvedValue([]);
      vi.mocked(prisma.processingQueue.findMany).mockResolvedValue([]);
      vi.mocked(prisma.paperlessDocument.upsert).mockResolvedValue({ id: 'doc-local-1' } as never);
      vi.mocked(prisma.processingQueue.create).mockResolvedValue({} as never);
      vi.mocked(prisma.paperlessInstance.update).mockResolvedValue({} as never);

      mockGetDocuments.mockResolvedValue({
        results: [
          {
            id: 123,
            title: 'Doc 1',
            content: 'Content',
            tags: [],
            correspondent: null,
            modified: '2024-01-15T10:00:00Z',
            created: '2024-01-14T10:00:00Z',
          },
        ],
        next: null,
      });

      const result = await scanInstance('instance-1');

      expect(result).toEqual({
        instanceId: 'instance-1',
        instanceName: 'Test Instance',
        documentsQueued: 1,
        documentsAlreadyProcessed: 0,
        documentsAlreadyQueued: 0,
      });
      expect(prisma.paperlessDocument.upsert).toHaveBeenCalled();
      expect(prisma.processingQueue.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          paperlessDocumentId: 123,
          paperlessInstanceId: 'instance-1',
          aiBotId: 'bot-1',
          status: QueueStatus.PENDING,
        }),
      });
    });

    it('skips documents that are already processed', async () => {
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue(mockInstance as never);
      vi.mocked(prisma.paperlessDocument.findMany).mockResolvedValue([
        { paperlessId: 123 },
      ] as never);
      vi.mocked(prisma.processingQueue.findMany).mockResolvedValue([]);
      vi.mocked(prisma.paperlessInstance.update).mockResolvedValue({} as never);

      mockGetDocuments.mockResolvedValue({
        results: [
          {
            id: 123,
            title: 'Doc 1',
            content: 'Content',
            tags: [],
            correspondent: null,
            modified: '2024-01-15T10:00:00Z',
            created: '2024-01-14T10:00:00Z',
          },
        ],
        next: null,
      });

      const result = await scanInstance('instance-1');

      expect(result.documentsAlreadyProcessed).toBe(1);
      expect(result.documentsQueued).toBe(0);
      expect(prisma.processingQueue.create).not.toHaveBeenCalled();
    });

    it('skips documents that are already in queue', async () => {
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue(mockInstance as never);
      vi.mocked(prisma.paperlessDocument.findMany).mockResolvedValue([]);
      vi.mocked(prisma.processingQueue.findMany).mockResolvedValue([
        { paperlessDocumentId: 123, status: QueueStatus.PENDING },
      ] as never);
      vi.mocked(prisma.paperlessInstance.update).mockResolvedValue({} as never);

      mockGetDocuments.mockResolvedValue({
        results: [
          {
            id: 123,
            title: 'Doc 1',
            content: 'Content',
            tags: [],
            correspondent: null,
            modified: '2024-01-15T10:00:00Z',
            created: '2024-01-14T10:00:00Z',
          },
        ],
        next: null,
      });

      const result = await scanInstance('instance-1');

      expect(result.documentsAlreadyQueued).toBe(1);
      expect(result.documentsQueued).toBe(0);
      expect(prisma.processingQueue.create).not.toHaveBeenCalled();
    });

    it('counts documents with PROCESSING status in queue', async () => {
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue(mockInstance as never);
      vi.mocked(prisma.paperlessDocument.findMany).mockResolvedValue([]);
      vi.mocked(prisma.processingQueue.findMany).mockResolvedValue([
        { paperlessDocumentId: 123, status: QueueStatus.PROCESSING },
        { paperlessDocumentId: 124, status: QueueStatus.COMPLETED },
        { paperlessDocumentId: 125, status: QueueStatus.FAILED },
      ] as never);
      vi.mocked(prisma.paperlessInstance.update).mockResolvedValue({} as never);

      mockGetDocuments.mockResolvedValue({
        results: [
          {
            id: 123,
            title: 'Processing Doc',
            content: '',
            tags: [],
            correspondent: null,
            modified: '2024-01-15T10:00:00Z',
            created: '2024-01-14T10:00:00Z',
          },
          {
            id: 124,
            title: 'Completed Doc',
            content: '',
            tags: [],
            correspondent: null,
            modified: '2024-01-15T10:00:00Z',
            created: '2024-01-14T10:00:00Z',
          },
          {
            id: 125,
            title: 'Failed Doc',
            content: '',
            tags: [],
            correspondent: null,
            modified: '2024-01-15T10:00:00Z',
            created: '2024-01-14T10:00:00Z',
          },
        ],
        next: null,
      });

      const result = await scanInstance('instance-1');

      // All 3 docs are in queue (any status)
      expect(result.documentsAlreadyQueued).toBe(3);
      expect(result.documentsQueued).toBe(0);
    });

    it('filters documents by configured tags', async () => {
      const instanceWithTags = { ...mockInstance, importFilterTags: [5, 10] };
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue(instanceWithTags as never);
      vi.mocked(prisma.paperlessDocument.findMany).mockResolvedValue([]);
      vi.mocked(prisma.processingQueue.findMany).mockResolvedValue([]);
      vi.mocked(prisma.paperlessDocument.upsert).mockResolvedValue({ id: 'doc-local-1' } as never);
      vi.mocked(prisma.processingQueue.create).mockResolvedValue({} as never);
      vi.mocked(prisma.paperlessInstance.update).mockResolvedValue({} as never);

      mockGetDocuments.mockResolvedValue({
        results: [
          {
            id: 1,
            title: 'No tags',
            content: '',
            tags: [],
            correspondent: null,
            modified: '2024-01-15T10:00:00Z',
            created: '2024-01-14T10:00:00Z',
          },
          {
            id: 2,
            title: 'Partial tags',
            content: '',
            tags: [5],
            correspondent: null,
            modified: '2024-01-15T10:00:00Z',
            created: '2024-01-14T10:00:00Z',
          },
          {
            id: 3,
            title: 'All tags',
            content: '',
            tags: [5, 10, 15],
            correspondent: null,
            modified: '2024-01-15T10:00:00Z',
            created: '2024-01-14T10:00:00Z',
          },
        ],
        next: null,
      });

      const result = await scanInstance('instance-1');

      expect(result.documentsQueued).toBe(1);
      expect(prisma.processingQueue.create).toHaveBeenCalledTimes(1);
    });

    it('handles pagination when fetching documents', async () => {
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue(mockInstance as never);
      vi.mocked(prisma.paperlessDocument.findMany).mockResolvedValue([]);
      vi.mocked(prisma.processingQueue.findMany).mockResolvedValue([]);
      vi.mocked(prisma.paperlessDocument.upsert).mockResolvedValue({ id: 'doc-local' } as never);
      vi.mocked(prisma.processingQueue.create).mockResolvedValue({} as never);
      vi.mocked(prisma.paperlessInstance.update).mockResolvedValue({} as never);

      mockGetDocuments
        .mockResolvedValueOnce({
          results: [
            {
              id: 1,
              title: 'Doc 1',
              content: '',
              tags: [],
              correspondent: null,
              modified: '2024-01-15T10:00:00Z',
              created: '2024-01-14T10:00:00Z',
            },
          ],
          next: 'page2',
        })
        .mockResolvedValueOnce({
          results: [
            {
              id: 2,
              title: 'Doc 2',
              content: '',
              tags: [],
              correspondent: null,
              modified: '2024-01-15T10:00:00Z',
              created: '2024-01-14T10:00:00Z',
            },
          ],
          next: null,
        });

      const result = await scanInstance('instance-1');

      expect(mockGetDocuments).toHaveBeenCalledTimes(2);
      expect(result.documentsQueued).toBe(2);
    });

    it('handles errors and updates scan times', async () => {
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue(mockInstance as never);
      vi.mocked(prisma.paperlessInstance.update).mockResolvedValue({} as never);

      mockGetDocuments.mockRejectedValue(new Error('Network error'));

      const result = await scanInstance('instance-1');

      expect(result.error).toBe('Network error');
      expect(result.documentsQueued).toBe(0);
      expect(prisma.paperlessInstance.update).toHaveBeenCalled();
    });

    it('handles non-Error exceptions', async () => {
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue(mockInstance as never);
      vi.mocked(prisma.paperlessInstance.update).mockResolvedValue({} as never);

      mockGetDocuments.mockRejectedValue('String error');

      const result = await scanInstance('instance-1');

      expect(result.error).toBe('Unknown error');
    });

    it('handles documents without modified/created dates', async () => {
      vi.mocked(prisma.paperlessInstance.findUnique).mockResolvedValue(mockInstance as never);
      vi.mocked(prisma.paperlessDocument.findMany).mockResolvedValue([]);
      vi.mocked(prisma.processingQueue.findMany).mockResolvedValue([]);
      vi.mocked(prisma.paperlessDocument.upsert).mockResolvedValue({ id: 'doc-local-1' } as never);
      vi.mocked(prisma.processingQueue.create).mockResolvedValue({} as never);
      vi.mocked(prisma.paperlessInstance.update).mockResolvedValue({} as never);

      mockGetDocuments.mockResolvedValue({
        results: [
          {
            id: 123,
            title: 'Doc without dates',
            content: 'Content',
            tags: [],
            correspondent: null,
            modified: null,
            created: null,
          },
        ],
        next: null,
      });

      const result = await scanInstance('instance-1');

      expect(result.documentsQueued).toBe(1);
      expect(prisma.paperlessDocument.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            documentDate: null,
            paperlessModified: null,
          }),
        })
      );
    });
  });

  describe('scanDueInstances', () => {
    it('scans all due instances', async () => {
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([
        { id: 'instance-1' },
        { id: 'instance-2' },
      ] as never);

      // Mock scanInstance to return different results
      vi.mocked(prisma.paperlessInstance.findUnique)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const results = await scanDueInstances();

      expect(results).toHaveLength(2);
      expect(prisma.paperlessInstance.findMany).toHaveBeenCalledWith({
        where: {
          autoProcessEnabled: true,
          OR: [{ nextScanAt: null }, { nextScanAt: { lte: expect.any(Date) } }],
        },
        select: { id: true },
      });
    });

    it('returns empty array when no instances are due', async () => {
      vi.mocked(prisma.paperlessInstance.findMany).mockResolvedValue([]);

      const results = await scanDueInstances();

      expect(results).toHaveLength(0);
    });
  });
});
