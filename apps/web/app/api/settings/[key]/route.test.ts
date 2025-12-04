import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { PUT } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    setting: {
      findMany: vi.fn(),
      upsert: vi.fn(),
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
    upsert: typeof prisma.setting.upsert;
  };
}>(prisma);

// Additional mocks to test specific branches
vi.mock('@/lib/api/schemas/settings', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/schemas/settings')>();
  return {
    ...actual,
    // Keep original implementations but allow spying
    getSettingKeys: vi.fn(() => actual.getSettingKeys()),
    getSettingsDefaults: vi.fn(() => actual.getSettingsDefaults()),
    getSettingValueSchema: vi.fn((key: string) =>
      actual.getSettingValueSchema(key as keyof typeof actual.SettingsSchema.shape)
    ),
    parseStoredSettingValue: vi.fn((key: string, value: string) =>
      actual.parseStoredSettingValue(key as keyof typeof actual.SettingsSchema.shape, value)
    ),
  };
});

import * as settingsModule from '@/lib/api/schemas/settings';
import { z } from 'zod';

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('PUT /api/settings/[key]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to original implementations
    vi.mocked(settingsModule.getSettingKeys).mockImplementation(
      () => ['security.sharing.mode'] as (keyof typeof settingsModule.SettingsSchema.shape)[]
    );
    vi.mocked(settingsModule.getSettingsDefaults).mockImplementation(() => ({
      'security.sharing.mode': 'BASIC',
    }));
    vi.mocked(settingsModule.getSettingValueSchema).mockImplementation(
      (key: string) =>
        settingsModule.SettingsSchema.shape[key as keyof typeof settingsModule.SettingsSchema.shape]
    );
  });

  it('returns 404 for unknown setting key', async () => {
    mockAdmin();

    const request = new NextRequest('http://localhost/api/settings/unknown.setting', {
      method: 'PUT',
      body: JSON.stringify({ value: 'something' }),
    });

    const response = await PUT(request, { params: Promise.resolve({ key: 'unknown.setting' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('error.notFound');
  });

  it('returns 400 for invalid value', async () => {
    mockAdmin();

    const request = new NextRequest('http://localhost/api/settings/security.sharing.mode', {
      method: 'PUT',
      body: JSON.stringify({ value: 'INVALID_VALUE' }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ key: 'security.sharing.mode' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('error.settingsValidationError');
    expect(data.params).toEqual({
      key: 'security.sharing.mode',
      value: 'INVALID_VALUE',
      expectedType: 'Invalid option: expected one of "BASIC"|"ADVANCED"',
    });
  });

  it('updates setting and returns all settings', async () => {
    mockAdmin();

    mockedPrisma.setting.upsert.mockResolvedValueOnce({
      id: '1',
      settingKey: 'security.sharing.mode',
      settingValue: 'ADVANCED',
    });

    mockedPrisma.setting.findMany.mockResolvedValueOnce([
      { id: '1', settingKey: 'security.sharing.mode', settingValue: 'ADVANCED' },
    ]);

    const request = new NextRequest('http://localhost/api/settings/security.sharing.mode', {
      method: 'PUT',
      body: JSON.stringify({ value: 'ADVANCED' }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ key: 'security.sharing.mode' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data['security.sharing.mode']).toBe('ADVANCED');
    expect(mockedPrisma.setting.upsert).toHaveBeenCalledWith({
      where: { settingKey: 'security.sharing.mode' },
      update: { settingValue: 'ADVANCED' },
      create: { settingKey: 'security.sharing.mode', settingValue: 'ADVANCED' },
    });
  });

  it('returns validation error with message when issue has no expected property', async () => {
    mockAdmin();

    // Mock a string schema with minLength that produces error without 'expected'
    vi.mocked(settingsModule.getSettingKeys).mockReturnValue(['test.string.setting'] as never[]);
    vi.mocked(settingsModule.getSettingValueSchema).mockReturnValue(
      z.string().min(5) // min length error has 'message' but not 'expected'
    );

    const request = new NextRequest('http://localhost/api/settings/test.string.setting', {
      method: 'PUT',
      body: JSON.stringify({ value: 'ab' }), // Too short
    });

    const response = await PUT(request, {
      params: Promise.resolve({ key: 'test.string.setting' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('error.settingsValidationError');
    expect(data.params.expectedType).toContain('5 character');
  });

  it('returns validation error with unknown when issue has no expected or message', async () => {
    mockAdmin();

    // Mock a schema with custom refinement that produces error without expected or message
    vi.mocked(settingsModule.getSettingKeys).mockReturnValue(['test.custom.setting'] as never[]);

    // Create a mock schema where safeParse returns error with empty issue
    const mockSchema = {
      safeParse: () => ({
        success: false,
        error: {
          issues: [{ code: 'custom' }], // No 'expected' or 'message'
        },
      }),
    };
    vi.mocked(settingsModule.getSettingValueSchema).mockReturnValue(mockSchema as never);

    const request = new NextRequest('http://localhost/api/settings/test.custom.setting', {
      method: 'PUT',
      body: JSON.stringify({ value: 'test' }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ key: 'test.custom.setting' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('error.settingsValidationError');
    expect(data.params.expectedType).toBe('unknown');
  });

  it('stores boolean values with JSON.stringify', async () => {
    mockAdmin();

    // Mock a boolean schema
    vi.mocked(settingsModule.getSettingKeys).mockReturnValue(['test.bool.setting'] as never[]);
    vi.mocked(settingsModule.getSettingValueSchema).mockReturnValue(z.boolean());
    vi.mocked(settingsModule.getSettingsDefaults).mockReturnValue({
      'test.bool.setting': false,
    } as never);
    vi.mocked(settingsModule.parseStoredSettingValue).mockReturnValue(true as never);

    mockedPrisma.setting.upsert.mockResolvedValueOnce({
      id: '1',
      settingKey: 'test.bool.setting',
      settingValue: 'true',
    });

    mockedPrisma.setting.findMany.mockResolvedValueOnce([
      { id: '1', settingKey: 'test.bool.setting', settingValue: 'true' },
    ]);

    const request = new NextRequest('http://localhost/api/settings/test.bool.setting', {
      method: 'PUT',
      body: JSON.stringify({ value: true }),
    });

    const response = await PUT(request, { params: Promise.resolve({ key: 'test.bool.setting' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    // Verify that boolean was stringified for storage
    expect(mockedPrisma.setting.upsert).toHaveBeenCalledWith({
      where: { settingKey: 'test.bool.setting' },
      update: { settingValue: 'true' }, // JSON.stringify(true) = 'true'
      create: { settingKey: 'test.bool.setting', settingValue: 'true' },
    });
  });

  it('returns 500 when stored value cannot be parsed after update', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAdmin();

    // Reset to original implementations for this test
    vi.mocked(settingsModule.getSettingKeys).mockReturnValue([
      'security.sharing.mode',
    ] as (keyof typeof settingsModule.SettingsSchema.shape)[]);
    vi.mocked(settingsModule.getSettingValueSchema).mockImplementation(
      (key: string) =>
        settingsModule.SettingsSchema.shape[key as keyof typeof settingsModule.SettingsSchema.shape]
    );
    // Use real parseStoredSettingValue which will throw for invalid values
    vi.mocked(settingsModule.parseStoredSettingValue).mockRestore();
    vi.mocked(settingsModule.parseStoredSettingValue).mockImplementation(
      (key: string, value: string) => {
        // Re-implement the real behavior - this will throw for CORRUPTED_VALUE
        const schema =
          settingsModule.SettingsSchema.shape[
            key as keyof typeof settingsModule.SettingsSchema.shape
          ];
        const result = schema.safeParse(value);
        if (!result.success) {
          const errors = result.error.issues.map((e: { message: string }) => e.message);
          throw new settingsModule.SettingsParseError(key, value, errors);
        }
        return result.data as never;
      }
    );

    mockedPrisma.setting.upsert.mockResolvedValueOnce({
      id: '1',
      settingKey: 'security.sharing.mode',
      settingValue: 'ADVANCED',
    });

    // Return invalid value when fetching all settings
    mockedPrisma.setting.findMany.mockResolvedValueOnce([
      { id: '1', settingKey: 'security.sharing.mode', settingValue: 'CORRUPTED_VALUE' },
    ]);

    const request = new NextRequest('http://localhost/api/settings/security.sharing.mode', {
      method: 'PUT',
      body: JSON.stringify({ value: 'ADVANCED' }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ key: 'security.sharing.mode' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.settingsParseError');
    expect(data.params.key).toBe('security.sharing.mode');
    expect(data.params.value).toBe('CORRUPTED_VALUE');
  });

  it('returns 500 on unexpected database error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAdmin();

    mockedPrisma.setting.upsert.mockRejectedValueOnce(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost/api/settings/security.sharing.mode', {
      method: 'PUT',
      body: JSON.stringify({ value: 'ADVANCED' }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ key: 'security.sharing.mode' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('error.serverError');
  });
});
