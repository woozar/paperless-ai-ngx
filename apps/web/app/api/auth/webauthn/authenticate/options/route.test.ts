import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    webAuthnChallenge: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@simplewebauthn/server', () => ({
  generateAuthenticationOptions: vi.fn(),
}));

vi.mock('@/lib/auth/webauthn', () => ({
  rpID: 'localhost',
  CHALLENGE_TTL_MS: 300000,
  parseTransports: vi.fn((transports: string[]) => transports),
}));

import { prisma } from '@repo/database';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  user: {
    findUnique: typeof prisma.user.findUnique;
  };
  webAuthnChallenge: {
    create: typeof prisma.webAuthnChallenge.create;
  };
}>(prisma);

describe('POST /api/auth/webauthn/authenticate/options', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns authentication options without username', async () => {
    const mockOptions = {
      challenge: 'test-challenge',
      rpId: 'localhost',
      allowCredentials: [],
    };

    vi.mocked(generateAuthenticationOptions).mockResolvedValueOnce(mockOptions);
    mockedPrisma.webAuthnChallenge.create.mockResolvedValueOnce({
      id: 'challenge-id-123',
      challenge: 'test-challenge',
      type: 'authentication',
      userId: null,
      expiresAt: new Date(),
      createdAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/options', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.options).toEqual(mockOptions);
    expect(data.challengeId).toBe('challenge-id-123');
    expect(generateAuthenticationOptions).toHaveBeenCalledWith({
      rpID: 'localhost',
      allowCredentials: undefined,
      userVerification: 'preferred',
    });
  });

  it('returns authentication options with username and existing credentials', async () => {
    const mockUser = {
      id: 'user-1',
      username: 'testuser',
      webAuthnCredentials: [
        {
          credentialId: Buffer.from('credential-1'),
          transports: ['internal'],
        },
        {
          credentialId: Buffer.from('credential-2'),
          transports: ['usb', 'nfc'],
        },
      ],
    };

    mockedPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

    const mockOptions = {
      challenge: 'test-challenge',
      rpId: 'localhost',
      allowCredentials: [],
    };

    vi.mocked(generateAuthenticationOptions).mockResolvedValueOnce(mockOptions);
    mockedPrisma.webAuthnChallenge.create.mockResolvedValueOnce({
      id: 'challenge-id-456',
      challenge: 'test-challenge',
      type: 'authentication',
      userId: null,
      expiresAt: new Date(),
      createdAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/options', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.options).toEqual(mockOptions);
    expect(data.challengeId).toBe('challenge-id-456');
    expect(generateAuthenticationOptions).toHaveBeenCalledWith({
      rpID: 'localhost',
      allowCredentials: [
        { id: Buffer.from('credential-1').toString('base64url'), transports: ['internal'] },
        { id: Buffer.from('credential-2').toString('base64url'), transports: ['usb', 'nfc'] },
      ],
      userVerification: 'preferred',
    });
  });

  it('returns options without allowCredentials when user not found', async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const mockOptions = {
      challenge: 'test-challenge',
      rpId: 'localhost',
    };

    vi.mocked(generateAuthenticationOptions).mockResolvedValueOnce(mockOptions);
    mockedPrisma.webAuthnChallenge.create.mockResolvedValueOnce({
      id: 'challenge-id-789',
      challenge: 'test-challenge',
      type: 'authentication',
      userId: null,
      expiresAt: new Date(),
      createdAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/options', {
      method: 'POST',
      body: JSON.stringify({ username: 'nonexistent' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.challengeId).toBe('challenge-id-789');
    expect(generateAuthenticationOptions).toHaveBeenCalledWith({
      rpID: 'localhost',
      allowCredentials: undefined,
      userVerification: 'preferred',
    });
  });

  it('returns options without allowCredentials when user has no credentials', async () => {
    const mockUser = {
      id: 'user-1',
      username: 'testuser',
      webAuthnCredentials: [],
    };

    mockedPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

    const mockOptions = {
      challenge: 'test-challenge',
      rpId: 'localhost',
    };

    vi.mocked(generateAuthenticationOptions).mockResolvedValueOnce(mockOptions);
    mockedPrisma.webAuthnChallenge.create.mockResolvedValueOnce({
      id: 'challenge-id-000',
      challenge: 'test-challenge',
      type: 'authentication',
      userId: null,
      expiresAt: new Date(),
      createdAt: new Date(),
    });

    const request = new NextRequest('http://localhost/api/auth/webauthn/authenticate/options', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(generateAuthenticationOptions).toHaveBeenCalledWith({
      rpID: 'localhost',
      allowCredentials: undefined,
      userVerification: 'preferred',
    });
  });
});
