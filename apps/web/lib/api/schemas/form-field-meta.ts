import { z } from 'zod';

/**
 * Field input types supported by AutoFormDialog
 */
export type FieldInputType = 'text' | 'password' | 'apiKey' | 'url' | 'select' | 'textarea';

/**
 * Option for select fields with static options
 */
export type SelectOption = {
  value: string;
  labelKey: string;
};

/**
 * Condition for showing a field based on another field's value
 */
export type ShowWhenCondition = {
  field: string;
  values: string[];
};

/**
 * Metadata for form fields, used with .meta() on Zod schemas
 */
export type FormFieldMeta = {
  /** Input type for the field */
  inputType: FieldInputType;
  /** Translation key for the field label */
  labelKey: string;
  /** For select fields: static options with value and translation key */
  options?: SelectOption[];
  /** Whether to apply custom validation (e.g., password rules) */
  validate?: boolean;
  /** Condition for conditionally showing this field */
  showWhen?: ShowWhenCondition;
};

/**
 * Helper to create select options from an object
 * @example selectOptions({ DEFAULT: 'default', ADMIN: 'admin' })
 */
export function selectOptions(options: Record<string, string>): SelectOption[] {
  return Object.entries(options).map(([value, labelKey]) => ({ value, labelKey }));
}

/**
 * Extract form field metadata from a Zod schema field
 */
export function getFieldMeta(field: z.ZodTypeAny): FormFieldMeta | undefined {
  // .meta() is a method in Zod that returns the metadata object
  const meta = field.meta() as FormFieldMeta | undefined;
  return meta;
}
