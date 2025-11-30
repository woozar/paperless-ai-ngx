import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH, DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
    findUnique: typeof prisma.user.findUnique;
    update: typeof prisma.user.update;
    delete: typeof prisma.user.delete;
    count: typeof prisma.user.count;
  };
}>(prisma);

const createContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe('GET /api/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users/user-1');

    const response = await GET(request, createContext('user-1'));
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

    const request = new NextRequest('http://localhost/api/users/user-1');

    const response = await GET(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.message).toBe('error.forbidden');
  });

  it('returns 404 when user not found', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users/nonexistent');

    const response = await GET(request, createContext('nonexistent'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('error.userNotFound');
  });

  it('returns user data on success', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
      isActive: true,
      mustChangePassword: false,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/users/user-1');

    const response = await GET(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.username).toBe('testuser');
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/users/user-1');

    const response = await GET(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});

describe('PATCH /api/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ username: 'newname' }),
    });

    const response = await PATCH(request, createContext('user-1'));
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

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ username: 'newname' }),
    });

    const response = await PATCH(request, createContext('user-1'));
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

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ username: 'a' }), // Too short
    });

    const response = await PATCH(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 404 when user not found', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users/nonexistent', {
      method: 'PATCH',
      body: JSON.stringify({ username: 'newname' }),
    });

    const response = await PATCH(request, createContext('nonexistent'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('error.userNotFound');
  });

  it('returns 400 when demoting last admin', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'admin-2',
      username: 'admin2',
      role: 'ADMIN',
      isActive: true,
    });
    mockedPrisma.user.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/users/admin-2', {
      method: 'PATCH',
      body: JSON.stringify({ role: 'DEFAULT' }),
    });

    const response = await PATCH(request, createContext('admin-2'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('error.lastAdmin');
  });

  it('allows demoting admin when multiple admins exist', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'admin-2',
      username: 'admin2',
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      salt: 'salt',
      passwordHash: 'hash',
      mustChangePassword: false,
    });
    mockedPrisma.user.count.mockResolvedValueOnce(2); // Multiple admins
    mockedPrisma.user.update.mockResolvedValueOnce({
      id: 'admin-2',
      username: 'admin2',
      role: 'DEFAULT',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      salt: 'salt',
      passwordHash: 'hash',
      mustChangePassword: false,
    });

    const request = new NextRequest('http://localhost/api/users/admin-2', {
      method: 'PATCH',
      body: JSON.stringify({ role: 'DEFAULT' }),
    });

    const response = await PATCH(request, createContext('admin-2'));

    expect(response.status).toBe(200);
    expect(mockedPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'admin-2' },
        data: expect.objectContaining({
          role: 'DEFAULT',
        }),
      })
    );
  });

  it('returns 409 when username already exists', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique
      .mockResolvedValueOnce({
        id: 'user-1',
        username: 'testuser',
        role: 'DEFAULT',
      })
      .mockResolvedValueOnce({
        id: 'user-2',
        username: 'existinguser',
      });

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ username: 'existinguser' }),
    });

    const response = await PATCH(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('error.usernameExists');
  });

  it('successfully updates user', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique
      .mockResolvedValueOnce({
        id: 'user-1',
        username: 'testuser',
        role: 'DEFAULT',
      })
      .mockResolvedValueOnce(null); // No user with new username
    mockedPrisma.user.update.mockResolvedValueOnce({
      id: 'user-1',
      username: 'newname',
      role: 'DEFAULT',
      isActive: true,
      mustChangePassword: false,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ username: 'newname' }),
    });

    const response = await PATCH(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.username).toBe('newname');
  });

  it('resets password when resetPassword is provided', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
    });
    vi.mocked(getSalt).mockResolvedValueOnce('test-salt');
    vi.mocked(hashPassword).mockReturnValueOnce('newhash');
    mockedPrisma.user.update.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
      isActive: true,
      mustChangePassword: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ resetPassword: 'newpassword123' }),
    });

    const response = await PATCH(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.mustChangePassword).toBe(true);
    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: expect.objectContaining({
        passwordHash: 'newhash',
        mustChangePassword: true,
      }),
      select: expect.any(Object),
    });
  });

  it('returns 500 when salt is not configured for password reset', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
    });
    vi.mocked(getSalt).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ resetPassword: 'newpassword123' }),
    });

    const response = await PATCH(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.applicationNotConfigured');
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ username: 'newname' }),
    });

    const response = await PATCH(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});

describe('DELETE /api/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createContext('user-1'));
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

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.message).toBe('error.forbidden');
  });

  it('returns 404 when user not found', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users/nonexistent', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createContext('nonexistent'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('error.userNotFound');
  });

  it('returns 400 when trying to delete yourself', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });

    const request = new NextRequest('http://localhost/api/users/admin-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createContext('admin-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('error.cannotDeleteSelf');
  });

  it('returns 400 when deleting last admin', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'admin-2',
      username: 'admin2',
      role: 'ADMIN',
    });
    mockedPrisma.user.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/users/admin-2', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createContext('admin-2'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('error.lastAdmin');
  });

  it('allows deleting admin when multiple admins exist', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'admin-2',
      username: 'admin2',
      role: 'ADMIN',
      isActive: true,
    });
    mockedPrisma.user.count.mockResolvedValueOnce(2); // Multiple admins
    mockedPrisma.user.delete.mockResolvedValueOnce({
      id: 'admin-2',
      username: 'admin2',
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      salt: 'salt',
      passwordHash: 'hash',
      mustChangePassword: false,
    });

    const request = new NextRequest('http://localhost/api/users/admin-2', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createContext('admin-2'));

    expect(response.status).toBe(204);
    expect(mockedPrisma.user.delete).toHaveBeenCalledWith({
      where: { id: 'admin-2' },
    });
  });

  it('successfully deletes user', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
    });
    mockedPrisma.user.delete.mockResolvedValueOnce({});

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createContext('user-1'));

    expect(response.status).toBe(204);
    expect(mockedPrisma.user.delete).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
  });

  it('returns 500 on unexpected error', async () => {
    vi.mocked(getAuthUser).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});

describe('PATCH /api/users/[id] - Additional Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates only role when only role is provided', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });

    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-2',
      username: 'testuser',
      role: 'DEFAULT',
      isActive: true,
    });

    mockedPrisma.user.update.mockResolvedValueOnce({
      id: 'user-2',
      username: 'testuser',
      role: 'ADMIN',
      isActive: true,
      mustChangePassword: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/users/user-2', {
      method: 'PATCH',
      body: JSON.stringify({ role: 'ADMIN' }),
    });

    const response = await PATCH(request, createContext('user-2'));

    expect(response.status).toBe(200);
    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-2' },
      data: { role: 'ADMIN' },
      select: expect.any(Object),
    });
  });

  it('updates only isActive when only isActive is provided', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });

    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-2',
      username: 'testuser',
      role: 'DEFAULT',
      isActive: true,
    });

    mockedPrisma.user.update.mockResolvedValueOnce({
      id: 'user-2',
      username: 'testuser',
      role: 'DEFAULT',
      isActive: false,
      mustChangePassword: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/users/user-2', {
      method: 'PATCH',
      body: JSON.stringify({ isActive: false }),
    });

    const response = await PATCH(request, createContext('user-2'));

    expect(response.status).toBe(200);
    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-2' },
      data: { isActive: false },
      select: expect.any(Object),
    });
  });

  it('returns 400 when deactivating last admin', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce({
      userId: 'admin-1',
      username: 'admin',
      role: 'ADMIN',
    });

    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'admin-2',
      username: 'admin2',
      role: 'ADMIN',
      isActive: true,
    });

    // Only 1 active admin exists
    mockedPrisma.user.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/users/admin-2', {
      method: 'PATCH',
      body: JSON.stringify({ isActive: false }),
    });

    const response = await PATCH(request, createContext('admin-2'));

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe('error.lastAdmin');
    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
  });
});
