import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { selectOptions } from './form-field-meta';

extendZodWithOpenApi(z);

// AI Provider type enum
export const AiProviderTypeSchema = z
  .enum(['openai', 'anthropic', 'ollama', 'google', 'custom'])
  .openapi('AiProviderType');

const providerOptions = selectOptions({
  openai: 'providerTypes.openai',
  anthropic: 'providerTypes.anthropic',
  ollama: 'providerTypes.ollama',
  google: 'providerTypes.google',
  custom: 'providerTypes.custom',
});

// UI-enhanced schema for creating AI providers
export const CreateAiProviderFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .meta({ inputType: 'text', labelKey: 'name' }),
  provider: AiProviderTypeSchema.default('openai').meta({
    inputType: 'select',
    labelKey: 'provider',
    options: providerOptions,
  }),
  model: z.string().min(1, 'Model is required').meta({ inputType: 'text', labelKey: 'model' }),
  apiKey: z
    .string()
    .min(1, 'API key is required')
    .meta({ inputType: 'apiKey', labelKey: 'apiKey' }),
  baseUrl: z
    .url('Invalid URL format')
    .optional()
    .meta({
      inputType: 'url',
      labelKey: 'baseUrl',
      showWhen: { field: 'provider', values: ['ollama', 'custom'] },
    }),
});

// UI-enhanced schema for editing AI providers
export const EditAiProviderFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .meta({ inputType: 'text', labelKey: 'name' }),
  provider: AiProviderTypeSchema.meta({
    inputType: 'select',
    labelKey: 'provider',
    options: providerOptions,
  }),
  model: z.string().min(1, 'Model is required').meta({ inputType: 'text', labelKey: 'model' }),
  apiKey: z
    .union([z.string().min(1, 'API key is required'), z.literal('')])
    .optional()
    .meta({ inputType: 'apiKey', labelKey: 'apiKey' }),
  baseUrl: z
    .url('Invalid URL format')
    .nullable()
    .optional()
    .meta({
      inputType: 'url',
      labelKey: 'baseUrl',
      showWhen: { field: 'provider', values: ['ollama', 'custom'] },
    }),
});

export type CreateAiProviderFormData = z.infer<typeof CreateAiProviderFormSchema>;
export type EditAiProviderFormData = z.infer<typeof EditAiProviderFormSchema>;
