import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiBot: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    aiModel: {
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
  aiBot: {
    findMany: typeof prisma.aiBot.findMany;
    findFirst: typeof prisma.aiBot.findFirst;
    create: typeof prisma.aiBot.create;
    count: typeof prisma.aiBot.count;
  };
  aiModel: {
    findFirst: typeof prisma.aiModel.findFirst;
  };
}>(prisma);

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('GET /api/ai-bots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns list of bots for admin', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findMany.mockResolvedValueOnce([
      {
        id: 'bot-1',
        name: 'Support Bot',
        systemPrompt: 'You are a helpful support assistant',
        aiModelId: 'model-1',
        ownerId: 'admin-1',
        aiModel: {
          id: 'model-1',
          name: 'GPT-4',
          aiAccount: {
            id: 'account-1',
            name: 'OpenAI',
            provider: 'openai',
          },
        },
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [],
      },
    ]);
    mockedPrisma.aiBot.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].name).toBe('Support Bot');
    expect(data.items[0].systemPrompt).toBe('You are a helpful support assistant');
    expect(data.total).toBe(1);
  });

  it('returns empty list when no bots exist', async () => {
    mockAdmin();
    mockedPrisma.aiBot.findMany.mockResolvedValueOnce([]);
    mockedPrisma.aiBot.count.mockResolvedValueOnce(0);

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(0);
    expect(data.total).toBe(0);
  });

  it('returns canEdit=true for shared bot with WRITE permission', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findMany.mockResolvedValueOnce([
      {
        id: 'bot-1',
        name: 'Shared Bot',
        systemPrompt: 'System prompt',
        aiModelId: 'model-1',
        ownerId: 'other-user',
        aiModel: {
          id: 'model-1',
          name: 'GPT-4',
          aiAccount: {
            id: 'account-1',
            name: 'OpenAI',
            provider: 'openai',
          },
        },
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [{ permission: 'WRITE' }],
      },
    ]);
    mockedPrisma.aiBot.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].canEdit).toBe(true);
    expect(data.items[0].isOwner).toBe(false);
  });

  it('returns canEdit=true and canShare=true for shared bot with FULL permission', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findMany.mockResolvedValueOnce([
      {
        id: 'bot-1',
        name: 'Shared Bot with FULL',
        systemPrompt: 'System prompt',
        aiModelId: 'model-1',
        ownerId: 'other-user',
        aiModel: {
          id: 'model-1',
          name: 'GPT-4',
          aiAccount: {
            id: 'account-1',
            name: 'OpenAI',
            provider: 'openai',
          },
        },
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [{ permission: 'FULL' }],
      },
    ]);
    mockedPrisma.aiBot.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].canEdit).toBe(true);
    expect(data.items[0].canShare).toBe(true);
    expect(data.items[0].isOwner).toBe(false);
  });

  it('returns canEdit=false and canShare=false for shared bot with READ permission', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findMany.mockResolvedValueOnce([
      {
        id: 'bot-1',
        name: 'Shared Bot with READ',
        systemPrompt: 'System prompt',
        aiModelId: 'model-1',
        ownerId: 'other-user',
        aiModel: {
          id: 'model-1',
          name: 'GPT-4',
          aiAccount: {
            id: 'account-1',
            name: 'OpenAI',
            provider: 'openai',
          },
        },
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [{ permission: 'READ' }],
      },
    ]);
    mockedPrisma.aiBot.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].canEdit).toBe(false);
    expect(data.items[0].canShare).toBe(false);
    expect(data.items[0].isOwner).toBe(false);
  });

  it('returns bots ordered by name', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findMany.mockResolvedValueOnce([
      {
        id: 'bot-1',
        name: 'Bot A',
        systemPrompt: 'System A',
        aiModelId: 'model-1',
        ownerId: 'admin-1',
        aiModel: {
          id: 'model-1',
          name: 'GPT-4',
          aiAccount: {
            id: 'account-1',
            name: 'OpenAI',
            provider: 'openai',
          },
        },
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [],
      },
      {
        id: 'bot-2',
        name: 'Bot B',
        systemPrompt: 'System B',
        aiModelId: 'model-1',
        ownerId: 'admin-1',
        aiModel: {
          id: 'model-1',
          name: 'GPT-4',
          aiAccount: {
            id: 'account-1',
            name: 'OpenAI',
            provider: 'openai',
          },
        },
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [],
      },
    ]);
    mockedPrisma.aiBot.count.mockResolvedValueOnce(2);

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(2);
    expect(data.items[0].name).toBe('Bot A');
    expect(data.items[1].name).toBe('Bot B');
  });
});

describe('POST /api/ai-bots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockAdmin();

    const request = new NextRequest('http://localhost/api/ai-bots', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        systemPrompt: '',
        aiModelId: '',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 409 when name already exists', async () => {
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'existing-bot',
    });

    const request = new NextRequest('http://localhost/api/ai-bots', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Support Bot',
        systemPrompt: 'You are helpful',
        aiModelId: 'model-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('aiBotNameExists');
  });

  it('returns 400 when aiModel does not exist', async () => {
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Support Bot',
        systemPrompt: 'You are helpful',
        aiModelId: 'nonexistent-model',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('aiModelNotFound');
  });

  it('successfully creates bot', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-1',
      name: 'GPT-4',
      aiAccount: {
        id: 'account-1',
        name: 'OpenAI',
        provider: 'openai',
      },
    });
    mockedPrisma.aiBot.create.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
      systemPrompt: 'You are a helpful support assistant',
      aiModelId: 'model-1',
      aiModel: {
        id: 'model-1',
        name: 'GPT-4',
        aiAccount: {
          id: 'account-1',
          name: 'OpenAI',
          provider: 'openai',
        },
      },
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-bots', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Support Bot',
        systemPrompt: 'You are a helpful support assistant',
        aiModelId: 'model-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe('Support Bot');
    expect(data.systemPrompt).toBe('You are a helpful support assistant');
    expect(data.aiModel.name).toBe('GPT-4');
  });

  it('creates bot with different models', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-2',
      name: 'Claude 3',
      aiAccount: {
        id: 'account-2',
        name: 'Anthropic',
        provider: 'anthropic',
      },
    });
    mockedPrisma.aiBot.create.mockResolvedValueOnce({
      id: 'bot-2',
      name: 'Claude Bot',
      systemPrompt: 'You are Claude',
      aiModelId: 'model-2',
      aiModel: {
        id: 'model-2',
        name: 'Claude 3',
        aiAccount: {
          id: 'account-2',
          name: 'Anthropic',
          provider: 'anthropic',
        },
      },
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-bots', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Claude Bot',
        systemPrompt: 'You are Claude',
        aiModelId: 'model-2',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe('Claude Bot');
    expect(data.aiModel.name).toBe('Claude 3');
  });
});
