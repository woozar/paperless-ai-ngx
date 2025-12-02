import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiKeyInput } from './api-key-input';

describe('ApiKeyInput', () => {
  it('renders input with type password by default', () => {
    render(<ApiKeyInput data-testid="api-key" />);
    const input = screen.getByTestId('api-key');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles visibility when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ApiKeyInput data-testid="api-key" />);

    const input = screen.getByTestId('api-key');
    const toggleButton = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('shows correct icon based on visibility state', async () => {
    const user = userEvent.setup();
    render(<ApiKeyInput data-testid="api-key" />);

    const toggleButton = screen.getByRole('button');

    // Initially shows Eye icon (key is hidden)
    expect(screen.getByText('Show API key')).toBeInTheDocument();

    await user.click(toggleButton);

    // After click shows EyeOff icon (key is visible)
    expect(screen.getByText('Hide API key')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ApiKeyInput data-testid="api-key" className="custom-class" />);
    const input = screen.getByTestId('api-key');
    expect(input).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<ApiKeyInput ref={ref} data-testid="api-key" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has autocomplete disabled', () => {
    render(<ApiKeyInput data-testid="api-key" />);
    const input = screen.getByTestId('api-key');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it('has password manager ignore attributes', () => {
    render(<ApiKeyInput data-testid="api-key" />);
    const input = screen.getByTestId('api-key');
    expect(input).toHaveAttribute('data-1p-ignore', 'true');
    expect(input).toHaveAttribute('data-lpignore', 'true');
    expect(input).toHaveAttribute('data-form-type', 'other');
  });
});
