import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { z } from 'zod';
import { AutoForm, useAutoForm } from './auto-form';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { renderHook, act } from '@testing-library/react';
import { IntlProvider } from 'next-intl';

// Simple schema for testing
const SimpleSchema = z.object({
  name: z.string().min(1).meta({ inputType: 'text', labelKey: 'name' }),
  email: z.string().email().meta({ inputType: 'text', labelKey: 'email' }),
});

// Schema with select options
const SchemaWithSelect = z.object({
  name: z.string().min(1).meta({ inputType: 'text', labelKey: 'name' }),
  provider: z.enum(['openai', 'anthropic']).meta({
    inputType: 'select',
    labelKey: 'provider',
    options: [
      { value: 'openai', labelKey: 'providers.openai' },
      { value: 'anthropic', labelKey: 'providers.anthropic' },
    ],
  }),
});

// Schema with conditional fields
const SchemaWithConditional = z.object({
  provider: z.enum(['openai', 'custom']).meta({
    inputType: 'select',
    labelKey: 'provider',
    options: [
      { value: 'openai', labelKey: 'providers.openai' },
      { value: 'custom', labelKey: 'providers.custom' },
    ],
  }),
  baseUrl: z
    .string()
    .optional()
    .meta({
      inputType: 'text',
      labelKey: 'baseUrl',
      showWhen: { field: 'provider', values: ['custom'] },
    }),
});

// Schema with password validation
const SchemaWithPassword = z.object({
  password: z.string().min(8).meta({
    inputType: 'password',
    labelKey: 'password',
    validate: true,
  }),
});

// Schema with default value
const SchemaWithDefault = z.object({
  name: z.string().default('Default Name').meta({ inputType: 'text', labelKey: 'name' }),
});

// Schema without metadata
const SchemaNoMeta = z.object({
  name: z.string().min(1),
});

describe('AutoForm', () => {
  it('renders form fields from schema', () => {
    renderWithIntl(
      <AutoForm schema={SimpleSchema} translationNamespace="test" testIdPrefix="test" />
    );

    expect(screen.getByTestId('test-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('test-email-input')).toBeInTheDocument();
  });

  it('calls onChange when field value changes', () => {
    const mockOnChange = vi.fn();

    renderWithIntl(
      <AutoForm
        schema={SimpleSchema}
        translationNamespace="test"
        testIdPrefix="test"
        onChange={mockOnChange}
      />
    );

    const nameInput = screen.getByTestId('test-name-input');
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Test Name' }),
      expect.any(Boolean)
    );
  });

  it('validates form and reports isValid', () => {
    const mockOnChange = vi.fn();

    renderWithIntl(
      <AutoForm
        schema={SimpleSchema}
        translationNamespace="test"
        testIdPrefix="test"
        onChange={mockOnChange}
      />
    );

    // Initially empty, should be invalid
    expect(mockOnChange).toHaveBeenLastCalledWith(expect.any(Object), false);

    // Fill in valid data
    fireEvent.change(screen.getByTestId('test-name-input'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByTestId('test-email-input'), {
      target: { value: 'test@example.com' },
    });

    expect(mockOnChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: 'Test', email: 'test@example.com' }),
      true
    );
  });

  it('disables fields when disabled prop is true', () => {
    renderWithIntl(
      <AutoForm
        schema={SimpleSchema}
        translationNamespace="test"
        testIdPrefix="test"
        disabled={true}
      />
    );

    expect(screen.getByTestId('test-name-input')).toBeDisabled();
    expect(screen.getByTestId('test-email-input')).toBeDisabled();
  });

  it('renders with initial data', () => {
    renderWithIntl(
      <AutoForm
        schema={SimpleSchema}
        translationNamespace="test"
        testIdPrefix="test"
        initialData={{ name: 'Initial Name', email: 'initial@test.com' }}
      />
    );

    expect(screen.getByTestId('test-name-input')).toHaveValue('Initial Name');
    expect(screen.getByTestId('test-email-input')).toHaveValue('initial@test.com');
  });

  it('renders as form by default', () => {
    const { container } = renderWithIntl(
      <AutoForm schema={SimpleSchema} translationNamespace="test" />
    );

    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('renders as div when asDiv is true', () => {
    const { container } = renderWithIntl(
      <AutoForm schema={SimpleSchema} translationNamespace="test" asDiv={true} />
    );

    expect(container.querySelector('form')).not.toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted with valid data', async () => {
    const mockOnSubmit = vi.fn();

    renderWithIntl(
      <AutoForm
        schema={SimpleSchema}
        translationNamespace="test"
        testIdPrefix="test"
        initialData={{ name: 'Test', email: 'test@example.com' }}
        onSubmit={mockOnSubmit}
      />
    );

    // Submit the form by pressing Enter in an input
    const form = screen.getByTestId('test-name-input').closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Test', email: 'test@example.com' });
    });
  });

  it('does not call onSubmit when form is invalid', () => {
    const mockOnSubmit = vi.fn();

    renderWithIntl(
      <AutoForm
        schema={SimpleSchema}
        translationNamespace="test"
        testIdPrefix="test"
        onSubmit={mockOnSubmit}
      />
    );

    const form = screen.getByTestId('test-name-input').closest('form');
    fireEvent.submit(form!);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('renders select fields with options', () => {
    renderWithIntl(
      <AutoForm schema={SchemaWithSelect} translationNamespace="test" testIdPrefix="test" />
    );

    expect(screen.getByTestId('test-provider-input')).toBeInTheDocument();
  });

  it('hides conditional fields when condition is not met', () => {
    renderWithIntl(
      <AutoForm
        schema={SchemaWithConditional}
        translationNamespace="test"
        testIdPrefix="test"
        initialData={{ provider: 'openai' }}
      />
    );

    expect(screen.queryByTestId('test-baseUrl-input')).not.toBeInTheDocument();
  });

  it('shows conditional fields when condition is met', () => {
    renderWithIntl(
      <AutoForm
        schema={SchemaWithConditional}
        translationNamespace="test"
        testIdPrefix="test"
        initialData={{ provider: 'custom' }}
      />
    );

    expect(screen.getByTestId('test-baseUrl-input')).toBeInTheDocument();
  });

  it('renders custom icons for select options', () => {
    const mockRenderIcon = vi.fn(() => <span data-testid="custom-icon">Icon</span>);

    renderWithIntl(
      <AutoForm
        schema={SchemaWithSelect}
        translationNamespace="test"
        testIdPrefix="test"
        renderOptionIcon={mockRenderIcon}
      />
    );

    expect(mockRenderIcon).toHaveBeenCalled();
  });

  it('calls renderAfterField for each field', () => {
    const mockRenderAfter = vi.fn(() => <span data-testid="after-field">After</span>);

    renderWithIntl(
      <AutoForm
        schema={SimpleSchema}
        translationNamespace="test"
        testIdPrefix="test"
        renderAfterField={mockRenderAfter}
      />
    );

    expect(mockRenderAfter).toHaveBeenCalledWith('name');
    expect(mockRenderAfter).toHaveBeenCalledWith('email');
  });

  it('uses field name as label key when no meta provided', () => {
    renderWithIntl(
      <AutoForm schema={SchemaNoMeta} translationNamespace="test" testIdPrefix="test" />
    );

    expect(screen.getByTestId('test-name-input')).toBeInTheDocument();
  });

  it('uses default values from schema', () => {
    renderWithIntl(
      <AutoForm schema={SchemaWithDefault} translationNamespace="test" testIdPrefix="test" />
    );

    expect(screen.getByTestId('test-name-input')).toHaveValue('Default Name');
  });

  it('supports external data control', () => {
    const mockOnChange = vi.fn();
    const externalData = { name: 'External Name', email: 'external@test.com' };

    renderWithIntl(
      <AutoForm
        schema={SimpleSchema}
        translationNamespace="test"
        testIdPrefix="test"
        externalData={externalData}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByTestId('test-name-input')).toHaveValue('External Name');

    // Change a field
    fireEvent.change(screen.getByTestId('test-name-input'), { target: { value: 'New Name' } });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Name' }),
      expect.any(Boolean)
    );
  });

  it('validates password fields with custom validation', () => {
    const mockOnChange = vi.fn();

    renderWithIntl(
      <AutoForm
        schema={SchemaWithPassword}
        translationNamespace="test"
        testIdPrefix="test"
        onChange={mockOnChange}
      />
    );

    // Weak password
    fireEvent.change(screen.getByTestId('test-password-input'), { target: { value: 'weak' } });

    expect(mockOnChange).toHaveBeenLastCalledWith(expect.any(Object), false);

    // Strong password
    fireEvent.change(screen.getByTestId('test-password-input'), {
      target: { value: 'StrongP@ss123' },
    });

    expect(mockOnChange).toHaveBeenLastCalledWith(expect.any(Object), true);
  });

  it('supports dynamic options for select fields', () => {
    const dynamicOptions = {
      provider: [
        { value: 'option1', label: 'Dynamic Option 1' },
        { value: 'option2', label: 'Dynamic Option 2' },
      ],
    };

    renderWithIntl(
      <AutoForm
        schema={SchemaWithSelect}
        translationNamespace="test"
        testIdPrefix="test"
        dynamicOptions={dynamicOptions}
      />
    );

    expect(screen.getByTestId('test-provider-input')).toBeInTheDocument();
  });
});

describe('useAutoForm', () => {
  const messages = { test: { name: 'Name', email: 'Email' } };
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <IntlProvider locale="en" messages={messages}>
      {children}
    </IntlProvider>
  );

  it('returns form data and validation state', () => {
    const { result } = renderHook(() => useAutoForm(SimpleSchema), { wrapper });

    expect(result.current.formData).toEqual({ name: '', email: '' });
    expect(result.current.isValid).toBe(false);
  });

  it('allows updating form data', () => {
    const { result } = renderHook(() => useAutoForm(SimpleSchema), { wrapper });

    act(() => {
      result.current.setFormData((prev) => ({ ...prev, name: 'Test', email: 'test@example.com' }));
    });

    expect(result.current.formData.name).toBe('Test');
    expect(result.current.isValid).toBe(true);
  });

  it('returns parsed data', () => {
    const { result } = renderHook(
      () => useAutoForm(SimpleSchema, { name: 'Test', email: 'test@example.com' }),
      { wrapper }
    );

    const parsed = result.current.getParsedData();
    expect(parsed).toEqual({ name: 'Test', email: 'test@example.com' });
  });

  it('handles initial data', () => {
    const { result } = renderHook(
      () => useAutoForm(SimpleSchema, { name: 'Initial', email: 'initial@test.com' }),
      { wrapper }
    );

    expect(result.current.formData).toEqual({ name: 'Initial', email: 'initial@test.com' });
  });

  it('validates password fields with custom validation', () => {
    const { result } = renderHook(() => useAutoForm(SchemaWithPassword), { wrapper });

    act(() => {
      result.current.setFormData({ password: 'weak' });
    });

    expect(result.current.isValid).toBe(false);

    act(() => {
      result.current.setFormData({ password: 'StrongP@ss123' });
    });

    expect(result.current.isValid).toBe(true);
  });

  it('handles conditional field visibility in validation', () => {
    const { result } = renderHook(() => useAutoForm(SchemaWithConditional), { wrapper });

    // When provider is openai, baseUrl is not required
    act(() => {
      result.current.setFormData({ provider: 'openai', baseUrl: '' });
    });

    expect(result.current.isValid).toBe(true);

    // When provider is custom, baseUrl may be required
    act(() => {
      result.current.setFormData({ provider: 'custom', baseUrl: '' });
    });

    // baseUrl is optional so still valid
    expect(result.current.isValid).toBe(true);
  });

  it('handles getParsedData with conditional fields', () => {
    const { result } = renderHook(() => useAutoForm(SchemaWithConditional), { wrapper });

    act(() => {
      result.current.setFormData({ provider: 'custom', baseUrl: 'http://localhost' });
    });

    const parsed = result.current.getParsedData();
    expect(parsed).toEqual({ provider: 'custom', baseUrl: 'http://localhost' });
  });

  it('filters out hidden conditional fields from getParsedData', () => {
    const { result } = renderHook(() => useAutoForm(SchemaWithConditional), { wrapper });

    act(() => {
      // When provider is 'openai', baseUrl should be hidden and filtered out
      result.current.setFormData({ provider: 'openai', baseUrl: 'http://should-be-ignored' });
    });

    const parsed = result.current.getParsedData();
    // baseUrl should NOT be in the parsed data since its showWhen condition is not met
    expect(parsed).toEqual({ provider: 'openai' });
    expect(parsed).not.toHaveProperty('baseUrl');
  });
});
