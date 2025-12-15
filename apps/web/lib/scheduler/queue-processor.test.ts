import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAnalyzeDocument = vi.fn();
const mockApplySuggestions = vi.fn();
const mockHasAutoApplyEnabled = vi.fn();

vi.mock('@repo/database', () => ({
  prisma: {
    processingQueue: {
      update: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock('@repo/paperless-client', () => ({
  PaperlessClient: class MockPaperlessClient {
    baseUrl: string;
    constructor(config: { baseUrl: string }) {
      this.baseUrl = config.baseUrl;
    }
  },
}));

vi.mock('@/lib/ai/analyze-document', () => ({
  analyzeDocument: (...args: unknown[]) => mockAnalyzeDocument(...args),
}));

vi.mock('@/lib/crypto/encryption', () => ({
  decrypt: vi.fn((token: string) => `decrypted-${token}`),
}));

vi.mock('@/lib/paperless/apply-suggestions', () => ({
  applySuggestions: (...args: unknown[]) => mockApplySuggestions(...args),
  hasAutoApplyEnabled: (...args: unknown[]) => mockHasAutoApplyEnabled(...args),
}));

import { prisma } from '@repo/database';
import {
  processQueueItem,
  processAllPending,
  resetStuckItems,
  getQueueStats,
} from './queue-processor';
import { QueueStatus } from './types';

describe('queue-processor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('processQueueItem', () => {
    const mockQueueItem = {
      id: 'queue-1',
      documentId: 'doc-1',
      aiBotId: 'bot-1',
      paperlessDocumentId: 123,
      attempts: 0,
      maxAttempts: 3,
      document: {
        id: 'doc-1',
        paperlessId: 123,
        title: 'Test Document',
      },
      aiBot: {
        id: 'bot-1',
        name: 'Test Bot',
      },
      paperlessInstance: {
        id: 'instance-1',
        apiUrl: 'http://localhost:8000',
        apiToken: 'test-token',
        ownerId: 'user-1',
        autoApplyTitle: true,
        autoApplyCorrespondent: true,
        autoApplyDocumentType: true,
        autoApplyTags: true,
        autoApplyDate: true,
      },
    };

    it('marks item as processing and runs analysis', async () => {
      vi.mocked(prisma.processingQueue.update)
        .mockResolvedValueOnce(mockQueueItem as never)
        .mockResolvedValueOnce({} as never);
      mockAnalyzeDocument.mockResolvedValue({ result: { title: 'Analyzed Title' } });
      mockHasAutoApplyEnabled.mockReturnValue(false);

      const result = await processQueueItem('queue-1');

      expect(result.success).toBe(true);
      expect(result.documentId).toBe('doc-1');
      expect(prisma.processingQueue.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'queue-1' },
          data: expect.objectContaining({
            status: QueueStatus.PROCESSING,
          }),
        })
      );
      expect(mockAnalyzeDocument).toHaveBeenCalledWith({
        documentId: 'doc-1',
        aiBotId: 'bot-1',
        userId: 'user-1',
      });
    });

    it('returns error when documentId is missing', async () => {
      const itemWithoutDoc = { ...mockQueueItem, documentId: null };
      vi.mocked(prisma.processingQueue.update)
        .mockResolvedValueOnce(itemWithoutDoc as never)
        .mockResolvedValueOnce({} as never);

      const result = await processQueueItem('queue-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Missing document or AI bot reference');
      expect(prisma.processingQueue.update).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: QueueStatus.FAILED,
            lastError: 'Missing document or AI bot reference',
          }),
        })
      );
    });

    it('returns error when aiBotId is missing', async () => {
      const itemWithoutBot = { ...mockQueueItem, aiBotId: null };
      vi.mocked(prisma.processingQueue.update)
        .mockResolvedValueOnce(itemWithoutBot as never)
        .mockResolvedValueOnce({} as never);

      const result = await processQueueItem('queue-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Missing document or AI bot reference');
    });

    it('applies suggestions when auto-apply is enabled', async () => {
      vi.mocked(prisma.processingQueue.update)
        .mockResolvedValueOnce(mockQueueItem as never)
        .mockResolvedValueOnce({} as never);
      mockAnalyzeDocument.mockResolvedValue({ result: { title: 'Analyzed Title' } });
      mockHasAutoApplyEnabled.mockReturnValue(true);
      mockApplySuggestions.mockResolvedValue({ success: true });

      const result = await processQueueItem('queue-1');

      expect(result.success).toBe(true);
      expect(mockApplySuggestions).toHaveBeenCalledWith(
        expect.objectContaining({
          paperlessDocumentId: 123,
          localDocumentId: 'doc-1',
          analysisResult: { title: 'Analyzed Title' },
        })
      );
    });

    it('logs warning but does not fail when auto-apply fails', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.mocked(prisma.processingQueue.update)
        .mockResolvedValueOnce(mockQueueItem as never)
        .mockResolvedValueOnce({} as never);
      mockAnalyzeDocument.mockResolvedValue({ result: { title: 'Analyzed Title' } });
      mockHasAutoApplyEnabled.mockReturnValue(true);
      mockApplySuggestions.mockResolvedValue({ success: false, error: 'Apply error' });

      const result = await processQueueItem('queue-1');

      expect(result.success).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Auto-apply failed'));
      consoleSpy.mockRestore();
    });

    it('skips auto-apply when no analysis result', async () => {
      vi.mocked(prisma.processingQueue.update)
        .mockResolvedValueOnce(mockQueueItem as never)
        .mockResolvedValueOnce({} as never);
      mockAnalyzeDocument.mockResolvedValue({ result: null });
      mockHasAutoApplyEnabled.mockReturnValue(true);

      const result = await processQueueItem('queue-1');

      expect(result.success).toBe(true);
      expect(mockApplySuggestions).not.toHaveBeenCalled();
    });

    it('skips auto-apply when document is missing', async () => {
      const itemWithoutDocument = { ...mockQueueItem, document: null };
      vi.mocked(prisma.processingQueue.update)
        .mockResolvedValueOnce(itemWithoutDocument as never)
        .mockResolvedValueOnce({} as never);
      mockAnalyzeDocument.mockResolvedValue({ result: { title: 'Test' } });
      mockHasAutoApplyEnabled.mockReturnValue(true);

      const result = await processQueueItem('queue-1');

      expect(result.success).toBe(true);
      expect(mockApplySuggestions).not.toHaveBeenCalled();
    });

    it('schedules retry on error when attempts remaining', async () => {
      vi.mocked(prisma.processingQueue.update)
        .mockResolvedValueOnce(mockQueueItem as never)
        .mockResolvedValueOnce({} as never);
      mockAnalyzeDocument.mockRejectedValue(new Error('AI service error'));

      const result = await processQueueItem('queue-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('AI service error');
      expect(prisma.processingQueue.update).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: QueueStatus.PENDING,
            attempts: 1,
            lastError: 'AI service error',
            scheduledFor: expect.any(Date),
            startedAt: null,
          }),
        })
      );
    });

    it('marks as failed when max attempts reached', async () => {
      const itemAtMaxAttempts = { ...mockQueueItem, attempts: 2 };
      vi.mocked(prisma.processingQueue.update)
        .mockResolvedValueOnce(itemAtMaxAttempts as never)
        .mockResolvedValueOnce({} as never);
      mockAnalyzeDocument.mockRejectedValue(new Error('AI service error'));

      const result = await processQueueItem('queue-1');

      expect(result.success).toBe(false);
      expect(prisma.processingQueue.update).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: QueueStatus.FAILED,
            attempts: 3,
            lastError: 'AI service error',
          }),
        })
      );
    });

    it('handles non-Error exceptions', async () => {
      vi.mocked(prisma.processingQueue.update)
        .mockResolvedValueOnce(mockQueueItem as never)
        .mockResolvedValueOnce({} as never);
      mockAnalyzeDocument.mockRejectedValue('String error');

      const result = await processQueueItem('queue-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });

    it('marks as completed after successful analysis', async () => {
      vi.mocked(prisma.processingQueue.update)
        .mockResolvedValueOnce(mockQueueItem as never)
        .mockResolvedValueOnce({} as never);
      mockAnalyzeDocument.mockResolvedValue({ result: { title: 'Test' } });
      mockHasAutoApplyEnabled.mockReturnValue(false);

      await processQueueItem('queue-1');

      expect(prisma.processingQueue.update).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: QueueStatus.COMPLETED,
            completedAt: expect.any(Date),
            lastError: null,
          }),
        })
      );
    });
  });

  describe('processAllPending', () => {
    it('processes all pending items sequentially', async () => {
      vi.mocked(prisma.processingQueue.findFirst)
        .mockResolvedValueOnce({ id: 'queue-1' } as never)
        .mockResolvedValueOnce({ id: 'queue-2' } as never)
        .mockResolvedValueOnce(null);

      const mockItem = {
        id: 'queue-1',
        documentId: 'doc-1',
        aiBotId: 'bot-1',
        attempts: 0,
        maxAttempts: 3,
        document: { id: 'doc-1', paperlessId: 123 },
        aiBot: { id: 'bot-1' },
        paperlessInstance: {
          id: 'instance-1',
          apiUrl: 'http://localhost:8000',
          apiToken: 'token',
          ownerId: 'user-1',
          autoApplyTitle: false,
          autoApplyCorrespondent: false,
          autoApplyDocumentType: false,
          autoApplyTags: false,
          autoApplyDate: false,
        },
      };

      vi.mocked(prisma.processingQueue.update).mockResolvedValue(mockItem as never);
      mockAnalyzeDocument.mockResolvedValue({ result: null });
      mockHasAutoApplyEnabled.mockReturnValue(false);

      const results = await processAllPending();

      expect(results).toHaveLength(2);
      expect(prisma.processingQueue.findFirst).toHaveBeenCalledTimes(3);
      expect(prisma.processingQueue.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: QueueStatus.PENDING,
            scheduledFor: { lte: expect.any(Date) },
          },
          orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        })
      );
    });

    it('returns empty array when no pending items', async () => {
      vi.mocked(prisma.processingQueue.findFirst).mockResolvedValue(null);

      const results = await processAllPending();

      expect(results).toHaveLength(0);
      expect(prisma.processingQueue.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetStuckItems', () => {
    it('resets items stuck in processing state', async () => {
      vi.mocked(prisma.processingQueue.updateMany).mockResolvedValue({ count: 3 } as never);

      const count = await resetStuckItems();

      expect(count).toBe(3);
      expect(prisma.processingQueue.updateMany).toHaveBeenCalledWith({
        where: {
          status: QueueStatus.PROCESSING,
          startedAt: { lt: expect.any(Date) },
        },
        data: {
          status: QueueStatus.PENDING,
          startedAt: null,
        },
      });
    });

    it('returns 0 when no stuck items', async () => {
      vi.mocked(prisma.processingQueue.updateMany).mockResolvedValue({ count: 0 } as never);

      const count = await resetStuckItems();

      expect(count).toBe(0);
    });
  });

  describe('getQueueStats', () => {
    it('returns counts for all statuses', async () => {
      vi.mocked(prisma.processingQueue.count)
        .mockResolvedValueOnce(5 as never)
        .mockResolvedValueOnce(2 as never)
        .mockResolvedValueOnce(100 as never)
        .mockResolvedValueOnce(3 as never);

      const stats = await getQueueStats();

      expect(stats).toEqual({
        pending: 5,
        processing: 2,
        completed: 100,
        failed: 3,
      });
      expect(prisma.processingQueue.count).toHaveBeenCalledTimes(4);
    });
  });
});
