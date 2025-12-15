import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/locales/en.json';
import QueuePage from './page';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'instance-1' }),
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/admin/paperless-instances/instance-1/queue',
}));

// Mock auth
vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({
    user: { userId: 'user-1', username: 'testuser', role: 'ADMIN' },
    isLoading: false,
  }),
}));

vi.mock('@/lib/use-api', () => ({
  useApi: () => ({ baseUrl: 'http://localhost' }),
}));

const mockShowError = vi.fn();
const mockShowSuccess = vi.fn();

vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({
    showError: mockShowError,
    showSuccess: mockShowSuccess,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock TableRow and TableCell from UI components
const MockTableRow = ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>;
const MockTableCell = ({ children }: { children: React.ReactNode }) => <td>{children}</td>;

// Mock child components
vi.mock('./_components', () => ({
  QueueStatsCards: ({ stats }: { stats: Record<string, number> }) => (
    <div data-testid="queue-stats-cards">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key}>{value}</div>
      ))}
    </div>
  ),
  QueueTableSkeleton: () => {
    const MockTableRow = ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>;
    const MockTableCell = ({ children }: { children: React.ReactNode }) => <td>{children}</td>;
    return (
      <>
        {[...Array(3)].map((_, i) => (
          <MockTableRow key={i}>
            <MockTableCell>
              <div data-testid="queue-table-skeleton">Loading...</div>
            </MockTableCell>
          </MockTableRow>
        ))}
      </>
    );
  },
  QueueTableRow: () => <div data-testid="queue-actions">Actions</div>,
}));

const mockGetQueue = vi.fn();
const mockBulkRetry = vi.fn();
const mockBulkDeleteCompleted = vi.fn();

vi.mock('@repo/api-client', () => ({
  getPaperlessInstancesByIdQueue: (args: unknown) => mockGetQueue(args),
  postPaperlessInstancesByIdQueueBulkRetry: (args: unknown) => mockBulkRetry(args),
  deletePaperlessInstancesByIdQueueBulkCompleted: (args: unknown) => mockBulkDeleteCompleted(args),
}));

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      {ui}
    </NextIntlClientProvider>
  );
};

const mockQueueResponse = {
  data: {
    items: [
      {
        id: 'queue-1',
        paperlessDocumentId: 123,
        status: 'pending',
        priority: 10,
        attempts: 0,
        maxAttempts: 3,
        lastError: null,
        scheduledFor: '2024-01-15T10:00:00Z',
        startedAt: null,
        completedAt: null,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z',
        documentId: 'doc-1',
        documentTitle: 'Test Document',
        aiBotId: 'bot-1',
        aiBotName: 'Test Bot',
      },
    ],
    stats: {
      pending: 1,
      processing: 0,
      completed: 2,
      failed: 1,
    },
    page: 1,
    limit: 20,
    total: 1,
    totalPages: 1,
  },
  error: null,
};

describe('QueuePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetQueue.mockResolvedValue(mockQueueResponse);
  });

  it('renders queue page with title and description', async () => {
    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByText('Processing Queue')).toBeInTheDocument();
    });
    expect(
      screen.getByText('View and manage documents waiting to be processed')
    ).toBeInTheDocument();
  });

  it('displays stats cards with queue statistics', async () => {
    renderWithProviders(<QueuePage />);

    await waitFor(
      () => {
        expect(mockGetQueue).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    await waitFor(() => {
      expect(screen.getByTestId('queue-stats-cards')).toBeInTheDocument();
    });
  });

  it('renders back button that navigates to instances page', async () => {
    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByTestId('queue-back-button')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('queue-back-button'));
    expect(mockPush).toHaveBeenCalledWith('/admin/paperless-instances');
  });

  it('displays all status filter tabs', async () => {
    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByTestId('queue-filter-all')).toBeInTheDocument();
    });
    expect(screen.getByTestId('queue-filter-pending')).toBeInTheDocument();
    expect(screen.getByTestId('queue-filter-processing')).toBeInTheDocument();
    expect(screen.getByTestId('queue-filter-failed')).toBeInTheDocument();
    expect(screen.getByTestId('queue-filter-completed')).toBeInTheDocument();
  });

  it('changes status filter when tab is clicked', async () => {
    renderWithProviders(<QueuePage />);

    await waitFor(
      () => {
        expect(mockGetQueue).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    await waitFor(() => {
      expect(screen.getByTestId('queue-filter-pending')).toBeInTheDocument();
    });

    vi.clearAllMocks();
    fireEvent.click(screen.getByTestId('queue-filter-pending'));

    await waitFor(
      () => {
        expect(mockGetQueue).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('filters queue items when clicking filter tabs', async () => {
    const user = userEvent.setup();

    renderWithProviders(<QueuePage />);

    // Wait for initial load
    await waitFor(
      () => {
        expect(screen.getByText('Test Document')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Get the current call count
    const initialCallCount = mockGetQueue.mock.calls.length;

    // Click on pending filter tab using userEvent
    const pendingTab = screen.getByTestId('queue-filter-pending');
    await user.click(pendingTab);

    // Verify that the API was called again with the pending status
    await waitFor(
      () => {
        const newCallCount = mockGetQueue.mock.calls.length;
        expect(newCallCount).toBeGreaterThan(initialCallCount);

        // Check that the last call included the pending status filter
        const lastCall = mockGetQueue.mock.calls[mockGetQueue.mock.calls.length - 1]?.[0];
        expect(lastCall?.query.status).toBe('pending');
      },
      { timeout: 3000 }
    );
  });

  it('shows bulk retry button when there are failed items', async () => {
    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByTestId('queue-bulk-retry-button')).toBeInTheDocument();
    });
  });

  it('hides bulk retry button when there are no failed items', async () => {
    mockGetQueue.mockResolvedValue({
      ...mockQueueResponse,
      data: {
        ...mockQueueResponse.data,
        stats: { pending: 1, processing: 0, completed: 0, failed: 0 },
      },
    });

    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.queryByTestId('queue-bulk-retry-button')).not.toBeInTheDocument();
    });
  });

  it('shows bulk delete button when there are completed items', async () => {
    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByTestId('queue-bulk-delete-button')).toBeInTheDocument();
    });
  });

  it('hides bulk delete button when there are no completed items', async () => {
    mockGetQueue.mockResolvedValue({
      ...mockQueueResponse,
      data: {
        ...mockQueueResponse.data,
        stats: { pending: 1, processing: 0, completed: 0, failed: 0 },
      },
    });

    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.queryByTestId('queue-bulk-delete-button')).not.toBeInTheDocument();
    });
  });

  it('handles bulk retry successfully', async () => {
    mockBulkRetry.mockResolvedValue({ data: { retriedCount: 3 }, error: null });

    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByTestId('queue-bulk-retry-button')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('queue-bulk-retry-button'));

    await waitFor(() => {
      expect(mockBulkRetry).toHaveBeenCalledWith(
        expect.objectContaining({
          path: { id: 'instance-1' },
        })
      );
    });

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith('bulkRetrySuccess', { count: 3 });
    });
  });

  it('handles bulk retry error', async () => {
    mockBulkRetry.mockResolvedValue({ data: null, error: { message: 'error' } });

    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByTestId('queue-bulk-retry-button')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('queue-bulk-retry-button'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('bulkRetryFailed');
    });
  });

  it('handles bulk delete completed successfully', async () => {
    mockBulkDeleteCompleted.mockResolvedValue({ data: { deletedCount: 2 }, error: null });

    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByTestId('queue-bulk-delete-button')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('queue-bulk-delete-button'));

    await waitFor(() => {
      expect(mockBulkDeleteCompleted).toHaveBeenCalledWith(
        expect.objectContaining({
          path: { id: 'instance-1' },
        })
      );
    });

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith('bulkDeleteSuccess', { count: 2 });
    });
  });

  it('handles bulk delete error', async () => {
    mockBulkDeleteCompleted.mockResolvedValue({ data: null, error: { message: 'error' } });

    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByTestId('queue-bulk-delete-button')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('queue-bulk-delete-button'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('bulkDeleteFailed');
    });
  });

  it('displays queue items in table', async () => {
    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByText('Test Document')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Bot')).toBeInTheDocument();
    expect(screen.getByText('0/3')).toBeInTheDocument(); // attempts
  });

  it('shows empty message when no items', async () => {
    mockGetQueue.mockResolvedValue({
      ...mockQueueResponse,
      data: {
        ...mockQueueResponse.data,
        items: [],
        total: 0,
      },
    });

    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByText('No items in queue')).toBeInTheDocument();
    });
  });

  it('shows document ID when title is not available', async () => {
    mockGetQueue.mockResolvedValue({
      ...mockQueueResponse,
      data: {
        ...mockQueueResponse.data,
        items: [
          {
            ...mockQueueResponse.data.items[0],
            documentTitle: null,
          },
        ],
      },
    });

    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByText('ID: 123')).toBeInTheDocument();
    });
  });

  it('shows dash when AI bot is not available', async () => {
    mockGetQueue.mockResolvedValue({
      ...mockQueueResponse,
      data: {
        ...mockQueueResponse.data,
        items: [
          {
            ...mockQueueResponse.data.items[0],
            aiBotName: null,
          },
        ],
      },
    });

    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  it('handles API error when loading queue', async () => {
    mockGetQueue.mockResolvedValue({
      data: null,
      error: { message: 'API Error' },
      response: { status: 500 },
    });

    renderWithProviders(<QueuePage />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('loadFailed');
    });
  });
});
