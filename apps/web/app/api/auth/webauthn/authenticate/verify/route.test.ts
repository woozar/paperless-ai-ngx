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
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@simplewebauthn/server', () => ({
  verifyAuthenticationResponse: vi.fn(),
}));

vi.mock('@/lib/auth/webauthn', () => ({
  rpID: 'localhost',
  origin: 'http://localhost:3000',
  parseTransports: vi.fn((transports: string[]) => transports),
}));

vi.mock('@/lib/auth/jwt', () => ({
  generateToken: vi.fn(),
}));

import { prisma } from '@repo/database';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { generateToken } from '@/lib/auth/jwt';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  webAuthnChallenge: {
    findUnique: typeof prisma.webAuthnChallenge.findUnique;
    delete: typeof prisma.webAuthnChallenge.delete;
  };
  webAuthnCredential: {
    findUnique: typeof prisma.webAuthnCredential.findUnique;
    update: typeof prisma.webAuthnCredential.update;
  };
}>(prisma);

const mockAuthenticationResponse = {
  id: Buffer.from('credential-id').toString('base64url'),
  rawId: 'raw-id',
  response: {
    clientDataJSON: 'client-data',
    authenticatorData: 'auth-data',
    signature: 'signature',
  },
  type: 'public-key',
  clientExtensionResults: {},
  authenticatorAttachment: 'platform',
};

describe('POST /api/auth/webauthn/authenticate/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when challenge is not found', async () => {
    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'nonexistent',
        response: mockAuthenticationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnChallengeNotFound');
  });

  it('returns 400 when challenge is expired', async () => {
    const expiredChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'authentication',
      userId: null,
      expiresAt: new Date(Date.now() - 1000), // Expired
      createdAt: new Date(),
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(expiredChallenge);
    mockedPrisma.webAuthnChallenge.delete.mockResolvedValueOnce(expiredChallenge);

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockAuthenticationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnChallengeExpired');
    expect(mockedPrisma.webAuthnChallenge.delete).toHaveBeenCalled();
  });

  it('returns 400 when challenge type is not authentication', async () => {
    const wrongTypeChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'registration',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(wrongTypeChallenge);

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockAuthenticationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnChallengeNotFound');
  });

  it('returns 404 when credential is not found', async () => {
    const validChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'authentication',
      userId: null,
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(validChallenge);
    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockAuthenticationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('webauthnCredentialNotFound');
  });

  it('returns 401 when user account is suspended', async () => {
    const validChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'authentication',
      userId: null,
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    const credentialWithSuspendedUser = {
      id: 'cred-id',
      credentialId: Buffer.from('credential-id'),
      publicKey: Buffer.from('public-key'),
      counter: BigInt(0),
      transports: ['internal'],
      user: {
        id: 'user-1',
        username: 'testuser',
        role: 'DEFAULT',
        mustChangePassword: false,
        isActive: false,
      },
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(validChallenge);
    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce(credentialWithSuspendedUser);

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockAuthenticationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.message).toBe('accountSuspended');
  });

  it('returns 400 when verification fails', async () => {
    const validChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'authentication',
      userId: null,
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    const validCredential = {
      id: 'cred-id',
      credentialId: Buffer.from('credential-id'),
      publicKey: Buffer.from('public-key'),
      counter: BigInt(0),
      transports: ['internal'],
      user: {
        id: 'user-1',
        username: 'testuser',
        role: 'DEFAULT',
        mustChangePassword: false,
        isActive: true,
      },
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(validChallenge);
    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce(validCredential);
    vi.mocked(verifyAuthenticationResponse).mockRejectedValueOnce(new Error('Verification failed'));

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockAuthenticationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnVerificationFailed');
  });

  it('returns 400 when verification is not verified', async () => {
    const validChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'authentication',
      userId: null,
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    const validCredential = {
      id: 'cred-id',
      credentialId: Buffer.from('credential-id'),
      publicKey: Buffer.from('public-key'),
      counter: BigInt(0),
      transports: ['internal'],
      user: {
        id: 'user-1',
        username: 'testuser',
        role: 'DEFAULT',
        mustChangePassword: false,
        isActive: true,
      },
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(validChallenge);
    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce(validCredential);
    vi.mocked(verifyAuthenticationResponse).mockResolvedValueOnce({
      verified: false,
      authenticationInfo: {
        credentialID: 'credential-id',
        newCounter: 1,
        userVerified: true,
        credentialDeviceType: 'singleDevice',
        credentialBackedUp: false,
        origin: 'http://localhost:3000',
        rpID: 'localhost',
      },
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockAuthenticationResponse,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('webauthnVerificationFailed');
  });

  it('returns token and user on successful authentication', async () => {
    const validChallenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      type: 'authentication',
      userId: null,
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    };

    const validCredential = {
      id: 'cred-id',
      credentialId: Buffer.from('credential-id'),
      publicKey: Buffer.from('public-key'),
      counter: BigInt(0),
      transports: ['internal'],
      user: {
        id: 'user-1',
        username: 'testuser',
        role: 'DEFAULT',
        mustChangePassword: false,
        isActive: true,
      },
    };

    mockedPrisma.webAuthnChallenge.findUnique.mockResolvedValueOnce(validChallenge);
    mockedPrisma.webAuthnCredential.findUnique.mockResolvedValueOnce(validCredential);
    vi.mocked(verifyAuthenticationResponse).mockResolvedValueOnce({
      verified: true,
      authenticationInfo: {
        credentialID: 'credential-id',
        newCounter: 1,
        userVerified: true,
        credentialDeviceType: 'singleDevice',
        credentialBackedUp: false,
        origin: 'http://localhost:3000',
        rpID: 'localhost',
      },
    });
    mockedPrisma.webAuthnCredential.update.mockResolvedValueOnce({
      ...validCredential,
      counter: BigInt(1),
    });
    mockedPrisma.webAuthnChallenge.delete.mockResolvedValueOnce(validChallenge);
    vi.mocked(generateToken).mockResolvedValueOnce('mock-jwt-token');

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/verify', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: 'challenge-id',
        response: mockAuthenticationResponse,
      }),
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
    expect(mockedPrisma.webAuthnCredential.update).toHaveBeenCalled();
    expect(mockedPrisma.webAuthnChallenge.delete).toHaveBeenCalled();
  });
});
