import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { RestoreUsersDialog } from './restore-users-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { UserListItem } from '@repo/api-client';

const mockInactiveUsers: UserListItem[] = [
  {
    id: 'user-1',
    username: 'deleteduser1',
    role: 'DEFAULT',
    isActive: false,
    createdAt: '2024-01-15T10:30:00Z',
    mustChangePassword: false,
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'admin-1',
    username: 'deletedadmin',
    role: 'ADMIN',
    isActive: false,
    createdAt: '2024-01-10T08:00:00Z',
    mustChangePassword: false,
    updatedAt: '2024-01-10T08:00:00Z',
  },
];

const mockGetUsersInactive = vi.fn();
const mockPostUsersByIdRestore = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getUsersInactive: (...args: any[]) => mockGetUsersInactive(...args),
    postUsersByIdRestore: (...args: any[]) => mockPostUsersByIdRestore(...args),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockShowApiError = vi.fn((error: { message: string }) => {
  const errorMessages: Record<string, string> = {
    'error.serverError': 'An internal server error occurred',
  };
  toast.error(errorMessages[error.message] || error.message);
});
const mockShowSuccess = vi.fn((key: string) => {
  const successMessages: Record<string, string> = {
    userRestored: 'User restored successfully',
  };
  toast.success(successMessages[key] || key);
});
const mockShowError = vi.fn((key: string) => {
  const errorMessages: Record<string, string> = {
    'error.loadFailed': 'Failed to load users',
    'error.restoreFailed': 'Failed to restore user',
  };
  toast.error(errorMessages[key] || key);
});

vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({
    showApiError: mockShowApiError,
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
}));

describe('RestoreUsersDialog', () => {
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
    mockGetUsersInactive.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 100, totalPages: 0 },
      error: undefined,
    });

    renderWithIntl(<RestoreUsersDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Deleted Users')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<RestoreUsersDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays loading state while fetching users', async () => {
    mockGetUsersInactive.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: { items: [] } }), 100))
    );

    renderWithIntl(<RestoreUsersDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('displays empty state when no inactive users', async () => {
    mockGetUsersInactive.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 100, totalPages: 0 },
      error: undefined,
    });

    renderWithIntl(<RestoreUsersDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('No deleted users found')).toBeInTheDocument();
    });
  });

  it('displays list of inactive users', async () => {
    mockGetUsersInactive.mockResolvedValueOnce({
      data: { items: mockInactiveUsers, total: 2, page: 1, limit: 100, totalPages: 1 },
      error: undefined,
    });

    renderWithIntl(<RestoreUsersDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('deleteduser1')).toBeInTheDocument();
      expect(screen.getByText('deletedadmin')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });
  });

  it('handles error when loading users fails', async () => {
    mockGetUsersInactive.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
    });

    renderWithIntl(<RestoreUsersDialog {...defaultProps} />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load users');
    });
  });

  it('handles exception when loading users', async () => {
    mockGetUsersInactive.mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<RestoreUsersDialog {...defaultProps} />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load users');
    });
  });

  it('restores user successfully', async () => {
    const user = userEvent.setup({ delay: null });
    const onSuccess = vi.fn();

    mockGetUsersInactive.mockResolvedValueOnce({
      data: { items: mockInactiveUsers, total: 2, page: 1, limit: 100, totalPages: 1 },
      error: undefined,
    });
    mockPostUsersByIdRestore.mockResolvedValueOnce({
      data: { id: 'user-1', username: 'deleteduser1', isActive: true },
      error: undefined,
    });

    renderWithIntl(<RestoreUsersDialog {...defaultProps} onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByText('deleteduser1')).toBeInTheDocument();
    });

    const restoreButton = screen.getByTestId('restore-user-user-1');
    await user.click(restoreButton);

    await waitFor(() => {
      expect(mockPostUsersByIdRestore).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          path: { id: 'user-1' },
        })
      );
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith('User restored successfully');
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('removes user from list after successful restore', async () => {
    const user = userEvent.setup({ delay: null });

    mockGetUsersInactive.mockResolvedValueOnce({
      data: { items: mockInactiveUsers, total: 2, page: 1, limit: 100, totalPages: 1 },
      error: undefined,
    });
    mockPostUsersByIdRestore.mockResolvedValueOnce({
      data: { id: 'user-1', username: 'deleteduser1', isActive: true },
      error: undefined,
    });

    renderWithIntl(<RestoreUsersDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('deleteduser1')).toBeInTheDocument();
    });

    const restoreButton = screen.getByTestId('restore-user-user-1');
    await user.click(restoreButton);

    await waitFor(() => {
      expect(screen.queryByText('deleteduser1')).not.toBeInTheDocument();
      expect(screen.getByText('deletedadmin')).toBeInTheDocument();
    });
  });

  it('handles error when restoring user fails', async () => {
    const user = userEvent.setup({ delay: null });

    mockGetUsersInactive.mockResolvedValueOnce({
      data: { items: mockInactiveUsers, total: 2, page: 1, limit: 100, totalPages: 1 },
      error: undefined,
    });
    mockPostUsersByIdRestore.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
    });

    renderWithIntl(<RestoreUsersDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('deleteduser1')).toBeInTheDocument();
    });

    const restoreButton = screen.getByTestId('restore-user-user-1');
    await user.click(restoreButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('An internal server error occurred');
    });
  });

  it('handles exception when restoring user', async () => {
    const user = userEvent.setup({ delay: null });

    mockGetUsersInactive.mockResolvedValueOnce({
      data: { items: mockInactiveUsers, total: 2, page: 1, limit: 100, totalPages: 1 },
      error: undefined,
    });
    mockPostUsersByIdRestore.mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<RestoreUsersDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('deleteduser1')).toBeInTheDocument();
    });

    const restoreButton = screen.getByTestId('restore-user-user-1');
    await user.click(restoreButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to restore user');
    });
  });
});
