import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    aiBot: {
      findFirst: vi.fn(),
    },
    userAiBotAccess: {
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
  aiBot: {
    findFirst: typeof prisma.aiBot.findFirst;
  };
  userAiBotAccess: {
    findMany: typeof prisma.userAiBotAccess.findMany;
    findFirst: typeof prisma.userAiBotAccess.findFirst;
    create: typeof prisma.userAiBotAccess.create;
    update: typeof prisma.userAiBotAccess.update;
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

describe('GET /api/ai-bots/[id]/sharing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when bot not found', async () => {
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing');
    const response = await GET(request, { params: Promise.resolve({ id: 'bot-1' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiBotNotFound');
  });

  it('returns list of shares for bot owner', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiBotAccess.findMany.mockResolvedValueOnce([
      {
        id: 'access-1',
        userId: 'user-2',
        aiBotId: 'bot-1',
        permission: 'READ',
        createdAt: mockDate,
        user: { id: 'user-2', username: 'otheruser' },
      },
      {
        id: 'access-2',
        userId: null,
        aiBotId: 'bot-1',
        permission: 'WRITE',
        createdAt: mockDate,
        user: null,
      },
    ]);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing');
    const response = await GET(request, { params: Promise.resolve({ id: 'bot-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(2);
    expect(data.items[0].username).toBe('otheruser');
    expect(data.items[0].permission).toBe('READ');
    expect(data.items[1].userId).toBeNull();
    expect(data.items[1].username).toBeNull();
    expect(data.items[1].permission).toBe('WRITE');
  });
});

describe('POST /api/ai-bots/[id]/sharing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when bot not found', async () => {
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-2', permission: 'READ' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'bot-1' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('aiBotNotFound');
  });

  it('creates new share for specific user', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      ownerId: 'user-1',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-2',
      username: 'otheruser',
    });
    mockedPrisma.userAiBotAccess.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.userAiBotAccess.create.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      aiBotId: 'bot-1',
      permission: 'READ',
      createdAt: mockDate,
      user: { id: 'user-2', username: 'otheruser' },
    });

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-2', permission: 'READ' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'bot-1' }) });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.userId).toBe('user-2');
    expect(data.permission).toBe('READ');
  });

  it('returns 404 when target user not found', async () => {
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      ownerId: 'user-1',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'nonexistent-user', permission: 'READ' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'bot-1' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('userNotFound');
  });

  it('returns 400 when trying to share with self', async () => {
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      ownerId: 'user-1',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
    });

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-1', permission: 'READ' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'bot-1' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('cannotShareWithSelf');
  });

  it('updates existing share when share already exists', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      ownerId: 'user-1',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-2',
      username: 'otheruser',
    });
    mockedPrisma.userAiBotAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      aiBotId: 'bot-1',
      permission: 'READ',
      createdAt: mockDate,
    });
    mockedPrisma.userAiBotAccess.update.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      aiBotId: 'bot-1',
      permission: 'WRITE',
      createdAt: mockDate,
      user: { id: 'user-2', username: 'otheruser' },
    });

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-2', permission: 'WRITE' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'bot-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.permission).toBe('WRITE');
  });

  it('creates share for all users', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiBotAccess.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.userAiBotAccess.create.mockResolvedValueOnce({
      id: 'access-1',
      userId: null,
      aiBotId: 'bot-1',
      permission: 'WRITE',
      createdAt: mockDate,
      user: null,
    });

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: null, permission: 'WRITE' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'bot-1' }) });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.userId).toBeNull();
  });

  it('updates existing all-users share', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.aiBot.findFirst.mockResolvedValueOnce({
      id: 'bot-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userAiBotAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      userId: null,
      aiBotId: 'bot-1',
      permission: 'READ',
      createdAt: mockDate,
    });
    mockedPrisma.userAiBotAccess.update.mockResolvedValueOnce({
      id: 'access-1',
      userId: null,
      aiBotId: 'bot-1',
      permission: 'WRITE',
      createdAt: mockDate,
      user: null,
    });

    const request = new NextRequest('http://localhost/api/ai-bots/bot-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: null, permission: 'WRITE' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'bot-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.userId).toBeNull();
    expect(data.username).toBeNull();
    expect(data.permission).toBe('WRITE');
  });
});
