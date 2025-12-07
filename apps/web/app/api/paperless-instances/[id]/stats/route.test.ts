import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
    paperlessDocument: {
      count: vi.fn(),
    },
    processingQueue: {
      count: vi.fn(),
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
  paperlessDocument: {
    count: typeof prisma.paperlessDocument.count;
  };
  processingQueue: {
    count: typeof prisma.processingQueue.count;
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

describe('GET /api/paperless-instances/[id]/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/stats');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns stats for instance', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
    });
    mockedPrisma.paperlessDocument.count.mockResolvedValueOnce(42);
    mockedPrisma.processingQueue.count.mockResolvedValueOnce(5);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/stats');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.documents).toBe(42);
    expect(data.processingQueue).toBe(5);
  });

  it('returns zero counts when no documents exist', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
    });
    mockedPrisma.paperlessDocument.count.mockResolvedValueOnce(0);
    mockedPrisma.processingQueue.count.mockResolvedValueOnce(0);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/stats');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.documents).toBe(0);
    expect(data.processingQueue).toBe(0);
  });
});
