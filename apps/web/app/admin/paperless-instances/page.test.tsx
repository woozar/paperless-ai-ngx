import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import PaperlessInstancesPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { PaperlessInstanceListItem } from '@repo/api-client';

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
          <option value="">Select...</option>
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
const mockGetPaperlessInstances = vi.fn();
const mockPostPaperlessInstancesByIdImport = vi.fn();
const mockGetPaperlessInstancesByIdStats = vi.fn();

const mockRouter = { push: mockPush };
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/admin/paperless-instances',
}));

const mockIsAuthLoading = vi.fn();
vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ user: mockUser(), isLoading: mockIsAuthLoading() }),
}));

const mockSettings = vi.fn();
vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockSettings(),
}));

const mockPostPaperlessInstances = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getPaperlessInstances: (...args: any[]) => mockGetPaperlessInstances(...args),
    postPaperlessInstancesByIdImport: (...args: any[]) =>
      mockPostPaperlessInstancesByIdImport(...args),
    getPaperlessInstancesByIdStats: (...args: any[]) => mockGetPaperlessInstancesByIdStats(...args),
    postPaperlessInstances: (...args: any[]) => mockPostPaperlessInstances(...args),
  };
});

const mockShowApiError = vi.fn((error: { message: string }) => {
  const errorMessages: Record<string, string> = {
    'error.serverError': 'An internal server error occurred',
  };
  toast.error(errorMessages[error.message] || error.message);
});
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn((key: string) => {
  const errorMessages: Record<string, string> = {
    loadFailed: 'Failed to load Paperless instances',
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

const mockInstances: PaperlessInstanceListItem[] = [
  {
    id: 'instance-1',
    name: 'Production',
    apiUrl: 'http://paperless.prod:8000',
    apiToken: 'prod-token',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'instance-2',
    name: 'Development',
    apiUrl: 'http://localhost:8000',
    apiToken: 'dev-token',
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
  },
];

describe('PaperlessInstancesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.mockReturnValue({ id: 'user-1', username: 'admin', role: 'ADMIN' });
    mockIsAuthLoading.mockReturnValue(false);
    mockSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'BASIC' as const },
      updateSetting: vi.fn(),
    });
    mockGetPaperlessInstancesByIdStats.mockResolvedValue({
      data: { documents: 0, processingQueue: 0 },
    });
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('does not load instances while auth is loading', async () => {
    mockIsAuthLoading.mockReturnValue(true);

    renderWithIntl(<PaperlessInstancesPage />);

    // Should not call the API while auth is loading
    expect(mockGetPaperlessInstances).not.toHaveBeenCalled();
  });

  it('loads and displays instances', async () => {
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: {
        items: mockInstances,
        total: mockInstances.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByText('Production')).toBeInTheDocument();
      expect(screen.getByText('Development')).toBeInTheDocument();
    });
  });

  it('displays "no instances" message when list is empty', async () => {
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByText(/no instances/i)).toBeInTheDocument();
    });
  });

  it('redirects to home on 403 error', async () => {
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 403 },
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message when loading fails', async () => {
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 500 },
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('opens create dialog when clicking create button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: {
        items: mockInstances,
        total: mockInstances.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create instance/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /create instance/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens edit dialog when clicking edit button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: {
        items: mockInstances,
        total: mockInstances.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-instance-instance-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('edit-instance-instance-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens delete dialog when clicking delete button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: {
        items: mockInstances,
        total: mockInstances.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-instance-instance-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('delete-instance-instance-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('closes edit dialog when onOpenChange is called', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: {
        items: mockInstances,
        total: mockInstances.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-instance-instance-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('edit-instance-instance-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getAllByRole('button').find((btn) => btn.textContent === 'Cancel');
    if (cancelButton) {
      await user.click(cancelButton);
    }
  });

  it('closes delete dialog when onOpenChange is called', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: {
        items: mockInstances,
        total: mockInstances.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-instance-instance-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('delete-instance-instance-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getAllByRole('button').find((btn) => btn.textContent === 'Cancel');
    if (cancelButton) {
      await user.click(cancelButton);
    }
  });

  it('displays skeleton while loading instances', async () => {
    let resolveLoad: (value: { data: any; error: any }) => void;
    const loadPromise = new Promise<{ data: any; error: any }>((resolve) => {
      resolveLoad = resolve;
    });
    mockGetPaperlessInstances.mockReturnValue(loadPromise);

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    resolveLoad!({
      data: {
        items: mockInstances,
        total: mockInstances.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });

    await waitFor(() => {
      expect(screen.getByText('Production')).toBeInTheDocument();
    });
  });

  it('shows success toast when import succeeds', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: {
        items: mockInstances,
        total: mockInstances.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });
    mockPostPaperlessInstancesByIdImport.mockResolvedValueOnce({
      data: { imported: 5, total: 10, skipped: 5 },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('import-instance-instance-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('import-instance-instance-1'));

    await waitFor(() => {
      expect(mockPostPaperlessInstancesByIdImport).toHaveBeenCalledWith(
        expect.objectContaining({
          path: { id: 'instance-1' },
        })
      );
      expect(vi.mocked(toast.success)).toHaveBeenCalled();
    });
  });

  it('shows error toast when import fails with API error', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: {
        items: mockInstances,
        total: mockInstances.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });
    mockPostPaperlessInstancesByIdImport.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'Import failed' },
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('import-instance-instance-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('import-instance-instance-1'));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('shows error toast when import throws exception', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: {
        items: mockInstances,
        total: mockInstances.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });
    mockPostPaperlessInstancesByIdImport.mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('import-instance-instance-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('import-instance-instance-1'));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  describe('pagination handlers', () => {
    it('calls loadInstances with new page when handlePageChange is triggered', async () => {
      mockGetPaperlessInstances.mockResolvedValue({
        data: { items: mockInstances, total: 25, page: 1, limit: 10, totalPages: 3 },
        error: undefined,
      });

      renderWithIntl(<PaperlessInstancesPage />);

      await waitFor(() => {
        expect(screen.getByTestId('pagination-next')).toBeInTheDocument();
      });

      const user = userEvent.setup();
      await user.click(screen.getByTestId('pagination-next'));

      await waitFor(() => {
        expect(mockGetPaperlessInstances).toHaveBeenCalledWith(
          expect.objectContaining({
            query: { page: 2, limit: 10 },
          })
        );
      });
    });

    it('resets to page 1 when limit changes', async () => {
      mockGetPaperlessInstances.mockResolvedValue({
        data: { items: mockInstances, total: 25, page: 2, limit: 10, totalPages: 3 },
        error: undefined,
      });

      renderWithIntl(<PaperlessInstancesPage />);

      await waitFor(() => {
        expect(screen.getByTestId('select-native')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('select-native'), { target: { value: '20' } });

      await waitFor(() => {
        expect(mockGetPaperlessInstances).toHaveBeenCalledWith(
          expect.objectContaining({
            query: { page: 1, limit: 20 },
          })
        );
      });
    });

    it('handles exception during loadInstances', async () => {
      mockGetPaperlessInstances.mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(<PaperlessInstancesPage />);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load Paperless instances');
      });
    });
  });

  describe('share dialog', () => {
    it('opens and closes share dialog when share button is clicked in ADVANCED mode', async () => {
      const user = userEvent.setup({ delay: null });
      mockSettings.mockReturnValue({
        settings: { 'security.sharing.mode': 'ADVANCED' as const },
        updateSetting: vi.fn(),
      });

      const instancesWithOwner = mockInstances.map((instance) => ({
        ...instance,
        isOwner: true,
        canEdit: true,
      }));
      mockGetPaperlessInstances.mockResolvedValueOnce({
        data: {
          items: instancesWithOwner,
          total: instancesWithOwner.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        error: undefined,
      });

      renderWithIntl(<PaperlessInstancesPage />);

      await waitFor(() => {
        expect(screen.getByTestId('share-instance-instance-1')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('share-instance-instance-1'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Close by pressing escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('reloadCurrentPage via dialog success', () => {
    it('reloads instances when create dialog calls onSuccess', async () => {
      const user = userEvent.setup({ delay: null });

      mockGetPaperlessInstances.mockResolvedValue({
        data: {
          items: mockInstances,
          total: mockInstances.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        error: undefined,
      });

      mockPostPaperlessInstances.mockResolvedValue({
        data: { id: 'new-instance', name: 'New Instance' },
        error: undefined,
      });

      renderWithIntl(<PaperlessInstancesPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create instance/i })).toBeInTheDocument();
      });

      const initialCallCount = mockGetPaperlessInstances.mock.calls.length;

      // Open create dialog
      await user.click(screen.getByRole('button', { name: /create instance/i }));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Fill the form - name, apiUrl, and apiToken inputs
      const nameInput = screen.getByTestId('create-instance-name-input');
      const apiUrlInput = screen.getByTestId('create-instance-apiUrl-input');
      const apiTokenInput = screen.getByTestId('create-instance-apiToken-input');

      await user.type(nameInput, 'New Instance');
      await user.type(apiUrlInput, 'http://paperless.local:8000');
      await user.type(apiTokenInput, 'test-token');

      // Submit the form
      const submitButton = screen.getByTestId('create-instance-submit-button');
      await user.click(submitButton);

      // Verify that onSuccess was triggered which calls reloadCurrentPage
      await waitFor(() => {
        expect(mockGetPaperlessInstances.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });
  });
});
