import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteUserDialog } from './delete-user-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { UserListItem } from '@repo/api-client';

const mockUser: UserListItem = {
  id: 'user-123',
  username: 'testuser',
  role: 'DEFAULT',
  isActive: true,
  createdAt: '2024-01-15T10:30:00Z',
  mustChangePassword: false,
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockDeleteUsersById = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    deleteUsersById: (...args: any[]) => mockDeleteUsersById(...args),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('DeleteUserDialog', () => {
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
    renderWithIntl(<DeleteUserDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<DeleteUserDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls deleteUsersById with correct user ID', async () => {
    const user = userEvent.setup({ delay: null });
    const onSuccess = vi.fn();
    mockDeleteUsersById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<DeleteUserDialog {...defaultProps} onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    await user.type(input, 'testuser');

    const deleteButton = screen.getByTestId('submit-delete-button');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteUsersById).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          path: { id: 'user-123' },
        })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
