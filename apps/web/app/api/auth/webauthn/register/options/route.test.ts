import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    webAuthnCredential: {
      findMany: vi.fn(),
    },
    webAuthnChallenge: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@simplewebauthn/server', () => ({
  generateRegistrationOptions: vi.fn(),
}));

vi.mock('@/lib/auth/webauthn', () => ({
  rpName: 'Paperless AI NGX',
  rpID: 'localhost',
  CHALLENGE_TTL_MS: 300000,
  parseTransports: vi.fn((transports: string[]) => transports),
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

import { prisma } from '@repo/database';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { getAuthUser } from '@/lib/auth/jwt';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  webAuthnCredential: {
    findMany: typeof prisma.webAuthnCredential.findMany;
  };
  webAuthnChallenge: {
    create: typeof prisma.webAuthnChallenge.create;
  };
}>(prisma);

function mockUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('POST /api/auth/webauthn/register/options', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns registration options for authenticated user', async () => {
    mockUser();

    mockedPrisma.webAuthnCredential.findMany.mockResolvedValueOnce([]);

    const mockOptions = {
      challenge: 'test-challenge',
      rp: { name: 'Paperless AI NGX', id: 'localhost' },
      user: { id: 'user-1', name: 'testuser', displayName: 'testuser' },
      pubKeyCredParams: [{ type: 'public-key' as const, alg: -7 }],
    };

    vi.mocked(generateRegistrationOptions).mockResolvedValueOnce(mockOptions);
    mockedPrisma.webAuthnChallenge.create.mockResolvedValueOnce({
      id: 'challenge-id-123',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'user-1',
      expiresAt: new Date(),
      createdAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/options', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.options).toEqual(mockOptions);
    expect(data.challengeId).toBe('challenge-id-123');
  });

  it('excludes existing credentials from registration options', async () => {
    mockUser();

    mockedPrisma.webAuthnCredential.findMany.mockResolvedValueOnce([
      {
        credentialId: Buffer.from('existing-cred-1'),
        transports: ['internal'],
      },
      {
        credentialId: Buffer.from('existing-cred-2'),
        transports: ['usb', 'nfc'],
      },
    ]);

    const mockOptions = {
      challenge: 'test-challenge',
      rp: { name: 'Paperless AI NGX', id: 'localhost' },
      user: { id: 'user-1', name: 'testuser', displayName: 'testuser' },
      excludeCredentials: [],
      pubKeyCredParams: [{ type: 'public-key' as const, alg: -7 }],
    };

    vi.mocked(generateRegistrationOptions).mockResolvedValueOnce(mockOptions);
    mockedPrisma.webAuthnChallenge.create.mockResolvedValueOnce({
      id: 'challenge-id-456',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'user-1',
      expiresAt: new Date(),
      createdAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/options', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.options).toEqual(mockOptions);
    expect(generateRegistrationOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        excludeCredentials: [
          {
            id: Buffer.from('existing-cred-1').toString('base64url'),
            transports: ['internal'],
          },
          {
            id: Buffer.from('existing-cred-2').toString('base64url'),
            transports: ['usb', 'nfc'],
          },
        ],
      })
    );
  });

  it('passes platform authenticatorType when specified', async () => {
    mockUser();
    mockedPrisma.webAuthnCredential.findMany.mockResolvedValueOnce([]);

    const mockOptions = {
      challenge: 'test-challenge',
      rp: { name: 'Paperless AI NGX', id: 'localhost' },
      user: { id: 'user-1', name: 'testuser', displayName: 'testuser' },
      pubKeyCredParams: [{ type: 'public-key' as const, alg: -7 }],
    };

    vi.mocked(generateRegistrationOptions).mockResolvedValueOnce(mockOptions);
    mockedPrisma.webAuthnChallenge.create.mockResolvedValueOnce({
      id: 'challenge-id-789',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'user-1',
      expiresAt: new Date(),
      createdAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/options', {
      method: 'POST',
      body: JSON.stringify({ authenticatorType: 'platform' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(generateRegistrationOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        authenticatorSelection: expect.objectContaining({
          authenticatorAttachment: 'platform',
        }),
      })
    );
  });

  it('passes cross-platform authenticatorType when specified', async () => {
    mockUser();
    mockedPrisma.webAuthnCredential.findMany.mockResolvedValueOnce([]);

    const mockOptions = {
      challenge: 'test-challenge',
      rp: { name: 'Paperless AI NGX', id: 'localhost' },
      user: { id: 'user-1', name: 'testuser', displayName: 'testuser' },
      pubKeyCredParams: [{ type: 'public-key' as const, alg: -7 }],
    };

    vi.mocked(generateRegistrationOptions).mockResolvedValueOnce(mockOptions);
    mockedPrisma.webAuthnChallenge.create.mockResolvedValueOnce({
      id: 'challenge-id-000',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'user-1',
      expiresAt: new Date(),
      createdAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/options', {
      method: 'POST',
      body: JSON.stringify({ authenticatorType: 'cross-platform' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(generateRegistrationOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        authenticatorSelection: expect.objectContaining({
          authenticatorAttachment: 'cross-platform',
        }),
      })
    );
  });

  it('returns 401 when user is not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/options', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });
});
