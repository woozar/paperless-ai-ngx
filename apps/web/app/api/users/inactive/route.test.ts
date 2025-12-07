import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
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
    findMany: typeof prisma.user.findMany;
    count: typeof prisma.user.count;
  };
}>(prisma);

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('GET /api/users/inactive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty list when no inactive users exist', async () => {
    mockAdmin();
    mockedPrisma.user.findMany.mockResolvedValueOnce([]);
    mockedPrisma.user.count.mockResolvedValueOnce(0);

    const request = new NextRequest('http://localhost/api/users/inactive');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toEqual([]);
    expect(data.total).toBe(0);
  });

  it('returns list of inactive users', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.user.findMany.mockResolvedValueOnce([
      {
        id: 'user-1',
        username: 'deleteduser1',
        role: 'DEFAULT',
        isActive: false,
        mustChangePassword: false,
        createdAt: mockDate,
        updatedAt: mockDate,
      },
      {
        id: 'user-2',
        username: 'deleteduser2',
        role: 'ADMIN',
        isActive: false,
        mustChangePassword: false,
        createdAt: mockDate,
        updatedAt: mockDate,
      },
    ]);
    mockedPrisma.user.count.mockResolvedValueOnce(2);

    const request = new NextRequest('http://localhost/api/users/inactive');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(2);
    expect(data.items[0].username).toBe('deleteduser1');
    expect(data.items[1].username).toBe('deleteduser2');
    expect(data.total).toBe(2);
  });

  it('filters by isActive: false', async () => {
    mockAdmin();
    mockedPrisma.user.findMany.mockResolvedValueOnce([]);
    mockedPrisma.user.count.mockResolvedValueOnce(0);

    const request = new NextRequest('http://localhost/api/users/inactive');
    await GET(request);

    expect(mockedPrisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isActive: false },
      })
    );
    expect(mockedPrisma.user.count).toHaveBeenCalledWith({
      where: { isActive: false },
    });
  });

  it('supports pagination', async () => {
    mockAdmin();
    mockedPrisma.user.findMany.mockResolvedValueOnce([]);
    mockedPrisma.user.count.mockResolvedValueOnce(25);

    const request = new NextRequest('http://localhost/api/users/inactive?page=2&limit=10');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.page).toBe(2);
    expect(data.limit).toBe(10);
    expect(data.totalPages).toBe(3);
    expect(mockedPrisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 10,
        take: 10,
      })
    );
  });

  it('returns 401 for non-authenticated users', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users/inactive');
    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('returns 403 for non-admin users', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'user-1',
      username: 'user',
      role: 'DEFAULT',
    });

    const request = new NextRequest('http://localhost/api/users/inactive');
    const response = await GET(request);

    expect(response.status).toBe(403);
  });
});
