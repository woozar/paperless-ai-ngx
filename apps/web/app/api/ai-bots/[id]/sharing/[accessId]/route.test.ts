import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiBot: {
      findFirst: vi.fn(),
    },
    userAiBotAccess: {
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
  aiBot: {
    findFirst: typeof prisma.aiBot.findFirst;
  };
  userAiBotAccess: {
    findFirst: typeof prisma.userAiBotAccess.findFirst;
    delete: typeof prisma.userAiBotAccess.delete;
  };
}>(prisma);

function mockAuth() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('DELETE /api/ai-bots/[id]/sharing/[accessId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when bot not found', async () => {
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing/access-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'bot-1', accessId: 'access-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiBotNotFound');
  });

  it('returns 404 when share not found', async () => {
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiBotAccess.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing/access-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'bot-1', accessId: 'access-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('shareNotFound');
  });

  it('successfully deletes share', async () => {
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiBotAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      aiBotId: 'bot-1',
      permission: 'READ',
    });
    mockedPrisma.userAiBotAccess.delete.mockResolvedValueOnce({ id: 'access-1' });

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing/access-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'bot-1', accessId: 'access-1' }),
    });

    expect(response.status).toBe(204);
  });
});
