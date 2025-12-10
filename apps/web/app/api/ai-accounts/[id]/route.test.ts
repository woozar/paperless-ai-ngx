import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH, DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiAccount: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    aiModel: {
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
    findFirst: typeof prisma.aiAccount.findFirst;
    update: typeof prisma.aiAccount.update;
    delete: typeof prisma.aiAccount.delete;
  };
  aiModel: {
    count: typeof prisma.aiModel.count;
  };
}>(prisma);

function mockAuth() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('GET /api/ai-accounts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when account not found', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1', {
      method: 'GET',
    });
    const response = await GET(request, {
      params: Promise.resolve({ id: 'account-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiAccountNotFound');
  });

  it('returns account details', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      name: 'My OpenAI',
      provider: 'openai',
      baseUrl: null,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1', {
      method: 'GET',
    });
    const response = await GET(request, {
      params: Promise.resolve({ id: 'account-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('My OpenAI');
  });
});

describe('PATCH /api/ai-accounts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when account not found', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated Name' }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'account-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiAccountNotFound');
  });

  it('returns 409 when new name already exists', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst
      .mockResolvedValueOnce({
        id: 'account-1',
        name: 'Original Name',
        provider: 'openai',
        apiKey: 'encrypted',
        baseUrl: null,
        isActive: true,
        ownerId: 'user-1',
        createdAt: mockDate,
        updatedAt: mockDate,
      })
      .mockResolvedValueOnce({
        id: 'account-2',
        name: 'New Name',
      });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'account-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('aiAccountNameExists');
  });

  it('successfully updates account', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      name: 'Original Name',
      provider: 'openai',
      apiKey: 'encrypted',
      baseUrl: null,
      isActive: true,
      ownerId: 'user-1',
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    mockedPrisma.aiAccount.update.mockResolvedValueOnce({
      id: 'account-1',
      name: 'Updated Name',
      provider: 'openai',
      baseUrl: null,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated Name' }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'account-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('Updated Name');
  });

  it('updates provider, baseUrl, and isActive fields', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      name: 'My Account',
      provider: 'openai',
      apiKey: 'encrypted',
      baseUrl: null,
      isActive: true,
      ownerId: 'user-1',
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    mockedPrisma.aiAccount.update.mockResolvedValueOnce({
      id: 'account-1',
      name: 'My Account',
      provider: 'ollama',
      baseUrl: 'http://localhost:11434',
      isActive: false,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1', {
      method: 'PATCH',
      body: JSON.stringify({
        provider: 'ollama',
        baseUrl: 'http://localhost:11434',
        isActive: false,
      }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'account-1' }),
    });
    await response.json();

    expect(response.status).toBe(200);
    expect(mockedPrisma.aiAccount.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          provider: 'ollama',
          baseUrl: 'http://localhost:11434',
          isActive: false,
        }),
      })
    );
  });

  it('encrypts new API key when provided', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      name: 'My Account',
      provider: 'openai',
      apiKey: 'old-encrypted',
      baseUrl: null,
      isActive: true,
      ownerId: 'user-1',
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    vi.mocked(encrypt).mockReturnValueOnce('new-encrypted');
    mockedPrisma.aiAccount.update.mockResolvedValueOnce({
      id: 'account-1',
      name: 'My Account',
      provider: 'openai',
      baseUrl: null,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1', {
      method: 'PATCH',
      body: JSON.stringify({ apiKey: 'new-secret-key' }),
    });
    await PATCH(request, {
      params: Promise.resolve({ id: 'account-1' }),
    });

    expect(vi.mocked(encrypt)).toHaveBeenCalledWith('new-secret-key');
  });
});

describe('DELETE /api/ai-accounts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when account not found', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'account-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiAccountNotFound');
  });

  it('returns 400 when account is in use by models', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      name: 'My Account',
      provider: 'openai',
      apiKey: 'encrypted',
      baseUrl: null,
      isActive: true,
      ownerId: 'user-1',
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    mockedPrisma.aiModel.count.mockResolvedValueOnce(3);

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'account-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('aiAccountInUse');
    expect(data.params.count).toBe(3);
  });

  it('successfully deletes account', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      name: 'My Account',
      provider: 'openai',
      apiKey: 'encrypted',
      baseUrl: null,
      isActive: true,
      ownerId: 'user-1',
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    mockedPrisma.aiModel.count.mockResolvedValueOnce(0);
    mockedPrisma.aiAccount.delete.mockResolvedValueOnce({ id: 'account-1' });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'account-1' }),
    });

    expect(response.status).toBe(204);
  });
});
