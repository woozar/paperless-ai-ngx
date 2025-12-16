'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/form-inputs/password-input';
import { ApiKeyInput } from '@/components/form-inputs/api-key-input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettings } from '@/components/settings-provider';
import { Euro, DollarSign } from 'lucide-react';

export type AutoFormFieldType =
  | 'text'
  | 'password'
  | 'apiKey'
  | 'url'
  | 'select'
  | 'textarea'
  | 'switch'
  | 'number'
  | 'currency';

export type SelectOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

export type AutoFormFieldProps = Readonly<{
  /** Field type determines which input component to render */
  type: AutoFormFieldType;
  /** Current field value */
  value: string | boolean;
  /** Change handler - called when value changes */
  onChange: (value: string | boolean) => void;
  /** HTML id attribute */
  id?: string;
  /** data-testid attribute for testing */
  testId?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Options for select fields */
  options?: SelectOption[];
  /** Show password validation rules (for password fields) */
  showPasswordRules?: boolean;
  /** Number of rows for textarea */
  rows?: number;
}>;

const CURRENCY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  EUR: Euro,
  USD: DollarSign,
};

/**
 * Currency input field that shows the currency symbol from settings
 */
function CurrencyField({
  id,
  testId,
  value,
  onChange,
  disabled,
}: Readonly<{
  id?: string;
  testId?: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}>) {
  const { settings } = useSettings();
  const currency = settings['display.general.currency'] || 'EUR';
  const CurrencyIcon = CURRENCY_ICONS[currency] || Euro;

  return (
    <div className="relative">
      <Input
        id={id}
        data-testid={testId}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          // Allow digits, comma and dot for decimal input
          const val = e.target.value.replaceAll(/[^0-9.,]/g, '');
          onChange(val);
        }}
        disabled={disabled}
        autoComplete="off"
        className="pr-9"
      />
      <CurrencyIcon className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
    </div>
  );
}

/**
 * Auto-form field component that renders the appropriate input based on type.
 * Used by AutoFormDialog and AutoSettingsPage to render individual form fields.
 */
export function AutoFormField({
  type,
  value,
  onChange,
  id,
  testId,
  disabled = false,
  options = [],
  showPasswordRules = false,
  rows = 5,
}: AutoFormFieldProps) {
  switch (type) {
    case 'password':
      return (
        <PasswordInput
          id={id}
          data-testid={testId}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          showRules={showPasswordRules}
          autoComplete="off"
        />
      );

    case 'apiKey':
      return (
        <ApiKeyInput
          id={id}
          data-testid={testId}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete="off"
        />
      );

    case 'select': {
      const selectedOption = options.find((opt) => opt.value === value);
      return (
        <Select value={value as string} onValueChange={(val) => onChange(val)} disabled={disabled}>
          <SelectTrigger id={id} data-testid={testId} className="w-full">
            <SelectValue>
              {selectedOption && (
                <span className="flex items-center gap-2">
                  {selectedOption.icon}
                  {selectedOption.label}
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    case 'textarea':
      return (
        <Textarea
          id={id}
          data-testid={testId}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={rows}
        />
      );

    case 'switch':
      return (
        <Switch
          id={id}
          checked={value as boolean}
          onCheckedChange={onChange}
          disabled={disabled}
          data-testid={testId}
        />
      );

    case 'url':
      return (
        <Input
          id={id}
          data-testid={testId}
          type="url"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete="new-password"
        />
      );

    case 'number':
      return (
        <Input
          id={id}
          data-testid={testId}
          type="text"
          inputMode="decimal"
          value={value as string}
          onChange={(e) => {
            // Allow digits, comma and dot for decimal input
            const val = e.target.value.replaceAll(/[^0-9.,]/g, '');
            onChange(val);
          }}
          disabled={disabled}
          autoComplete="off"
        />
      );

    case 'currency':
      return (
        <CurrencyField
          id={id}
          testId={testId}
          value={value as string}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'text':
    default:
      return (
        <Input
          id={id}
          data-testid={testId}
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete="new-password"
        />
      );
  }
}
