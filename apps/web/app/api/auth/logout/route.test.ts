import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

describe('POST /api/auth/logout', () => {
  it('returns success response', async () => {
    const request = new NextRequest('http://localhost/api/auth/logout', {
      method: 'POST',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
