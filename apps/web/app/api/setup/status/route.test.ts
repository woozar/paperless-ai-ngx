import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      count: vi.fn(),
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
  paperlessInstance: {
    count: typeof prisma.paperlessInstance.count;
  };
}>(prisma);

function mockAdminUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

function mockDefaultUser() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'user-1',
    username: 'testuser',
    role: 'DEFAULT',
  });
}

describe('GET /api/setup/status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns setupNeeded=false for non-admin users', async () => {
    mockDefaultUser();

    const request = new NextRequest('http://localhost/api/setup/status');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ setupNeeded: false });
    expect(mockedPrisma.paperlessInstance.count).not.toHaveBeenCalled();
  });

  it('returns setupNeeded=true when admin has no instances', async () => {
    mockAdminUser();
    mockedPrisma.paperlessInstance.count.mockResolvedValueOnce(0);

    const request = new NextRequest('http://localhost/api/setup/status');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      setupNeeded: true,
      setupComplete: false,
    });
    expect(mockedPrisma.paperlessInstance.count).toHaveBeenCalledWith({
      where: { ownerId: 'admin-1' },
    });
  });

  it('returns setupNeeded=false when admin has instances', async () => {
    mockAdminUser();
    mockedPrisma.paperlessInstance.count.mockResolvedValueOnce(2);

    const request = new NextRequest('http://localhost/api/setup/status');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      setupNeeded: false,
      setupComplete: true,
    });
    expect(mockedPrisma.paperlessInstance.count).toHaveBeenCalledWith({
      where: { ownerId: 'admin-1' },
    });
  });

  it('returns setupNeeded=false when admin has exactly one instance', async () => {
    mockAdminUser();
    mockedPrisma.paperlessInstance.count.mockResolvedValueOnce(1);

    const request = new NextRequest('http://localhost/api/setup/status');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      setupNeeded: false,
      setupComplete: true,
    });
  });
});
