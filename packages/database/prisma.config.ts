import { config } from 'dotenv';
import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

// Load .env from monorepo root
config({ path: path.join(__dirname, '../../.env') });

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: env('DATABASE_URL'),
  },
});
