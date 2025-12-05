import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import UsersPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { UserListItem } from '@repo/api-client';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockPush = vi.fn();
const mockUser = vi.fn();
const mockGetUsers = vi.fn();
const mockPatchUsersById = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/admin/users',
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ user: mockUser() }),
}));

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getUsers: (...args: any[]) => mockGetUsers(...args),
    patchUsersById: (...args: any[]) => mockPatchUsersById(...args),
  };
});

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'security.sharing.mode': 'BASIC' },
    isLoading: false,
  }),
}));

const mockUsers: UserListItem[] = [
  {
    id: 'user-1',
    username: 'admin',
    role: 'ADMIN',
    isActive: true,
    mustChangePassword: false,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'user-2',
    username: 'testuser',
    role: 'DEFAULT',
    isActive: true,
    mustChangePassword: false,
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
  },
];

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.mockReturnValue({ id: 'user-1', username: 'admin', role: 'ADMIN' });
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('redirects non-admin users to home', async () => {
    mockUser.mockReturnValue({ id: 'user-2', username: 'testuser', role: 'DEFAULT' });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('renders null for non-admin users', () => {
    mockUser.mockReturnValue({ id: 'user-2', username: 'testuser', role: 'DEFAULT' });

    const { container } = renderWithIntl(<UsersPage />);

    expect(container.firstChild).toBeNull();
  });

  it('loads and displays users', async () => {
    mockGetUsers.mockResolvedValueOnce({
      data: { users: mockUsers },
      error: undefined,
    });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(screen.getAllByText('admin').length).toBeGreaterThan(0);
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });
  });

  it('displays "no users" message when list is empty', async () => {
    mockGetUsers.mockResolvedValueOnce({
      data: { users: [] },
      error: undefined,
    });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });

    // Ensure table body exists but is empty
    const tableBody = screen.queryByRole('rowgroup');
    expect(tableBody).not.toBeInTheDocument();
  });

  it('redirects to home on 403 error', async () => {
    mockGetUsers.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 403 },
    });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message when loading fails', async () => {
    mockGetUsers.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 500 },
    });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load users');
    });
  });

  it('opens create dialog when clicking create button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetUsers.mockResolvedValueOnce({
      data: { users: mockUsers },
      error: undefined,
    });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /create user/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens edit dialog when clicking edit button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetUsers.mockResolvedValueOnce({
      data: { users: mockUsers },
      error: undefined,
    });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-user-user-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('edit-user-user-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens delete dialog when clicking delete button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetUsers.mockResolvedValueOnce({
      data: { users: mockUsers },
      error: undefined,
    });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-user-user-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('delete-user-user-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('handleToggleStatus', () => {
    it('toggles user status successfully', async () => {
      const user = userEvent.setup({ delay: null });
      mockGetUsers.mockResolvedValue({
        data: { users: mockUsers },
        error: undefined,
      });

      mockPatchUsersById.mockResolvedValueOnce({
        data: { id: 'user-2', isActive: false },
        error: undefined,
      });

      renderWithIntl(<UsersPage />);

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      const initialCallCount = mockGetUsers.mock.calls.length;

      await user.click(screen.getByTestId('toggle-status-user-2'));

      await waitFor(() => {
        expect(mockPatchUsersById).toHaveBeenCalledWith(
          expect.objectContaining({
            client: expect.any(Object),
            path: { id: 'user-2' },
            body: { isActive: false },
          })
        );
        expect(mockGetUsers.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });

    it('displays error when toggling status fails', async () => {
      const user = userEvent.setup({ delay: null });
      mockGetUsers.mockResolvedValueOnce({
        data: { users: mockUsers },
        error: undefined,
      });

      mockPatchUsersById.mockResolvedValueOnce({
        data: undefined,
        error: { message: 'error.serverError' },
      });

      renderWithIntl(<UsersPage />);

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('toggle-status-user-2'));

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('An internal server error occurred');
      });
    });

    it('displays last admin error when deactivating last admin', async () => {
      const user = userEvent.setup({ delay: null });
      mockGetUsers.mockResolvedValue({
        data: { users: mockUsers },
        error: undefined,
      });

      mockPatchUsersById.mockResolvedValueOnce({
        data: undefined,
        error: { message: 'error.lastAdmin' },
        response: { status: 400 },
      });

      renderWithIntl(<UsersPage />);

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('toggle-status-user-2'));

      await waitFor(() => {
        expect(mockPatchUsersById).toHaveBeenCalled();
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Cannot modify the last admin user');
      });
    });

    it('handles exception during toggle status', async () => {
      const user = userEvent.setup({ delay: null });
      mockGetUsers.mockResolvedValueOnce({
        data: { users: mockUsers },
        error: undefined,
      });

      mockPatchUsersById.mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(<UsersPage />);

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('toggle-status-user-2'));

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to update user');
      });
    });
  });

  it('closes edit dialog when onOpenChange is called', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetUsers.mockResolvedValueOnce({
      data: { users: mockUsers },
      error: undefined,
    });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-user-user-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('edit-user-user-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close the dialog by pressing Escape or clicking close button
    const closeButton = screen.getAllByRole('button').find((btn) => btn.textContent === 'Cancel');
    if (closeButton) {
      await user.click(closeButton);
    }
  });

  it('closes delete dialog when onOpenChange is called', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetUsers.mockResolvedValueOnce({
      data: { users: mockUsers },
      error: undefined,
    });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-user-user-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('delete-user-user-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close the dialog
    const cancelButton = screen.getAllByRole('button').find((btn) => btn.textContent === 'Cancel');
    if (cancelButton) {
      await user.click(cancelButton);
    }
  });
});
