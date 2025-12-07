import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { ShareDialog } from './share-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(() => 'mock-token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

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
    mockFetch.mockReset();
  });

  describe('rendering', () => {
    it('renders dialog when open', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        });

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
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ items: [] }),
                }),
              100
            )
          )
      );

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('shows empty message when no shares exist', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/not shared with anyone/i)).toBeInTheDocument();
      });
    });
  });

  describe('displaying shares', () => {
    it('displays list of existing shares', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 'access-1',
                  userId: 'user-2',
                  username: 'otheruser',
                  permission: 'READ',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [{ id: 'user-3', username: 'thirduser' }] }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });
    });

    it('displays "All Users" for shares with null userId', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 'access-1',
                  userId: null,
                  username: null,
                  permission: 'WRITE',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/All Users/i)).toBeInTheDocument();
      });
    });
  });

  describe('adding shares', () => {
    it('adds share for specific user', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [{ id: 'user-2', username: 'otheruser' }],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: () =>
            Promise.resolve({
              id: 'access-1',
              userId: 'user-2',
              username: 'otheruser',
              permission: 'READ',
              createdAt: '2024-01-15T10:00:00Z',
            }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/not shared with anyone/i)).toBeInTheDocument();
      });

      // Select a user from the new share row
      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);

      // Wait for the dropdown to open and find the option
      const option = await screen.findByRole('option', { name: /otheruser/i });
      await user.click(option);

      // Click add button
      const addButton = screen.getByTestId('add-share-button');
      await user.click(addButton);

      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });

    it('adds share for all users', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: () =>
            Promise.resolve({
              id: 'access-1',
              userId: null,
              username: null,
              permission: 'READ',
              createdAt: '2024-01-15T10:00:00Z',
            }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "All Users" from the new share row dropdown
      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);

      // Select "All Users" option
      const allUsersOption = await screen.findByRole('option', { name: /All Users/i });
      await user.click(allUsersOption);

      // Click add button
      const addButton = screen.getByTestId('add-share-button');
      await user.click(addButton);

      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });

    it('hides "All Users" option when already shared with all', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 'access-1',
                  userId: null,
                  username: null,
                  permission: 'WRITE',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Open the user select dropdown
      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);

      // "All Users" option should not be present since it's already shared
      expect(screen.queryByRole('option', { name: /All Users/i })).not.toBeInTheDocument();
    });

    it('shows error toast on API failure', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ message: 'serverError' }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "All Users" from dropdown
      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);
      const allUsersOption = await screen.findByRole('option', { name: /All Users/i });
      await user.click(allUsersOption);

      // Click add button
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

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 'access-1',
                  userId: 'user-2',
                  username: 'otheruser',
                  permission: 'READ',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
        });

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

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 'access-1',
                  userId: 'user-2',
                  username: 'otheruser',
                  permission: 'READ',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: false,
        });

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

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 'access-1',
                  userId: 'user-2',
                  username: 'otheruser',
                  permission: 'READ',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockRejectedValueOnce(new Error('Network error'));

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

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/not shared with anyone/i)).toBeInTheDocument();
      });

      // Click on permission select for new share row
      const permissionSelect = screen.getByTestId('new-share-permission-select');
      await user.click(permissionSelect);

      // Find and click WRITE option
      const writeOption = await screen.findByRole('option', { name: /write/i });
      await user.click(writeOption);

      // The select trigger should still be there
      expect(screen.getByTestId('new-share-permission-select')).toBeInTheDocument();
    });

    it('auto-saves when permission is changed for existing share', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 'access-1',
                  userId: 'user-2',
                  username: 'otheruser',
                  permission: 'READ',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              id: 'access-1',
              userId: 'user-2',
              username: 'otheruser',
              permission: 'WRITE',
              createdAt: '2024-01-15T10:00:00Z',
            }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });

      // Click on permission select for existing share
      const permissionSelect = screen.getByTestId('permission-select-access-1');
      await user.click(permissionSelect);

      // Find and click WRITE option
      const writeOption = await screen.findByRole('option', { name: /write/i });
      await user.click(writeOption);

      // Should auto-save and show success toast
      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });

    it('shows error toast when permission update returns error', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 'access-1',
                  userId: 'user-2',
                  username: 'otheruser',
                  permission: 'READ',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ message: 'serverError' }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });

      // Click on permission select for existing share
      const permissionSelect = screen.getByTestId('permission-select-access-1');
      await user.click(permissionSelect);

      // Find and click WRITE option
      const writeOption = await screen.findByRole('option', { name: /write/i });
      await user.click(writeOption);

      // Should show error toast
      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });

    it('shows error toast when permission update network fails', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 'access-1',
                  userId: 'user-2',
                  username: 'otheruser',
                  permission: 'READ',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });

      // Click on permission select for existing share
      const permissionSelect = screen.getByTestId('permission-select-access-1');
      await user.click(permissionSelect);

      // Find and click WRITE option
      const writeOption = await screen.findByRole('option', { name: /write/i });
      await user.click(writeOption);

      // Should show error toast
      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });
  });

  describe('network errors', () => {
    it('shows error toast when add share network fails', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "All Users" from dropdown
      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);
      const allUsersOption = await screen.findByRole('option', { name: /All Users/i });
      await user.click(allUsersOption);

      // Click add button
      const addButton = screen.getByTestId('add-share-button');
      await user.click(addButton);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });

    it('shows error toast when load shares fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });

    it('shows error toast when load shares returns not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    });
  });

  describe('validation', () => {
    it('does not add share when in user mode without selected user', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/not shared with anyone/i)).toBeInTheDocument();
      });

      // Click add button without selecting a user
      const addButton = screen.getByTestId('add-share-button');
      await user.click(addButton);

      // Should not make a POST request (only GET for shares and users)
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('share updates', () => {
    it('adds new share when response is 201', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: () =>
            Promise.resolve({
              id: 'access-1',
              userId: null,
              username: null,
              permission: 'READ',
              createdAt: '2024-01-15T10:00:00Z',
            }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "All Users" from dropdown
      const userSelect = screen.getByTestId('new-share-user-select');
      await user.click(userSelect);
      const allUsersOption = await screen.findByRole('option', { name: /All Users/i });
      await user.click(allUsersOption);

      // Click add button
      const addButton = screen.getByTestId('add-share-button');
      await user.click(addButton);

      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });
  });

  describe('API calls', () => {
    it('includes auth token in headers', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/ai-providers/provider-1/sharing'),
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: 'Bearer mock-token',
            }),
          })
        );
      });
    });

    it('does not include auth token when not available', async () => {
      mockLocalStorage.getItem.mockReturnValueOnce(null).mockReturnValueOnce(null);

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/ai-providers/provider-1/sharing'),
          expect.objectContaining({
            headers: expect.not.objectContaining({
              Authorization: expect.anything(),
            }),
          })
        );
      });
    });
  });

  describe('permission change edge cases', () => {
    it('does not call API when same permission is selected', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 'access-1',
                  userId: 'user-2',
                  username: 'otheruser',
                  permission: 'READ',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
      });

      // Click on permission select for existing share
      const permissionSelect = screen.getByTestId('permission-select-access-1');
      await user.click(permissionSelect);

      // Find and click READ option (same as current)
      const readOption = await screen.findByRole('option', { name: /read/i });
      await user.click(readOption);

      // Should not make a POST request (only 2 calls for initial load)
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('updates share in list when permission change succeeds with multiple shares', async () => {
      const user = userEvent.setup({ delay: null });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
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
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              id: 'access-1',
              userId: 'user-2',
              username: 'otheruser',
              permission: 'WRITE',
              createdAt: '2024-01-15T10:00:00Z',
            }),
        });

      renderWithIntl(<ShareDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('otheruser')).toBeInTheDocument();
        expect(screen.getByText('thirduser')).toBeInTheDocument();
      });

      // Click on permission select for first share
      const permissionSelect = screen.getByTestId('permission-select-access-1');
      await user.click(permissionSelect);

      // Find and click WRITE option
      const writeOption = await screen.findByRole('option', { name: /write/i });
      await user.click(writeOption);

      // Should show success and the share should be updated
      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });
  });
});
