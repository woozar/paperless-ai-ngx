import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Helper schema for currency input that handles comma as decimal separator
const currencyInputSchema = z
  .string()
  .transform((val) => {
    if (!val || val.trim() === '') return null;
    // Replace comma with dot for decimal parsing
    const normalized = val.replace(',', '.');
    const num = Number.parseFloat(normalized);
    return Number.isNaN(num) ? null : num;
  })
  .pipe(z.number().positive().nullable());

// Base schema for AI model forms (both create and edit use the same fields)
const AiModelFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .meta({ inputType: 'text', labelKey: 'name' }),
  modelIdentifier: z
    .string()
    .min(1, 'Model identifier is required')
    .meta({ inputType: 'text', labelKey: 'modelIdentifier' }),
  aiAccountId: z
    .string()
    .min(1, 'AI Account is required')
    .meta({ inputType: 'select', labelKey: 'aiAccount' }),
  inputTokenPrice: currencyInputSchema.meta({ inputType: 'currency', labelKey: 'inputTokenPrice' }),
  outputTokenPrice: currencyInputSchema.meta({
    inputType: 'currency',
    labelKey: 'outputTokenPrice',
  }),
});

// UI-enhanced schema for creating AI models
export const CreateAiModelFormSchema = AiModelFormSchema;

// UI-enhanced schema for editing AI models
export const EditAiModelFormSchema = AiModelFormSchema;

export type CreateAiModelFormData = z.infer<typeof CreateAiModelFormSchema>;
export type EditAiModelFormData = z.infer<typeof EditAiModelFormSchema>;

// Setup wizard schema (without aiAccountId - it's set by the wizard)
export const SetupAiModelFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .meta({ inputType: 'text', labelKey: 'name' }),
  modelIdentifier: z
    .string()
    .min(1, 'Model identifier is required')
    .meta({ inputType: 'text', labelKey: 'modelIdentifier' }),
  inputTokenPrice: currencyInputSchema.meta({ inputType: 'currency', labelKey: 'inputTokenPrice' }),
  outputTokenPrice: currencyInputSchema.meta({
    inputType: 'currency',
    labelKey: 'outputTokenPrice',
  }),
});

export type SetupAiModelFormData = z.infer<typeof SetupAiModelFormSchema>;
