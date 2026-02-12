import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { registerCrudPaths, createNameSchema, createOptionalNameSchema } from './crud-helpers';

extendZodWithOpenApi(z);

// AiProvider type enum (kept as AiProviderType for API compatibility)
export const AiProviderTypeSchema = z
  .enum(['openai', 'anthropic', 'ollama', 'google', 'custom'])
  .openapi('AiProviderType');

// AiAccount in list (apiKey always masked)
export const AiAccountListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    provider: AiProviderTypeSchema,
    apiKey: z.string(), // Always "***" in responses
    baseUrl: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi('AiAccountListItem');

// Helper to transform empty string to undefined for optional URL fields
const optionalUrlSchema = z
  .string()
  .optional()
  .transform((val) => (val === '' ? undefined : val))
  .pipe(z.url('Invalid URL format').optional());

// Create AiAccount request
export const CreateAiAccountRequestSchema = z
  .object({
    name: createNameSchema(),
    provider: AiProviderTypeSchema,
    apiKey: z.string().min(1, 'API key is required'),
    baseUrl: optionalUrlSchema,
  })
  .refine(
    (data) => {
      // baseUrl is required for ollama and custom providers
      if (data.provider === 'ollama' || data.provider === 'custom') {
        return !!data.baseUrl;
      }
      return true;
    },
    {
      message: 'Base URL is required for ollama and custom providers',
      path: ['baseUrl'],
    }
  )
  .openapi('CreateAiAccountRequest');

// Update AiAccount request (partial)
export const UpdateAiAccountRequestSchema = z
  .object({
    name: createOptionalNameSchema(),
    provider: AiProviderTypeSchema.optional(),
    apiKey: z.string().min(1).optional(), // If empty, keep existing
    baseUrl: z.url('Invalid URL format').nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .openapi('UpdateAiAccountRequest');

// Register schemas
registry.register('AiProviderType', AiProviderTypeSchema);
registry.register('AiAccountListItem', AiAccountListItemSchema);
registry.register('CreateAiAccountRequest', CreateAiAccountRequestSchema);
registry.register('UpdateAiAccountRequest', UpdateAiAccountRequestSchema);

// Register all CRUD paths using helper
registerCrudPaths({
  resourceName: 'AiAccount',
  resourcePath: '/ai-accounts',
  tag: 'AiAccounts',
  listItemSchema: AiAccountListItemSchema,
  createRequestSchema: CreateAiAccountRequestSchema,
  updateRequestSchema: UpdateAiAccountRequestSchema,
});
