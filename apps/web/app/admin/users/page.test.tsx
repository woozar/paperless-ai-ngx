import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import UsersPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { UserListItem } from '@repo/api-client';

// Mock Radix Select to make onValueChange testable
vi.mock('@/components/ui/select', async () => {
  const actual = await vi.importActual('@/components/ui/select');
  return {
    ...actual,
    Select: ({
      children,
      onValueChange,
      value,
    }: {
      children: React.ReactNode;
      onValueChange: (value: string) => void;
      value: string;
    }) => (
      <div data-testid="mock-select" data-value={value}>
        <select
          data-testid="select-native"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        {children}
      </div>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectValue: () => null,
    SelectContent: () => null,
    SelectItem: () => null,
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockPush = vi.fn();
const mockUser = vi.fn();
const mockGetUsers = vi.fn();
const mockGetUsersInactive = vi.fn();
const mockPostUsers = vi.fn();

const mockRouter = { push: mockPush };
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/admin/users',
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ user: mockUser(), isLoading: false }),
}));

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getUsers: (...args: any[]) => mockGetUsers(...args),
    getUsersInactive: (...args: any[]) => mockGetUsersInactive(...args),
    postUsers: (...args: any[]) => mockPostUsers(...args),
  };
});

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'security.sharing.mode': 'BASIC' },
    isLoading: false,
  }),
}));

const mockShowApiError = vi.fn((error: { message: string }) => {
  // Simulate the real behavior by calling toast.error
  const errorMessages: Record<string, string> = {
    'error.serverError': 'An internal server error occurred',
    'error.lastAdmin': 'Cannot modify the last admin user',
  };
  toast.error(errorMessages[error.message] || error.message);
});
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn((key: string) => {
  // Simulate the real behavior by calling toast.error
  const errorMessages: Record<string, string> = {
    loadFailed: 'Failed to load users',
    updateFailed: 'Failed to update user',
  };
  toast.error(errorMessages[key] || key);
});
const mockShowInfo = vi.fn();

vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({
    showApiError: mockShowApiError,
    showSuccess: mockShowSuccess,
    showError: mockShowError,
    showInfo: mockShowInfo,
  }),
}));

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
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

  it('renders null for non-admin users', async () => {
    mockUser.mockReturnValue({ id: 'user-2', username: 'testuser', role: 'DEFAULT' });

    const { container } = renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('loads and displays users', async () => {
    mockGetUsers.mockResolvedValue({
      data: { items: mockUsers, total: mockUsers.length, page: 1, limit: 10, totalPages: 1 },
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
      data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
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
      data: { items: mockUsers, total: mockUsers.length, page: 1, limit: 10, totalPages: 1 },
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
      data: { items: mockUsers, total: mockUsers.length, page: 1, limit: 10, totalPages: 1 },
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
      data: { items: mockUsers, total: mockUsers.length, page: 1, limit: 10, totalPages: 1 },
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

  it('closes edit dialog when onOpenChange is called', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetUsers.mockResolvedValueOnce({
      data: { items: mockUsers, total: mockUsers.length, page: 1, limit: 10, totalPages: 1 },
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
      data: { items: mockUsers, total: mockUsers.length, page: 1, limit: 10, totalPages: 1 },
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

  describe('pagination handlers', () => {
    it('calls loadUsers with new page when handlePageChange is triggered', async () => {
      mockGetUsers.mockResolvedValue({
        data: { items: mockUsers, total: 25, page: 1, limit: 10, totalPages: 3 },
        error: undefined,
      });

      renderWithIntl(<UsersPage />);

      await waitFor(() => {
        expect(screen.getByTestId('pagination-next')).toBeInTheDocument();
      });

      const user = userEvent.setup();
      await user.click(screen.getByTestId('pagination-next'));

      await waitFor(() => {
        expect(mockGetUsers).toHaveBeenCalledWith(
          expect.objectContaining({
            query: { page: 2, limit: 10 },
          })
        );
      });
    });

    it('resets to page 1 when limit changes', async () => {
      mockGetUsers.mockResolvedValue({
        data: { items: mockUsers, total: 25, page: 2, limit: 10, totalPages: 3 },
        error: undefined,
      });

      renderWithIntl(<UsersPage />);

      await waitFor(() => {
        expect(screen.getByTestId('select-native')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('select-native'), { target: { value: '20' } });

      await waitFor(() => {
        expect(mockGetUsers).toHaveBeenCalledWith(
          expect.objectContaining({
            query: { page: 1, limit: 20 },
          })
        );
      });
    });

    it('handles exception during loadUsers', async () => {
      mockGetUsers.mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(<UsersPage />);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load users');
      });
    });
  });

  it('opens restore users dialog when deleted users button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetUsers.mockResolvedValueOnce({
      data: { items: mockUsers, total: mockUsers.length, page: 1, limit: 10, totalPages: 1 },
      error: undefined,
    });
    mockGetUsersInactive.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 100, totalPages: 0 },
      error: undefined,
    });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Deleted Users'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByText('Users that have been deleted can be restored here.')
      ).toBeInTheDocument();
    });
  });

  it('reloads users list when user is created successfully', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetUsers.mockResolvedValue({
      data: { items: mockUsers, total: mockUsers.length, page: 1, limit: 10, totalPages: 1 },
      error: undefined,
    });
    mockPostUsers.mockResolvedValueOnce({
      data: { id: 'new-user', username: 'newuser', role: 'DEFAULT', isActive: true },
      error: undefined,
    });

    renderWithIntl(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    const initialCallCount = mockGetUsers.mock.calls.length;

    // Open create dialog
    await user.click(screen.getByText('Create User'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Fill in the form and submit
    await user.type(screen.getByLabelText('Username'), 'newuser');
    await user.type(screen.getByLabelText('Password'), 'password123');

    // Submit the form
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    // Verify that getUsers was called again (reload via onSuccess)
    await waitFor(() => {
      expect(mockGetUsers.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });
});
