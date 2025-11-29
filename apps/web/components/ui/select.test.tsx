import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from './select';

// Mock Radix UI Select components to avoid jsdom compatibility issues
vi.mock('@radix-ui/react-select', () => ({
  Root: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="select-root" data-props={JSON.stringify(props)}>
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
  Group: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-group">{children}</div>
  ),
  Label: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="select-label" className={className}>
      {children}
    </span>
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
  Separator: ({ className }: { className?: string }) => (
    <div data-testid="select-separator" className={className} />
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

describe('Select', () => {
  it('renders Select with children', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </Select>
    );

    expect(screen.getByTestId('select-root')).toBeInTheDocument();
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('select-value')).toHaveTextContent('Select an option');
  });

  it('applies custom className to SelectTrigger', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
      </Select>
    );

    expect(screen.getByTestId('select-trigger')).toHaveClass('custom-trigger');
  });

  it('renders SelectTrigger with sm size', () => {
    render(
      <Select>
        <SelectTrigger size="sm">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
      </Select>
    );

    expect(screen.getByTestId('select-trigger')).toHaveAttribute('data-size', 'sm');
  });

  it('renders SelectTrigger with default size', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
      </Select>
    );

    expect(screen.getByTestId('select-trigger')).toHaveAttribute('data-size', 'default');
  });

  it('renders SelectContent with items', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByTestId('select-content')).toBeInTheDocument();
    expect(screen.getAllByTestId('select-item')).toHaveLength(2);
  });

  it('renders SelectGroup with SelectLabel', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Group Label</SelectLabel>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    expect(screen.getByTestId('select-group')).toBeInTheDocument();
    expect(screen.getByTestId('select-label')).toHaveTextContent('Group Label');
  });

  it('renders SelectSeparator', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectSeparator />
          <SelectItem value="2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByTestId('select-separator')).toBeInTheDocument();
  });

  it('applies custom className to SelectItem', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1" className="custom-item">
            Option 1
          </SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByTestId('select-item')).toHaveClass('custom-item');
  });

  it('applies custom className to SelectLabel', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="custom-label">Label</SelectLabel>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    expect(screen.getByTestId('select-label')).toHaveClass('custom-label');
  });

  it('applies custom className to SelectSeparator', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectSeparator className="custom-separator" />
          <SelectItem value="2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByTestId('select-separator')).toHaveClass('custom-separator');
  });

  it('passes props to Select root', () => {
    render(
      <Select disabled defaultValue="test">
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
      </Select>
    );

    const root = screen.getByTestId('select-root');
    const props = JSON.parse(root.getAttribute('data-props') || '{}');
    expect(props.disabled).toBe(true);
    expect(props.defaultValue).toBe('test');
  });
});
