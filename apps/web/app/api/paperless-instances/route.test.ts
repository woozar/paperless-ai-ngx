import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
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
  paperlessInstance: {
    findMany: typeof prisma.paperlessInstance.findMany;
    findFirst: typeof prisma.paperlessInstance.findFirst;
    create: typeof prisma.paperlessInstance.create;
  };
}>(prisma);

describe('GET /api/paperless-instances', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances');

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

    const request = new NextRequest('http://localhost/api/paperless-instances');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.message).toBe('error.forbidden');
  });

  it('returns list of instances for admin', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.paperlessInstance.findMany.mockResolvedValueOnce([
      {
        id: 'instance-1',
        name: 'My Paperless',
        apiUrl: 'https://paperless.example.com',
        isActive: true,
        createdAt: mockDate,
        updatedAt: mockDate,
      },
    ]);

    const request = new NextRequest('http://localhost/api/paperless-instances');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.instances).toHaveLength(1);
    expect(data.instances[0].name).toBe('My Paperless');
    expect(data.instances[0].apiToken).toBe('***');
    expect(data.total).toBe(1);
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/paperless-instances');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});

describe('POST /api/paperless-instances', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

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

    expect(response.status).toBe(401);
    expect(data.message).toBe('error.unauthorized');
  });

  it('returns 403 when user is not admin', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
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

    expect(response.status).toBe(403);
    expect(data.message).toBe('error.forbidden');
  });

  it('returns 400 for invalid request body', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });

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
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
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
    expect(data.message).toBe('errors.paperlessInstanceNameExists');
  });

  it('successfully creates instance', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
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

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

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

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});
