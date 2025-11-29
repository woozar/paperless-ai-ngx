import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { EditUserDialog } from './edit-user-dialog';
import { renderWithIntl, messages } from '@/test-utils/render-with-intl';
import type { UserListItem } from '@repo/api-client';

const mockUser: UserListItem = {
  id: 'user-123',
  username: 'testuser',
  role: 'DEFAULT',
  isActive: true,
  mustChangePassword: false,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockPatchUsersById = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    patchUsersById: (...args: any[]) => mockPatchUsersById(...args),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('EditUserDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    user: mockUser,
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
    renderWithIntl(<EditUserDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<EditUserDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays current username in dialog description', async () => {
    renderWithIntl(<EditUserDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('initializes username input with user value', async () => {
    renderWithIntl(<EditUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('edit-username-input');
    expect(usernameInput).toHaveValue('testuser');
  });

  it('calls API and onSuccess when save button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const onSuccess = vi.fn();
    mockPatchUsersById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<EditUserDialog {...defaultProps} onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('edit-username-input');
    await user.clear(usernameInput);
    await user.type(usernameInput, 'newusername');

    const submitButton = screen.getByTestId('edit-user-submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchUsersById).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          path: { id: 'user-123' },
          body: { username: 'newusername' },
        })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('displays username exists error', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchUsersById.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.usernameExists' },
      response: { status: 409 },
    });

    renderWithIntl(<EditUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('edit-username-input');
    await user.clear(usernameInput);
    await user.type(usernameInput, 'admin');

    const submitButton = screen.getByTestId('edit-user-submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Username already exists');
    });
  });

  it('displays last admin error', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchUsersById.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.lastAdmin' },
      response: { status: 400 },
    });

    renderWithIntl(<EditUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('edit-user-submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Cannot modify the last admin user');
    });
  });
});
