import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    webAuthnCredential: {
      findMany: vi.fn(),
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
    findMany: typeof prisma.webAuthnCredential.findMany;
  };
}>(prisma);

function mockUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('GET /api/auth/webauthn/credentials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty list when user has no credentials', async () => {
    mockUser();
    mockedPrisma.webAuthnCredential.findMany.mockResolvedValueOnce([]);

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.credentials).toEqual([]);
  });

  it('returns list of credentials for authenticated user', async () => {
    mockUser();
    const mockDate1 = new Date('2024-01-15T10:00:00Z');
    const mockDate2 = new Date('2024-01-20T15:30:00Z');
    const lastUsedDate = new Date('2024-01-22T08:00:00Z');

    mockedPrisma.webAuthnCredential.findMany.mockResolvedValueOnce([
      {
        id: 'cred-1',
        name: 'MacBook Touch ID',
        deviceType: 'multiDevice',
        backedUp: true,
        createdAt: mockDate2,
        lastUsedAt: lastUsedDate,
      },
      {
        id: 'cred-2',
        name: 'YubiKey',
        deviceType: 'singleDevice',
        backedUp: false,
        createdAt: mockDate1,
        lastUsedAt: null,
      },
    ]);

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.credentials).toHaveLength(2);
    expect(data.credentials[0]).toEqual({
      id: 'cred-1',
      name: 'MacBook Touch ID',
      deviceType: 'multiDevice',
      backedUp: true,
      createdAt: mockDate2.toISOString(),
      lastUsedAt: lastUsedDate.toISOString(),
    });
    expect(data.credentials[1]).toEqual({
      id: 'cred-2',
      name: 'YubiKey',
      deviceType: 'singleDevice',
      backedUp: false,
      createdAt: mockDate1.toISOString(),
      lastUsedAt: null,
    });
  });

  it('returns credentials ordered by createdAt desc', async () => {
    mockUser();

    mockedPrisma.webAuthnCredential.findMany.mockResolvedValueOnce([]);

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials');

    await GET(request);

    expect(mockedPrisma.webAuthnCredential.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      select: {
        id: true,
        name: true,
        deviceType: true,
        backedUp: true,
        createdAt: true,
        lastUsedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('returns 401 when user is not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials');

    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('handles credentials with null names', async () => {
    mockUser();
    const mockDate = new Date('2024-01-15T10:00:00Z');

    mockedPrisma.webAuthnCredential.findMany.mockResolvedValueOnce([
      {
        id: 'cred-1',
        name: null,
        deviceType: 'multiDevice',
        backedUp: true,
        createdAt: mockDate,
        lastUsedAt: null,
      },
    ]);

    const request = new NextRequest('http://localhost/api/auth/webauthn/credentials');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.credentials[0].name).toBeNull();
  });
});
