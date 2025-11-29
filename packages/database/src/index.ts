import { PrismaClient } from '../generated/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { URL } from 'node:url';

// Load .env only in development (in production, env vars come from Docker/hosting)
if (process.env.NODE_ENV !== 'production') {
  const { config } = await import('dotenv');
  const { join, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  config({ path: join(__dirname, '../../../.env') });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

// Parse DATABASE_URL to extract connection parameters
function parseConnectionUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port) || 5432,
    database: parsed.pathname.slice(1),
    user: parsed.username,
    password: parsed.password,
  };
}

function getPool(): pg.Pool {
  if (!globalForPrisma.pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const connectionParams = parseConnectionUrl(process.env.DATABASE_URL);
    globalForPrisma.pool = new pg.Pool(connectionParams);
  }
  return globalForPrisma.pool;
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg(getPool());
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? [/* 'query', */ 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Re-export only what's needed from generated client (avoiding export * on CommonJS module)
export { Prisma } from '../generated/client/index.js';
