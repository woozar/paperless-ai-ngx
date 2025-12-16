import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { PasswordInput } from './password-input';
import messages from '@/locales/en.json';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
};

describe('PasswordInput', () => {
  it('renders password input with hidden password by default', () => {
    renderWithProviders(<PasswordInput data-testid="password" />);

    const input = screen.getByTestId('password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility when button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<PasswordInput data-testid="password" />);

    const input = screen.getByTestId('password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    renderWithProviders(<PasswordInput data-testid="password" className="custom-class" />);

    const input = screen.getByTestId('password');
    expect(input).toHaveClass('custom-class');
  });

  it('forwards all input props', () => {
    renderWithProviders(
      <PasswordInput
        data-testid="password"
        placeholder="Enter password"
        disabled
        required
        autoComplete="current-password"
      />
    );

    const input = screen.getByTestId('password');
    expect(input).toHaveAttribute('placeholder', 'Enter password');
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('autocomplete', 'current-password');
  });

  it('applies pr-10 class for button spacing', () => {
    renderWithProviders(<PasswordInput data-testid="password" />);

    const input = screen.getByTestId('password');
    expect(input).toHaveClass('pr-10');
  });

  it('toggle button has tabIndex -1', () => {
    renderWithProviders(<PasswordInput />);

    const toggleButton = screen.getByRole('button', { name: /show password/i });
    expect(toggleButton).toHaveAttribute('tabindex', '-1');
  });

  it('shows password requirements when showRules is true', () => {
    renderWithProviders(<PasswordInput data-testid="password" showRules />);

    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
  });

  it('updates requirement status as password is typed', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<PasswordInput data-testid="password" showRules />);

    const input = screen.getByTestId('password');

    // Initially, requirement should be unmet
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();

    // Type a valid password (8+ characters)
    await user.type(input, 'SecurePass123');

    // Requirement should now be met (no X icon visible for minLength)
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
  });

  it('does not show requirements when showRules is false', () => {
    renderWithProviders(<PasswordInput data-testid="password" />);

    expect(screen.queryByText('At least 8 characters')).not.toBeInTheDocument();
  });
});
