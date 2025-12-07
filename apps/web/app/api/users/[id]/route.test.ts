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

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('GET /api/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when user not found', async () => {
    mockAdmin();
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/users/nonexistent');
    const response = await GET(request, createContext('nonexistent'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('error.userNotFound');
  });

  it('returns user data on success', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
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
});

describe('PATCH /api/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockAdmin();

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ username: 'a' }),
    });

    const response = await PATCH(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 404 when user not found', async () => {
    mockAdmin();
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
    mockAdmin();
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
    mockAdmin();
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
    mockedPrisma.user.count.mockResolvedValueOnce(2);
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
        data: expect.objectContaining({ role: 'DEFAULT' }),
      })
    );
  });

  it('returns 409 when username already exists', async () => {
    mockAdmin();
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
    mockAdmin();
    mockedPrisma.user.findUnique
      .mockResolvedValueOnce({
        id: 'user-1',
        username: 'testuser',
        role: 'DEFAULT',
      })
      .mockResolvedValueOnce(null);
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
    mockAdmin();
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
    mockAdmin();
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

  it('updates only role when only role is provided', async () => {
    mockAdmin();
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
    mockAdmin();
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
    mockAdmin();
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'admin-2',
      username: 'admin2',
      role: 'ADMIN',
      isActive: true,
    });
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

describe('DELETE /api/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when user not found', async () => {
    mockAdmin();
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
    mockAdmin();
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
    mockAdmin();
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

  it('allows soft-deleting admin when multiple admins exist', async () => {
    mockAdmin();
    const createdAt = new Date('2024-01-01T00:00:00Z');
    const updatedAt = new Date('2024-01-02T00:00:00Z');
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'admin-2',
      username: 'admin2',
      role: 'ADMIN',
      isActive: true,
    });
    mockedPrisma.user.count.mockResolvedValueOnce(2);
    mockedPrisma.user.update.mockResolvedValueOnce({
      id: 'admin-2',
      username: 'admin2',
      role: 'ADMIN',
      isActive: false,
      createdAt,
      updatedAt,
      mustChangePassword: false,
    });

    const request = new NextRequest('http://localhost/api/users/admin-2', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createContext('admin-2'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('admin-2');
    expect(data.isActive).toBe(false);
    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'admin-2' },
      data: { isActive: false },
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

  it('successfully soft-deletes user', async () => {
    mockAdmin();
    const createdAt = new Date('2024-01-01T00:00:00Z');
    const updatedAt = new Date('2024-01-02T00:00:00Z');
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
    });
    mockedPrisma.user.update.mockResolvedValueOnce({
      id: 'user-1',
      username: 'testuser',
      role: 'DEFAULT',
      isActive: false,
      createdAt,
      updatedAt,
      mustChangePassword: false,
    });

    const request = new NextRequest('http://localhost/api/users/user-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createContext('user-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('user-1');
    expect(data.isActive).toBe(false);
    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { isActive: false },
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
});
