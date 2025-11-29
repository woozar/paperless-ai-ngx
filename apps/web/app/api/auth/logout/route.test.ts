import { describe, it, expect } from 'vitest';
import { POST } from './route';

describe('POST /api/auth/logout', () => {
  it('returns success response', async () => {
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
