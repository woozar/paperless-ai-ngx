'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { ApiKeyInput } from '@/components/ui/api-key-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
}>;

type FieldType = 'text' | 'password' | 'apiKey' | 'url' | 'select' | 'textarea';

type StaticSelectOption = { value: string; labelKey: string };

type FieldMetadata = {
  name: string;
  type: FieldType;
  labelKey: string;
  options?: StaticSelectOption[];
  hasCustomValidation?: boolean;
  defaultValue?: string;
  showWhen?: { field: string; values: string[] };
};

const VALID_FIELD_TYPES: Set<FieldType> = new Set([
  'text',
  'password',
  'apiKey',
  'url',
  'select',
  'textarea',
]);

function parseFieldType(typeStr: string): FieldType {
  return VALID_FIELD_TYPES.has(typeStr as FieldType) ? (typeStr as FieldType) : 'text';
}

function parseSelectOptions(parts: string[]): StaticSelectOption[] {
  return parts
    .slice(2)
    .filter((opt) => !opt.startsWith('showWhen:'))
    .map((opt) => {
      const colonIndex = opt.indexOf(':');
      if (colonIndex === -1) return { value: opt, labelKey: opt };
      return {
        value: opt.substring(0, colonIndex),
        labelKey: opt.substring(colonIndex + 1),
      };
    });
}

function parseShowWhen(parts: string[]): FieldMetadata['showWhen'] {
  const showWhenPart = parts.find((p) => p.startsWith('showWhen:'));
  if (!showWhenPart) return undefined;

  const condition = showWhenPart.substring('showWhen:'.length);
  const colonIndex = condition.indexOf(':');
  if (colonIndex === -1) return undefined;

  return {
    field: condition.substring(0, colonIndex),
    values: condition
      .substring(colonIndex + 1)
      .split(',')
      .map((val) => val.trim()),
  };
}

function extractDefaultValue(field: z.ZodTypeAny): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const zodDef = (field as any)._def as { defaultValue?: (() => string) | string } | undefined;
  if (zodDef?.defaultValue === undefined) return undefined;
  /* v8 ignore next -- @preserve */
  return typeof zodDef.defaultValue === 'function' ? zodDef.defaultValue() : zodDef.defaultValue;
}

function extractFieldMetadata(key: string, field: z.ZodTypeAny): FieldMetadata {
  const description = field.description ?? '';
  const parts = description.split('|');
  const fieldType = parseFieldType(parts[0]!);

  return {
    name: key,
    type: fieldType,
    labelKey: parts[1] ?? key,
    options: fieldType === 'select' && parts.length > 2 ? parseSelectOptions(parts) : undefined,
    hasCustomValidation: parts.includes('validate') || undefined,
    defaultValue: extractDefaultValue(field),
    showWhen: parseShowWhen(parts),
  };
}

/**
 * Auto-form dialog that extracts all metadata from Zod schema .describe() fields.
 * Format: "type|labelKey|option1:label1|option2:label2|showWhen:field:value1,value2"
 *
 * Examples:
 * - text|name - Simple text field
 * - select|role|DEFAULT:default|ADMIN:admin - Select with options
 * - password|password|validate - Password field with custom validation
 * - url|baseUrl|showWhen:provider:ollama,custom - Conditional field that only shows when provider is ollama or custom
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
      const response = await onSubmit(formData as z.infer<TSchema>);

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
    formData,
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

      const value = formData[field.name];
      const label = t(field.labelKey);
      const id = `${testIdPrefix}-${field.name}`;
      const testId = `${testIdPrefix}-${field.name}-input`;

      switch (field.type) {
        case 'password':
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={id}>{label}</Label>
              <PasswordInput
                id={id}
                data-testid={testId}
                value={value}
                onChange={(e) => updateField(field.name, e.target.value)}
                disabled={isSubmitting}
                showRules={field.hasCustomValidation}
                autoComplete="off"
              />
            </div>
          );

        case 'apiKey':
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={id}>{label}</Label>
              <ApiKeyInput
                id={id}
                data-testid={testId}
                value={value}
                onChange={(e) => updateField(field.name, e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
              />
            </div>
          );

        case 'select': {
          // Use dynamic options if available, otherwise use static options from schema
          const dynamicOpts = dynamicOptions[field.name];
          const staticOpts = field.options ?? [];

          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={id}>{label}</Label>
              <Select
                value={value}
                onValueChange={(val) => updateField(field.name, val)}
                disabled={isSubmitting}
              >
                <SelectTrigger id={id} data-testid={testId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dynamicOpts
                    ? dynamicOpts.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    : staticOpts.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        case 'textarea':
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={id}>{label}</Label>
              <Textarea
                id={id}
                data-testid={testId}
                value={value}
                onChange={(e) => updateField(field.name, e.target.value)}
                disabled={isSubmitting}
                rows={5}
              />
            </div>
          );

        case 'url':
        case 'text':
        default:
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                data-testid={testId}
                type={field.type === 'url' ? 'url' : 'text'}
                value={value}
                onChange={(e) => updateField(field.name, e.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>
          );
      }
    },
    [formData, isSubmitting, t, testIdPrefix, updateField, dynamicOptions]
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
