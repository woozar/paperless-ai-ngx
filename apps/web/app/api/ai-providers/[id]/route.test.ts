import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH, DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiProvider: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    aiBot: {
      count: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

vi.mock('@/lib/crypto/encryption', () => ({
  encrypt: vi.fn(),
}));

import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { encrypt } from '@/lib/crypto/encryption';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  aiProvider: {
    findFirst: typeof prisma.aiProvider.findFirst;
    update: typeof prisma.aiProvider.update;
    delete: typeof prisma.aiProvider.delete;
  };
  aiBot: {
    count: typeof prisma.aiBot.count;
  };
}>(prisma);

const mockContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe('GET /api/ai-providers/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1');
    const response = await GET(request, mockContext('provider-1'));
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

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1');
    const response = await GET(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.message).toBe('error.forbidden');
  });

  it('returns 404 when provider not found', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1');
    const response = await GET(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('errors.aiProviderNotFound');
  });

  it('returns provider details', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
      provider: 'openai',
      model: 'gpt-4',
      baseUrl: null,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1');
    const response = await GET(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('OpenAI');
    expect(data.apiKey).toBeUndefined();
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1');
    const response = await GET(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});

describe('PATCH /api/ai-providers/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('provider-1'));
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

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('provider-1'));
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

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: '' }),
    });
    const response = await PATCH(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 404 when provider not found', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('errors.aiProviderNotFound');
  });

  it('returns 409 when new name already exists', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst
      .mockResolvedValueOnce({
        id: 'provider-1',
        name: 'OpenAI',
      })
      .mockResolvedValueOnce({
        id: 'provider-2',
        name: 'New Name',
      });

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('errors.aiProviderNameExists');
  });

  it('successfully updates provider', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst
      .mockResolvedValueOnce({
        id: 'provider-1',
        name: 'OpenAI',
      })
      .mockResolvedValueOnce(null);
    mockedPrisma.aiProvider.update.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'New Name',
      provider: 'openai',
      model: 'gpt-4',
      baseUrl: null,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('New Name');
    expect(data.apiKey).toBeUndefined();
  });

  it('updates apiKey when provided', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
    });
    vi.mocked(encrypt).mockReturnValueOnce('new-encrypted-api-key');
    mockedPrisma.aiProvider.update.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
      provider: 'openai',
      model: 'gpt-4',
      baseUrl: null,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ apiKey: 'new-sk-xxx' }),
    });
    const response = await PATCH(request, mockContext('provider-1'));

    expect(response.status).toBe(200);
    expect(vi.mocked(encrypt)).toHaveBeenCalledWith('new-sk-xxx');
  });

  it('does not update apiKey when not provided', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst
      .mockResolvedValueOnce({
        id: 'provider-1',
        name: 'OpenAI',
      })
      .mockResolvedValueOnce(null);
    mockedPrisma.aiProvider.update.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'New Name',
      provider: 'openai',
      model: 'gpt-4',
      baseUrl: null,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    await PATCH(request, mockContext('provider-1'));

    expect(vi.mocked(encrypt)).not.toHaveBeenCalled();
  });

  it('updates isActive status', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
    });
    mockedPrisma.aiProvider.update.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
      provider: 'openai',
      model: 'gpt-4',
      baseUrl: null,
      isActive: false,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ isActive: false }),
    });
    const response = await PATCH(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isActive).toBe(false);
  });

  it('updates provider type', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
    });
    mockedPrisma.aiProvider.update.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
      provider: 'anthropic',
      model: 'gpt-4',
      baseUrl: null,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ provider: 'anthropic' }),
    });
    const response = await PATCH(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.provider).toBe('anthropic');
  });

  it('updates model', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
    });
    mockedPrisma.aiProvider.update.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
      provider: 'openai',
      model: 'gpt-4-turbo',
      baseUrl: null,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ model: 'gpt-4-turbo' }),
    });
    const response = await PATCH(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.model).toBe('gpt-4-turbo');
  });

  it('updates baseUrl', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
    });
    mockedPrisma.aiProvider.update.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
      provider: 'openai',
      model: 'gpt-4',
      baseUrl: 'http://new-url.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ baseUrl: 'http://new-url.com' }),
    });
    const response = await PATCH(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.baseUrl).toBe('http://new-url.com');
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});

describe('DELETE /api/ai-providers/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('provider-1'));
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

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.message).toBe('error.forbidden');
  });

  it('returns 404 when provider not found', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('errors.aiProviderNotFound');
  });

  it('returns 400 when provider is in use by bots', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
    });
    mockedPrisma.aiBot.count.mockResolvedValueOnce(2);

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('errors.aiProviderInUse');
    expect(data.params.count).toBe(2);
  });

  it('successfully deletes provider when no bots reference it', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
    });
    mockedPrisma.aiBot.count.mockResolvedValueOnce(0);
    mockedPrisma.aiProvider.delete.mockResolvedValueOnce({});

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('provider-1'));

    expect(response.status).toBe(204);
    expect(mockedPrisma.aiProvider.delete).toHaveBeenCalledWith({
      where: { id: 'provider-1' },
    });
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/ai-providers/provider-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('provider-1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});
