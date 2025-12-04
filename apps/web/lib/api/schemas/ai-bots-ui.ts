import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// UI-enhanced schema for creating AI bots
export const CreateAiBotFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .meta({ inputType: 'text', labelKey: 'name' }),
  aiProviderId: z
    .string()
    .min(1, 'AI Provider is required')
    .meta({ inputType: 'select', labelKey: 'aiProvider' }),
  systemPrompt: z
    .string()
    .min(1, 'System prompt is required')
    .meta({ inputType: 'textarea', labelKey: 'systemPrompt' }),
});

// UI-enhanced schema for editing AI bots
export const EditAiBotFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .meta({ inputType: 'text', labelKey: 'name' }),
  aiProviderId: z
    .string()
    .min(1, 'AI Provider is required')
    .meta({ inputType: 'select', labelKey: 'aiProvider' }),
  systemPrompt: z
    .string()
    .min(1, 'System prompt is required')
    .meta({ inputType: 'textarea', labelKey: 'systemPrompt' }),
});

export type CreateAiBotFormData = z.infer<typeof CreateAiBotFormSchema>;
export type EditAiBotFormData = z.infer<typeof EditAiBotFormSchema>;
