import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiAccount: {
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
  aiAccount: {
    findMany: typeof prisma.aiAccount.findMany;
    findFirst: typeof prisma.aiAccount.findFirst;
    create: typeof prisma.aiAccount.create;
    count: typeof prisma.aiAccount.count;
  };
}>(prisma);

function mockAuth() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('GET /api/ai-accounts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns list of accounts for user', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findMany.mockResolvedValueOnce([
      {
        id: 'account-1',
        name: 'My OpenAI',
        provider: 'openai',
        baseUrl: null,
        isActive: true,
        ownerId: 'user-1',
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [],
      },
    ]);
    mockedPrisma.aiAccount.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-accounts');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].name).toBe('My OpenAI');
    expect(data.total).toBe(1);
  });

  it('returns canEdit=true for shared account with WRITE permission', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findMany.mockResolvedValueOnce([
      {
        id: 'account-1',
        name: 'Shared Account',
        provider: 'openai',
        baseUrl: null,
        isActive: true,
        ownerId: 'other-user',
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [{ permission: 'WRITE' }],
      },
    ]);
    mockedPrisma.aiAccount.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-accounts');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].canEdit).toBe(true);
    expect(data.items[0].isOwner).toBe(false);
  });

  it('returns canEdit=true and canShare=true for shared account with FULL permission', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findMany.mockResolvedValueOnce([
      {
        id: 'account-1',
        name: 'Shared Account with FULL',
        provider: 'openai',
        baseUrl: null,
        isActive: true,
        ownerId: 'other-user',
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [{ permission: 'FULL' }],
      },
    ]);
    mockedPrisma.aiAccount.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/ai-accounts');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].canEdit).toBe(true);
    expect(data.items[0].canShare).toBe(true);
    expect(data.items[0].isOwner).toBe(false);
  });
});

describe('POST /api/ai-accounts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockAuth();

    const request = new NextRequest('http://localhost/api/ai-accounts', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        provider: 'invalid',
        apiKey: '',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 409 when name already exists', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'existing-account',
    });

    const request = new NextRequest('http://localhost/api/ai-accounts', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Existing Account',
        provider: 'openai',
        apiKey: 'secret-key',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('aiAccountNameExists');
  });

  it('successfully creates account', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce(null);
    vi.mocked(encrypt).mockReturnValueOnce('encrypted-key');
    mockedPrisma.aiAccount.create.mockResolvedValueOnce({
      id: 'new-account-1',
      name: 'My OpenAI',
      provider: 'openai',
      baseUrl: null,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-accounts', {
      method: 'POST',
      body: JSON.stringify({
        name: 'My OpenAI',
        provider: 'openai',
        apiKey: 'secret-key',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe('My OpenAI');
    expect(vi.mocked(encrypt)).toHaveBeenCalledWith('secret-key');
  });

  it('creates account with custom baseUrl', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce(null);
    vi.mocked(encrypt).mockReturnValueOnce('encrypted-key');
    mockedPrisma.aiAccount.create.mockResolvedValueOnce({
      id: 'new-account-1',
      name: 'Custom AI',
      provider: 'custom',
      baseUrl: 'https://custom.ai/api',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-accounts', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Custom AI',
        provider: 'custom',
        apiKey: 'secret-key',
        baseUrl: 'https://custom.ai/api',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.baseUrl).toBe('https://custom.ai/api');
  });
});
