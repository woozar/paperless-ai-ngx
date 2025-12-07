import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
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
  user: {
    findUnique: typeof prisma.user.findUnique;
    update: typeof prisma.user.update;
  };
}>(prisma);

const createContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('POST /api/users/[id]/restore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when user not found', async () => {
    mockAdmin();
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users/nonexistent/restore', {
      method: 'POST',
    });

    const response = await POST(request, createContext('nonexistent'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('error.userNotFound');
  });

  it('successfully restores a soft-deleted user', async () => {
    const createdAt = new Date('2024-01-01T00:00:00Z');
    const updatedAt = new Date('2024-01-02T00:00:00Z');
    mockAdmin();
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'deleteduser',
      role: 'DEFAULT',
      isActive: false,
    });
    mockedPrisma.user.update.mockResolvedValueOnce({
      id: 'user-1',
      username: 'deleteduser',
      role: 'DEFAULT',
      isActive: true,
      mustChangePassword: false,
      createdAt,
      updatedAt,
    });

    const request = new NextRequest('http://localhost/api/users/user-1/restore', {
      method: 'POST',
    });

    const response = await POST(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('user-1');
    expect(data.isActive).toBe(true);
    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { isActive: true },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('returns correct date format in response', async () => {
    const createdAt = new Date('2024-01-15T10:30:00Z');
    const updatedAt = new Date('2024-01-16T14:00:00Z');
    mockAdmin();
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
      isActive: false,
    });
    mockedPrisma.user.update.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
      isActive: true,
      mustChangePassword: false,
      createdAt,
      updatedAt,
    });

    const request = new NextRequest('http://localhost/api/users/user-1/restore', {
      method: 'POST',
    });

    const response = await POST(request, createContext('user-1'));
    const data = await response.json();

    expect(data.createdAt).toBe('2024-01-15T10:30:00.000Z');
    expect(data.updatedAt).toBe('2024-01-16T14:00:00.000Z');
  });

  it('returns 401 for non-authenticated users', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users/user-1/restore', {
      method: 'POST',
    });

    const response = await POST(request, createContext('user-1'));

    expect(response.status).toBe(401);
  });

  it('returns 403 for non-admin users', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'user-1',
      username: 'user',
      role: 'DEFAULT',
    });

    const request = new NextRequest('http://localhost/api/users/user-1/restore', {
      method: 'POST',
    });

    const response = await POST(request, createContext('user-1'));

    expect(response.status).toBe(403);
  });
});
