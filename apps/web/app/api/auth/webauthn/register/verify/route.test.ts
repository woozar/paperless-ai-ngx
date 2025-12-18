import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    webAuthnChallenge: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    webAuthnCredential: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@simplewebauthn/server', () => ({
  verifyRegistrationResponse: vi.fn(),
}));

vi.mock('@/lib/auth/webauthn', () => ({
  rpID: 'localhost',
  origin: 'http://localhost:3000',
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

import { prisma } from '@repo/database';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { getAuthUser } from '@/lib/auth/jwt';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  webAuthnChallenge: {
    findUnique: typeof prisma.webAuthnChallenge.findUnique;
    delete: typeof prisma.webAuthnChallenge.delete;
  };
  webAuthnCredential: {
    create: typeof prisma.webAuthnCredential.create;
  };
}>(prisma);

function mockUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

const mockRegistrationResponse = {
  id: Buffer.from('credential-id').toString('base64url'),
  rawId: 'raw-id',
  response: {
    clientDataJSON: 'client-data',
    attestationObject: 'attestation',
  },
  type: 'public-key',
  clientExtensionResults: {},
  authenticatorAttachment: 'platform',
};

describe('POST /api/auth/webauthn/register/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when challenge is not found', async () => {
    mockUser();
    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'nonexistent',
        response: mockRegistrationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnChallengeNotFound');
  });

  it('returns 400 when challenge is expired', async () => {
    mockUser();

    const expiredChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'user-1',
      expiresAt: new Date(Date.now() - 1000), // Expired
      createdAt: new Date(),
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(expiredChallenge);
    mockedPrisma.webAuthnChallenge.delete.mockResolvedValueOnce(expiredChallenge);

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockRegistrationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnChallengeExpired');
    expect(mockedPrisma.webAuthnChallenge.delete).toHaveBeenCalled();
  });

  it('returns 400 when challenge type is not registration', async () => {
    mockUser();

    const wrongTypeChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'authentication',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(wrongTypeChallenge);

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockRegistrationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnChallengeNotFound');
  });

  it('returns 400 when challenge belongs to different user', async () => {
    mockUser();

    const differentUserChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'other-user',
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(differentUserChallenge);

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockRegistrationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnChallengeNotFound');
  });

  it('returns 400 when verification fails', async () => {
    mockUser();

    const validChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(validChallenge);
    vi.mocked(verifyRegistrationResponse).mockRejectedValueOnce(new Error('Verification failed'));

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockRegistrationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnVerificationFailed');
  });

  it('returns 400 when verification is not verified', async () => {
    mockUser();

    const validChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(validChallenge);
    vi.mocked(verifyRegistrationResponse).mockResolvedValueOnce({
      verified: false,
    } as Awaited<ReturnType<typeof verifyRegistrationResponse>>);

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockRegistrationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnVerificationFailed');
  });

  it('returns 400 when registrationInfo is missing', async () => {
    mockUser();

    const validChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(validChallenge);
    vi.mocked(verifyRegistrationResponse).mockResolvedValueOnce({
      verified: true,
    } as Awaited<ReturnType<typeof verifyRegistrationResponse>>);

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockRegistrationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnVerificationFailed');
  });

  it('returns credential on successful registration', async () => {
    mockUser();
    const mockDate = new Date('2024-01-15T10:00:00Z');

    const validChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(validChallenge);
    vi.mocked(verifyRegistrationResponse).mockResolvedValueOnce({
      verified: true,
      registrationInfo: {
        credential: {
          id: Buffer.from('credential-id').toString('base64url'),
          publicKey: new Uint8Array([1, 2, 3, 4]),
          counter: 0,
          transports: ['internal'],
        },
        credentialDeviceType: 'multiDevice',
        credentialBackedUp: true,
      },
    } as Awaited<ReturnType<typeof verifyRegistrationResponse>>);

    mockedPrisma.webAuthnCredential.create.mockResolvedValueOnce({
      id: 'cred-db-id',
      credentialId: Buffer.from('credential-id'),
      publicKey: Buffer.from([1, 2, 3, 4]),
      counter: BigInt(0),
      deviceType: 'multiDevice',
      backedUp: true,
      transports: ['internal'],
      name: null,
      createdAt: mockDate,
      lastUsedAt: null,
      userId: 'user-1',
    });

    mockedPrisma.webAuthnChallenge.delete.mockResolvedValueOnce(validChallenge);

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockRegistrationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.credential).toEqual({
      id: 'cred-db-id',
      name: null,
      deviceType: 'multiDevice',
      backedUp: true,
      createdAt: mockDate.toISOString(),
      lastUsedAt: null,
    });
    expect(mockedPrisma.webAuthnChallenge.delete).toHaveBeenCalled();
  });

  it('stores custom name with credential', async () => {
    mockUser();
    const mockDate = new Date('2024-01-15T10:00:00Z');

    const validChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(validChallenge);
    vi.mocked(verifyRegistrationResponse).mockResolvedValueOnce({
      verified: true,
      registrationInfo: {
        credential: {
          id: Buffer.from('credential-id').toString('base64url'),
          publicKey: new Uint8Array([1, 2, 3, 4]),
          counter: 0,
          transports: ['usb'],
        },
        credentialDeviceType: 'singleDevice',
        credentialBackedUp: false,
      },
    } as Awaited<ReturnType<typeof verifyRegistrationResponse>>);

    mockedPrisma.webAuthnCredential.create.mockResolvedValueOnce({
      id: 'cred-db-id',
      credentialId: Buffer.from('credential-id'),
      publicKey: Buffer.from([1, 2, 3, 4]),
      counter: BigInt(0),
      deviceType: 'singleDevice',
      backedUp: false,
      transports: ['usb'],
      name: 'My Security Key',
      createdAt: mockDate,
      lastUsedAt: null,
      userId: 'user-1',
    });

    mockedPrisma.webAuthnChallenge.delete.mockResolvedValueOnce(validChallenge);

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockRegistrationResponse,
        name: 'My Security Key',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.credential.name).toBe('My Security Key');
    expect(mockedPrisma.webAuthnCredential.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'My Security Key',
        }),
      })
    );
  });

  it('returns 401 when user is not authenticated', async () => {
    vi.mocked(getAuthUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/webauthn/register/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockRegistrationResponse,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });
});
