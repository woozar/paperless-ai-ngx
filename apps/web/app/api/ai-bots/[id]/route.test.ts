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
    findFirst: typeof prisma.aiBot.findFirst;
    update: typeof prisma.aiBot.update;
    delete: typeof prisma.aiBot.delete;
  };
  aiProvider: {
    findFirst: typeof prisma.aiProvider.findFirst;
  };
}>(prisma);

const mockContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe('GET /api/ai-bots/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1');
    const response = await GET(request, mockContext('bot-1'));
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

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1');
    const response = await GET(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.message).toBe('error.forbidden');
  });

  it('returns 404 when bot not found', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1');
    const response = await GET(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('errors.aiBotNotFound');
  });

  it('returns bot details', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
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

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1');
    const response = await GET(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('Support Bot');
    expect(data.systemPrompt).toBe('You are a helpful support assistant');
    expect(data.aiProvider.name).toBe('OpenAI');
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1');
    const response = await GET(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});

describe('PATCH /api/ai-bots/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
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

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
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
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('errors.aiBotNotFound');
  });

  it('returns 409 when new name already exists', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
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
    expect(data.message).toBe('errors.aiBotNameExists');
  });

  it('successfully updates bot name', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
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
      aiProviderId: 'provider-1',
      aiProvider: {
        id: 'provider-1',
        name: 'OpenAI',
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
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
    });
    mockedPrisma.aiBot.update.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
      systemPrompt: 'New system prompt',
      aiProviderId: 'provider-1',
      aiProvider: {
        id: 'provider-1',
        name: 'OpenAI',
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

  it('returns 400 when changing to non-existent provider', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ aiProviderId: 'nonexistent-provider' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('errors.aiProviderNotFound');
  });

  it('successfully updates bot provider', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-2',
      name: 'Anthropic',
    });
    mockedPrisma.aiBot.update.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
      systemPrompt: 'You are helpful',
      aiProviderId: 'provider-2',
      aiProvider: {
        id: 'provider-2',
        name: 'Anthropic',
      },
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ aiProviderId: 'provider-2' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.aiProvider.id).toBe('provider-2');
    expect(data.aiProvider.name).toBe('Anthropic');
  });

  it('updates isActive status', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
    });
    mockedPrisma.aiBot.update.mockResolvedValueOnce({
      id: 'bot-1',
      name: 'Support Bot',
      systemPrompt: 'You are helpful',
      aiProviderId: 'provider-1',
      aiProvider: {
        id: 'provider-1',
        name: 'OpenAI',
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

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});

describe('DELETE /api/ai-bots/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('bot-1'));
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

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.message).toBe('error.forbidden');
  });

  it('returns 404 when bot not found', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('errors.aiBotNotFound');
  });

  it('successfully deletes bot', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
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

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('bot-1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});
