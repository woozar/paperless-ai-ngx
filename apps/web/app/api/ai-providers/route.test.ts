import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiProvider: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
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
    findMany: typeof prisma.aiProvider.findMany;
    findFirst: typeof prisma.aiProvider.findFirst;
    create: typeof prisma.aiProvider.create;
  };
}>(prisma);

describe('GET /api/ai-providers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-providers');

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

    const request = new NextRequest('http://localhost/api/ai-providers');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.message).toBe('error.forbidden');
  });

  it('returns list of providers for admin', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findMany.mockResolvedValueOnce([
      {
        id: 'provider-1',
        name: 'OpenAI',
        provider: 'openai',
        model: 'gpt-4',
        baseUrl: null,
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
      },
    ]);

    const request = new NextRequest('http://localhost/api/ai-providers');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.providers).toHaveLength(1);
    expect(data.providers[0].name).toBe('OpenAI');
    expect(data.providers[0].apiKey).toBeUndefined();
    expect(data.total).toBe(1);
  });

  it('returns empty list when no providers exist', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findMany.mockResolvedValueOnce([]);

    const request = new NextRequest('http://localhost/api/ai-providers');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.providers).toHaveLength(0);
    expect(data.total).toBe(0);
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/ai-providers');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});

describe('POST /api/ai-providers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-providers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'OpenAI',
        provider: 'openai',
        model: 'gpt-4',
        apiKey: 'sk-xxx',
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

    const request = new NextRequest('http://localhost/api/ai-providers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'OpenAI',
        provider: 'openai',
        model: 'gpt-4',
        apiKey: 'sk-xxx',
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

    const request = new NextRequest('http://localhost/api/ai-providers', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        provider: 'invalid-provider',
        model: '',
        apiKey: '',
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
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce({
      id: 'existing-provider',
    });

    const request = new NextRequest('http://localhost/api/ai-providers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'OpenAI',
        provider: 'openai',
        model: 'gpt-4',
        apiKey: 'sk-xxx',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('errors.aiProviderNameExists');
  });

  it('successfully creates provider', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce(null);
    vi.mocked(encrypt).mockReturnValueOnce('encrypted-api-key');
    mockedPrisma.aiProvider.create.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'OpenAI',
      provider: 'openai',
      model: 'gpt-4',
      baseUrl: null,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-providers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'OpenAI',
        provider: 'openai',
        model: 'gpt-4',
        apiKey: 'sk-xxx',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe('OpenAI');
    expect(data.apiKey).toBeUndefined();
    expect(vi.mocked(encrypt)).toHaveBeenCalledWith('sk-xxx');
  });

  it('creates provider with baseUrl', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.aiProvider.findFirst.mockResolvedValueOnce(null);
    vi.mocked(encrypt).mockReturnValueOnce('encrypted-api-key');
    mockedPrisma.aiProvider.create.mockResolvedValueOnce({
      id: 'provider-1',
      name: 'Custom Ollama',
      provider: 'ollama',
      model: 'llama2',
      baseUrl: 'http://localhost:11434',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-providers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Custom Ollama',
        provider: 'ollama',
        model: 'llama2',
        apiKey: 'dummy-key',
        baseUrl: 'http://localhost:11434',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe('Custom Ollama');
    expect(data.baseUrl).toBe('http://localhost:11434');
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/ai-providers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'OpenAI',
        provider: 'openai',
        model: 'gpt-4',
        apiKey: 'sk-xxx',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});
