import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
    processingQueue: {
      findFirst: vi.fn(),
      delete: vi.fn(),
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
    delete: typeof prisma.processingQueue.delete;
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

describe('DELETE /api/paperless-instances/[id]/queue/[queueId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1'
    );
    const response = await DELETE(request, mockContext('instance-1', 'queue-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns 404 when queue item not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1'
    );
    const response = await DELETE(request, mockContext('instance-1', 'queue-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('queueItemNotFound');
  });

  it('returns 400 when trying to delete processing item', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce({
      id: 'queue-1',
      status: 'processing',
    });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1'
    );
    const response = await DELETE(request, mockContext('instance-1', 'queue-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('cannotDeleteProcessingItem');
  });

  it('successfully deletes pending queue item', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce({
      id: 'queue-1',
      status: 'pending',
    });
    mockedPrisma.processingQueue.delete.mockResolvedValueOnce({} as never);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1'
    );
    const response = await DELETE(request, mockContext('instance-1', 'queue-1'));

    expect(response.status).toBe(204);
    expect(mockedPrisma.processingQueue.delete).toHaveBeenCalledWith({
      where: { id: 'queue-1' },
    });
  });

  it('successfully deletes failed queue item', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce({
      id: 'queue-1',
      status: 'failed',
    });
    mockedPrisma.processingQueue.delete.mockResolvedValueOnce({} as never);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1'
    );
    const response = await DELETE(request, mockContext('instance-1', 'queue-1'));

    expect(response.status).toBe(204);
  });

  it('successfully deletes completed queue item', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.findFirst.mockResolvedValueOnce({
      id: 'queue-1',
      status: 'completed',
    });
    mockedPrisma.processingQueue.delete.mockResolvedValueOnce({} as never);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/queue-1'
    );
    const response = await DELETE(request, mockContext('instance-1', 'queue-1'));

    expect(response.status).toBe(204);
  });
});
