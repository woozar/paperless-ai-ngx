import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/utilities/password', () => ({
  verifyPassword: vi.fn(),
}));

vi.mock('@/lib/bootstrap', () => ({
  getSalt: vi.fn(),
}));

vi.mock('@/lib/auth/jwt', () => ({
  generateToken: vi.fn(),
}));

import { prisma } from '@repo/database';
import { verifyPassword } from '@/lib/utilities/password';
import { getSalt } from '@/lib/bootstrap';
import { generateToken } from '@/lib/auth/jwt';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  user: {
    findUnique: typeof prisma.user.findUnique;
  };
}>(prisma);

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 400 for invalid request body', async () => {
    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: '', password: '' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 401 when user is not found', async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'unknown', password: 'password123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.message).toBe('error.invalidCredentials');
  });

  it('returns 401 when user account is suspended', async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      passwordHash: 'hash',
      role: 'DEFAULT',
      mustChangePassword: false,
      isActive: false,
    });

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'password123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.message).toBe('error.accountSuspended');
  });

  it('returns 500 when salt is not configured', async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      passwordHash: 'hash',
      role: 'DEFAULT',
      mustChangePassword: false,
      isActive: true,
    });
    vi.mocked(getSalt).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'password123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.applicationNotConfigured');
  });

  it('returns 401 when password is incorrect', async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      passwordHash: 'hash',
      role: 'DEFAULT',
      mustChangePassword: false,
      isActive: true,
    });
    vi.mocked(getSalt).mockResolvedValueOnce('test-salt');
    vi.mocked(verifyPassword).mockReturnValueOnce(false);

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'wrongpassword' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.message).toBe('error.invalidCredentials');
  });

  it('returns token and user on successful login', async () => {
    const mockUser = {
      id: 'user-1',
      username: 'testuser',
      passwordHash: 'hash',
      role: 'DEFAULT',
      mustChangePassword: false,
      isActive: true,
    };
    mockedPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
    vi.mocked(getSalt).mockResolvedValueOnce('test-salt');
    vi.mocked(verifyPassword).mockReturnValueOnce(true);
    vi.mocked(generateToken).mockResolvedValueOnce('mock-jwt-token');

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'correctpassword' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.token).toBe('mock-jwt-token');
    expect(data.user).toEqual({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
      mustChangePassword: false,
    });
    expect(generateToken).toHaveBeenCalledWith({
      userId: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
    });
  });

  it('returns mustChangePassword true when user needs to change password', async () => {
    const mockUser = {
      id: 'user-1',
      username: 'newuser',
      passwordHash: 'hash',
      role: 'DEFAULT',
      mustChangePassword: true,
      isActive: true,
    };
    mockedPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
    vi.mocked(getSalt).mockResolvedValueOnce('test-salt');
    vi.mocked(verifyPassword).mockReturnValueOnce(true);
    vi.mocked(generateToken).mockResolvedValueOnce('mock-jwt-token');

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'newuser', password: 'password123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user.mustChangePassword).toBe(true);
  });

  it('returns 500 on unexpected error', async () => {
    mockedPrisma.user.findUnique.mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'password123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});
