import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiProvider: {
      findFirst: vi.fn(),
    },
    userAiProviderAccess: {
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
  aiProvider: {
    findFirst: typeof prisma.aiProvider.findFirst;
  };
  userAiProviderAccess: {
    findFirst: typeof prisma.userAiProviderAccess.findFirst;
    delete: typeof prisma.userAiProviderAccess.delete;
  };
}>(prisma);

function mockAuth() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('DELETE /api/ai-providers/[id]/sharing/[accessId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when provider not found', async () => {
    mockAuth();
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/ai-providers/provider-1/sharing/access-1',
      { method: 'DELETE' }
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'provider-1', accessId: 'access-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiProviderNotFound');
  });

  it('returns 404 when share not found', async () => {
    mockAuth();
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiProviderAccess.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest(
      'http://localhost/api/ai-providers/provider-1/sharing/access-1',
      { method: 'DELETE' }
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'provider-1', accessId: 'access-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('shareNotFound');
  });

  it('successfully deletes share', async () => {
    mockAuth();
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiProviderAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      aiProviderId: 'provider-1',
      permission: 'READ',
    });
    mockedPrisma.userAiProviderAccess.delete.mockResolvedValueOnce({
      id: 'access-1',
    });

    const request = new NextRequest(
      'http://localhost/api/ai-providers/provider-1/sharing/access-1',
      { method: 'DELETE' }
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'provider-1', accessId: 'access-1' }),
    });

    expect(response.status).toBe(204);
    expect(mockedPrisma.userAiProviderAccess.delete).toHaveBeenCalledWith({
      where: { id: 'access-1' },
    });
  });
});
