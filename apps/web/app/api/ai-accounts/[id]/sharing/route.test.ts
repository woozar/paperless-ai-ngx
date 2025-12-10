import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiAccount: {
      findFirst: vi.fn(),
    },
    userAiAccountAccess: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
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
  aiAccount: {
    findFirst: typeof prisma.aiAccount.findFirst;
  };
  userAiAccountAccess: {
    findMany: typeof prisma.userAiAccountAccess.findMany;
    findFirst: typeof prisma.userAiAccountAccess.findFirst;
    create: typeof prisma.userAiAccountAccess.create;
    update: typeof prisma.userAiAccountAccess.update;
  };
  user: {
    findUnique: typeof prisma.user.findUnique;
  };
}>(prisma);

function mockAuth() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('GET /api/ai-accounts/[id]/sharing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when account not found', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1/sharing');
    const response = await GET(request, { params: Promise.resolve({ id: 'account-1' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiAccountNotFound');
  });

  it('returns list of shares for account owner', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiAccountAccess.findMany.mockResolvedValueOnce([
      {
        id: 'access-1',
        userId: 'user-2',
        aiAccountId: 'account-1',
        permission: 'READ',
        createdAt: mockDate,
        user: { id: 'user-2', username: 'otheruser' },
      },
    ]);

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1/sharing');
    const response = await GET(request, { params: Promise.resolve({ id: 'account-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].username).toBe('otheruser');
    expect(data.items[0].permission).toBe('READ');
  });
});

describe('POST /api/ai-accounts/[id]/sharing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when account not found', async () => {
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-2', permission: 'READ' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'account-1' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiAccountNotFound');
  });

  it('creates new share for specific user', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      ownerId: 'user-1',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-2',
      username: 'otheruser',
    });
    mockedPrisma.userAiAccountAccess.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.userAiAccountAccess.create.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      aiAccountId: 'account-1',
      permission: 'READ',
      createdAt: mockDate,
      user: { id: 'user-2', username: 'otheruser' },
    });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-2', permission: 'READ' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'account-1' }) });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.userId).toBe('user-2');
    expect(data.permission).toBe('READ');
  });

  it('updates existing share when share already exists', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      ownerId: 'user-1',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-2',
      username: 'otheruser',
    });
    mockedPrisma.userAiAccountAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      aiAccountId: 'account-1',
      permission: 'READ',
      createdAt: mockDate,
    });
    mockedPrisma.userAiAccountAccess.update.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      aiAccountId: 'account-1',
      permission: 'WRITE',
      createdAt: mockDate,
      user: { id: 'user-2', username: 'otheruser' },
    });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-2', permission: 'WRITE' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'account-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.permission).toBe('WRITE');
  });

  it('creates share for all users (userId = null)', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiAccountAccess.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.userAiAccountAccess.create.mockResolvedValueOnce({
      id: 'access-1',
      userId: null,
      aiAccountId: 'account-1',
      permission: 'READ',
      createdAt: mockDate,
      user: null,
    });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: null, permission: 'READ' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'account-1' }) });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.userId).toBeNull();
  });

  it('updates existing all-users share', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiAccount.findFirst.mockResolvedValueOnce({
      id: 'account-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiAccountAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      userId: null,
      aiAccountId: 'account-1',
      permission: 'READ',
      createdAt: mockDate,
    });
    mockedPrisma.userAiAccountAccess.update.mockResolvedValueOnce({
      id: 'access-1',
      userId: null,
      aiAccountId: 'account-1',
      permission: 'WRITE',
      createdAt: mockDate,
      user: null,
    });

    const request = new NextRequest('http://localhost/api/ai-accounts/account-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: null, permission: 'WRITE' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'account-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.userId).toBeNull();
    expect(data.permission).toBe('WRITE');
  });
});
