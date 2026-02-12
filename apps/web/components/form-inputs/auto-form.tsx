'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { AutoFormField, type AutoFormFieldType } from '@/components/form-inputs/auto-form-field';
import { validatePassword } from '@/lib/utilities/password-validation';
import {
  type FieldInputType,
  type SelectOption,
  getFieldMeta,
} from '@/lib/api/schemas/form-field-meta';

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

export type AutoFormProps<TSchema extends z.ZodObject<z.ZodRawShape>> = Readonly<{
  /** Zod schema with metadata in .meta() */
  schema: TSchema;
  /** Translation namespace for field labels */
  translationNamespace: string;
  /** Test ID prefix for form elements */
  testIdPrefix?: string;
  /** Initial form data */
  initialData?: Partial<z.infer<TSchema>>;
  /** Dynamic options for select fields */
  dynamicOptions?: Record<string, Array<{ value: string; label: string }>>;
  /** Render icon for select option (fieldName, optionValue) => ReactNode */
  renderOptionIcon?: (fieldName: string, optionValue: string) => React.ReactNode;
  /** Whether form fields are disabled */
  disabled?: boolean;
  /** Called when form data changes */
  onChange?: (data: Record<string, string>, isValid: boolean) => void;
  /** Called when form is submitted (via Enter key) */
  onSubmit?: (data: z.infer<TSchema>) => void;
  /** Render custom content after a specific field */
  renderAfterField?: (fieldName: string) => React.ReactNode;
  /** Control form state externally (for resume logic) */
  externalData?: Record<string, string>;
  /** Whether to render as a div instead of form (use when nested in another form) */
  asDiv?: boolean;
}>;

export type AutoFormHandle<TSchema extends z.ZodObject<z.ZodRawShape>> = {
  formData: Record<string, string>;
  isValid: boolean;
  getParsedData: () => z.infer<TSchema>;
  reset: () => void;
};

/**
 * Auto-form component that renders form fields based on a Zod schema.
 * Does NOT include buttons - those should be provided by the parent component.
 *
 * Features:
 * - Extracts field metadata from Zod schema .meta() fields
 * - Manages form state internally
 * - Validates form data against schema
 * - Supports conditional fields (showWhen)
 * - Supports dynamic select options
 * - Supports custom icons for select options
 */
export function AutoForm<TSchema extends z.ZodObject<z.ZodRawShape>>({
  schema,
  translationNamespace,
  testIdPrefix = 'form',
  initialData = {},
  dynamicOptions = {},
  renderOptionIcon,
  disabled = false,
  onChange,
  onSubmit,
  renderAfterField,
  externalData,
  asDiv = false,
}: AutoFormProps<TSchema>) {
  const t = useTranslations(translationNamespace);

  // Extract field metadata from schema
  const fields = useMemo(() => {
    const schemaShape = schema.shape as Record<string, z.ZodTypeAny>;
    return Object.entries(schemaShape).map(([key, field]) => extractFieldMetadata(key, field));
  }, [schema]);

  // Initialize form data with defaults and initialData
  const [internalFormData, setInternalFormData] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((field) => [
        field.name,
        String(initialData[field.name] ?? field.defaultValue ?? ''),
      ])
    )
  );

  // Use external data if provided, otherwise use internal state
  const formData = externalData ?? internalFormData;
  const setFormData = externalData
    ? // When using external data, call onChange instead of setting internal state
      (updater: (prev: Record<string, string>) => Record<string, string>) => {
        const newData = updater(formData);
        onChange?.(newData, isFormValidForData(newData));
      }
    : setInternalFormData;

  // Validate form for given data
  const isFormValidForData = useCallback(
    (data: Record<string, string>) => {
      // Filter visible fields based on showWhen conditions
      const visibleFields = fields.filter((field) => {
        if (!field.showWhen) return true;
        const dependentValue = data[field.showWhen.field];
        return dependentValue && field.showWhen.values.includes(dependentValue);
      });

      // Password validation for visible fields only
      const passwordField = visibleFields.find(
        (f) => f.type === 'password' && f.hasCustomValidation
      );
      if (passwordField) {
        const passwordValue = data[passwordField.name];
        if (passwordValue) {
          const validation = validatePassword(passwordValue);
          if (!validation.isValid) return false;
        }
      }

      const validationData = Object.fromEntries(
        Object.entries(data).filter(([key]) => visibleFields.some((field) => field.name === key))
      );

      try {
        schema.parse(validationData);
        return true;
      } catch {
        return false;
      }
    },
    [fields, schema]
  );

  // Validate current form data
  const isFormValid = useMemo(() => isFormValidForData(formData), [formData, isFormValidForData]);

  // Notify parent of initial state (only once on mount)
  useEffect(() => {
    if (!externalData) {
      onChange?.(formData, isFormValid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run on mount
  }, []);

  const updateField = useCallback(
    (name: string, value: string) => {
      const newFormData = { ...formData, [name]: value };
      setFormData(() => newFormData);
      // Notify parent of changes immediately
      if (!externalData) {
        onChange?.(newFormData, isFormValidForData(newFormData));
      }
    },
    [formData, setFormData, externalData, onChange, isFormValidForData]
  );

  // Get parsed data for submission
  const getParsedData = useCallback(() => {
    const visibleFields = fields.filter((field) => {
      if (!field.showWhen) return true;
      const dependentValue = formData[field.showWhen.field];
      return dependentValue && field.showWhen.values.includes(dependentValue);
    });

    const visibleFormData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => visibleFields.some((field) => field.name === key))
    );

    return schema.parse(visibleFormData) as z.infer<TSchema>;
  }, [fields, formData, schema]);

  // Handle form submit (Enter key)
  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isFormValid && onSubmit) {
        onSubmit(getParsedData());
      }
    },
    [isFormValid, onSubmit, getParsedData]
  );

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

      const value = formData[field.name] ?? '';
      const label = t(field.labelKey);
      const id = `${testIdPrefix}-${field.name}`;
      const testId = `${testIdPrefix}-${field.name}-input`;

      return (
        <div key={field.name}>
          <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <AutoFormField
              type={field.type as AutoFormFieldType}
              value={value}
              onChange={(val) => updateField(field.name, val as string)}
              id={id}
              testId={testId}
              disabled={disabled}
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
          {renderAfterField?.(field.name)}
        </div>
      );
    },
    [
      formData,
      disabled,
      t,
      testIdPrefix,
      updateField,
      dynamicOptions,
      renderOptionIcon,
      renderAfterField,
    ]
  );

  const content = <div className="space-y-4">{fields.map(renderField)}</div>;

  if (asDiv) {
    return content;
  }

  return <form onSubmit={handleFormSubmit}>{content}</form>;
}

// Export hook for getting form state
export function useAutoForm<TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema,
  initialData: Partial<z.infer<TSchema>> = {}
): {
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isValid: boolean;
  getParsedData: () => z.infer<TSchema>;
} {
  const fields = useMemo(() => {
    const schemaShape = schema.shape as Record<string, z.ZodTypeAny>;
    return Object.entries(schemaShape).map(([key, field]) => extractFieldMetadata(key, field));
  }, [schema]);

  const [formData, setFormData] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((field) => [
        field.name,
        String(initialData[field.name] ?? field.defaultValue ?? ''),
      ])
    )
  );

  const isValid = useMemo(() => {
    const visibleFields = fields.filter((field) => {
      if (!field.showWhen) return true;
      const dependentValue = formData[field.showWhen.field];
      return dependentValue && field.showWhen.values.includes(dependentValue);
    });

    const passwordField = visibleFields.find((f) => f.type === 'password' && f.hasCustomValidation);
    if (passwordField) {
      const passwordValue = formData[passwordField.name];
      if (passwordValue) {
        const validation = validatePassword(passwordValue);
        if (!validation.isValid) return false;
      }
    }

    const validationData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => visibleFields.some((field) => field.name === key))
    );

    try {
      schema.parse(validationData);
      return true;
    } catch {
      return false;
    }
  }, [formData, fields, schema]);

  const getParsedData = useCallback(() => {
    const visibleFields = fields.filter((field) => {
      if (!field.showWhen) return true;
      const dependentValue = formData[field.showWhen.field];
      return dependentValue && field.showWhen.values.includes(dependentValue);
    });

    const visibleFormData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => visibleFields.some((field) => field.name === key))
    );

    return schema.parse(visibleFormData) as z.infer<TSchema>;
  }, [fields, formData, schema]);

  return { formData, setFormData, isValid, getParsedData };
}
