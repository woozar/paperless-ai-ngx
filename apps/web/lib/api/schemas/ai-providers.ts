import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { registerCrudPaths, createNameSchema, createOptionalNameSchema } from './crud-helpers';

extendZodWithOpenApi(z);

// AiProvider enum
export const AiProviderTypeSchema = z
  .enum(['openai', 'anthropic', 'ollama', 'google', 'custom'])
  .openapi('AiProviderType');

// AiProvider in list (apiKey always masked)
export const AiProviderListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    provider: AiProviderTypeSchema,
    model: z.string(),
    apiKey: z.string(), // Always "***" in responses
    baseUrl: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi('AiProviderListItem');

// AiProvider list response
export const AiProviderListResponseSchema = z
  .object({
    providers: z.array(AiProviderListItemSchema),
    total: z.number(),
  })
  .openapi('AiProviderListResponse');

// Create AiProvider request
export const CreateAiProviderRequestSchema = z
  .object({
    name: createNameSchema(),
    provider: AiProviderTypeSchema,
    model: z.string().min(1, 'Model is required'),
    apiKey: z.string().min(1, 'API key is required'),
    baseUrl: z.url('Invalid URL format').optional(),
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
  .openapi('CreateAiProviderRequest');

// Update AiProvider request (partial)
export const UpdateAiProviderRequestSchema = z
  .object({
    name: createOptionalNameSchema(),
    provider: AiProviderTypeSchema.optional(),
    model: z.string().min(1).optional(),
    apiKey: z.string().min(1).optional(), // If empty, keep existing
    baseUrl: z.url('Invalid URL format').nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .openapi('UpdateAiProviderRequest');

// Register schemas
registry.register('AiProviderType', AiProviderTypeSchema);
registry.register('AiProviderListItem', AiProviderListItemSchema);
registry.register('AiProviderListResponse', AiProviderListResponseSchema);
registry.register('CreateAiProviderRequest', CreateAiProviderRequestSchema);
registry.register('UpdateAiProviderRequest', UpdateAiProviderRequestSchema);

// Register all CRUD paths using helper
registerCrudPaths({
  resourceName: 'AiProvider',
  resourcePath: '/ai-providers',
  tag: 'AiProviders',
  listItemSchema: AiProviderListItemSchema,
  listResponseSchema: AiProviderListResponseSchema,
  createRequestSchema: CreateAiProviderRequestSchema,
  updateRequestSchema: UpdateAiProviderRequestSchema,
});
