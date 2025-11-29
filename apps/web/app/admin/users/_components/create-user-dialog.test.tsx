import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { CreateUserDialog } from './create-user-dialog';
import { renderWithIntl, messages } from '@/test-utils/render-with-intl';

const mockPostUsers = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    postUsers: (...args: any[]) => mockPostUsers(...args),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('CreateUserDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onSuccess: vi.fn(),
  };

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

  it('renders dialog when open is true', async () => {
    renderWithIntl(<CreateUserDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<CreateUserDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('disables submit button when username is empty', async () => {
    renderWithIntl(<CreateUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('create-user-submit');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(messages.admin.users.createUser);
  });

  it('disables submit button when password is empty', async () => {
    renderWithIntl(<CreateUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('create-username-input');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const submitButton = screen.getByTestId('create-user-submit');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when username and password are provided', async () => {
    renderWithIntl(<CreateUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('create-username-input');
    const passwordInput = screen.getByTestId('create-password-input');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByTestId('create-user-submit');
    expect(submitButton).not.toBeDisabled();
  });

  it('calls API with form data when submit button is clicked', async () => {
    mockPostUsers.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<CreateUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('create-username-input');
    const passwordInput = screen.getByTestId('create-password-input');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    const submitButton = screen.getByTestId('create-user-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPostUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          body: {
            username: 'newuser',
            password: 'secret123',
            role: 'DEFAULT',
          },
        })
      );
    });
  });

  it('closes dialog and calls onSuccess after successful creation', async () => {
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    mockPostUsers.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(
      <CreateUserDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('create-username-input');
    const passwordInput = screen.getByTestId('create-password-input');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    const submitButton = screen.getByTestId('create-user-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message when username already exists', async () => {
    mockPostUsers.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.usernameExists' },
      response: { status: 409 },
    });

    renderWithIntl(<CreateUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('create-username-input');
    const passwordInput = screen.getByTestId('create-password-input');

    fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    const submitButton = screen.getByTestId('create-user-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Username already exists');
    });
  });

  it('toggles password visibility when toggle button is clicked', async () => {
    renderWithIntl(<CreateUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const passwordInput = screen.getByTestId('create-password-input');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find the toggle button (has tabIndex -1)
    const toggleButton = screen
      .getAllByRole('button')
      .find((btn) => btn.getAttribute('tabindex') === '-1');
    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  it('calls onOpenChange with false when cancel button is clicked', async () => {
    const onOpenChange = vi.fn();
    renderWithIntl(<CreateUserDialog {...defaultProps} onOpenChange={onOpenChange} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: messages.common.cancel });
    fireEvent.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows loading state while creating', async () => {
    // Create a promise that we can control
    let resolveCreate: (value: { data?: any; error?: any }) => void;
    const createPromise = new Promise<{ data?: any; error?: any }>((resolve) => {
      resolveCreate = resolve;
    });
    mockPostUsers.mockReturnValue(createPromise);

    renderWithIntl(<CreateUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('create-username-input');
    const passwordInput = screen.getByTestId('create-password-input');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    const submitButton = screen.getByTestId('create-user-submit');
    fireEvent.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(submitButton).toHaveTextContent(messages.common.loading);
      expect(submitButton).toBeDisabled();
    });

    // Resolve the promise
    resolveCreate!({ data: {}, error: undefined });

    // Should return to normal state
    await waitFor(() => {
      expect(submitButton).toHaveTextContent(messages.admin.users.createUser);
    });
  });

  it('disables inputs while creating', async () => {
    const onSuccess = vi.fn();
    let resolveCreate: (value: { data?: any; error?: any }) => void;
    const createPromise = new Promise<{ data?: any; error?: any }>((resolve) => {
      resolveCreate = resolve;
    });
    mockPostUsers.mockReturnValue(createPromise);

    renderWithIntl(<CreateUserDialog {...defaultProps} onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('create-username-input');
    const passwordInput = screen.getByTestId('create-password-input');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    const submitButton = screen.getByTestId('create-user-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
    });

    resolveCreate!({ data: {}, error: undefined });

    // Wait for the operation to complete
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('resets form when dialog closes and reopens', async () => {
    const { rerender } = renderWithIntl(<CreateUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Fill in the form
    const usernameInput = screen.getByTestId('create-username-input');
    const passwordInput = screen.getByTestId('create-password-input');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');

    // Close the dialog
    rerender(<CreateUserDialog {...defaultProps} open={false} />);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Reopen the dialog
    rerender(<CreateUserDialog {...defaultProps} open={true} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Form should be reset
    const newUsernameInput = screen.getByTestId('create-username-input');
    const newPasswordInput = screen.getByTestId('create-password-input');

    expect(newUsernameInput).toHaveValue('');
    expect(newPasswordInput).toHaveValue('');
  });
});
