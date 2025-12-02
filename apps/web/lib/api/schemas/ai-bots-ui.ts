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
    .describe('text|name'),
  aiProviderId: z.string().min(1, 'AI Provider is required').describe('select|aiProvider'),
  systemPrompt: z.string().min(1, 'System prompt is required').describe('textarea|systemPrompt'),
});

// UI-enhanced schema for editing AI bots
export const EditAiBotFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .describe('text|name'),
  aiProviderId: z.string().min(1, 'AI Provider is required').describe('select|aiProvider'),
  systemPrompt: z.string().min(1, 'System prompt is required').describe('textarea|systemPrompt'),
});

export type CreateAiBotFormData = z.infer<typeof CreateAiBotFormSchema>;
export type EditAiBotFormData = z.infer<typeof EditAiBotFormSchema>;
