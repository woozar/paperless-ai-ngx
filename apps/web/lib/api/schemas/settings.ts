import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { CommonErrorResponses } from './common';

extendZodWithOpenApi(z);

// Sharing mode enum
export const SharingModeSchema = z
  .enum(['BASIC', 'ADVANCED'])
  .default('BASIC')
  .openapi('SharingMode');

// Currency enum
export const CurrencySchema = z.enum(['EUR', 'USD']).default('EUR').openapi('Currency');

// User identity (for AI context)
export const UserIdentitySchema = z.string().default('').openapi('UserIdentity');

// PDF max size schema (in MB)
export const PdfMaxSizeMbSchema = z.coerce
  .number()
  .min(1)
  .max(100)
  .default(20)
  .openapi('PdfMaxSizeMb');

// Settings schema with defaults - keys are 3-part: section.group.setting
// IMPORTANT: All settings MUST have a default value to ensure getSettingsDefaults() works correctly
export const SettingsSchema = z
  .object({
    // Display settings
    'display.general.currency': CurrencySchema,
    // AI settings
    'ai.context.identity': UserIdentitySchema,
    'ai.pdf.maxSizeMb': PdfMaxSizeMbSchema,
    // Security settings
    'security.sharing.mode': SharingModeSchema,
  })
  .openapi('Settings');

export type Settings = z.infer<typeof SettingsSchema>;

// Settings response (same as Settings)
export const SettingsResponseSchema = SettingsSchema.openapi('SettingsResponse');

// Helper to extract defaults from schema
export function getSettingsDefaults(): Settings {
  return SettingsSchema.parse({});
}

// Helper to get all setting keys
export function getSettingKeys(): (keyof Settings)[] {
  return Object.keys(SettingsSchema.shape) as (keyof Settings)[];
}

// Helper to get the value schema for a specific setting key
export function getSettingValueSchema(key: keyof Settings): z.ZodType {
  return SettingsSchema.shape[key];
}

// Custom error for settings parsing failures
export class SettingsParseError extends Error {
  constructor(
    public readonly settingKey: string,
    public readonly storedValue: string,
    public readonly validationErrors: string[]
  ) {
    const message = `Invalid stored value for setting "${settingKey}": "${storedValue}". Errors: ${validationErrors.join(', ')}`;
    super(message);
    this.name = 'SettingsParseError';
  }
}

// Helper to parse a stored string value back to its proper type
export function parseStoredSettingValue(
  key: keyof Settings,
  storedValue: string
): Settings[keyof Settings] {
  const schema = SettingsSchema.shape[key];
  let jsonParseError: z.ZodError | null = null;
  let stringParseError: z.ZodError | null = null;

  // Try to parse as JSON first (handles booleans, numbers, etc.)
  try {
    const parsed = JSON.parse(storedValue);
    const result = schema.safeParse(parsed);
    if (result.success) return result.data;

    jsonParseError = result.error;
  } catch {
    // Not valid JSON, try as raw string
  }

  // Fall back to parsing as raw string
  const result = schema.safeParse(storedValue);
  if (result.success) return result.data;

  stringParseError = result.error;

  // Throw error with details for UI display
  // v8 ignore next -- @preserve - fallback for edge cases when both errors are null (unreachable with current schema)
  const errors = jsonParseError?.issues ?? stringParseError?.issues ?? [];
  const errorDetails = errors.map((e) =>
    // v8 ignore next -- @preserve - path only populated for nested object schemas (not used yet)
    e.path.length > 0 ? `${e.path.join('.')}: ${e.message}` : e.message
  );

  throw new SettingsParseError(key, storedValue, errorDetails);
}

// Update setting value request schema
export const UpdateSettingValueRequestSchema = z
  .object({
    value: z.string(),
  })
  .openapi('UpdateSettingValueRequest');

// Register schemas
registry.register('SharingMode', SharingModeSchema);
registry.register('Currency', CurrencySchema);
registry.register('Settings', SettingsSchema);
registry.register('SettingsResponse', SettingsResponseSchema);
registry.register('UpdateSettingValueRequest', UpdateSettingValueRequestSchema);

// Register settings paths
registry.registerPath({
  method: 'get',
  path: '/settings',
  summary: 'Get all settings (Admin only)',
  tags: ['Settings'],
  responses: {
    200: {
      description: 'Current settings',
      content: {
        'application/json': {
          schema: SettingsResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
  },
});

registry.registerPath({
  method: 'put',
  path: '/settings/{key}',
  summary: 'Update a single setting (Admin only)',
  tags: ['Settings'],
  request: {
    params: z.object({
      key: z.string().openapi({ description: 'Setting key (e.g., security.sharing.mode)' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateSettingValueRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Settings updated',
      content: {
        'application/json': {
          schema: SettingsResponseSchema,
        },
      },
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
  },
});
