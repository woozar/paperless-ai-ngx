import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { CreateUserDialog } from './create-user-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';

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

  it('calls API with form data when submitted', async () => {
    mockPostUsers.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<CreateUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('create-user-username-input');
    const passwordInput = screen.getByTestId('create-user-password-input');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    const submitButton = screen.getByTestId('create-user-submit-button');
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

    const usernameInput = screen.getByTestId('create-user-username-input');
    const passwordInput = screen.getByTestId('create-user-password-input');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    const submitButton = screen.getByTestId('create-user-submit-button');
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

    const usernameInput = screen.getByTestId('create-user-username-input');
    const passwordInput = screen.getByTestId('create-user-password-input');

    fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    const submitButton = screen.getByTestId('create-user-submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Username already exists');
    });
  });

  it('displays generic error on exception', async () => {
    mockPostUsers.mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<CreateUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('create-user-username-input');
    const passwordInput = screen.getByTestId('create-user-password-input');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    const submitButton = screen.getByTestId('create-user-submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });
});
