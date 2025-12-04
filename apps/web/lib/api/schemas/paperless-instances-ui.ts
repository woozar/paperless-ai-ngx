import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// UI-enhanced schema for creating Paperless instances
export const CreatePaperlessInstanceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .meta({ inputType: 'text', labelKey: 'name' }),
  apiUrl: z.url('Invalid URL format').meta({ inputType: 'url', labelKey: 'apiUrl' }),
  apiToken: z
    .string()
    .min(1, 'API token is required')
    .meta({ inputType: 'apiKey', labelKey: 'apiToken' }),
});

// UI-enhanced schema for editing Paperless instances
export const EditPaperlessInstanceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .meta({ inputType: 'text', labelKey: 'name' }),
  apiUrl: z.url('Invalid URL format').meta({ inputType: 'url', labelKey: 'apiUrl' }),
  apiToken: z
    .union([z.string().min(1, 'API token is required'), z.literal('')])
    .optional()
    .meta({ inputType: 'apiKey', labelKey: 'apiToken' }),
});

export type CreatePaperlessInstanceFormData = z.infer<typeof CreatePaperlessInstanceFormSchema>;
export type EditPaperlessInstanceFormData = z.infer<typeof EditPaperlessInstanceFormSchema>;
