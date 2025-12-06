'use client';

import { memo, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AutoFormField, type AutoFormFieldType } from '@/components/ui/auto-form-field';
import { Loader2 } from 'lucide-react';
import type { Settings } from '@/lib/api/schemas/settings';

type FieldType = 'enum' | 'boolean' | 'string';

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
  value: string | boolean;
  onChange: (value: string | boolean) => void;
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

    case 'string':
    default:
      return (
        <div className="space-y-4">
          <Label>{t(`${baseKey}.title`)}</Label>
          <AutoFormField
            type={autoFieldType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            testId={testId}
          />
          <p className="text-muted-foreground text-sm">{t(`${baseKey}.description`)}</p>
        </div>
      );
  }
});

export interface GroupCardProps {
  sectionKey: string;
  groupKey: string;
  fields: SettingField[];
  settings: Settings;
  savingKey: string | null;
  onFieldChange: (field: SettingField, value: string | boolean) => void;
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
        fields.map((field) => [field.key, (value: string | boolean) => onFieldChange(field, value)])
      ) as Record<string, (value: string | boolean) => void>,
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
