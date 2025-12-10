import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiModel: {
      findFirst: vi.fn(),
    },
    userAiModelAccess: {
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
  aiModel: {
    findFirst: typeof prisma.aiModel.findFirst;
  };
  userAiModelAccess: {
    findFirst: typeof prisma.userAiModelAccess.findFirst;
    delete: typeof prisma.userAiModelAccess.delete;
  };
}>(prisma);

const mockContext = (id: string, accessId: string) => ({
  params: Promise.resolve({ id, accessId }),
});

function mockAuth() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('DELETE /api/ai-models/[id]/sharing/[accessId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when model not found', async () => {
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-models/model-1/sharing/access-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('model-1', 'access-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiModelNotFound');
  });

  it('returns 404 when share not found', async () => {
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiModelAccess.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-models/model-1/sharing/access-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('model-1', 'access-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('shareNotFound');
  });

  it('successfully deletes share when user is owner', async () => {
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiModelAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      aiModelId: 'model-1',
      userId: 'user-2',
      permission: 'READ',
    });
    mockedPrisma.userAiModelAccess.delete.mockResolvedValueOnce({
      id: 'access-1',
    });

    const request = new NextRequest('http://localhost/api/ai-models/model-1/sharing/access-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('model-1', 'access-1'));

    expect(response.status).toBe(204);
    expect(mockedPrisma.userAiModelAccess.delete).toHaveBeenCalledWith({
      where: { id: 'access-1' },
    });
  });

  it('successfully deletes share when user has FULL permission', async () => {
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      ownerId: 'other-user',
    });
    mockedPrisma.userAiModelAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      aiModelId: 'model-1',
      userId: 'user-3',
      permission: 'READ',
    });
    mockedPrisma.userAiModelAccess.delete.mockResolvedValueOnce({
      id: 'access-1',
    });

    const request = new NextRequest('http://localhost/api/ai-models/model-1/sharing/access-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('model-1', 'access-1'));

    expect(response.status).toBe(204);
    expect(mockedPrisma.userAiModelAccess.delete).toHaveBeenCalledWith({
      where: { id: 'access-1' },
    });
  });
});
