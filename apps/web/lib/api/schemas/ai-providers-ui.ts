import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// AI Provider type enum
export const AiProviderTypeSchema = z
  .enum(['openai', 'anthropic', 'ollama', 'google', 'custom'])
  .openapi('AiProviderType');

// UI-enhanced schema for creating AI providers
export const CreateAiProviderFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .describe('text|name'),
  provider: AiProviderTypeSchema.default('openai').describe(
    'select|provider|openai:providerTypes.openai|anthropic:providerTypes.anthropic|ollama:providerTypes.ollama|google:providerTypes.google|custom:providerTypes.custom'
  ),
  model: z.string().min(1, 'Model is required').describe('text|model'),
  apiKey: z.string().min(1, 'API key is required').describe('apiKey|apiKey'),
  baseUrl: z
    .url('Invalid URL format')
    .optional()
    .describe('url|baseUrl|showWhen:provider:ollama,custom'),
});

// UI-enhanced schema for editing AI providers
export const EditAiProviderFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .describe('text|name'),
  provider: AiProviderTypeSchema.describe(
    'select|provider|openai:providerTypes.openai|anthropic:providerTypes.anthropic|ollama:providerTypes.ollama|google:providerTypes.google|custom:providerTypes.custom'
  ),
  model: z.string().min(1, 'Model is required').describe('text|model'),
  apiKey: z
    .union([z.string().min(1, 'API key is required'), z.literal('')])
    .optional()
    .describe('apiKey|apiKey'),
  baseUrl: z
    .url('Invalid URL format')
    .nullable()
    .optional()
    .describe('url|baseUrl|showWhen:provider:ollama,custom'),
});

export type CreateAiProviderFormData = z.infer<typeof CreateAiProviderFormSchema>;
export type EditAiProviderFormData = z.infer<typeof EditAiProviderFormSchema>;
