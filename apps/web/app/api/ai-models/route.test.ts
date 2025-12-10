import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiModel: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    aiAccount: {
      findFirst: vi.fn(),
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
    findMany: typeof prisma.aiModel.findMany;
    findFirst: typeof prisma.aiModel.findFirst;
    create: typeof prisma.aiModel.create;
    count: typeof prisma.aiModel.count;
  };
  aiAccount: {
    findFirst: typeof prisma.aiAccount.findFirst;
  };
}>(prisma);

function mockAuth() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('GET /api/ai-models', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns list of models for user', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiModel.findMany.mockResolvedValueOnce([
      {
        id: 'model-1',
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        inputTokenPrice: 0.03,
        outputTokenPrice: 0.06,
        isActive: true,
        aiAccountId: 'account-1',
        aiAccount: {
          id: 'account-1',
          name: 'OpenAI',
          provider: 'openai',
        },
        ownerId: 'user-1',
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [],
      },
    ]);
    mockedPrisma.aiModel.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-models');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].name).toBe('GPT-4');
    expect(data.total).toBe(1);
  });

  it('returns canEdit=true for shared model with WRITE permission', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiModel.findMany.mockResolvedValueOnce([
      {
        id: 'model-1',
        name: 'Shared Model',
        modelIdentifier: 'gpt-4',
        inputTokenPrice: 0.03,
        outputTokenPrice: 0.06,
        isActive: true,
        aiAccountId: 'account-1',
        aiAccount: {
          id: 'account-1',
          name: 'OpenAI',
          provider: 'openai',
        },
        ownerId: 'other-user',
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [{ permission: 'WRITE' }],
      },
    ]);
    mockedPrisma.aiModel.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-models');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].canEdit).toBe(true);
    expect(data.items[0].isOwner).toBe(false);
  });

  it('returns canEdit=true and canShare=true for shared model with FULL permission', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiModel.findMany.mockResolvedValueOnce([
      {
        id: 'model-1',
        name: 'Shared Model with FULL',
        modelIdentifier: 'gpt-4',
        inputTokenPrice: 0.03,
        outputTokenPrice: 0.06,
        isActive: true,
        aiAccountId: 'account-1',
        aiAccount: {
          id: 'account-1',
          name: 'OpenAI',
          provider: 'openai',
        },
        ownerId: 'other-user',
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [{ permission: 'FULL' }],
      },
    ]);
    mockedPrisma.aiModel.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-models');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].canEdit).toBe(true);
    expect(data.items[0].canShare).toBe(true);
    expect(data.items[0].isOwner).toBe(false);
  });
});

describe('POST /api/ai-models', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockAuth();

    const request = new NextRequest('http://localhost/api/ai-models', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        modelIdentifier: '',
        aiAccountId: '',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 404 when AI account not found', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-models', {
      method: 'POST',
      body: JSON.stringify({
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'non-existent',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiAccountNotFound');
  });

  it('returns 409 when name already exists', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
    });
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'existing-model',
    });

    const request = new NextRequest('http://localhost/api/ai-models', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Existing Model',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('aiModelNameExists');
  });

  it('successfully creates model', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
    });
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.aiModel.create.mockResolvedValueOnce({
      id: 'new-model-1',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
      inputTokenPrice: 0.03,
      outputTokenPrice: 0.06,
      isActive: true,
      aiAccountId: 'account-1',
      aiAccount: {
        id: 'account-1',
        name: 'OpenAI',
        provider: 'openai',
      },
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-models', {
      method: 'POST',
      body: JSON.stringify({
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
        inputTokenPrice: 0.03,
        outputTokenPrice: 0.06,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe('GPT-4');
  });

  it('creates model without token prices', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
    });
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.aiModel.create.mockResolvedValueOnce({
      id: 'new-model-1',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
      inputTokenPrice: null,
      outputTokenPrice: null,
      isActive: true,
      aiAccountId: 'account-1',
      aiAccount: {
        id: 'account-1',
        name: 'OpenAI',
        provider: 'openai',
      },
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-models', {
      method: 'POST',
      body: JSON.stringify({
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.inputTokenPrice).toBeNull();
    expect(data.outputTokenPrice).toBeNull();
  });
});
