import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    setting: {
      findMany: vi.fn(),
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
  setting: {
    findMany: typeof prisma.setting.findMany;
  };
}>(prisma);

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('GET /api/settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns settings with defaults for admin', async () => {
    mockAdmin();

    mockedPrisma.setting.findMany.mockResolvedValueOnce([]);

    const request = new NextRequest('http://localhost/api/settings');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data['security.sharing.mode']).toBe('BASIC');
  });

  it('returns settings from database for admin', async () => {
    mockAdmin();

    mockedPrisma.setting.findMany.mockResolvedValueOnce([
      { id: '1', settingKey: 'security.sharing.mode', settingValue: 'ADVANCED' },
    ]);

    const request = new NextRequest('http://localhost/api/settings');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data['security.sharing.mode']).toBe('ADVANCED');
  });

  it('ignores unknown settings from database', async () => {
    mockAdmin();

    mockedPrisma.setting.findMany.mockResolvedValueOnce([
      { id: '1', settingKey: 'security.sharing.mode', settingValue: 'ADVANCED' },
      { id: '2', settingKey: 'unknown.setting.key', settingValue: 'some-value' },
    ]);

    const request = new NextRequest('http://localhost/api/settings');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data['security.sharing.mode']).toBe('ADVANCED');
    expect(data['unknown.setting.key']).toBeUndefined();
  });

  it('returns 500 when stored value cannot be parsed', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAdmin();

    mockedPrisma.setting.findMany.mockResolvedValueOnce([
      { id: '1', settingKey: 'security.sharing.mode', settingValue: 'INVALID_ENUM_VALUE' },
    ]);

    const request = new NextRequest('http://localhost/api/settings');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.settingsParseError');
    expect(data.params.key).toBe('security.sharing.mode');
    expect(data.params.value).toBe('INVALID_ENUM_VALUE');
  });

  it('returns 500 on unexpected database error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAdmin();

    mockedPrisma.setting.findMany.mockRejectedValueOnce(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost/api/settings');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});
