import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
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
  paperlessInstance: {
    findMany: typeof prisma.paperlessInstance.findMany;
    findFirst: typeof prisma.paperlessInstance.findFirst;
    create: typeof prisma.paperlessInstance.create;
    count: typeof prisma.paperlessInstance.count;
  };
}>(prisma);

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('GET /api/paperless-instances', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns list of instances for admin', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findMany.mockResolvedValueOnce([
      {
        id: 'instance-1',
        name: 'My Paperless',
        apiUrl: 'https://paperless.example.com',
        ownerId: 'admin-1',
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [],
      },
    ]);
    mockedPrisma.paperlessInstance.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/paperless-instances');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].name).toBe('My Paperless');
    expect(data.items[0].apiToken).toBe('***');
    expect(data.total).toBe(1);
  });

  it('returns canEdit=true for shared instance with WRITE permission', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findMany.mockResolvedValueOnce([
      {
        id: 'instance-1',
        name: 'Shared Instance',
        apiUrl: 'https://paperless.example.com',
        ownerId: 'other-user',
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [{ permission: 'WRITE' }],
      },
    ]);
    mockedPrisma.paperlessInstance.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/paperless-instances');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].canEdit).toBe(true);
    expect(data.items[0].isOwner).toBe(false);
  });

  it('returns canEdit=true and canShare=true for shared instance with FULL permission', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findMany.mockResolvedValueOnce([
      {
        id: 'instance-1',
        name: 'Shared Instance with FULL',
        apiUrl: 'https://paperless.example.com',
        ownerId: 'other-user',
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        sharedWith: [{ permission: 'FULL' }],
      },
    ]);
    mockedPrisma.paperlessInstance.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/paperless-instances');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].canEdit).toBe(true);
    expect(data.items[0].canShare).toBe(true);
    expect(data.items[0].isOwner).toBe(false);
  });
});

describe('POST /api/paperless-instances', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockAdmin();

    const request = new NextRequest('http://localhost/api/paperless-instances', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        apiUrl: 'not-a-url',
        apiToken: '',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 409 when name already exists', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'existing-instance',
    });

    const request = new NextRequest('http://localhost/api/paperless-instances', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Existing Paperless',
        apiUrl: 'https://paperless.example.com',
        apiToken: 'secret-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('paperlessInstanceNameExists');
  });

  it('successfully creates instance', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);
    vi.mocked(encrypt).mockReturnValueOnce('encrypted-token');
    mockedPrisma.paperlessInstance.create.mockResolvedValueOnce({
      id: 'new-instance-1',
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances', {
      method: 'POST',
      body: JSON.stringify({
        name: 'My Paperless',
        apiUrl: 'https://paperless.example.com',
        apiToken: 'secret-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe('My Paperless');
    expect(data.apiToken).toBe('***');
    expect(vi.mocked(encrypt)).toHaveBeenCalledWith('secret-token');
  });
});
