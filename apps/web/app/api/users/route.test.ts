import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

vi.mock('@/lib/utilities/password', () => ({
  hashPassword: vi.fn(),
}));

vi.mock('@/lib/bootstrap', () => ({
  getSalt: vi.fn(),
}));

import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { hashPassword } from '@/lib/utilities/password';
import { getSalt } from '@/lib/bootstrap';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  user: {
    findMany: typeof prisma.user.findMany;
    findUnique: typeof prisma.user.findUnique;
    create: typeof prisma.user.create;
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

describe('GET /api/users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns list of users for admin', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.user.findMany.mockResolvedValueOnce([
      {
        id: 'user-1',
        username: 'testuser',
        role: 'DEFAULT',
        isActive: true,
        mustChangePassword: false,
        createdAt: mockDate,
        updatedAt: mockDate,
      },
    ]);
    mockedPrisma.user.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/users');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].username).toBe('testuser');
    expect(data.total).toBe(1);
  });
});

describe('POST /api/users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockAdmin();

    const request = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ username: 'ab', password: 'short' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 409 when username already exists', async () => {
    mockAdmin();
    mockedPrisma.user.findUnique.mockResolvedValueOnce({ id: 'existing-user' });

    const request = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ username: 'existinguser', password: 'password123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('usernameExists');
  });

  it('returns 500 when salt is not configured', async () => {
    mockAdmin();
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);
    vi.mocked(getSalt).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ username: 'newuser', password: 'password123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('applicationNotConfigured');
  });

  it('successfully creates user', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);
    vi.mocked(getSalt).mockResolvedValueOnce('test-salt');
    vi.mocked(hashPassword).mockReturnValueOnce('hashed-password');
    mockedPrisma.user.create.mockResolvedValueOnce({
      id: 'new-user-1',
      username: 'newuser',
      role: 'DEFAULT',
      isActive: true,
      mustChangePassword: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ username: 'newuser', password: 'password123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.username).toBe('newuser');
    expect(data.mustChangePassword).toBe(true);
  });

  it('creates user with specified role', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);
    vi.mocked(getSalt).mockResolvedValueOnce('test-salt');
    vi.mocked(hashPassword).mockReturnValueOnce('hashed-password');
    mockedPrisma.user.create.mockResolvedValueOnce({
      id: 'new-admin-1',
      username: 'newadmin',
      role: 'ADMIN',
      isActive: true,
      mustChangePassword: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ username: 'newadmin', password: 'password123', role: 'ADMIN' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.role).toBe('ADMIN');
  });
});
