import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiProvider: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
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
    findMany: typeof prisma.aiProvider.findMany;
    findFirst: typeof prisma.aiProvider.findFirst;
    create: typeof prisma.aiProvider.create;
    count: typeof prisma.aiProvider.count;
  };
}>(prisma);

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('GET /api/ai-providers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns list of providers for admin', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiProvider.findMany.mockResolvedValueOnce([
      {
        id: 'provider-1',
        name: 'OpenAI',
        provider: 'openai',
        model: 'gpt-4',
        baseUrl: null,
        ownerId: 'admin-1',
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [],
      },
    ]);
    mockedPrisma.aiProvider.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-providers');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].name).toBe('OpenAI');
    expect(data.items[0].apiKey).toBeUndefined();
    expect(data.total).toBe(1);
  });

  it('returns empty list when no providers exist', async () => {
    mockAdmin();
    mockedPrisma.aiProvider.findMany.mockResolvedValueOnce([]);
    mockedPrisma.aiProvider.count.mockResolvedValueOnce(0);

    const request = new NextRequest('http://localhost/api/ai-providers');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(0);
    expect(data.total).toBe(0);
  });

  it('returns canEdit=true for shared provider with WRITE permission', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiProvider.findMany.mockResolvedValueOnce([
      {
        id: 'provider-1',
        name: 'Shared Provider',
        provider: 'openai',
        model: 'gpt-4',
        baseUrl: null,
        ownerId: 'other-user',
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [{ permission: 'WRITE' }],
      },
    ]);
    mockedPrisma.aiProvider.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-providers');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].canEdit).toBe(true);
    expect(data.items[0].isOwner).toBe(false);
  });

  it('returns canEdit=true and canShare=true for shared provider with FULL permission', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.aiProvider.findMany.mockResolvedValueOnce([
      {
        id: 'provider-1',
        name: 'Shared Provider with FULL',
        provider: 'openai',
        model: 'gpt-4',
        baseUrl: null,
        ownerId: 'other-user',
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [{ permission: 'FULL' }],
      },
    ]);
    mockedPrisma.aiProvider.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-providers');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].canEdit).toBe(true);
    expect(data.items[0].canShare).toBe(true);
    expect(data.items[0].isOwner).toBe(false);
  });
});

describe('POST /api/ai-providers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockAdmin();

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
    mockAdmin();
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
    expect(data.message).toBe('aiProviderNameExists');
  });

  it('successfully creates provider', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
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
    mockAdmin();
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
});
