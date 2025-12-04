import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AutoFormField } from './auto-form-field';
import { renderWithIntl } from '@/test-utils/render-with-intl';

// Mock Radix UI Select for jsdom compatibility
vi.mock('@radix-ui/react-select', () => ({
  Root: ({
    children,
    onValueChange,
    ...props
  }: {
    children: React.ReactNode;
    onValueChange?: (value: string) => void;
  }) => (
    <div data-testid="select-root" data-on-value-change={!!onValueChange} {...props}>
      {children}
    </div>
  ),
  Trigger: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <button data-testid="select-trigger" className={className} {...props}>
      {children}
    </button>
  ),
  Value: ({ placeholder, ...props }: { placeholder?: string }) => (
    <span data-testid="select-value" {...props}>
      {placeholder}
    </span>
  ),
  Icon: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="select-icon">{children}</span>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-portal">{children}</div>
  ),
  Content: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="select-content" className={className} {...props}>
      {children}
    </div>
  ),
  Viewport: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="select-viewport" className={className}>
      {children}
    </div>
  ),
  Item: ({
    children,
    className,
    value,
  }: {
    children: React.ReactNode;
    className?: string;
    value: string;
  }) => (
    <div data-testid="select-item" className={className} data-value={value}>
      {children}
    </div>
  ),
  ItemText: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="select-item-text">{children}</span>
  ),
  ItemIndicator: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="select-item-indicator">{children}</span>
  ),
  ScrollUpButton: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div data-testid="scroll-up" className={className}>
      {children}
    </div>
  ),
  ScrollDownButton: ({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="scroll-down" className={className}>
      {children}
    </div>
  ),
}));

describe('AutoFormField', () => {
  describe('text field', () => {
    it('renders text input and calls onChange', async () => {
      const user = userEvent.setup({ delay: null });
      const onChange = vi.fn();

      renderWithIntl(
        <AutoFormField type="text" value="initial" onChange={onChange} testId="test-field" />
      );

      const input = screen.getByTestId('test-field');
      expect(input).toHaveValue('initial');

      await user.clear(input);
      await user.type(input, 'new value');

      expect(onChange).toHaveBeenCalled();
    });

    it('renders disabled input', () => {
      renderWithIntl(
        <AutoFormField type="text" value="" onChange={vi.fn()} disabled testId="test-field" />
      );

      expect(screen.getByTestId('test-field')).toBeDisabled();
    });
  });

  describe('url field', () => {
    it('renders url input with type="url"', () => {
      renderWithIntl(
        <AutoFormField
          type="url"
          value="https://example.com"
          onChange={vi.fn()}
          testId="test-field"
        />
      );

      const input = screen.getByTestId('test-field');
      expect(input).toHaveAttribute('type', 'url');
      expect(input).toHaveValue('https://example.com');
    });
  });

  describe('password field', () => {
    it('renders password input and calls onChange', async () => {
      const user = userEvent.setup({ delay: null });
      const onChange = vi.fn();

      renderWithIntl(
        <AutoFormField type="password" value="" onChange={onChange} testId="test-field" />
      );

      const input = screen.getByTestId('test-field');
      await user.type(input, 'secret');

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('apiKey field', () => {
    it('renders API key input', async () => {
      const user = userEvent.setup({ delay: null });
      const onChange = vi.fn();

      renderWithIntl(
        <AutoFormField type="apiKey" value="" onChange={onChange} testId="test-field" />
      );

      const input = screen.getByTestId('test-field');
      await user.type(input, 'sk-key');

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('textarea field', () => {
    it('renders textarea and calls onChange', async () => {
      const user = userEvent.setup({ delay: null });
      const onChange = vi.fn();

      renderWithIntl(
        <AutoFormField
          type="textarea"
          value="initial text"
          onChange={onChange}
          testId="test-field"
          rows={3}
        />
      );

      const textarea = screen.getByTestId('test-field');
      expect(textarea).toHaveValue('initial text');
      expect(textarea).toHaveAttribute('rows', '3');

      await user.clear(textarea);
      await user.type(textarea, 'new text');

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('switch field', () => {
    it('renders switch and calls onChange with boolean', () => {
      const onChange = vi.fn();

      renderWithIntl(
        <AutoFormField type="switch" value={false} onChange={onChange} testId="test-field" />
      );

      const switchElement = screen.getByTestId('test-field');
      fireEvent.click(switchElement);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('renders checked switch', () => {
      renderWithIntl(
        <AutoFormField type="switch" value={true} onChange={vi.fn()} testId="test-field" />
      );

      const switchElement = screen.getByTestId('test-field');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('select field', () => {
    it('renders select with options', () => {
      renderWithIntl(
        <AutoFormField
          type="select"
          value="option1"
          onChange={vi.fn()}
          testId="test-field"
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ]}
        />
      );

      // With mocked select, verify the trigger is rendered
      expect(screen.getByTestId('test-field')).toBeInTheDocument();
      // Options should be in the mocked content
      expect(screen.getAllByTestId('select-item')).toHaveLength(2);
    });

    it('passes onValueChange to select', () => {
      const onChange = vi.fn();

      renderWithIntl(
        <AutoFormField
          type="select"
          value="option1"
          onChange={onChange}
          testId="test-field"
          options={[{ value: 'option1', label: 'Option 1' }]}
        />
      );

      // Verify the select root has onValueChange handler
      const root = screen.getByTestId('select-root');
      expect(root).toHaveAttribute('data-on-value-change', 'true');
    });
  });

  describe('default type', () => {
    it('renders text input for unknown type', () => {
      renderWithIntl(
        <AutoFormField
          type={'unknown' as 'text'}
          value="test"
          onChange={vi.fn()}
          testId="test-field"
        />
      );

      const input = screen.getByTestId('test-field');
      expect(input).toHaveAttribute('type', 'text');
    });
  });
});
