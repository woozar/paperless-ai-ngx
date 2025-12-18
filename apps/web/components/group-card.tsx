'use client';

import { memo, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AutoFormField, type AutoFormFieldType } from '@/components/form-inputs/auto-form-field';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import type { Settings } from '@/lib/api/schemas/settings';

type FieldType = 'enum' | 'boolean' | 'string' | 'number';
type SettingValue = string | boolean | number;

export interface SettingField {
  key: keyof Settings;
  section: string;
  group: string;
  name: string;
  type: FieldType;
  enumValues?: string[];
  isSecret?: boolean;
}

interface SettingControlProps {
  field: SettingField;
  value: SettingValue;
  onChange: (value: SettingValue) => void;
  disabled: boolean;
  t: ReturnType<typeof useTranslations>;
}

// Map SettingField type to AutoFormFieldType
function getAutoFieldType(field: SettingField): AutoFormFieldType {
  if (field.type === 'enum') return 'select';
  if (field.type === 'boolean') return 'switch';
  return field.isSecret ? 'apiKey' : 'text';
}

const SettingControl = memo(function SettingControl({
  field,
  value,
  onChange,
  disabled,
  t,
}: Readonly<SettingControlProps>) {
  // Convert dotted key to nested path: security.sharing.mode -> admin.settings.security.sharing.mode
  const baseKey = `admin.settings.${field.section}.${field.group}.${field.name}`;
  const autoFieldType = getAutoFieldType(field);
  const testId = `setting-${field.key}`;

  // Prepare options for enum fields
  const options = useMemo(
    () =>
      field.enumValues?.map((enumValue) => ({
        value: enumValue,
        label: t(`${baseKey}.values.${enumValue.toLowerCase()}`),
      })),
    [field.enumValues, baseKey, t]
  );

  switch (field.type) {
    case 'enum':
      return (
        <div className="space-y-4">
          <Label className="block">{t(`${baseKey}.title`)}</Label>
          <AutoFormField
            type={autoFieldType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            testId={testId}
            options={options}
          />
          <p className="text-muted-foreground text-sm">{t(`${baseKey}.description`)}</p>
        </div>
      );

    case 'boolean':
      return (
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label htmlFor={testId}>{t(`${baseKey}.title`)}</Label>
            <p className="text-muted-foreground text-sm">{t(`${baseKey}.description`)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {disabled && <Loader2 className="h-4 w-4 animate-spin" />}
            <AutoFormField
              type={autoFieldType}
              value={value}
              onChange={onChange}
              disabled={disabled}
              id={testId}
              testId={testId}
            />
          </div>
        </div>
      );

    case 'number':
      return (
        <StringSettingControl
          baseKey={baseKey}
          value={String(value)}
          onChange={(val) => onChange(Number(val))}
          disabled={disabled}
          testId={testId}
          isNumber
          t={t}
        />
      );

    case 'string':
    default:
      return (
        <StringSettingControl
          baseKey={baseKey}
          value={value as string}
          onChange={onChange as (value: string) => void}
          disabled={disabled}
          testId={testId}
          isSecret={field.isSecret}
          t={t}
        />
      );
  }
});

// Separate component for string settings that saves on blur
interface StringSettingControlProps {
  baseKey: string;
  value: string;
  onChange: (value: string) => void;
  isNumber?: boolean;
  disabled: boolean;
  testId: string;
  isSecret?: boolean;
  t: ReturnType<typeof useTranslations>;
}

const DEBOUNCE_DELAY = 2000;

function getInputType(isSecret?: boolean, isNumber?: boolean): 'password' | 'number' | 'text' {
  if (isSecret) return 'password';
  if (isNumber) return 'number';
  return 'text';
}

const StringSettingControl = memo(function StringSettingControl({
  baseKey,
  value,
  onChange,
  isNumber,
  disabled,
  testId,
  isSecret,
  t,
}: Readonly<StringSettingControlProps>) {
  const [localValue, setLocalValue] = useState(value);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if there are unsaved changes
  const hasUnsavedChanges = localValue !== value;

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const saveValue = useCallback(
    (newValue: string) => {
      // v8 ignore next -- @preserve - early return when value unchanged (defensive check)
      if (newValue === value) return;

      setIsPending(true);
      onChange(newValue);
      // Reset pending after a short delay (assumes save completes quickly)
      setTimeout(() => setIsPending(false), 500);
    },
    [value, onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounced save
      timeoutRef.current = setTimeout(() => {
        saveValue(newValue);
      }, DEBOUNCE_DELAY);
    },
    [saveValue]
  );

  const handleBlur = useCallback(() => {
    // Save immediately on blur - clear pending debounce if exists
    // v8 ignore next 3 -- @preserve - timeout may or may not exist depending on timing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    saveValue(localValue);
  }, [localValue, saveValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="block">{t(`${baseKey}.title`)}</Label>
        {hasUnsavedChanges && !isPending && (
          <span className="text-muted-foreground text-xs italic">
            {t('admin.settings.unsaved')}
          </span>
        )}
        {isPending && <Loader2 className="text-muted-foreground h-3 w-3 animate-spin" />}
      </div>
      <Input
        type={getInputType(isSecret, isNumber)}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled || isPending}
        data-testid={testId}
        autoComplete="off"
      />
      <p className="text-muted-foreground text-sm">{t(`${baseKey}.description`)}</p>
    </div>
  );
});

export interface GroupCardProps {
  sectionKey: string;
  groupKey: string;
  fields: SettingField[];
  settings: Settings;
  savingKey: string | null;
  onFieldChange: (field: SettingField, value: SettingValue) => void;
  t: ReturnType<typeof useTranslations>;
}

export const GroupCard = memo(function GroupCard({
  sectionKey,
  groupKey,
  fields,
  settings,
  savingKey,
  onFieldChange,
  t,
}: Readonly<GroupCardProps>) {
  // Create stable onChange callbacks for each field
  const fieldChangeHandlers = useMemo(
    () =>
      Object.fromEntries(
        fields.map((field) => [field.key, (value: SettingValue) => onFieldChange(field, value)])
      ) as Record<string, (value: SettingValue) => void>,
    [fields, onFieldChange]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      {/* Left column: Title and description */}
      <div className="space-y-1">
        <h3 className="text-base font-medium">
          {t(`admin.settings.${sectionKey}.${groupKey}.title`)}
        </h3>
        <p className="text-muted-foreground text-sm">
          {t(`admin.settings.${sectionKey}.${groupKey}.description`)}
        </p>
      </div>

      {/* Right column: Settings controls in a card */}
      <Card className="bg-gray-100 p-6 dark:bg-gray-800/50">
        <CardContent className="space-y-6 p-0">
          {fields.map((field) => (
            <SettingControl
              key={field.key}
              field={field}
              value={settings[field.key]}
              onChange={fieldChangeHandlers[field.key]!}
              disabled={savingKey === field.key}
              t={t}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
});
