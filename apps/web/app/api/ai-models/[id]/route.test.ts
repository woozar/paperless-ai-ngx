import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH, DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiModel: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    aiAccount: {
      findFirst: vi.fn(),
    },
    aiBot: {
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
  aiModel: {
    findFirst: typeof prisma.aiModel.findFirst;
    update: typeof prisma.aiModel.update;
    delete: typeof prisma.aiModel.delete;
    count: typeof prisma.aiModel.count;
  };
  aiAccount: {
    findFirst: typeof prisma.aiAccount.findFirst;
  };
  aiBot: {
    count: typeof prisma.aiBot.count;
  };
}>(prisma);

const mockContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

function mockAuth() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('GET /api/ai-models/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when model not found', async () => {
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-models/model-1');
    const response = await GET(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiModelNotFound');
  });

  it('returns model details', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
      inputTokenPrice: 0.03,
      outputTokenPrice: 0.06,
      isActive: true,
      aiAccountId: 'account-1',
      aiAccount: {
        id: 'account-1',
        name: 'OpenAI Account',
        provider: 'openai',
      },
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-models/model-1');
    const response = await GET(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('GPT-4');
    expect(data.modelIdentifier).toBe('gpt-4');
    expect(data.inputTokenPrice).toBe(0.03);
    expect(data.outputTokenPrice).toBe(0.06);
    expect(data.aiAccount.name).toBe('OpenAI Account');
  });
});

describe('PATCH /api/ai-models/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockAuth();

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: '' }),
    });
    const response = await PATCH(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 404 when model not found', async () => {
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiModelNotFound');
  });

  it('returns 409 when new name already exists', async () => {
    mockAuth();
    mockedPrisma.aiModel.findFirst
      .mockResolvedValueOnce({
        id: 'model-1',
        name: 'GPT-4',
        ownerId: 'user-1',
        aiAccountId: 'account-1',
      })
      .mockResolvedValueOnce({
        id: 'model-2',
        name: 'New Name',
      });

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('aiModelNameExists');
  });

  it('successfully updates model name', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiModel.findFirst
      .mockResolvedValueOnce({
        id: 'model-1',
        name: 'GPT-4',
        ownerId: 'user-1',
        aiAccountId: 'account-1',
      })
      .mockResolvedValueOnce(null);
    mockedPrisma.aiModel.update.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4 Turbo',
      modelIdentifier: 'gpt-4-turbo',
      inputTokenPrice: 0.01,
      outputTokenPrice: 0.03,
      isActive: true,
      aiAccountId: 'account-1',
      aiAccount: {
        id: 'account-1',
        name: 'OpenAI Account',
        provider: 'openai',
      },
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'GPT-4 Turbo' }),
    });
    const response = await PATCH(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('GPT-4 Turbo');
  });

  it('successfully updates model identifier', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      ownerId: 'user-1',
      aiAccountId: 'account-1',
      modelIdentifier: 'gpt-4',
    });
    mockedPrisma.aiModel.update.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4-0125-preview',
      inputTokenPrice: 0.01,
      outputTokenPrice: 0.03,
      isActive: true,
      aiAccountId: 'account-1',
      aiAccount: {
        id: 'account-1',
        name: 'OpenAI Account',
        provider: 'openai',
      },
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'PATCH',
      body: JSON.stringify({ modelIdentifier: 'gpt-4-0125-preview' }),
    });
    const response = await PATCH(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.modelIdentifier).toBe('gpt-4-0125-preview');
  });

  it('returns 404 when changing to non-existent account', async () => {
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      ownerId: 'user-1',
      aiAccountId: 'account-1',
    });
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'PATCH',
      body: JSON.stringify({ aiAccountId: 'nonexistent-account' }),
    });
    const response = await PATCH(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiAccountNotFound');
  });

  it('successfully updates model account', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      ownerId: 'user-1',
      aiAccountId: 'account-1',
    });
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-2',
      name: 'New OpenAI Account',
      provider: 'openai',
    });
    mockedPrisma.aiModel.update.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
      inputTokenPrice: 0.03,
      outputTokenPrice: 0.06,
      isActive: true,
      aiAccountId: 'account-2',
      aiAccount: {
        id: 'account-2',
        name: 'New OpenAI Account',
        provider: 'openai',
      },
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'PATCH',
      body: JSON.stringify({ aiAccountId: 'account-2' }),
    });
    const response = await PATCH(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.aiAccount.id).toBe('account-2');
    expect(data.aiAccount.name).toBe('New OpenAI Account');
  });

  it('updates token prices', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      ownerId: 'user-1',
      aiAccountId: 'account-1',
    });
    mockedPrisma.aiModel.update.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
      inputTokenPrice: 0.02,
      outputTokenPrice: 0.04,
      isActive: true,
      aiAccountId: 'account-1',
      aiAccount: {
        id: 'account-1',
        name: 'OpenAI Account',
        provider: 'openai',
      },
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'PATCH',
      body: JSON.stringify({
        inputTokenPrice: 0.02,
        outputTokenPrice: 0.04,
      }),
    });
    const response = await PATCH(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.inputTokenPrice).toBe(0.02);
    expect(data.outputTokenPrice).toBe(0.04);
  });

  it('updates isActive status', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      ownerId: 'user-1',
      aiAccountId: 'account-1',
    });
    mockedPrisma.aiModel.update.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
      inputTokenPrice: 0.03,
      outputTokenPrice: 0.06,
      isActive: false,
      aiAccountId: 'account-1',
      aiAccount: {
        id: 'account-1',
        name: 'OpenAI Account',
        provider: 'openai',
      },
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'PATCH',
      body: JSON.stringify({ isActive: false }),
    });
    const response = await PATCH(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isActive).toBe(false);
  });
});

describe('DELETE /api/ai-models/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when model not found', async () => {
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiModelNotFound');
  });

  it('returns 400 when model is in use by bots', async () => {
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      ownerId: 'user-1',
    });
    mockedPrisma.aiBot.count.mockResolvedValueOnce(3);

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('model-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('aiModelInUse');
    expect(data.params.count).toBe(3);
  });

  it('successfully deletes model', async () => {
    mockAuth();
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      ownerId: 'user-1',
    });
    mockedPrisma.aiBot.count.mockResolvedValueOnce(0);
    mockedPrisma.aiModel.delete.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
    });

    const request = new NextRequest('http://localhost/api/ai-models/model-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('model-1'));

    expect(response.status).toBe(204);
    expect(mockedPrisma.aiModel.delete).toHaveBeenCalledWith({
      where: { id: 'model-1' },
    });
  });
});
