import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import ChangePasswordPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockPush = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ updateUser: mockUpdateUser }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('ChangePasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('renders change password form', () => {
    renderWithIntl(<ChangePasswordPage />);

    expect(screen.getAllByText('Change Password').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<ChangePasswordPage />);

    await user.type(screen.getByLabelText(/current password/i), 'oldpassword');
    await user.type(screen.getByLabelText(/new password/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'differentpassword');
    await user.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Passwords do not match');
    });
  });

  it('shows error when password is too short', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<ChangePasswordPage />);

    await user.type(screen.getByLabelText(/current password/i), 'oldpassword');
    await user.type(screen.getByLabelText(/new password/i), 'short');
    await user.type(screen.getByLabelText(/confirm password/i), 'short');
    await user.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Password must be at least 8 characters');
    });
  });

  it('submits successfully and redirects to home', async () => {
    const user = userEvent.setup({ delay: null });
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    renderWithIntl(<ChangePasswordPage />);

    await user.type(screen.getByLabelText(/current password/i), 'oldpassword');
    await user.type(screen.getByLabelText(/new password/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'newpassword123');
    await user.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Password changed successfully');
      expect(mockUpdateUser).toHaveBeenCalledWith({ mustChangePassword: false });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows error when current password is incorrect', async () => {
    const user = userEvent.setup({ delay: null });
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'error.currentPasswordIncorrect' }),
    });

    renderWithIntl(<ChangePasswordPage />);

    await user.type(screen.getByLabelText(/current password/i), 'wrongpassword');
    await user.type(screen.getByLabelText(/new password/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'newpassword123');
    await user.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Current password is incorrect');
    });
  });

  it('shows generic error on server error', async () => {
    const user = userEvent.setup({ delay: null });
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'error.serverError' }),
    });

    renderWithIntl(<ChangePasswordPage />);

    await user.type(screen.getByLabelText(/current password/i), 'oldpassword');
    await user.type(screen.getByLabelText(/new password/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'newpassword123');
    await user.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('An internal server error occurred');
    });
  });

  it('shows generic error on network failure', async () => {
    const user = userEvent.setup({ delay: null });
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<ChangePasswordPage />);

    await user.type(screen.getByLabelText(/current password/i), 'oldpassword');
    await user.type(screen.getByLabelText(/new password/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'newpassword123');
    await user.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        'An error occurred while changing password'
      );
    });
  });

  it('toggles current password visibility', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<ChangePasswordPage />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    expect(currentPasswordInput).toHaveAttribute('type', 'password');

    // Find toggle buttons (they have tabIndex=-1)
    const toggleButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.getAttribute('tabindex') === '-1');

    // Click the first toggle button (current password)
    await user.click(toggleButtons[0]!);
    expect(currentPasswordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await user.click(toggleButtons[0]!);
    expect(currentPasswordInput).toHaveAttribute('type', 'password');
  });

  it('toggles new password visibility', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<ChangePasswordPage />);

    const newPasswordInput = screen.getByLabelText(/^new password$/i);
    expect(newPasswordInput).toHaveAttribute('type', 'password');

    // Find toggle buttons (they have tabIndex=-1)
    const toggleButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.getAttribute('tabindex') === '-1');

    // Click the second toggle button (new password)
    await user.click(toggleButtons[1]!);
    expect(newPasswordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await user.click(toggleButtons[1]!);
    expect(newPasswordInput).toHaveAttribute('type', 'password');
  });

  it('toggles confirm password visibility', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<ChangePasswordPage />);

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Find toggle buttons (they have tabIndex=-1)
    const toggleButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.getAttribute('tabindex') === '-1');

    // Click the third toggle button (confirm password)
    await user.click(toggleButtons[2]!);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await user.click(toggleButtons[2]!);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('disables inputs while loading', async () => {
    const user = userEvent.setup({ delay: null });
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(() => new Promise(() => {}));

    renderWithIntl(<ChangePasswordPage />);

    await user.type(screen.getByLabelText(/current password/i), 'oldpassword');
    await user.type(screen.getByLabelText(/new password/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'newpassword123');
    await user.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/current password/i)).toBeDisabled();
      expect(screen.getByLabelText(/new password/i)).toBeDisabled();
      expect(screen.getByLabelText(/confirm password/i)).toBeDisabled();
      expect(screen.getByRole('button', { name: /changing/i })).toBeDisabled();
    });
  });
});
