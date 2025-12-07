import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
    },
    userPaperlessInstanceAccess: {
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
  paperlessInstance: {
    findFirst: typeof prisma.paperlessInstance.findFirst;
  };
  userPaperlessInstanceAccess: {
    findMany: typeof prisma.userPaperlessInstanceAccess.findMany;
    findFirst: typeof prisma.userPaperlessInstanceAccess.findFirst;
    create: typeof prisma.userPaperlessInstanceAccess.create;
    update: typeof prisma.userPaperlessInstanceAccess.update;
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

describe('GET /api/paperless-instances/[id]/sharing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/sharing');
    const response = await GET(request, { params: Promise.resolve({ id: 'instance-1' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns list of shares for instance owner', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userPaperlessInstanceAccess.findMany.mockResolvedValueOnce([
      {
        id: 'access-1',
        userId: 'user-2',
        instanceId: 'instance-1',
        permission: 'READ',
        createdAt: mockDate,
        user: { id: 'user-2', username: 'otheruser' },
      },
      {
        id: 'access-2',
        userId: null,
        instanceId: 'instance-1',
        permission: 'WRITE',
        createdAt: mockDate,
        user: null,
      },
    ]);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/sharing');
    const response = await GET(request, { params: Promise.resolve({ id: 'instance-1' }) });
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

describe('POST /api/paperless-instances/[id]/sharing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-2', permission: 'READ' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'instance-1' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('creates new share for specific user', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      ownerId: 'user-1',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-2',
      username: 'otheruser',
    });
    mockedPrisma.userPaperlessInstanceAccess.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.userPaperlessInstanceAccess.create.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      instanceId: 'instance-1',
      permission: 'READ',
      createdAt: mockDate,
      user: { id: 'user-2', username: 'otheruser' },
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-2', permission: 'READ' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'instance-1' }) });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.userId).toBe('user-2');
    expect(data.permission).toBe('READ');
  });

  it('returns 404 when target user not found', async () => {
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      ownerId: 'user-1',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'nonexistent-user', permission: 'READ' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'instance-1' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('userNotFound');
  });

  it('returns 400 when trying to share with self', async () => {
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      ownerId: 'user-1',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-1', permission: 'READ' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'instance-1' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('cannotShareWithSelf');
  });

  it('updates existing share when share already exists', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      ownerId: 'user-1',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-2',
      username: 'otheruser',
    });
    mockedPrisma.userPaperlessInstanceAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      instanceId: 'instance-1',
      permission: 'READ',
      createdAt: mockDate,
    });
    mockedPrisma.userPaperlessInstanceAccess.update.mockResolvedValueOnce({
      id: 'access-1',
      userId: 'user-2',
      instanceId: 'instance-1',
      permission: 'WRITE',
      createdAt: mockDate,
      user: { id: 'user-2', username: 'otheruser' },
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-2', permission: 'WRITE' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'instance-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.permission).toBe('WRITE');
  });

  it('creates share for all users', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userPaperlessInstanceAccess.findFirst.mockResolvedValueOnce(null);
    mockedPrisma.userPaperlessInstanceAccess.create.mockResolvedValueOnce({
      id: 'access-1',
      userId: null,
      instanceId: 'instance-1',
      permission: 'WRITE',
      createdAt: mockDate,
      user: null,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: null, permission: 'WRITE' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'instance-1' }) });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.userId).toBeNull();
  });

  it('updates existing all-users share', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAuth();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      ownerId: 'user-1',
    });
    mockedPrisma.userPaperlessInstanceAccess.findFirst.mockResolvedValueOnce({
      id: 'access-1',
      userId: null,
      instanceId: 'instance-1',
      permission: 'READ',
      createdAt: mockDate,
    });
    mockedPrisma.userPaperlessInstanceAccess.update.mockResolvedValueOnce({
      id: 'access-1',
      userId: null,
      instanceId: 'instance-1',
      permission: 'WRITE',
      createdAt: mockDate,
      user: null,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1/sharing', {
      method: 'POST',
      body: JSON.stringify({ userId: null, permission: 'WRITE' }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: 'instance-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.userId).toBeNull();
    expect(data.username).toBeNull();
    expect(data.permission).toBe('WRITE');
  });
});
