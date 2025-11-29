import type { Mock } from 'vitest';

/**
 * Helper type for mocking Prisma client methods in tests
 */
export type MockedPrismaClient<T extends Record<string, any>> = {
  [K in keyof T]: {
    [M in keyof T[K]]: Mock;
  };
};

/**
 * Type-safe helper to create a mocked Prisma client
 */
export function mockPrisma<T extends Record<string, any>>(prisma: any): MockedPrismaClient<T> {
  return prisma;
}
