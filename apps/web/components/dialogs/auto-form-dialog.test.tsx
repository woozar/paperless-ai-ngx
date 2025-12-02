import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { AutoFormDialog } from './auto-form-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('AutoFormDialog', () => {
  // Use existing translation namespace and keys
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    translationNamespace: 'admin.users',
    titleKey: 'createUser',
    successMessageKey: 'userCreated',
    submitButtonKey: 'create',
    onSubmit: vi.fn(),
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('parseFieldType fallback', () => {
    it('treats unknown field type as text input', async () => {
      // Use unknownType but with existing labelKey 'username'
      const schemaWithUnknownType = z.object({
        username: z.string().describe('unknownType|username'),
      });

      renderWithIntl(
        <AutoFormDialog {...defaultProps} schema={schemaWithUnknownType} testIdPrefix="test" />
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Should render as text input (fallback behavior)
      const input = screen.getByTestId('test-username-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });
  });

  describe('field without description', () => {
    it('uses field name as label key when no description provided', async () => {
      // Use 'username' as field name since admin.users.username exists
      const schemaWithoutDescription = z.object({
        username: z.string(),
      });

      renderWithIntl(
        <AutoFormDialog {...defaultProps} schema={schemaWithoutDescription} testIdPrefix="test" />
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Field should still render
      const input = screen.getByTestId('test-username-input');
      expect(input).toBeInTheDocument();
    });
  });

  describe('showWhen conditional fields', () => {
    it('hides field when showWhen condition is not met', async () => {
      // Use existing keys: role and password
      const schemaWithConditional = z.object({
        role: z.string().describe('text|role'),
        password: z.string().optional().describe('text|password|showWhen:role:ADMIN'),
      });

      renderWithIntl(
        <AutoFormDialog
          {...defaultProps}
          schema={schemaWithConditional}
          testIdPrefix="test"
          initialData={{ role: 'DEFAULT', password: '' }}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Role field should be visible
      expect(screen.getByTestId('test-role-input')).toBeInTheDocument();

      // Password should be hidden because role is 'DEFAULT', not 'ADMIN'
      expect(screen.queryByTestId('test-password-input')).not.toBeInTheDocument();
    });

    it('shows field when showWhen condition is met', async () => {
      const schemaWithConditional = z.object({
        role: z.string().describe('text|role'),
        password: z.string().optional().describe('text|password|showWhen:role:ADMIN'),
      });

      renderWithIntl(
        <AutoFormDialog
          {...defaultProps}
          schema={schemaWithConditional}
          testIdPrefix="test"
          initialData={{ role: 'ADMIN', password: '' }}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Both fields should be visible
      expect(screen.getByTestId('test-role-input')).toBeInTheDocument();
      expect(screen.getByTestId('test-password-input')).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('calls onSubmit with form data', async () => {
      const user = userEvent.setup({ delay: null });
      const onSubmit = vi.fn().mockResolvedValue({ data: {} });
      const onSuccess = vi.fn();

      const schema = z.object({
        username: z.string().min(1).describe('text|username'),
      });

      renderWithIntl(
        <AutoFormDialog
          {...defaultProps}
          schema={schema}
          onSubmit={onSubmit}
          onSuccess={onSuccess}
          testIdPrefix="test"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const input = screen.getByTestId('test-username-input');
      await user.type(input, 'testuser');

      const submitButton = screen.getByTestId('test-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({ username: 'testuser' });
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('select fields with static options', () => {
    it('renders select field with options from describe', async () => {
      // Use existing keys: role with admin/default options
      const schemaWithSelect = z.object({
        role: z.string().describe('select|role|ADMIN:admin|DEFAULT:default'),
      });

      renderWithIntl(
        <AutoFormDialog
          {...defaultProps}
          schema={schemaWithSelect}
          testIdPrefix="test"
          initialData={{ role: 'ADMIN' }}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select trigger should be visible
      const selectTrigger = screen.getByTestId('test-role-input');
      expect(selectTrigger).toBeInTheDocument();
    });
  });

  describe('parseSelectOptions edge cases', () => {
    it('handles option without colon separator', async () => {
      // Use status with active/suspended as simple options
      const schemaWithSimpleOptions = z.object({
        status: z.string().describe('select|status|active|suspended'),
      });

      renderWithIntl(
        <AutoFormDialog
          {...defaultProps}
          schema={schemaWithSimpleOptions}
          testIdPrefix="test"
          initialData={{ status: 'active' }}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select should render
      const selectTrigger = screen.getByTestId('test-status-input');
      expect(selectTrigger).toBeInTheDocument();
    });
  });

  describe('parseShowWhen edge cases', () => {
    it('ignores malformed showWhen condition without field separator', async () => {
      // Use existing keys
      const schemaWithMalformedShowWhen = z.object({
        username: z.string().describe('text|username'),
        password: z.string().optional().describe('text|password|showWhen:malformed'),
      });

      renderWithIntl(
        <AutoFormDialog
          {...defaultProps}
          schema={schemaWithMalformedShowWhen}
          testIdPrefix="test"
          initialData={{ username: 'test', password: '' }}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Both fields should be visible (malformed showWhen is ignored)
      expect(screen.getByTestId('test-username-input')).toBeInTheDocument();
      expect(screen.getByTestId('test-password-input')).toBeInTheDocument();
    });
  });

  describe('extractDefaultValue', () => {
    it('uses default value from schema', async () => {
      const schemaWithDefault = z.object({
        username: z.string().default('defaultuser').describe('text|username'),
      });

      renderWithIntl(
        <AutoFormDialog {...defaultProps} schema={schemaWithDefault} testIdPrefix="test" />
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const input = screen.getByTestId('test-username-input');
      expect(input).toHaveValue('defaultuser');
    });
  });
});
