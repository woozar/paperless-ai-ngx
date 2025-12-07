import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH, DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
    findFirst: typeof prisma.paperlessInstance.findFirst;
    update: typeof prisma.paperlessInstance.update;
    delete: typeof prisma.paperlessInstance.delete;
  };
}>(prisma);

const mockContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('GET /api/paperless-instances/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns instance details', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('My Paperless');
    expect(data.apiToken).toBe('***');
  });
});

describe('PATCH /api/paperless-instances/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockAdmin();

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: '', apiUrl: 'not-a-url' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns 409 when new name already exists', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst
      .mockResolvedValueOnce({
        id: 'instance-1',
        name: 'Old Name',
      })
      .mockResolvedValueOnce({
        id: 'other-instance',
        name: 'New Name',
      });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('paperlessInstanceNameExists');
  });

  it('successfully updates instance', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst
      .mockResolvedValueOnce({
        id: 'instance-1',
        name: 'Old Name',
      })
      .mockResolvedValueOnce(null);
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'New Name',
      apiUrl: 'https://paperless.example.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('New Name');
    expect(data.apiToken).toBe('***');
  });

  it('updates apiToken when provided', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
    });
    vi.mocked(encrypt).mockReturnValueOnce('new-encrypted-token');
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ apiToken: 'new-secret-token' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));

    expect(response.status).toBe(200);
    expect(vi.mocked(encrypt)).toHaveBeenCalledWith('new-secret-token');
  });

  it('does not update apiToken when not provided', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst
      .mockResolvedValueOnce({
        id: 'instance-1',
        name: 'Old Name',
      })
      .mockResolvedValueOnce(null);
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'New Name',
      apiUrl: 'https://paperless.example.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    await PATCH(request, mockContext('instance-1'));

    expect(vi.mocked(encrypt)).not.toHaveBeenCalled();
  });

  it('updates apiUrl', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
    });
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://new-url.example.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ apiUrl: 'https://new-url.example.com' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.apiUrl).toBe('https://new-url.example.com');
  });
});

describe('DELETE /api/paperless-instances/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('successfully deletes instance', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
    });
    mockedPrisma.paperlessInstance.delete.mockResolvedValueOnce({} as any);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('instance-1'));

    expect(response.status).toBe(204);
    expect(mockedPrisma.paperlessInstance.delete).toHaveBeenCalledWith({
      where: { id: 'instance-1' },
    });
  });
});
