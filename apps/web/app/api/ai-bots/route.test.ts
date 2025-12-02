import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiBot: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    aiProvider: {
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
  };
  aiProvider: {
    findFirst: typeof prisma.aiProvider.findFirst;
  };
}>(prisma);

describe('GET /api/ai-bots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.message).toBe('error.unauthorized');
  });

  it('returns 403 when user is not admin', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
    });

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.message).toBe('error.forbidden');
  });

  it('returns list of bots for admin', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findMany.mockResolvedValueOnce([
      {
        id: 'bot-1',
        name: 'Support Bot',
        systemPrompt: 'You are a helpful support assistant',
        aiProviderId: 'provider-1',
        aiProvider: {
          id: 'provider-1',
          name: 'OpenAI',
        },
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
      },
    ]);

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.bots).toHaveLength(1);
    expect(data.bots[0].name).toBe('Support Bot');
    expect(data.bots[0].systemPrompt).toBe('You are a helpful support assistant');
    expect(data.total).toBe(1);
  });

  it('returns empty list when no bots exist', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findMany.mockResolvedValueOnce([]);

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.bots).toHaveLength(0);
    expect(data.total).toBe(0);
  });

  it('returns bots ordered by name', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findMany.mockResolvedValueOnce([
      {
        id: 'bot-1',
        name: 'Bot A',
        systemPrompt: 'System A',
        aiProviderId: 'provider-1',
        aiProvider: {
          id: 'provider-1',
          name: 'OpenAI',
        },
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
      },
      {
        id: 'bot-2',
        name: 'Bot B',
        systemPrompt: 'System B',
        aiProviderId: 'provider-1',
        aiProvider: {
          id: 'provider-1',
          name: 'OpenAI',
        },
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
      },
    ]);

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.bots).toHaveLength(2);
    expect(data.bots[0].name).toBe('Bot A');
    expect(data.bots[1].name).toBe('Bot B');
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/ai-bots');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});

describe('POST /api/ai-bots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Support Bot',
        systemPrompt: 'You are helpful',
        aiProviderId: 'provider-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.message).toBe('error.unauthorized');
  });

  it('returns 403 when user is not admin', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
    });

    const request = new NextRequest('http://localhost/api/ai-bots', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Support Bot',
        systemPrompt: 'You are helpful',
        aiProviderId: 'provider-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.message).toBe('error.forbidden');
  });

  it('returns 400 for invalid request body', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });

    const request = new NextRequest('http://localhost/api/ai-bots', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        systemPrompt: '',
        aiProviderId: '',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 409 when name already exists', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'existing-bot',
    });

    const request = new NextRequest('http://localhost/api/ai-bots', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Support Bot',
        systemPrompt: 'You are helpful',
        aiProviderId: 'provider-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('errors.aiBotNameExists');
  });

  it('returns 400 when aiProvider does not exist', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Support Bot',
        systemPrompt: 'You are helpful',
        aiProviderId: 'nonexistent-provider',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('errors.aiProviderNotFound');
  });

  it('successfully creates bot', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
    });
    mockedPrisma.aiBot.create.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
      systemPrompt: 'You are a helpful support assistant',
      aiProviderId: 'provider-1',
      aiProvider: {
        id: 'provider-1',
        name: 'OpenAI',
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
        aiProviderId: 'provider-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe('Support Bot');
    expect(data.systemPrompt).toBe('You are a helpful support assistant');
    expect(data.aiProvider.name).toBe('OpenAI');
  });

  it('creates bot with different providers', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-2',
      name: 'Anthropic',
    });
    mockedPrisma.aiBot.create.mockResolvedValueOnce({
      id: 'bot-2',
      name: 'Claude Bot',
      systemPrompt: 'You are Claude',
      aiProviderId: 'provider-2',
      aiProvider: {
        id: 'provider-2',
        name: 'Anthropic',
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
        aiProviderId: 'provider-2',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe('Claude Bot');
    expect(data.aiProvider.name).toBe('Anthropic');
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/ai-bots', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Support Bot',
        systemPrompt: 'You are helpful',
        aiProviderId: 'provider-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});
