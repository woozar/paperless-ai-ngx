import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangePasswordForm } from './change-password-form';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockPostAuthChangePassword = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    postAuthChangePassword: (...args: unknown[]) => mockPostAuthChangePassword(...args),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('renders the form with all required fields', () => {
    renderWithIntl(<ChangePasswordForm />);

    expect(screen.getByTestId('current-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('new-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('change-password-submit')).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<ChangePasswordForm />);

    await user.type(screen.getByTestId('current-password-input'), 'oldpassword');
    await user.type(screen.getByTestId('new-password-input'), 'newpassword123');
    await user.type(screen.getByTestId('confirm-password-input'), 'differentpassword');

    await user.click(screen.getByTestId('change-password-submit'));

    // Should not call API
    expect(mockPostAuthChangePassword).not.toHaveBeenCalled();
  });

  it('shows error when new password is too short', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<ChangePasswordForm />);

    await user.type(screen.getByTestId('current-password-input'), 'oldpassword');
    await user.type(screen.getByTestId('new-password-input'), 'short');
    await user.type(screen.getByTestId('confirm-password-input'), 'short');

    await user.click(screen.getByTestId('change-password-submit'));

    // Should not call API
    expect(mockPostAuthChangePassword).not.toHaveBeenCalled();
  });

  it('successfully changes password', async () => {
    const user = userEvent.setup({ delay: null });

    mockPostAuthChangePassword.mockResolvedValue({
      data: { success: true },
      error: undefined,
    });

    renderWithIntl(<ChangePasswordForm />);

    await user.type(screen.getByTestId('current-password-input'), 'oldpassword');
    await user.type(screen.getByTestId('new-password-input'), 'newpassword123');
    await user.type(screen.getByTestId('confirm-password-input'), 'newpassword123');

    await user.click(screen.getByTestId('change-password-submit'));

    await waitFor(() => {
      expect(mockPostAuthChangePassword).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            currentPassword: 'oldpassword',
            newPassword: 'newpassword123',
          },
        })
      );
    });

    // Form should be cleared after success
    await waitFor(() => {
      expect(screen.getByTestId('current-password-input')).toHaveValue('');
      expect(screen.getByTestId('new-password-input')).toHaveValue('');
      expect(screen.getByTestId('confirm-password-input')).toHaveValue('');
    });
  });

  it('handles API error', async () => {
    const user = userEvent.setup({ delay: null });

    mockPostAuthChangePassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid password' },
    });

    renderWithIntl(<ChangePasswordForm />);

    await user.type(screen.getByTestId('current-password-input'), 'oldpassword');
    await user.type(screen.getByTestId('new-password-input'), 'newpassword123');
    await user.type(screen.getByTestId('confirm-password-input'), 'newpassword123');

    await user.click(screen.getByTestId('change-password-submit'));

    await waitFor(() => {
      expect(mockPostAuthChangePassword).toHaveBeenCalled();
    });
  });

  it('shows loading state while submitting', async () => {
    const user = userEvent.setup({ delay: null });

    mockPostAuthChangePassword.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: { success: true }, error: undefined }), 100)
        )
    );

    renderWithIntl(<ChangePasswordForm />);

    await user.type(screen.getByTestId('current-password-input'), 'oldpassword');
    await user.type(screen.getByTestId('new-password-input'), 'newpassword123');
    await user.type(screen.getByTestId('confirm-password-input'), 'newpassword123');

    await user.click(screen.getByTestId('change-password-submit'));

    expect(screen.getByText('Changing...')).toBeInTheDocument();
    expect(screen.getByTestId('change-password-submit')).toBeDisabled();
  });

  it('disables inputs while submitting', async () => {
    const user = userEvent.setup({ delay: null });

    mockPostAuthChangePassword.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: { success: true }, error: undefined }), 100)
        )
    );

    renderWithIntl(<ChangePasswordForm />);

    await user.type(screen.getByTestId('current-password-input'), 'oldpassword');
    await user.type(screen.getByTestId('new-password-input'), 'newpassword123');
    await user.type(screen.getByTestId('confirm-password-input'), 'newpassword123');

    await user.click(screen.getByTestId('change-password-submit'));

    expect(screen.getByTestId('current-password-input')).toBeDisabled();
    expect(screen.getByTestId('new-password-input')).toBeDisabled();
    expect(screen.getByTestId('confirm-password-input')).toBeDisabled();
  });

  it('handles API exception gracefully', async () => {
    const user = userEvent.setup({ delay: null });

    mockPostAuthChangePassword.mockRejectedValue(new Error('Network error'));

    renderWithIntl(<ChangePasswordForm />);

    await user.type(screen.getByTestId('current-password-input'), 'oldpassword');
    await user.type(screen.getByTestId('new-password-input'), 'newpassword123');
    await user.type(screen.getByTestId('confirm-password-input'), 'newpassword123');

    await user.click(screen.getByTestId('change-password-submit'));

    await waitFor(() => {
      expect(mockPostAuthChangePassword).toHaveBeenCalled();
    });

    // Button should be re-enabled after error
    await waitFor(() => {
      expect(screen.getByTestId('change-password-submit')).not.toBeDisabled();
    });
  });
});
