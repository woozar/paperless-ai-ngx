'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AutoFormField, type AutoFormFieldType } from '@/components/ui/auto-form-field';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { SettingsSchema, type Settings } from '@/lib/api/schemas/settings';
import { useSettings } from './settings-provider';
import { toast } from 'sonner';
import { useState, useMemo, useCallback } from 'react';
import { z } from 'zod';

type FieldType = 'enum' | 'boolean' | 'string';

interface FieldMeta {
  inputType?: 'secret';
}

interface SettingField {
  key: keyof Settings;
  section: string;
  group: string;
  name: string;
  type: FieldType;
  enumValues?: string[];
  isSecret?: boolean;
}

interface ParsedKey {
  section: string;
  group: string;
  name: string;
}

// Parse setting key in "section.group.name" format
function parseSettingKey(key: string): ParsedKey | null {
  const parts = key.split('.');
  if (parts.length !== 3) return null;

  const [section, group, name] = parts;
  if (!section || !group || !name) return null;

  return { section, group, name };
}

// Unwrap Zod schema wrappers (ZodDefault)
// Note: Modern zod-to-openapi uses metadata, not ZodEffects, so we only need to handle ZodDefault
function unwrapZodSchema(schema: z.ZodType): z.ZodType {
  let innerSchema: z.ZodType = schema;

  while (innerSchema instanceof z.ZodDefault) {
    innerSchema = innerSchema.unwrap() as z.ZodType;
  }

  return innerSchema;
}

// Determine field type, enum values, and metadata from unwrapped Zod schema
function determineFieldType(schema: z.ZodType): {
  type: FieldType;
  enumValues?: string[];
  isSecret?: boolean;
} {
  const meta = schema.meta() as FieldMeta | undefined;
  const isSecret = meta?.inputType === 'secret';

  if (schema instanceof z.ZodEnum) {
    return { type: 'enum', enumValues: schema.options as string[] };
  }

  if (schema instanceof z.ZodBoolean) {
    return { type: 'boolean' };
  }

  return { type: 'string', isSecret };
}

// Extract field metadata from Zod schema
function extractFieldMetadata(schema: typeof SettingsSchema): SettingField[] {
  const fields: SettingField[] = [];

  for (const [key, fieldSchema] of Object.entries(schema.shape)) {
    const parsed = parseSettingKey(key);
    if (!parsed) continue;

    const innerSchema = unwrapZodSchema(fieldSchema);
    const { type, enumValues, isSecret } = determineFieldType(innerSchema);

    fields.push({
      key: key as keyof Settings,
      ...parsed,
      type,
      enumValues,
      isSecret,
    });
  }

  return fields;
}

// Group fields by section and group
function groupFields(fields: SettingField[]) {
  const sections: Record<string, Record<string, SettingField[]>> = {};

  for (const field of fields) {
    const sectionGroups = sections[field.section] ?? (sections[field.section] = {});
    const groupFields = sectionGroups[field.group] ?? (sectionGroups[field.group] = []);
    groupFields.push(field);
  }

  return sections;
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

function SettingControl({ field, value, onChange, disabled, t }: Readonly<SettingControlProps>) {
  // Convert dotted key to nested path: security.sharing.mode -> admin.settings.security.sharing.mode
  const baseKey = `admin.settings.${field.section}.${field.group}.${field.name}`;
  const autoFieldType = getAutoFieldType(field);
  const testId = `setting-${field.key}`;

  // Prepare options for enum fields
  const options = field.enumValues?.map((enumValue) => ({
    value: enumValue,
    label: t(`${baseKey}.values.${enumValue.toLowerCase()}`),
  }));

  switch (field.type) {
    case 'enum':
      return (
        <div>
          <Label className="mb-4 block">{t(`${baseKey}.title`)}</Label>
          <div className="grid grid-cols-2 items-center gap-6">
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
        </div>
      );

    case 'boolean':
      return (
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor={testId}>{t(`${baseKey}.title`)}</Label>
            <p className="text-muted-foreground text-sm">{t(`${baseKey}.description`)}</p>
          </div>
          <div className="flex items-center gap-2">
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
        <div className="space-y-2">
          <Label>{t(`${baseKey}.title`)}</Label>
          <p className="text-muted-foreground text-sm">{t(`${baseKey}.description`)}</p>
          <AutoFormField
            type={autoFieldType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            testId={testId}
          />
        </div>
      );
  }
}

interface GroupCardProps {
  sectionKey: string;
  groupKey: string;
  fields: SettingField[];
  settings: Settings;
  savingKey: string | null;
  onFieldChange: (field: SettingField, value: string | boolean) => void;
  t: ReturnType<typeof useTranslations>;
}

function GroupCard({
  sectionKey,
  groupKey,
  fields,
  settings,
  savingKey,
  onFieldChange,
  t,
}: Readonly<GroupCardProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(`admin.settings.${sectionKey}.${groupKey}.title`)}</CardTitle>
        <CardDescription>
          {t(`admin.settings.${sectionKey}.${groupKey}.description`)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <SettingControl
            key={field.key}
            field={field}
            value={settings[field.key]}
            onChange={(value) => onFieldChange(field, value)}
            disabled={savingKey === field.key}
            t={t}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function AutoSettingsPage() {
  const t = useTranslations();
  const { settings, isLoading, updateSetting } = useSettings();
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const fields = useMemo(() => extractFieldMetadata(SettingsSchema), []);
  const groupedFields = useMemo(() => groupFields(fields), [fields]);

  const handleChange = useCallback(
    async (field: SettingField, value: string | boolean) => {
      setSavingKey(field.key);
      try {
        await updateSetting(field.key, value as Settings[typeof field.key]);
        toast.success(t('admin.settings.saved'));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'admin.settings.saveFailed';
        const params = (error as Error & { params?: Record<string, string> })?.params;
        toast.error(t(message, params));
      } finally {
        setSavingKey(null);
      }
    },
    [updateSetting, t]
  );

  if (isLoading || !settings) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Card>
              <CardHeader>
                <Skeleton className="mb-2 h-6 w-32" />
                <Skeleton className="h-4 w-full max-w-md" />
              </CardHeader>
              <CardContent className="space-y-6">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-4 w-full max-w-xs" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500 ease-out">
      {Object.entries(groupedFields).map(([sectionKey, groups]) => (
        <div key={sectionKey} className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t(`admin.settings.${sectionKey}.title`)}
          </h2>
          {Object.entries(groups).map(([groupKey, groupFields]) => (
            <GroupCard
              key={groupKey}
              sectionKey={sectionKey}
              groupKey={groupKey}
              fields={groupFields}
              settings={settings}
              savingKey={savingKey}
              onFieldChange={handleChange}
              t={t}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
