import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
    processingQueue: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  paperlessInstance: {
    findFirst: typeof prisma.paperlessInstance.findFirst;
  };
  processingQueue: {
    findFirst: typeof prisma.processingQueue.findFirst;
    update: typeof prisma.processingQueue.update;
  };
}>(prisma);

const mockContext = (id: string, queueId: string) => ({
  params: Promise.resolve({ id, queueId }),
});

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

const baseQueueItem = {
  id: 'queue-1',
  paperlessDocumentId: 123,
  priority: 0,
  attempts: 3,
  maxAttempts: 3,
  lastError: 'Some error',
  scheduledFor: new Date('2024-01-15T10:00:00Z'),
  startedAt: new Date('2024-01-15T10:01:00Z'),
  completedAt: null,
  createdAt: new Date('2024-01-15T09:00:00Z'),
  updatedAt: new Date('2024-01-15T10:01:00Z'),
  documentId: 'doc-1',
  document: { title: 'Test Doc' },
  aiBotId: 'bot-1',
  aiBot: { name: 'Test Bot' },
};

describe('POST /api/paperless-instances/[id]/queue/[queueId]/retry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1/retry'
    );
    const response = await POST(request, mockContext('instance-1', 'queue-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns 404 when queue item not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1/retry'
    );
    const response = await POST(request, mockContext('instance-1', 'queue-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('queueItemNotFound');
  });

  it('returns 400 when trying to retry non-failed item', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce({
      id: 'queue-1',
      status: 'pending',
    });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1/retry'
    );
    const response = await POST(request, mockContext('instance-1', 'queue-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('canOnlyRetryFailedItems');
  });

  it('returns 400 when trying to retry processing item', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce({
      id: 'queue-1',
      status: 'processing',
    });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1/retry'
    );
    const response = await POST(request, mockContext('instance-1', 'queue-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('canOnlyRetryFailedItems');
  });

  it('returns 400 when trying to retry completed item', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce({
      id: 'queue-1',
      status: 'completed',
    });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1/retry'
    );
    const response = await POST(request, mockContext('instance-1', 'queue-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('canOnlyRetryFailedItems');
  });

  it('successfully retries failed queue item', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce({
      id: 'queue-1',
      status: 'failed',
    });

    const updatedItem = {
      ...baseQueueItem,
      status: 'pending',
      attempts: 0,
      lastError: null,
      scheduledFor: new Date(),
      startedAt: null,
      completedAt: null,
    };
    mockedPrisma.processingQueue.update.mockResolvedValueOnce(updatedItem as never);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1/retry'
    );
    const response = await POST(request, mockContext('instance-1', 'queue-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('pending');
    expect(data.attempts).toBe(0);
    expect(data.lastError).toBeNull();
    expect(mockedPrisma.processingQueue.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'queue-1' },
        data: expect.objectContaining({
          status: 'pending',
          attempts: 0,
          lastError: null,
        }),
      })
    );
  });
});
