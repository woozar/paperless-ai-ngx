import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import DocumentsPage from './page';
import type { DocumentListItem } from '@repo/api-client';

const mockGetDocuments = vi.fn();

vi.mock('@repo/api-client', async () => ({
  getPaperlessInstancesByIdDocuments: (args: unknown) => mockGetDocuments(args),
}));

const mockShowError = vi.fn();
vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({ showError: mockShowError }),
}));

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'instance-123' }),
  useRouter: () => ({ push: mockPush }),
}));

const mockUser = { id: 'user-1', role: 'ADMIN' };
const mockUseAuth = vi.fn().mockReturnValue({ user: mockUser, isLoading: false });
vi.mock('@/components/auth-provider', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockFormatDateOnly = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
vi.mock('@/hooks/use-format-date', () => ({
  useFormatDateOnly: () => mockFormatDateOnly,
}));

vi.mock('@/components/app-shell', () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-shell">{children}</div>
  ),
}));

vi.mock('./_components', () => ({
  DocumentTableSkeleton: () => (
    <tr data-testid="skeleton">
      <td>Loading...</td>
    </tr>
  ),
  DocumentTableRow: ({
    document,
    onAnalyze,
    onViewResult,
    formatDate,
  }: {
    document: DocumentListItem;
    onAnalyze: (doc: DocumentListItem) => void;
    onViewResult: (doc: DocumentListItem) => void;
    formatDate: (date: string) => string;
  }) => (
    <tr data-testid={`row-${document.id}`}>
      <td>{document.title}</td>
      <td>{document.status}</td>
      <td>{formatDate(document.importedAt)}</td>
      <td>
        <button onClick={() => onAnalyze(document)} data-testid={`analyze-${document.id}`}>
          Analyze
        </button>
        <button onClick={() => onViewResult(document)} data-testid={`view-${document.id}`}>
          View
        </button>
      </td>
    </tr>
  ),
  AnalyzeDocumentDialog: ({
    open,
    document,
    onOpenChange,
    onSuccess,
  }: {
    open: boolean;
    document: DocumentListItem | null;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
  }) =>
    open ? (
      <div data-testid="analyze-dialog">
        {document?.title}
        <button onClick={() => onOpenChange(false)} data-testid="close-analyze-dialog">
          Close
        </button>
        <button onClick={() => onSuccess?.()} data-testid="trigger-success">
          Success
        </button>
      </div>
    ) : null,
  ViewResultDialog: ({
    open,
    document,
    onOpenChange,
  }: {
    open: boolean;
    document: DocumentListItem | null;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div data-testid="view-dialog">
        {document?.title}
        <button onClick={() => onOpenChange(false)} data-testid="close-view-dialog">
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock('@/components/table-pagination', () => ({
  TablePagination: ({
    onPageChange,
    onLimitChange,
  }: {
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  }) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(2)} data-testid="next-page">
        Next
      </button>
      <button onClick={() => onLimitChange(20)} data-testid="change-limit">
        20 per page
      </button>
    </div>
  ),
}));

const mockDocuments: DocumentListItem[] = [
  {
    id: 'doc-1',
    paperlessId: 100,
    title: 'Invoice 001',
    status: 'processed',
    importedAt: '2024-01-10T10:00:00Z',
    documentDate: '2024-01-05T00:00:00Z',
    lastProcessedAt: '2024-01-10T12:00:00Z',
  },
  {
    id: 'doc-2',
    paperlessId: 101,
    title: 'Contract 002',
    status: 'unprocessed',
    importedAt: '2024-01-11T10:00:00Z',
    documentDate: '2024-01-08T00:00:00Z',
    lastProcessedAt: null,
  },
];

describe('DocumentsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: mockUser, isLoading: false });
    mockGetDocuments.mockResolvedValue({
      data: {
        items: mockDocuments,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it('loads and displays documents', async () => {
    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-doc-1')).toBeInTheDocument();
    });

    expect(screen.getByText('Invoice 001')).toBeInTheDocument();
    expect(screen.getByText('Contract 002')).toBeInTheDocument();
  });

  it('shows skeleton while loading', async () => {
    mockGetDocuments.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 } }),
            100
          )
        )
    );

    renderWithIntl(<DocumentsPage />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('shows empty state when no documents', async () => {
    mockGetDocuments.mockResolvedValue({
      data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
    });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(
        screen.getByText('No documents found. Import documents from your Paperless instance first.')
      ).toBeInTheDocument();
    });
  });

  it('redirects to instances page on 403 error', async () => {
    mockGetDocuments.mockResolvedValue({
      error: { message: 'Forbidden' },
      response: { status: 403 },
    });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/paperless-instances');
    });
  });

  it('redirects to instances page on 404 error', async () => {
    mockGetDocuments.mockResolvedValue({
      error: { message: 'Not found' },
      response: { status: 404 },
    });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/paperless-instances');
    });
  });

  it('shows error on other API errors', async () => {
    mockGetDocuments.mockResolvedValue({
      error: { message: 'Server error' },
      response: { status: 500 },
    });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('loadFailed');
    });
  });

  it('opens analyze dialog when analyze button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-doc-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('analyze-doc-1'));

    expect(screen.getByTestId('analyze-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('analyze-dialog')).toHaveTextContent('Invoice 001');
  });

  it('opens view result dialog when view button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-doc-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('view-doc-1'));

    expect(screen.getByTestId('view-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('view-dialog')).toHaveTextContent('Invoice 001');
  });

  it('filters documents by status using tabs', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-doc-1')).toBeInTheDocument();
    });

    // Click the unprocessed tab
    await user.click(screen.getByTestId('filter-unprocessed'));

    await waitFor(() => {
      expect(mockGetDocuments).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({ status: 'unprocessed' }),
        })
      );
    });
  });

  it('navigates back to instances when back button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-doc-1')).toBeInTheDocument();
    });

    const backButton = screen.getByText('Back to Instances');
    await user.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/admin/paperless-instances');
  });

  it('handles page change', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-doc-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('next-page'));

    await waitFor(() => {
      expect(mockGetDocuments).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({ page: 2 }),
        })
      );
    });
  });

  it('handles limit change and resets to page 1', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-doc-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('change-limit'));

    await waitFor(() => {
      expect(mockGetDocuments).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({ limit: 20, page: 1 }),
        })
      );
    });
  });

  it('closes analyze dialog and clears analyzing document', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-doc-1')).toBeInTheDocument();
    });

    // Open dialog
    await user.click(screen.getByTestId('analyze-doc-1'));
    expect(screen.getByTestId('analyze-dialog')).toBeInTheDocument();

    // Close dialog
    await user.click(screen.getByTestId('close-analyze-dialog'));
    expect(screen.queryByTestId('analyze-dialog')).not.toBeInTheDocument();
  });

  it('closes view result dialog and clears viewing document', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-doc-1')).toBeInTheDocument();
    });

    // Open dialog
    await user.click(screen.getByTestId('view-doc-1'));
    expect(screen.getByTestId('view-dialog')).toBeInTheDocument();

    // Close dialog
    await user.click(screen.getByTestId('close-view-dialog'));
    expect(screen.queryByTestId('view-dialog')).not.toBeInTheDocument();
  });

  it('reloads documents on analysis success', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-doc-1')).toBeInTheDocument();
    });

    // Clear previous calls
    mockGetDocuments.mockClear();

    // Open dialog and trigger success
    await user.click(screen.getByTestId('analyze-doc-1'));
    await user.click(screen.getByTestId('trigger-success'));

    // Should reload documents
    await waitFor(() => {
      expect(mockGetDocuments).toHaveBeenCalled();
    });
  });

  it('shows error when API throws exception', async () => {
    mockGetDocuments.mockRejectedValue(new Error('Network error'));

    renderWithIntl(<DocumentsPage />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('loadFailed');
    });
  });

  it('does not load documents while auth is loading', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: true });

    renderWithIntl(<DocumentsPage />);

    expect(mockGetDocuments).not.toHaveBeenCalled();
  });
});
