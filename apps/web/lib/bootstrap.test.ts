import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock @repo/database
vi.mock('@repo/database', () => {
  // Create mock PrismaClientKnownRequestError inside factory
  class MockPrismaClientKnownRequestError extends Error {
    code: string;
    constructor(message: string, { code }: { code: string }) {
      super(message);
      this.code = code;
      this.name = 'PrismaClientKnownRequestError';
    }
  }

  const mockTx = {
    setting: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    user: {
      count: vi.fn(),
      create: vi.fn(),
    },
  };

  return {
    prisma: {
      $transaction: vi.fn(async (callback: (tx: typeof mockTx) => Promise<void>) => {
        await callback(mockTx);
      }),
      setting: {
        findUnique: vi.fn(),
      },
    },
    Prisma: {
      TransactionIsolationLevel: {
        Serializable: 'Serializable',
      },
      PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
    },
    __mockTx: mockTx,
  };
});

// Mock password utilities
vi.mock('./utilities/password', () => ({
  generateSalt: vi.fn(() => 'generated-salt-123'),
  hashPassword: vi.fn(() => 'hashed-password-456'),
}));

import { bootstrapApplication, getSalt, BootstrapError } from './bootstrap';
import { prisma, Prisma } from '@repo/database';

// Helper to get mockTx from the mock module
const getMockTx = async () => {
  const mod = await vi.importMock<{
    __mockTx: {
      setting: { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
      user: { count: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
    };
  }>('@repo/database');
  return mod.__mockTx;
};

describe('bootstrap', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('bootstrapApplication', () => {
    it('creates salt when none exists', async () => {
      const mockTx = await getMockTx();
      mockTx.setting.findUnique.mockResolvedValue(null);
      mockTx.setting.create.mockResolvedValue({
        settingKey: 'security.secrets.salt',
        settingValue: 'generated-salt-123',
      });
      mockTx.user.count.mockResolvedValue(1);

      await bootstrapApplication();

      expect(mockTx.setting.findUnique).toHaveBeenCalledWith({
        where: { settingKey: 'security.secrets.salt' },
      });
      expect(mockTx.setting.create).toHaveBeenCalledWith({
        data: {
          settingKey: 'security.secrets.salt',
          settingValue: 'generated-salt-123',
        },
      });
    });

    it('does not create salt when one exists', async () => {
      const mockTx = await getMockTx();
      mockTx.setting.findUnique.mockResolvedValue({
        settingKey: 'security.secrets.salt',
        settingValue: 'existing-salt',
      });
      mockTx.user.count.mockResolvedValue(1);

      await bootstrapApplication();

      expect(mockTx.setting.create).not.toHaveBeenCalled();
    });

    it('creates admin user when no users exist and ADMIN_INITIAL_PASSWORD is set', async () => {
      process.env.ADMIN_INITIAL_PASSWORD = 'initial-password';
      const mockTx = await getMockTx();
      mockTx.setting.findUnique.mockResolvedValue({
        settingKey: 'security.secrets.salt',
        settingValue: 'existing-salt',
      });
      mockTx.user.count.mockResolvedValue(0);
      mockTx.user.create.mockResolvedValue({ id: 'new-admin' });

      await bootstrapApplication();

      expect(mockTx.user.create).toHaveBeenCalledWith({
        data: {
          username: 'admin',
          passwordHash: 'hashed-password-456',
          role: 'ADMIN',
          mustChangePassword: true,
          isActive: true,
        },
      });
      expect(console.log).toHaveBeenCalledWith('Initial admin user created successfully.');
    });

    it('does not create admin user when users already exist', async () => {
      const mockTx = await getMockTx();
      mockTx.setting.findUnique.mockResolvedValue({
        settingKey: 'security.secrets.salt',
        settingValue: 'existing-salt',
      });
      mockTx.user.count.mockResolvedValue(5);

      await bootstrapApplication();

      expect(mockTx.user.create).not.toHaveBeenCalled();
    });

    it('throws BootstrapError when no users exist and ADMIN_INITIAL_PASSWORD is not set', async () => {
      delete process.env.ADMIN_INITIAL_PASSWORD;
      const mockTx = await getMockTx();
      mockTx.setting.findUnique.mockResolvedValue({
        settingKey: 'security.secrets.salt',
        settingValue: 'existing-salt',
      });
      mockTx.user.count.mockResolvedValue(0);

      await expect(bootstrapApplication()).rejects.toThrow(BootstrapError);
    });

    it('throws BootstrapError with correct message when password not set', async () => {
      delete process.env.ADMIN_INITIAL_PASSWORD;
      const mockTx = await getMockTx();
      mockTx.setting.findUnique.mockResolvedValue({
        settingKey: 'security.secrets.salt',
        settingValue: 'existing-salt',
      });
      mockTx.user.count.mockResolvedValue(0);

      await expect(bootstrapApplication()).rejects.toThrow(
        'No users exist and ADMIN_INITIAL_PASSWORD environment variable is not set'
      );
    });

    it('handles P2034 concurrent transaction error gracefully', async () => {
      const PrismaError = Prisma.PrismaClientKnownRequestError as unknown as new (
        message: string,
        options: { code: string }
      ) => Error;
      const concurrentError = new PrismaError('Write conflict', {
        code: 'P2034',
      });

      vi.mocked(prisma.$transaction).mockRejectedValueOnce(concurrentError);

      await expect(bootstrapApplication()).resolves.toBeUndefined();
      expect(console.log).toHaveBeenCalledWith(
        'Bootstrap: Concurrent transaction completed first, skipping.'
      );
    });

    it('rethrows non-P2034 errors', async () => {
      const otherError = new Error('Database connection failed');

      vi.mocked(prisma.$transaction).mockRejectedValueOnce(otherError);

      await expect(bootstrapApplication()).rejects.toThrow('Database connection failed');
    });

    it('uses Serializable isolation level', async () => {
      const mockTx = await getMockTx();
      mockTx.setting.findUnique.mockResolvedValue({
        settingKey: 'security.secrets.salt',
        settingValue: 'existing-salt',
      });
      mockTx.user.count.mockResolvedValue(1);

      await bootstrapApplication();

      expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), {
        isolationLevel: 'Serializable',
      });
    });
  });

  describe('getSalt', () => {
    it('returns salt value when it exists', async () => {
      vi.mocked(prisma.setting.findUnique).mockResolvedValue({
        settingKey: 'security.secrets.salt',
        settingValue: 'stored-salt-value',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await getSalt();

      expect(result).toBe('stored-salt-value');
      expect(prisma.setting.findUnique).toHaveBeenCalledWith({
        where: { settingKey: 'security.secrets.salt' },
      });
    });

    it('returns null when salt does not exist', async () => {
      vi.mocked(prisma.setting.findUnique).mockResolvedValue(null);

      const result = await getSalt();

      expect(result).toBeNull();
    });
  });

  describe('BootstrapError', () => {
    it('has correct name property', () => {
      const error = new BootstrapError('Test message');

      expect(error.name).toBe('BootstrapError');
      expect(error.message).toBe('Test message');
      expect(error).toBeInstanceOf(Error);
    });
  });
});
