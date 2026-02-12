'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { AutoForm } from '@/components/form-inputs/auto-form';
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

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormKey((prev) => prev + 1);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleFormChange = useCallback((data: Record<string, string>, isValid: boolean) => {
    setFormData(data);
    setIsFormValid(isValid);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Parse formData through schema to apply transforms
      const parsedData = schema.parse(formData) as z.infer<TSchema>;
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
    formData,
    isFormValid,
    isSubmitting,
    schema,
    onSubmit,
    showApiError,
    showSuccess,
    showError,
    successMessageKey,
    onOpenChange,
    onSuccess,
  ]);

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
          <div className="py-4">
            <AutoForm
              key={formKey}
              schema={schema}
              translationNamespace={translationNamespace}
              testIdPrefix={testIdPrefix}
              initialData={initialData}
              dynamicOptions={dynamicOptions}
              renderOptionIcon={renderOptionIcon}
              disabled={isSubmitting}
              onChange={handleFormChange}
              asDiv
            />
          </div>
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
              disabled={!isFormValid || isSubmitting}
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
