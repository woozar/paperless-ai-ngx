import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { AutoFormDialog } from './auto-form-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { selectOptions } from '@/lib/api/schemas/form-field-meta';

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

  describe('field without meta', () => {
    it('uses field name as label key when no meta provided', async () => {
      // Use 'username' as field name since admin.users.username exists
      const schemaWithoutMeta = z.object({
        username: z.string(),
      });

      renderWithIntl(
        <AutoFormDialog {...defaultProps} schema={schemaWithoutMeta} testIdPrefix="test" />
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Field should still render as text input (default)
      const input = screen.getByTestId('test-username-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });
  });

  describe('showWhen conditional fields', () => {
    it('hides field when showWhen condition is not met', async () => {
      // Use existing keys: role and password
      const schemaWithConditional = z.object({
        role: z.string().meta({ inputType: 'text', labelKey: 'role' }),
        password: z
          .string()
          .optional()
          .meta({
            inputType: 'text',
            labelKey: 'password',
            showWhen: { field: 'role', values: ['ADMIN'] },
          }),
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
        role: z.string().meta({ inputType: 'text', labelKey: 'role' }),
        password: z
          .string()
          .optional()
          .meta({
            inputType: 'text',
            labelKey: 'password',
            showWhen: { field: 'role', values: ['ADMIN'] },
          }),
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
        username: z.string().min(1).meta({ inputType: 'text', labelKey: 'username' }),
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
    it('renders select field with options from meta', async () => {
      // Use existing keys: role with admin/default options
      const schemaWithSelect = z.object({
        role: z.string().meta({
          inputType: 'select',
          labelKey: 'role',
          options: selectOptions({ ADMIN: 'admin', DEFAULT: 'default' }),
        }),
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

  describe('extractDefaultValue', () => {
    it('uses default value from schema', async () => {
      const schemaWithDefault = z.object({
        username: z
          .string()
          .default('defaultuser')
          .meta({ inputType: 'text', labelKey: 'username' }),
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
