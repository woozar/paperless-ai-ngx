import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH, DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiBot: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
    findFirst: typeof prisma.aiBot.findFirst;
    update: typeof prisma.aiBot.update;
    delete: typeof prisma.aiBot.delete;
  };
  aiModel: {
    findFirst: typeof prisma.aiModel.findFirst;
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

describe('GET /api/ai-bots/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when bot not found', async () => {
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1');
    const response = await GET(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiBotNotFound');
  });

  it('returns bot details', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
      systemPrompt: 'You are a helpful support assistant',
      aiModelId: 'model-1',
      aiModel: {
        id: 'model-1',
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
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

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1');
    const response = await GET(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('Support Bot');
    expect(data.systemPrompt).toBe('You are a helpful support assistant');
    expect(data.aiModel.name).toBe('GPT-4');
  });
});

describe('PATCH /api/ai-bots/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockAdmin();

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: '' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 404 when bot not found', async () => {
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiBotNotFound');
  });

  it('returns 409 when new name already exists', async () => {
    mockAdmin();
    mockedPrisma.aiBot.findFirst
      .mockResolvedValueOnce({
        id: 'bot-1',
        name: 'Support Bot',
      })
      .mockResolvedValueOnce({
        id: 'bot-2',
        name: 'New Name',
      });

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('aiBotNameExists');
  });

  it('successfully updates bot name', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findFirst
      .mockResolvedValueOnce({
        id: 'bot-1',
        name: 'Support Bot',
      })
      .mockResolvedValueOnce(null);
    mockedPrisma.aiBot.update.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'New Name',
      systemPrompt: 'You are helpful',
      aiModelId: 'model-1',
      aiModel: {
        id: 'model-1',
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
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

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('New Name');
  });

  it('successfully updates bot systemPrompt', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
    });
    mockedPrisma.aiBot.update.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
      systemPrompt: 'New system prompt',
      aiModelId: 'model-1',
      aiModel: {
        id: 'model-1',
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
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

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ systemPrompt: 'New system prompt' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.systemPrompt).toBe('New system prompt');
  });

  it('returns 400 when changing to non-existent model', async () => {
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
    });
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ aiModelId: 'nonexistent-model' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('aiModelNotFound');
  });

  it('successfully updates bot model', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
    });
    mockedPrisma.aiModel.findFirst.mockResolvedValueOnce({
      id: 'model-2',
      name: 'Claude 3.5 Sonnet',
      modelIdentifier: 'claude-3-5-sonnet',
      aiAccount: {
        id: 'account-2',
        name: 'Anthropic',
        provider: 'anthropic',
      },
    });
    mockedPrisma.aiBot.update.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
      systemPrompt: 'You are helpful',
      aiModelId: 'model-2',
      aiModel: {
        id: 'model-2',
        name: 'Claude 3.5 Sonnet',
        modelIdentifier: 'claude-3-5-sonnet',
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

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ aiModelId: 'model-2' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.aiModel.id).toBe('model-2');
    expect(data.aiModel.name).toBe('Claude 3.5 Sonnet');
  });

  it('updates isActive status', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
    });
    mockedPrisma.aiBot.update.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
      systemPrompt: 'You are helpful',
      aiModelId: 'model-1',
      aiModel: {
        id: 'model-1',
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccount: {
          id: 'account-1',
          name: 'OpenAI',
          provider: 'openai',
        },
      },
      isActive: false,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ isActive: false }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isActive).toBe(false);
  });

  it('successfully updates bot responseLanguage', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
    });
    mockedPrisma.aiBot.update.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
      systemPrompt: 'You are helpful',
      responseLanguage: 'GERMAN',
      aiModelId: 'model-1',
      aiModel: {
        id: 'model-1',
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
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

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ responseLanguage: 'GERMAN' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.responseLanguage).toBe('GERMAN');
  });
});

describe('DELETE /api/ai-bots/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when bot not found', async () => {
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiBotNotFound');
  });

  it('successfully deletes bot', async () => {
    mockAdmin();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
      ownerId: 'admin-1',
    });
    mockedPrisma.aiBot.delete.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
    });

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockedPrisma.aiBot.delete).toHaveBeenCalledWith({
      where: { id: 'bot-1' },
    });
  });
});
