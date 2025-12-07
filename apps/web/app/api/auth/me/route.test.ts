import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
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
  user: {
    findUnique: typeof prisma.user.findUnique;
  };
}>(prisma);

function mockUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('GET /api/auth/me', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when user not found', async () => {
    mockUser();
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/me');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('userNotFound');
  });

  it('returns user data on success', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockUser();
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
      mustChangePassword: false,
      createdAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/auth/me');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
      mustChangePassword: false,
      createdAt: '2024-01-15T10:00:00.000Z',
    });
  });
});
