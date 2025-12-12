import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { PaperlessInstancesContent } from './paperless-instances-content';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { PaperlessInstanceListItem } from '@repo/api-client';

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

const mockGetPaperlessInstances = vi.fn();
const mockPostPaperlessInstancesByIdImport = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getPaperlessInstances: (...args: any[]) => mockGetPaperlessInstances(...args),
    postPaperlessInstancesByIdImport: (...args: any[]) =>
      mockPostPaperlessInstancesByIdImport(...args),
  };
});

const mockShowError = vi.fn((key: string) => {
  const errorMessages: Record<string, string> = {
    loadFailed: 'Failed to load Paperless instances',
    importFailed: 'Import failed',
  };
  toast.error(errorMessages[key] || key);
});

vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({
    showError: mockShowError,
    showApiError: vi.fn(),
    showSuccess: vi.fn(),
    showInfo: vi.fn(),
  }),
}));

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
}));

vi.mock('@/hooks/use-format-date', () => ({
  useFormatDate: () => (dateString: string) => new Date(dateString).toLocaleDateString(),
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ isLoading: false }),
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'security.sharing.mode': 'BASIC' as const },
    updateSetting: vi.fn(),
  }),
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock the components imported from paperless-instances
vi.mock('../../paperless-instances/_components', () => ({
  InstanceTableSkeleton: () => (
    <tr>
      <td colSpan={4}>
        <div data-slot="skeleton">Loading...</div>
      </td>
    </tr>
  ),
  InstanceTableRow: ({
    instance,
    onImport,
    onEdit,
    onDelete,
    onShare,
    onFilter,
    isImporting,
  }: {
    instance: any;
    onImport: (instance: any) => void;
    onEdit: (instance: any) => void;
    onDelete: (instance: any) => void;
    onShare: (instance: any) => void;
    onFilter: (instance: any) => void;
    isImporting: boolean;
  }) => (
    <tr data-testid={`instance-row-${instance.id}`}>
      <td>{instance.name}</td>
      <td>{instance.apiUrl}</td>
      <td>{new Date(instance.createdAt).toLocaleDateString()}</td>
      <td>
        <button
          data-testid={`import-instance-${instance.id}`}
          onClick={() => onImport(instance)}
          disabled={isImporting}
        >
          {isImporting ? 'Importing...' : 'Import'}
        </button>
        <button data-testid={`edit-instance-${instance.id}`} onClick={() => onEdit(instance)}>
          Edit
        </button>
        <button data-testid={`delete-instance-${instance.id}`} onClick={() => onDelete(instance)}>
          Delete
        </button>
        <button data-testid={`share-instance-${instance.id}`} onClick={() => onShare(instance)}>
          Share
        </button>
        <button data-testid={`filter-instance-${instance.id}`} onClick={() => onFilter(instance)}>
          Filter
        </button>
      </td>
    </tr>
  ),
  CreateInstanceDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Create Dialog</div> : null,
  EditInstanceDialog: ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div role="dialog">
        Edit Dialog
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
  DeleteInstanceDialog: ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div role="dialog">
        Delete Dialog
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
  ImportFilterDialog: ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div role="dialog">
        Import Filter Dialog
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
}));

// Mock ShareDialog
vi.mock('@/components/sharing/share-dialog', () => ({
  ShareDialog: ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div role="dialog">
        Share Dialog
        <button data-testid="close-share-dialog" onClick={() => onOpenChange(false)}>
          Close
        </button>
      </div>
    ) : null,
}));

const mockInstances: Omit<PaperlessInstanceListItem, 'apiToken'>[] = [
  {
    id: 'instance-1',
    name: 'Production',
    apiUrl: 'http://paperless.prod:8000',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'instance-2',
    name: 'Development',
    apiUrl: 'http://localhost:8000',
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
  },
];

describe('PaperlessInstancesContent', () => {
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

    renderWithIntl(<PaperlessInstancesContent />);

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

    renderWithIntl(<PaperlessInstancesContent />);

    await waitFor(() => {
      expect(screen.getByText(/no instances/i)).toBeInTheDocument();
    });
  });

  it('displays error when loading fails', async () => {
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 500 },
    });

    renderWithIntl(<PaperlessInstancesContent />);

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

    renderWithIntl(<PaperlessInstancesContent />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create instance/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /create instance/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('displays skeleton while loading', async () => {
    let resolveLoad: (value: { data: any; error: any }) => void;
    const loadPromise = new Promise<{ data: any; error: any }>((resolve) => {
      resolveLoad = resolve;
    });
    mockGetPaperlessInstances.mockReturnValue(loadPromise);

    renderWithIntl(<PaperlessInstancesContent />);

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

  it('handles successful import', async () => {
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

    renderWithIntl(<PaperlessInstancesContent />);

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

  it('handles import failure with API error', async () => {
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

    renderWithIntl(<PaperlessInstancesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('import-instance-instance-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('import-instance-instance-1'));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('handles import failure with exception', async () => {
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

    renderWithIntl(<PaperlessInstancesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('import-instance-instance-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('import-instance-instance-1'));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('handles pagination', async () => {
    mockGetPaperlessInstances.mockResolvedValue({
      data: { items: mockInstances, total: 25, page: 1, limit: 10, totalPages: 3 },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesContent />);

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

    renderWithIntl(<PaperlessInstancesContent />);

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

  it('handles exception during load', async () => {
    mockGetPaperlessInstances.mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<PaperlessInstancesContent />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load Paperless instances');
    });
  });

  it('opens and closes share dialog', async () => {
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

    renderWithIntl(<PaperlessInstancesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('share-instance-instance-1')).toBeInTheDocument();
    });

    // Open share dialog
    await user.click(screen.getByTestId('share-instance-instance-1'));

    await waitFor(() => {
      expect(screen.getByText('Share Dialog')).toBeInTheDocument();
    });

    // Close share dialog
    await user.click(screen.getByTestId('close-share-dialog'));

    await waitFor(() => {
      expect(screen.queryByText('Share Dialog')).not.toBeInTheDocument();
    });
  });

  it('opens and closes edit dialog', async () => {
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

    renderWithIntl(<PaperlessInstancesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-instance-instance-1')).toBeInTheDocument();
    });

    // Open edit dialog
    await user.click(screen.getByTestId('edit-instance-instance-1'));

    await waitFor(() => {
      expect(screen.getByText('Edit Dialog')).toBeInTheDocument();
    });

    // Close edit dialog via onOpenChange(false)
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByText('Edit Dialog')).not.toBeInTheDocument();
    });
  });

  it('opens and closes delete dialog', async () => {
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

    renderWithIntl(<PaperlessInstancesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-instance-instance-1')).toBeInTheDocument();
    });

    // Open delete dialog
    await user.click(screen.getByTestId('delete-instance-instance-1'));

    await waitFor(() => {
      expect(screen.getByText('Delete Dialog')).toBeInTheDocument();
    });

    // Close delete dialog via onOpenChange(false)
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByText('Delete Dialog')).not.toBeInTheDocument();
    });
  });
});
