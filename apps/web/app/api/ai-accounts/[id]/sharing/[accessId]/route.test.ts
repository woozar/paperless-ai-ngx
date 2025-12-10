import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiAccount: {
      findFirst: vi.fn(),
    },
    userAiAccountAccess: {
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
  aiAccount: {
    findFirst: typeof prisma.aiAccount.findFirst;
  };
  userAiAccountAccess: {
    findFirst: typeof prisma.userAiAccountAccess.findFirst;
    delete: typeof prisma.userAiAccountAccess.delete;
  };
}>(prisma);

function mockAuth() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('DELETE /api/ai-accounts/[id]/sharing/[accessId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when account not found', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1/sharing/access-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'account-1', accessId: 'access-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiAccountNotFound');
  });

  it('returns 404 when share not found', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiAccountAccess.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1/sharing/access-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'account-1', accessId: 'access-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('shareNotFound');
  });

  it('successfully deletes share', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiAccountAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      aiAccountId: 'account-1',
      permission: 'READ',
    });
    mockedPrisma.userAiAccountAccess.delete.mockResolvedValueOnce({ id: 'access-1' });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1/sharing/access-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'account-1', accessId: 'access-1' }),
    });

    expect(response.status).toBe(204);
  });

  it('allows user with FULL permission to delete share', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      ownerId: 'other-user',
    });
    mockedPrisma.userAiAccountAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      aiAccountId: 'account-1',
      permission: 'READ',
    });
    mockedPrisma.userAiAccountAccess.delete.mockResolvedValueOnce({ id: 'access-1' });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1/sharing/access-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'account-1', accessId: 'access-1' }),
    });

    expect(response.status).toBe(204);
  });
});
