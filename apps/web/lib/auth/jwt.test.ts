/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateToken, verifyToken, extractToken, getAuthUser } from './jwt';
import { NextRequest } from 'next/server';

describe('JWT utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, JWT_SECRET: 'test-secret-key-for-testing-purposes-32chars!' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('generateToken', () => {
    it('generates a valid JWT token string', async () => {
      const token = await generateToken({
        userId: 'user-123',
        username: 'testuser',
        role: 'DEFAULT',
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('includes user payload in token', async () => {
      const payload = {
        userId: 'user-456',
        username: 'admin',
        role: 'ADMIN' as const,
      };

      const token = await generateToken(payload);
      const decoded = await verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.username).toBe(payload.username);
      expect(decoded.role).toBe(payload.role);
    });
  });

  describe('verifyToken', () => {
    it('verifies and decodes a valid token', async () => {
      const payload = {
        userId: 'user-789',
        username: 'testuser',
        role: 'DEFAULT' as const,
      };

      const token = await generateToken(payload);
      const decoded = await verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.username).toBe(payload.username);
      expect(decoded.role).toBe(payload.role);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('throws error for invalid token', async () => {
      await expect(verifyToken('invalid-token')).rejects.toThrow('Invalid or expired token');
    });

    it('throws error for tampered token', async () => {
      const token = await generateToken({
        userId: 'user-123',
        username: 'testuser',
        role: 'DEFAULT',
      });

      const tamperedToken = token.slice(0, -5) + 'xxxxx';
      await expect(verifyToken(tamperedToken)).rejects.toThrow('Invalid or expired token');
    });
  });

  describe('extractToken', () => {
    it('extracts token from valid Authorization header', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: { authorization: 'Bearer my-jwt-token' },
      });

      const token = extractToken(request);
      expect(token).toBe('my-jwt-token');
    });

    it('returns null for missing Authorization header', () => {
      const request = new NextRequest('http://localhost:3000/api/test');

      const token = extractToken(request);
      expect(token).toBeNull();
    });

    it('returns null for non-Bearer Authorization header', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: { authorization: 'Basic dXNlcjpwYXNz' },
      });

      const token = extractToken(request);
      expect(token).toBeNull();
    });

    it('returns null for Bearer with trailing space only (empty token)', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: { authorization: 'Bearer ' },
      });

      const token = extractToken(request);
      expect(token).toBeNull();
    });

    it('extracts token with special characters', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: { authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature' },
      });

      const token = extractToken(request);
      expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature');
    });
  });

  describe('getAuthUser', () => {
    it('returns user payload for valid token in request', async () => {
      const payload = {
        userId: 'user-123',
        username: 'testuser',
        role: 'DEFAULT' as const,
      };
      const token = await generateToken(payload);

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: { authorization: `Bearer ${token}` },
      });

      const user = await getAuthUser(request);

      expect(user).not.toBeNull();
      expect(user?.userId).toBe(payload.userId);
      expect(user?.username).toBe(payload.username);
      expect(user?.role).toBe(payload.role);
    });

    it('returns null when no Authorization header is present', async () => {
      const request = new NextRequest('http://localhost:3000/api/test');

      const user = await getAuthUser(request);

      expect(user).toBeNull();
    });

    it('returns null for invalid token', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      try {
        const request = new NextRequest('http://localhost:3000/api/test', {
          headers: { authorization: 'Bearer invalid-token' },
        });

        const user = await getAuthUser(request);

        expect(user).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Invalid or expired token',
          })
        );
      } finally {
        consoleErrorSpy.mockRestore();
      }
    });
  });

  describe('getSecret', () => {
    it('throws error when JWT_SECRET is not set', async () => {
      delete process.env.JWT_SECRET;

      await expect(
        generateToken({ userId: 'user-1', username: 'test', role: 'DEFAULT' })
      ).rejects.toThrow('JWT_SECRET environment variable is not set');
    });
  });
});
