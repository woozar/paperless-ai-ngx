import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { ShareDialog } from './share-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';

// Mock the API client functions
vi.mock('@repo/api-client', () => ({
  getAiProvidersByIdSharing: vi.fn(),
  postAiProvidersByIdSharing: vi.fn(),
  deleteAiProvidersByIdSharingByAccessId: vi.fn(),
  getAiBotsByIdSharing: vi.fn(),
  postAiBotsByIdSharing: vi.fn(),
  deleteAiBotsByIdSharingByAccessId: vi.fn(),
  getPaperlessInstancesByIdSharing: vi.fn(),
  postPaperlessInstancesByIdSharing: vi.fn(),
  deletePaperlessInstancesByIdSharingByAccessId: vi.fn(),
  getUsers: vi.fn(),
}));

// Mock useApi hook
vi.mock('@/lib/use-api', () => ({
  useApi: vi.fn(() => ({})),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

import {
  getAiProvidersByIdSharing,
  postAiProvidersByIdSharing,
  deleteAiProvidersByIdSharingByAccessId,
  getUsers,
} from '@repo/api-client';
import type { ShareAccessItem } from '@/lib/api/schemas/sharing';

// Helper to create mock API responses - using 'as any' for simplicity in tests
const mockShareList = (items: ShareAccessItem[]) =>
  ({ data: { items }, error: undefined, request: {}, response: {} }) as any;

const mockUserList = (items: { id: string; username: string }[]) =>
  ({
    data: {
      items: items.map((u) => ({
        ...u,
        role: 'DEFAULT' as const,
        isActive: true,
        mustChangePassword: false,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      })),
      total: items.length,
      totalPages: 1,
      page: 1,
      limit: 100,
    },
    error: undefined,
    request: {},
    response: {},
  }) as any;

const mockShareItem = (item: ShareAccessItem) =>
  ({ data: item, error: undefined, request: {}, response: {} }) as any;

const mockError = (message: string) =>
  ({ data: undefined, error: { error: message, message }, request: {}, response: {} }) as any;

const mockDeleteResponse = () =>
  ({ data: undefined, error: undefined, request: {}, response: {} }) as any;

describe('ShareDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    resourceType: 'ai-providers' as const,
    resourceId: 'provider-1',
    resourceName: 'Test Provider',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders dialog when open', async () => {
      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockShareList([]));
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      expect(screen.getByText('Test Provider')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      renderWithIntl(<ShareDialog {...defaultProps} open={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows loading state while fetching shares', async () => {
      vi.mocked(getAiProvidersByIdSharing).mockImplementation(
        (() => new Promise((resolve) => setTimeout(() => resolve(mockShareList([])), 100))) as any
      );
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('shows empty message when no shares exist', async () => {
      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockShareList([]));
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/not shared with anyone/i)).toBeInTheDocument();
      });
    });
  });

  describe('displaying shares', () => {
    it('displays list of existing shares', async () => {
      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareList([
          {
            id: 'access-1',
            userId: 'user-2',
            username: 'otheruser',
            permission: 'READ',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ])
      );
      vi.mocked(getUsers).mockResolvedValueOnce(
        mockUserList([{ id: 'user-3', username: 'thirduser' }])
      );

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });
    });

    it('displays "All Users" for shares with null userId', async () => {
      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareList([
          {
            id: 'access-1',
            userId: null,
            username: null,
            permission: 'WRITE',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ])
      );
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/All Users/i)).toBeInTheDocument();
      });
    });
  });

  describe('adding shares', () => {
    it('adds share for specific user', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockShareList([]));
      vi.mocked(getUsers).mockResolvedValueOnce(
        mockUserList([{ id: 'user-2', username: 'otheruser' }])
      );
      vi.mocked(postAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareItem({
          id: 'access-1',
          userId: 'user-2',
          username: 'otheruser',
          permission: 'READ',
          createdAt: '2024-01-15T10:00:00Z',
        })
      );

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.queryByText(/not shared with anyone/i)).toBeInTheDocument();
      });

      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);

      const option = await screen.findByRole('option', { name: /otheruser/i });
      await user.click(option);

      const addButton = screen.getByTestId('add-share-button');
      await user.click(addButton);

      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });

    it('adds share for all users', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockShareList([]));
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));
      vi.mocked(postAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareItem({
          id: 'access-1',
          userId: null,
          username: null,
          permission: 'READ',
          createdAt: '2024-01-15T10:00:00Z',
        })
      );

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);

      const allUsersOption = await screen.findByRole('option', { name: /All Users/i });
      await user.click(allUsersOption);

      const addButton = screen.getByTestId('add-share-button');
      await user.click(addButton);

      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });

    it('hides "All Users" option when already shared with all', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareList([
          {
            id: 'access-1',
            userId: null,
            username: null,
            permission: 'WRITE',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ])
      );
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);

      expect(screen.queryByRole('option', { name: /All Users/i })).not.toBeInTheDocument();
    });

    it('shows error toast on API failure', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockShareList([]));
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));
      vi.mocked(postAiProvidersByIdSharing).mockResolvedValueOnce(mockError('serverError'));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);
      const allUsersOption = await screen.findByRole('option', { name: /All Users/i });
      await user.click(allUsersOption);

      const addButton = screen.getByTestId('add-share-button');
      await user.click(addButton);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });
  });

  describe('removing shares', () => {
    it('removes share when clicking remove button', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareList([
          {
            id: 'access-1',
            userId: 'user-2',
            username: 'otheruser',
            permission: 'READ',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ])
      );
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));
      vi.mocked(deleteAiProvidersByIdSharingByAccessId).mockResolvedValueOnce(mockDeleteResponse());

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });

      const removeButton = screen.getByTestId('remove-share-access-1');
      await user.click(removeButton);

      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });

    it('shows error toast when remove fails', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareList([
          {
            id: 'access-1',
            userId: 'user-2',
            username: 'otheruser',
            permission: 'READ',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ])
      );
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));
      vi.mocked(deleteAiProvidersByIdSharingByAccessId).mockResolvedValueOnce(
        mockError('serverError')
      );

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });

      const removeButton = screen.getByTestId('remove-share-access-1');
      await user.click(removeButton);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });

    it('shows error toast when remove network fails', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareList([
          {
            id: 'access-1',
            userId: 'user-2',
            username: 'otheruser',
            permission: 'READ',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ])
      );
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));
      vi.mocked(deleteAiProvidersByIdSharingByAccessId).mockRejectedValueOnce(
        new Error('Network error')
      );

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });

      const removeButton = screen.getByTestId('remove-share-access-1');
      await user.click(removeButton);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });
  });

  describe('inline editing', () => {
    it('allows changing permission for new share', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockShareList([]));
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.queryByText(/not shared with anyone/i)).toBeInTheDocument();
      });

      const permissionSelect = screen.getByTestId('new-share-permission-select');
      await user.click(permissionSelect);

      const writeOption = await screen.findByRole('option', { name: /write/i });
      await user.click(writeOption);

      expect(screen.getByTestId('new-share-permission-select')).toBeInTheDocument();
    });

    it('auto-saves when permission is changed for existing share', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareList([
          {
            id: 'access-1',
            userId: 'user-2',
            username: 'otheruser',
            permission: 'READ',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ])
      );
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));
      vi.mocked(postAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareItem({
          id: 'access-1',
          userId: 'user-2',
          username: 'otheruser',
          permission: 'WRITE',
          createdAt: '2024-01-15T10:00:00Z',
        })
      );

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });

      const permissionSelect = screen.getByTestId('permission-select-access-1');
      await user.click(permissionSelect);

      const writeOption = await screen.findByRole('option', { name: /write/i });
      await user.click(writeOption);

      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });

    it('shows error toast when permission update returns error', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareList([
          {
            id: 'access-1',
            userId: 'user-2',
            username: 'otheruser',
            permission: 'READ',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ])
      );
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));
      vi.mocked(postAiProvidersByIdSharing).mockResolvedValueOnce(mockError('serverError'));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });

      const permissionSelect = screen.getByTestId('permission-select-access-1');
      await user.click(permissionSelect);

      const writeOption = await screen.findByRole('option', { name: /write/i });
      await user.click(writeOption);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });

    it('shows error toast when permission update network fails', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareList([
          {
            id: 'access-1',
            userId: 'user-2',
            username: 'otheruser',
            permission: 'READ',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ])
      );
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));
      vi.mocked(postAiProvidersByIdSharing).mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });

      const permissionSelect = screen.getByTestId('permission-select-access-1');
      await user.click(permissionSelect);

      const writeOption = await screen.findByRole('option', { name: /write/i });
      await user.click(writeOption);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });
  });

  describe('network errors', () => {
    it('shows error toast when add share network fails', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockShareList([]));
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));
      vi.mocked(postAiProvidersByIdSharing).mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);
      const allUsersOption = await screen.findByRole('option', { name: /All Users/i });
      await user.click(allUsersOption);

      const addButton = screen.getByTestId('add-share-button');
      await user.click(addButton);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });

    it('shows error toast when load shares fails', async () => {
      vi.mocked(getAiProvidersByIdSharing).mockRejectedValueOnce(new Error('Network error'));
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });

    it('shows error toast when load shares returns error', async () => {
      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockError('serverError'));
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });

    it('silently handles when load users fails', async () => {
      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockShareList([]));
      vi.mocked(getUsers).mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      // Should still render dialog without error toast for users
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('silently handles when load users returns no data', async () => {
      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockShareList([]));
      vi.mocked(getUsers).mockResolvedValueOnce(mockError('serverError'));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      // Should still render dialog - users dropdown will just be empty
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('validation', () => {
    it('does not add share when in user mode without selected user', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockShareList([]));
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.queryByText(/not shared with anyone/i)).toBeInTheDocument();
      });

      const addButton = screen.getByTestId('add-share-button');
      await user.click(addButton);

      // Should not make a POST request
      expect(postAiProvidersByIdSharing).not.toHaveBeenCalled();
    });
  });

  describe('share updates', () => {
    it('adds new share when response succeeds', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(mockShareList([]));
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));
      vi.mocked(postAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareItem({
          id: 'access-1',
          userId: null,
          username: null,
          permission: 'READ',
          createdAt: '2024-01-15T10:00:00Z',
        })
      );

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);
      const allUsersOption = await screen.findByRole('option', { name: /All Users/i });
      await user.click(allUsersOption);

      const addButton = screen.getByTestId('add-share-button');
      await user.click(addButton);

      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });
  });

  describe('permission change edge cases', () => {
    it('does not call API when same permission is selected', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareList([
          {
            id: 'access-1',
            userId: 'user-2',
            username: 'otheruser',
            permission: 'READ',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ])
      );
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });

      const permissionSelect = screen.getByTestId('permission-select-access-1');
      await user.click(permissionSelect);

      const readOption = await screen.findByRole('option', { name: /read/i });
      await user.click(readOption);

      // Should not make a POST request
      expect(postAiProvidersByIdSharing).not.toHaveBeenCalled();
    });

    it('updates share in list when permission change succeeds with multiple shares', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(getAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareList([
          {
            id: 'access-1',
            userId: 'user-2',
            username: 'otheruser',
            permission: 'READ',
            createdAt: '2024-01-15T10:00:00Z',
          },
          {
            id: 'access-2',
            userId: 'user-3',
            username: 'thirduser',
            permission: 'WRITE',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ])
      );
      vi.mocked(getUsers).mockResolvedValueOnce(mockUserList([]));
      vi.mocked(postAiProvidersByIdSharing).mockResolvedValueOnce(
        mockShareItem({
          id: 'access-1',
          userId: 'user-2',
          username: 'otheruser',
          permission: 'WRITE',
          createdAt: '2024-01-15T10:00:00Z',
        })
      );

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
        expect(screen.getByText('thirduser')).toBeInTheDocument();
      });

      const permissionSelect = screen.getByTestId('permission-select-access-1');
      await user.click(permissionSelect);

      const writeOption = await screen.findByRole('option', { name: /write/i });
      await user.click(writeOption);

      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });
  });
});
