import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
    userPaperlessInstanceAccess: {
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
  userPaperlessInstanceAccess: {
    findFirst: typeof prisma.userPaperlessInstanceAccess.findFirst;
    delete: typeof prisma.userPaperlessInstanceAccess.delete;
  };
}>(prisma);

function mockAuth() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('DELETE /api/paperless-instances/[id]/sharing/[accessId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/sharing/access-1',
      { method: 'DELETE' }
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'instance-1', accessId: 'access-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns 404 when share not found', async () => {
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userPaperlessInstanceAccess.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/sharing/access-1',
      { method: 'DELETE' }
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'instance-1', accessId: 'access-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('shareNotFound');
  });

  it('successfully deletes share', async () => {
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userPaperlessInstanceAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      instanceId: 'instance-1',
      permission: 'READ',
    });
    mockedPrisma.userPaperlessInstanceAccess.delete.mockResolvedValueOnce({ id: 'access-1' });

    const request = new NextRequest(
      'http://localhost/api/paperless-instances/instance-1/sharing/access-1',
      { method: 'DELETE' }
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'instance-1', accessId: 'access-1' }),
    });

    expect(response.status).toBe(204);
  });
});
