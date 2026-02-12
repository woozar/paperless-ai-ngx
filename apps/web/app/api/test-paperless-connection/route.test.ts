import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

import { getAuthUser } from '@/lib/auth/jwt';

// Mock fetch globally
global.fetch = vi.fn();

function mockUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('POST /api/test-paperless-connection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success when connection is successful', async () => {
    mockUser();

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as Response);

    const request = new NextRequest('http://localhost/api/test-paperless-connection', {
      method: 'POST',
      body: JSON.stringify({
        apiUrl: 'https://paperless.example.com',
        apiToken: 'test-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'https://paperless.example.com/api/documents/?page=1&page_size=1',
      expect.objectContaining({
        headers: {
          Authorization: 'Token test-token',
        },
      })
    );
  });

  it('returns error when Paperless returns non-ok response', async () => {
    mockUser();

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as Response);

    const request = new NextRequest('http://localhost/api/test-paperless-connection', {
      method: 'POST',
      body: JSON.stringify({
        apiUrl: 'https://paperless.example.com',
        apiToken: 'invalid-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: false,
      error: {
        message: 'connectionError',
        params: { status: 401 },
      },
    });
  });

  it('returns error when network request fails', async () => {
    mockUser();

    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost/api/test-paperless-connection', {
      method: 'POST',
      body: JSON.stringify({
        apiUrl: 'https://paperless.example.com',
        apiToken: 'test-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: false,
      error: {
        message: 'connectionError',
        params: { error: 'Network error' },
      },
    });
  });

  it('returns error when request times out', async () => {
    mockUser();

    vi.mocked(fetch).mockRejectedValueOnce(new Error('TimeoutError'));

    const request = new NextRequest('http://localhost/api/test-paperless-connection', {
      method: 'POST',
      body: JSON.stringify({
        apiUrl: 'https://paperless.example.com',
        apiToken: 'test-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: false,
      error: {
        message: 'connectionError',
        params: { error: 'TimeoutError' },
      },
    });
  });

  it('validates apiUrl is a valid URL', async () => {
    mockUser();

    const request = new NextRequest('http://localhost/api/test-paperless-connection', {
      method: 'POST',
      body: JSON.stringify({
        apiUrl: 'not-a-url',
        apiToken: 'test-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('invalidRequest');
  });

  it('validates apiToken is not empty', async () => {
    mockUser();

    const request = new NextRequest('http://localhost/api/test-paperless-connection', {
      method: 'POST',
      body: JSON.stringify({
        apiUrl: 'https://paperless.example.com',
        apiToken: '',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('invalidRequest');
  });
});
