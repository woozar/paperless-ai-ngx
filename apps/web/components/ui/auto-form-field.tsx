'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { ApiKeyInput } from '@/components/ui/api-key-input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type AutoFormFieldType =
  | 'text'
  | 'password'
  | 'apiKey'
  | 'url'
  | 'select'
  | 'textarea'
  | 'switch';

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
