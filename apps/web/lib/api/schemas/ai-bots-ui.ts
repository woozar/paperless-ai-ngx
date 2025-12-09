import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { selectOptions } from './form-field-meta';

extendZodWithOpenApi(z);

// Response language options
const responseLanguageOptions = ['DOCUMENT', 'GERMAN', 'ENGLISH'] as const;
const responseLanguageSelectOptions = selectOptions({
  DOCUMENT: 'responseLanguageOptions.DOCUMENT',
  GERMAN: 'responseLanguageOptions.GERMAN',
  ENGLISH: 'responseLanguageOptions.ENGLISH',
});

// Base fields shared between create and edit
const baseAiBotFields = {
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
};

// UI-enhanced schema for creating AI bots
export const CreateAiBotFormSchema = z.object({
  ...baseAiBotFields,
  responseLanguage: z
    .enum(responseLanguageOptions)
    .default('DOCUMENT')
    .meta({
      inputType: 'select',
      labelKey: 'responseLanguage',
      options: responseLanguageSelectOptions,
    }),
});

// UI-enhanced schema for editing AI bots
export const EditAiBotFormSchema = z.object({
  ...baseAiBotFields,
  responseLanguage: z
    .enum(responseLanguageOptions)
    .meta({
      inputType: 'select',
      labelKey: 'responseLanguage',
      options: responseLanguageSelectOptions,
    }),
});

export type CreateAiBotFormData = z.infer<typeof CreateAiBotFormSchema>;
export type EditAiBotFormData = z.infer<typeof EditAiBotFormSchema>;
