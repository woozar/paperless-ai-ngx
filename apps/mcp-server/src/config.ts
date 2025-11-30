import { z } from 'zod';
import * as dotenv from 'dotenv';
import { randomBytes } from 'node:crypto';
import { logger } from './logger.js';

dotenv.config();

const configSchema = z.object({
  // Server Configuration
  PORT: z
    .string()
    .default('3001')
    .transform((val) => parseInt(val, 10)),
  HOST: z.string().default('localhost'),

  // Authentication
  API_TOKEN: z.string().optional(),
  JWT_SECRET: z.string().default(() => randomBytes(32).toString('hex')),

  // Logging
  LOG_LEVEL: z.enum(['none', 'error', 'info', 'debug']).default('info'),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(): Config {
  const result = configSchema.safeParse({
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    API_TOKEN: process.env.API_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
    LOG_LEVEL: process.env.LOG_LEVEL,
  });

  if (!result.success) {
    logger.error('Configuration validation failed:');
    logger.error(result.error.format());
    throw new Error('Invalid configuration');
  }

  return result.data;
}
