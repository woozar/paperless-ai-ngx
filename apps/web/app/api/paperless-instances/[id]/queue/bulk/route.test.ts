import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
    processingQueue: {
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
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
    updateMany: typeof prisma.processingQueue.updateMany;
    deleteMany: typeof prisma.processingQueue.deleteMany;
  };
}>(prisma);

const mockContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('POST /api/paperless-instances/[id]/queue/bulk/retry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/bulk'
    );
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('retries all failed items', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.updateMany.mockResolvedValueOnce({ count: 5 });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/bulk'
    );
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.retriedCount).toBe(5);
    expect(mockedPrisma.processingQueue.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          paperlessInstanceId: 'instance-1',
          status: 'failed',
        },
        data: expect.objectContaining({
          status: 'pending',
          attempts: 0,
          lastError: null,
        }),
      })
    );
  });

  it('returns 0 when no failed items to retry', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.updateMany.mockResolvedValueOnce({ count: 0 });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/bulk'
    );
    const response = await POST(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.retriedCount).toBe(0);
  });
});

describe('DELETE /api/paperless-instances/[id]/queue/bulk/completed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/bulk'
    );
    const response = await DELETE(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('deletes all completed items', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.deleteMany.mockResolvedValueOnce({ count: 10 });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/bulk'
    );
    const response = await DELETE(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.deletedCount).toBe(10);
    expect(mockedPrisma.processingQueue.deleteMany).toHaveBeenCalledWith({
      where: {
        paperlessInstanceId: 'instance-1',
        status: 'completed',
      },
    });
  });

  it('returns 0 when no completed items to delete', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({ id: 'instance-1' });
    mockedPrisma.processingQueue.deleteMany.mockResolvedValueOnce({ count: 0 });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/queue/bulk'
    );
    const response = await DELETE(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.deletedCount).toBe(0);
  });
});
