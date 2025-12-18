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

// Document mode options
const documentModeOptions = ['text', 'pdf'] as const;
const documentModeSelectOptions = selectOptions({
  text: 'documentModeOptions.text',
  pdf: 'documentModeOptions.pdf',
});

// Optional number field that treats empty string as null
const optionalNumberSchema = z.preprocess(
  (val) => (val === '' || val === undefined || val === null ? null : val),
  z.coerce.number().min(1).max(100).nullable()
);

// Base fields shared between create and edit
const baseAiBotFields = {
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .meta({ inputType: 'text', labelKey: 'name' }),
  aiModelId: z
    .string()
    .min(1, 'AI Model is required')
    .meta({ inputType: 'select', labelKey: 'aiModel' }),
  systemPrompt: z
    .string()
    .min(1, 'System prompt is required')
    .meta({ inputType: 'textarea', labelKey: 'systemPrompt' }),
};

// UI-enhanced schema for creating AI bots
export const CreateAiBotFormSchema = z.object({
  ...baseAiBotFields,
  responseLanguage: z.enum(responseLanguageOptions).default('DOCUMENT').meta({
    inputType: 'select',
    labelKey: 'responseLanguage',
    options: responseLanguageSelectOptions,
  }),
  documentMode: z.enum(documentModeOptions).default('text').meta({
    inputType: 'select',
    labelKey: 'documentMode',
    options: documentModeSelectOptions,
  }),
  pdfMaxSizeMb: optionalNumberSchema.meta({
    inputType: 'number',
    labelKey: 'pdfMaxSizeMb',
    showWhen: { field: 'documentMode', values: ['pdf'] },
  }),
});

// UI-enhanced schema for editing AI bots
export const EditAiBotFormSchema = z.object({
  ...baseAiBotFields,
  responseLanguage: z.enum(responseLanguageOptions).meta({
    inputType: 'select',
    labelKey: 'responseLanguage',
    options: responseLanguageSelectOptions,
  }),
  documentMode: z.enum(documentModeOptions).meta({
    inputType: 'select',
    labelKey: 'documentMode',
    options: documentModeSelectOptions,
  }),
  pdfMaxSizeMb: optionalNumberSchema.meta({
    inputType: 'number',
    labelKey: 'pdfMaxSizeMb',
    showWhen: { field: 'documentMode', values: ['pdf'] },
  }),
});

export type CreateAiBotFormData = z.infer<typeof CreateAiBotFormSchema>;
export type EditAiBotFormData = z.infer<typeof EditAiBotFormSchema>;
