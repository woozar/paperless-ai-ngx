'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AutoFormField, type AutoFormFieldType } from '@/components/form-inputs/auto-form-field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Loader2 } from 'lucide-react';
import { validatePassword } from '@/lib/utilities/password-validation';
import {
  type FieldInputType,
  type SelectOption,
  getFieldMeta,
} from '@/lib/api/schemas/form-field-meta';

type AutoFormDialogProps<TSchema extends z.ZodObject<z.ZodRawShape>> = Readonly<{
  /** Dialog open state */
  open: boolean;
  /** Dialog open state change handler */
  onOpenChange: (open: boolean) => void;
  /** Zod schema with metadata in .describe() */
  schema: TSchema;
  /** Title translation key */
  titleKey: string;
  /** Description translation key (optional) */
  descriptionKey?: string;
  /** Description text (overrides descriptionKey if provided) */
  description?: string;
  /** Translation namespace */
  translationNamespace: string;
  /** Success message translation key */
  successMessageKey: string;
  /** Submit button translation key */
  submitButtonKey: string;
  /** API submit function */
  onSubmit: (data: z.infer<TSchema>) => Promise<{
    data?: unknown;
    error?: { message: string; params?: Record<string, string | number> };
  }>;
  /** Success callback */
  onSuccess: () => void;
  /** Test ID prefix for form elements */
  testIdPrefix?: string;
  /** Initial form data (for edit mode) */
  initialData?: Partial<z.infer<TSchema>>;
  /** Dynamic options for select fields */
  dynamicOptions?: Record<string, Array<{ value: string; label: string }>>;
  /** Render icon for select option (fieldName, optionValue) => ReactNode */
  renderOptionIcon?: (fieldName: string, optionValue: string) => React.ReactNode;
}>;

type FieldMetadata = {
  name: string;
  type: FieldInputType;
  labelKey: string;
  options?: SelectOption[];
  hasCustomValidation?: boolean;
  defaultValue?: string;
  showWhen?: { field: string; values: string[] };
};

function extractDefaultValue(field: z.ZodTypeAny): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const zodDef = (field as any)._def as { defaultValue?: (() => string) | string } | undefined;
  if (zodDef?.defaultValue === undefined) return undefined;
  /* v8 ignore next -- @preserve */
  return typeof zodDef.defaultValue === 'function' ? zodDef.defaultValue() : zodDef.defaultValue;
}

function extractFieldMetadata(key: string, field: z.ZodTypeAny): FieldMetadata {
  const meta = getFieldMeta(field);

  // Default to text input if no metadata
  if (!meta) {
    return {
      name: key,
      type: 'text',
      labelKey: key,
      defaultValue: extractDefaultValue(field),
    };
  }

  return {
    name: key,
    type: meta.inputType,
    labelKey: meta.labelKey,
    options: meta.options,
    hasCustomValidation: meta.validate,
    defaultValue: extractDefaultValue(field),
    showWhen: meta.showWhen,
  };
}

/**
 * Auto-form dialog that extracts all metadata from Zod schema .meta() fields.
 *
 * Examples:
 * - .meta({ inputType: 'text', labelKey: 'name' }) - Simple text field
 * - .meta({ inputType: 'select', labelKey: 'role', options: [{ value: 'DEFAULT', labelKey: 'default' }] }) - Select with options
 * - .meta({ inputType: 'password', labelKey: 'password', validate: true }) - Password field with custom validation
 * - .meta({ inputType: 'url', labelKey: 'baseUrl', showWhen: { field: 'provider', values: ['ollama', 'custom'] } }) - Conditional field
 */
export function AutoFormDialog<TSchema extends z.ZodObject<z.ZodRawShape>>({
  open,
  onOpenChange,
  schema,
  titleKey,
  descriptionKey,
  description,
  translationNamespace,
  successMessageKey,
  submitButtonKey,
  onSubmit,
  onSuccess,
  testIdPrefix = 'form',
  initialData = {},
  dynamicOptions = {},
  renderOptionIcon,
}: AutoFormDialogProps<TSchema>) {
  const t = useTranslations(translationNamespace);
  const tCommon = useTranslations('common');
  const { showApiError, showSuccess, showError } = useErrorDisplay(translationNamespace);

  // Extract field metadata from schema
  const fields = useMemo(() => {
    const schemaShape = schema.shape as Record<string, z.ZodTypeAny>;
    return Object.entries(schemaShape).map(([key, field]) => extractFieldMetadata(key, field));
  }, [schema]);

  // Initialize form data with defaults and initialData
  const [formData, setFormData] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((field) => [
        field.name,
        String(initialData[field.name] ?? field.defaultValue ?? ''),
      ])
    )
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData(
        Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? '']))
      );
      setIsSubmitting(false);
    }
  }, [open, fields]);

  const updateField = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Filter visible fields based on showWhen conditions (same as isFormValid)
      const visibleFields = fields.filter((field) => {
        if (!field.showWhen) return true;
        const dependentValue = formData[field.showWhen.field];
        return dependentValue && field.showWhen.values.includes(dependentValue);
      });

      const visibleFormData = Object.fromEntries(
        Object.entries(formData).filter(([key]) =>
          visibleFields.some((field) => field.name === key)
        )
      );

      // Parse formData through schema to apply transforms (e.g., string -> number for currency)
      const parsedData = schema.parse(visibleFormData) as z.infer<TSchema>;
      const response = await onSubmit(parsedData);

      if (response.error) {
        showApiError(response.error);
      } else {
        showSuccess(successMessageKey);
        onOpenChange(false);
        onSuccess();
      }
    } catch {
      showError('createFailed');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    fields,
    formData,
    schema,
    onSubmit,
    showApiError,
    showSuccess,
    showError,
    successMessageKey,
    onOpenChange,
    onSuccess,
  ]);

  // Validate form
  const isFormValid = useMemo(() => {
    if (isSubmitting) return false;

    // Filter visible fields based on showWhen conditions
    const visibleFields = fields.filter((field) => {
      if (!field.showWhen) return true;
      const dependentValue = formData[field.showWhen.field];
      return dependentValue && field.showWhen.values.includes(dependentValue);
    });

    // Password validation for visible fields only
    const passwordField = visibleFields.find((f) => f.type === 'password' && f.hasCustomValidation);
    if (passwordField) {
      const passwordValue = formData[passwordField.name];
      // Skip validation for empty optional password fields
      if (passwordValue) {
        const validation = validatePassword(passwordValue);
        if (!validation.isValid) return false;
      }
    }

    const validationData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => visibleFields.some((field) => field.name === key))
    );

    // Zod schema validation (safeParse to handle optional fields)
    try {
      schema.parse(validationData);
      return true;
    } catch {
      return false;
    }
  }, [formData, isSubmitting, schema, fields]);

  // Render field based on metadata
  const renderField = useCallback(
    (field: FieldMetadata) => {
      // Check if field should be shown based on showWhen condition
      if (field.showWhen) {
        const dependentValue = formData[field.showWhen.field];
        if (!dependentValue || !field.showWhen.values.includes(dependentValue)) {
          return null;
        }
      }

      const value = formData[field.name]!;
      const label = t(field.labelKey);
      const id = `${testIdPrefix}-${field.name}`;
      const testId = `${testIdPrefix}-${field.name}-input`;

      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={id}>{label}</Label>
          <AutoFormField
            type={field.type as AutoFormFieldType}
            value={value}
            onChange={(val) => updateField(field.name, val as string)}
            id={id}
            testId={testId}
            disabled={isSubmitting}
            options={(
              dynamicOptions[field.name] ??
              (field.options ?? []).map((opt) => ({ value: opt.value, label: t(opt.labelKey) }))
            ).map((opt) => ({
              ...opt,
              icon: renderOptionIcon?.(field.name, opt.value),
            }))}
            showPasswordRules={field.hasCustomValidation}
          />
        </div>
      );
    },
    [formData, isSubmitting, t, testIdPrefix, updateField, dynamicOptions, renderOptionIcon]
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={/* v8 ignore next -- @preserve */ (e) => e.preventDefault()}
      >
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle>{t(titleKey)}</DialogTitle>
            <DialogDescription>
              {description || (descriptionKey ? t(descriptionKey) : t(titleKey))}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">{fields.map(renderField)}</div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              data-testid={`${testIdPrefix}-cancel-button`}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              data-testid={`${testIdPrefix}-submit-button`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tCommon('loading')}
                </>
              ) : (
                tCommon(submitButtonKey)
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
