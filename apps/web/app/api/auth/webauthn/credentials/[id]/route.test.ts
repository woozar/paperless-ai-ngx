import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { DELETE, PATCH } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    webAuthnCredential: {
      findUnique: vi.fn(),
      delete: vi.fn(),
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
  webAuthnCredential: {
    findUnique: typeof prisma.webAuthnCredential.findUnique;
    delete: typeof prisma.webAuthnCredential.delete;
    update: typeof prisma.webAuthnCredential.update;
  };
}>(prisma);

function mockUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

const mockParams = { id: 'cred-1' };

describe('DELETE /api/auth/webauthn/credentials/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when credential is not found', async () => {
    mockUser();
    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials/nonexistent', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'nonexistent' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('webauthnCredentialNotFound');
  });

  it('returns 404 when credential belongs to different user', async () => {
    mockUser();
    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce({
      id: 'cred-1',
      userId: 'other-user',
      credentialId: Buffer.from('cred-id'),
      publicKey: Buffer.from('public-key'),
      counter: BigInt(0),
      deviceType: 'multiDevice',
      backedUp: true,
      transports: ['internal'],
      name: 'Other User Passkey',
      createdAt: new Date(),
      lastUsedAt: null,
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials/cred-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve(mockParams) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('webauthnCredentialNotFound');
  });

  it('deletes credential and returns success', async () => {
    mockUser();

    const credential = {
      id: 'cred-1',
      userId: 'user-1',
      credentialId: Buffer.from('cred-id'),
      publicKey: Buffer.from('public-key'),
      counter: BigInt(0),
      deviceType: 'multiDevice',
      backedUp: true,
      transports: ['internal'],
      name: 'My Passkey',
      createdAt: new Date(),
      lastUsedAt: null,
    };

    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce(credential);
    mockedPrisma.webAuthnCredential.delete.mockResolvedValueOnce(credential);

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials/cred-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve(mockParams) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockedPrisma.webAuthnCredential.delete).toHaveBeenCalledWith({
      where: { id: 'cred-1' },
    });
  });

  it('returns 401 when user is not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials/cred-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve(mockParams) });

    expect(response.status).toBe(401);
  });
});

describe('PATCH /api/auth/webauthn/credentials/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when credential is not found', async () => {
    mockUser();
    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials/nonexistent', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'nonexistent' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('webauthnCredentialNotFound');
  });

  it('returns 404 when credential belongs to different user', async () => {
    mockUser();
    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce({
      id: 'cred-1',
      userId: 'other-user',
      credentialId: Buffer.from('cred-id'),
      publicKey: Buffer.from('public-key'),
      counter: BigInt(0),
      deviceType: 'multiDevice',
      backedUp: true,
      transports: ['internal'],
      name: 'Other User Passkey',
      createdAt: new Date(),
      lastUsedAt: null,
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials/cred-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });

    const response = await PATCH(request, { params: Promise.resolve(mockParams) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('webauthnCredentialNotFound');
  });

  it('returns 400 for invalid request body - empty name', async () => {
    mockUser();

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials/cred-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: '' }),
    });

    const response = await PATCH(request, { params: Promise.resolve(mockParams) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 400 for invalid request body - name too long', async () => {
    mockUser();

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials/cred-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'a'.repeat(101) }),
    });

    const response = await PATCH(request, { params: Promise.resolve(mockParams) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('renames credential and returns updated data', async () => {
    mockUser();
    const mockDate = new Date('2024-01-15T10:00:00Z');
    const lastUsedDate = new Date('2024-01-20T08:00:00Z');

    const credential = {
      id: 'cred-1',
      userId: 'user-1',
      credentialId: Buffer.from('cred-id'),
      publicKey: Buffer.from('public-key'),
      counter: BigInt(0),
      deviceType: 'multiDevice',
      backedUp: true,
      transports: ['internal'],
      name: 'Old Name',
      createdAt: mockDate,
      lastUsedAt: lastUsedDate,
    };

    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce(credential);
    mockedPrisma.webAuthnCredential.update.mockResolvedValueOnce({
      id: 'cred-1',
      name: 'New Passkey Name',
      deviceType: 'multiDevice',
      backedUp: true,
      createdAt: mockDate,
      lastUsedAt: lastUsedDate,
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials/cred-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Passkey Name' }),
    });

    const response = await PATCH(request, { params: Promise.resolve(mockParams) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      id: 'cred-1',
      name: 'New Passkey Name',
      deviceType: 'multiDevice',
      backedUp: true,
      createdAt: mockDate.toISOString(),
      lastUsedAt: lastUsedDate.toISOString(),
    });
    expect(mockedPrisma.webAuthnCredential.update).toHaveBeenCalledWith({
      where: { id: 'cred-1' },
      data: { name: 'New Passkey Name' },
      select: {
        id: true,
        name: true,
        deviceType: true,
        backedUp: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });
  });

  it('returns null for lastUsedAt when not set', async () => {
    mockUser();
    const mockDate = new Date('2024-01-15T10:00:00Z');

    const credential = {
      id: 'cred-1',
      userId: 'user-1',
      credentialId: Buffer.from('cred-id'),
      publicKey: Buffer.from('public-key'),
      counter: BigInt(0),
      deviceType: 'singleDevice',
      backedUp: false,
      transports: ['usb'],
      name: 'YubiKey',
      createdAt: mockDate,
      lastUsedAt: null,
    };

    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce(credential);
    mockedPrisma.webAuthnCredential.update.mockResolvedValueOnce({
      id: 'cred-1',
      name: 'My YubiKey',
      deviceType: 'singleDevice',
      backedUp: false,
      createdAt: mockDate,
      lastUsedAt: null,
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials/cred-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'My YubiKey' }),
    });

    const response = await PATCH(request, { params: Promise.resolve(mockParams) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.lastUsedAt).toBeNull();
  });

  it('returns 401 when user is not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials/cred-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });

    const response = await PATCH(request, { params: Promise.resolve(mockParams) });

    expect(response.status).toBe(401);
  });
});
