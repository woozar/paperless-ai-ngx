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

vi.mock('@/lib/utilities/password', () => ({
  verifyPassword: vi.fn(),
  hashPassword: vi.fn(),
}));

vi.mock('@/lib/bootstrap', () => ({
  getSalt: vi.fn(),
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

import { prisma } from '@repo/database';
import { verifyPassword, hashPassword } from '@/lib/utilities/password';
import { getSalt } from '@/lib/bootstrap';
import { getAuthUser } from '@/lib/auth/jwt';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  user: {
    findUnique: typeof prisma.user.findUnique;
    update: typeof prisma.user.update;
  };
}>(prisma);

function mockUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('POST /api/auth/change-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockUser();

    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: '', newPassword: 'short' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('invalidPasswordFormat');
  });

  it('returns 500 when salt is not configured', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockUser();
    vi.mocked(getSalt).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: 'oldpassword', newPassword: 'newpassword123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('applicationNotConfigured');
  });

  it('returns 404 when user not found', async () => {
    mockUser();
    vi.mocked(getSalt).mockResolvedValueOnce('test-salt');
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: 'oldpassword', newPassword: 'newpassword123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('userNotFound');
  });

  it('returns 400 when current password is incorrect', async () => {
    mockUser();
    vi.mocked(getSalt).mockResolvedValueOnce('test-salt');
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      passwordHash: 'oldhash',
    });
    vi.mocked(verifyPassword).mockReturnValueOnce(false);

    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: 'wrongpassword', newPassword: 'newpassword123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('currentPasswordIncorrect');
  });

  it('successfully changes password', async () => {
    mockUser();
    vi.mocked(getSalt).mockResolvedValueOnce('test-salt');
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      passwordHash: 'oldhash',
    });
    vi.mocked(verifyPassword).mockReturnValueOnce(true);
    vi.mocked(hashPassword).mockReturnValueOnce('newhash');
    mockedPrisma.user.update.mockResolvedValueOnce({});

    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: 'oldpassword', newPassword: 'newpassword123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        passwordHash: 'newhash',
        mustChangePassword: false,
      },
    });
  });
});
