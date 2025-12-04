import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adminRoute, authRoute, publicRoute } from './index';

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

import { getAuthUser } from '@/lib/auth/jwt';

const mockGetAuthUser = vi.mocked(getAuthUser);

describe('route-wrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('adminRoute', () => {
    it('returns 401 when not authenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const handler = adminRoute(async () => NextResponse.json({ ok: true }));
      const request = new NextRequest('http://localhost/api/test');
      const response = await handler(request);

      expect(response.status).toBe(401);
    });

    it('returns 403 when user is not admin', async () => {
      mockGetAuthUser.mockResolvedValue({
        userId: '1',
        username: 'user',
        role: 'DEFAULT',
      });

      const handler = adminRoute(async () => NextResponse.json({ ok: true }));
      const request = new NextRequest('http://localhost/api/test');
      const response = await handler(request);

      expect(response.status).toBe(403);
    });

    it('calls handler when user is admin', async () => {
      mockGetAuthUser.mockResolvedValue({
        userId: '1',
        username: 'admin',
        role: 'ADMIN',
      });

      const handler = adminRoute(async () => NextResponse.json({ ok: true }));
      const request = new NextRequest('http://localhost/api/test');
      const response = await handler(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.ok).toBe(true);
    });
  });

  describe('authRoute', () => {
    it('returns 401 when not authenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const handler = authRoute(async () => NextResponse.json({ ok: true }));
      const request = new NextRequest('http://localhost/api/test');
      const response = await handler(request);

      expect(response.status).toBe(401);
    });

    it('allows non-admin users', async () => {
      mockGetAuthUser.mockResolvedValue({
        userId: '1',
        username: 'user',
        role: 'DEFAULT',
      });

      const handler = authRoute(async () => NextResponse.json({ ok: true }));
      const request = new NextRequest('http://localhost/api/test');
      const response = await handler(request);

      expect(response.status).toBe(200);
    });
  });

  describe('publicRoute', () => {
    it('does not require authentication', async () => {
      const handler = publicRoute(async () => NextResponse.json({ ok: true }));
      const request = new NextRequest('http://localhost/api/test');
      const response = await handler(request);

      expect(response.status).toBe(200);
      expect(mockGetAuthUser).not.toHaveBeenCalled();
    });
  });

  describe('body validation', () => {
    const TestSchema = z.object({ name: z.string() });

    it('returns 400 when body validation fails', async () => {
      mockGetAuthUser.mockResolvedValue({
        userId: '1',
        username: 'admin',
        role: 'ADMIN',
      });

      const handler = adminRoute(async () => NextResponse.json({ ok: true }), {
        bodySchema: TestSchema,
      });

      const request = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        body: JSON.stringify({ invalid: 'data' }),
      });
      const response = await handler(request);

      expect(response.status).toBe(400);
    });

    it('returns 400 when body is invalid JSON', async () => {
      mockGetAuthUser.mockResolvedValue({
        userId: '1',
        username: 'admin',
        role: 'ADMIN',
      });

      const handler = adminRoute(async () => NextResponse.json({ ok: true }), {
        bodySchema: TestSchema,
      });

      const request = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        body: '{invalid json',
        headers: { 'Content-Type': 'application/json' },
      });
      const response = await handler(request);

      expect(response.status).toBe(400);
    });

    it('passes validated body to handler', async () => {
      mockGetAuthUser.mockResolvedValue({
        userId: '1',
        username: 'admin',
        role: 'ADMIN',
      });

      const handler = adminRoute(async ({ body }) => NextResponse.json({ received: body.name }), {
        bodySchema: TestSchema,
      });

      const request = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
      });
      const response = await handler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe('test');
    });
  });

  describe('route params', () => {
    it('extracts params from context', async () => {
      mockGetAuthUser.mockResolvedValue({
        userId: '1',
        username: 'admin',
        role: 'ADMIN',
      });

      const handler = adminRoute<never, { id: string }>(async ({ params }) =>
        NextResponse.json({ id: params.id })
      );

      const request = new NextRequest('http://localhost/api/test/123');
      const response = await handler(request, {
        params: Promise.resolve({ id: '123' }),
      });
      const data = await response.json();

      expect(data.id).toBe('123');
    });
  });

  describe('error handling', () => {
    it('catches handler errors and returns 500', async () => {
      mockGetAuthUser.mockResolvedValue({
        userId: '1',
        username: 'admin',
        role: 'ADMIN',
      });

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const handler = adminRoute(
        async () => {
          throw new Error('Test error');
        },
        { errorLogPrefix: 'Test' }
      );

      const request = new NextRequest('http://localhost/api/test');
      const response = await handler(request);

      expect(response.status).toBe(500);
      expect(consoleError).toHaveBeenCalledWith('[Test] error:', expect.any(Error));

      consoleError.mockRestore();
    });
  });
});
