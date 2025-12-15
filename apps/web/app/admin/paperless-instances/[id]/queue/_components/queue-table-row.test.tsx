import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/locales/en.json';
import { QueueTableRow } from './queue-table-row';
import type { ProcessingQueueItem } from '@repo/api-client';

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

const mockRetryApi = vi.fn();
const mockDeleteApi = vi.fn();

vi.mock('@repo/api-client', () => ({
  postPaperlessInstancesByIdQueueByQueueIdRetry: (args: unknown) => mockRetryApi(args),
  deletePaperlessInstancesByIdQueueByQueueId: (args: unknown) => mockDeleteApi(args),
}));

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
};

const createQueueItem = (overrides: Partial<ProcessingQueueItem> = {}): ProcessingQueueItem => ({
  id: 'queue-1',
  paperlessDocumentId: 123,
  status: 'pending',
  priority: 0,
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
  ...overrides,
});

describe('QueueTableRow', () => {
  const defaultProps = {
    instanceId: 'instance-1',
    onRefresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockShowError.mockClear();
    mockShowSuccess.mockClear();
  });

  describe('failed item', () => {
    it('shows retry button for failed items', () => {
      renderWithProviders(
        <QueueTableRow {...defaultProps} item={createQueueItem({ status: 'failed' })} />
      );

      expect(screen.getByTestId('queue-retry-queue-1')).toBeInTheDocument();
    });

    it('shows last error in tooltip when present', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithProviders(
        <QueueTableRow
          {...defaultProps}
          item={createQueueItem({ status: 'failed', lastError: 'API connection failed' })}
        />
      );

      // Hover over the retry button to trigger tooltip
      const retryButton = screen.getByTestId('queue-retry-queue-1');
      await user.hover(retryButton);

      await waitFor(() => {
        // Tooltip content should now be visible
        expect(screen.getByRole('tooltip')).toHaveTextContent('API connection failed');
      });
    });

    it('does not show delete button for failed items', () => {
      renderWithProviders(
        <QueueTableRow {...defaultProps} item={createQueueItem({ status: 'failed' })} />
      );

      expect(screen.queryByTestId('queue-delete-queue-1')).not.toBeInTheDocument();
    });

    it('calls retry API and refreshes on success', async () => {
      mockRetryApi.mockResolvedValueOnce({ data: { status: 'pending' }, error: null });
      const onRefresh = vi.fn();

      renderWithProviders(
        <QueueTableRow
          {...defaultProps}
          item={createQueueItem({ status: 'failed' })}
          onRefresh={onRefresh}
        />
      );

      fireEvent.click(screen.getByTestId('queue-retry-queue-1'));

      await waitFor(() => {
        expect(mockRetryApi).toHaveBeenCalledWith(
          expect.objectContaining({
            path: { id: 'instance-1', queueId: 'queue-1' },
          })
        );
      });

      await waitFor(() => {
        expect(onRefresh).toHaveBeenCalled();
      });
    });

    it('shows error on retry failure', async () => {
      mockRetryApi.mockResolvedValueOnce({ data: null, error: { message: 'error' } });

      renderWithProviders(
        <QueueTableRow {...defaultProps} item={createQueueItem({ status: 'failed' })} />
      );

      fireEvent.click(screen.getByTestId('queue-retry-queue-1'));

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('retryFailed');
      });
    });
  });

  describe('pending item', () => {
    it('shows delete button for pending items', () => {
      renderWithProviders(
        <QueueTableRow {...defaultProps} item={createQueueItem({ status: 'pending' })} />
      );

      expect(screen.getByTestId('queue-delete-queue-1')).toBeInTheDocument();
    });

    it('does not show retry button for pending items', () => {
      renderWithProviders(
        <QueueTableRow {...defaultProps} item={createQueueItem({ status: 'pending' })} />
      );

      expect(screen.queryByTestId('queue-retry-queue-1')).not.toBeInTheDocument();
    });

    it('calls delete API and refreshes on success', async () => {
      mockDeleteApi.mockResolvedValueOnce({ data: null, error: null });
      const onRefresh = vi.fn();

      renderWithProviders(
        <QueueTableRow
          {...defaultProps}
          item={createQueueItem({ status: 'pending' })}
          onRefresh={onRefresh}
        />
      );

      fireEvent.click(screen.getByTestId('queue-delete-queue-1'));

      await waitFor(() => {
        expect(mockDeleteApi).toHaveBeenCalledWith(
          expect.objectContaining({
            path: { id: 'instance-1', queueId: 'queue-1' },
          })
        );
      });

      await waitFor(() => {
        expect(onRefresh).toHaveBeenCalled();
      });
    });

    it('shows error on delete failure', async () => {
      mockDeleteApi.mockResolvedValueOnce({ data: null, error: { message: 'error' } });

      renderWithProviders(
        <QueueTableRow {...defaultProps} item={createQueueItem({ status: 'pending' })} />
      );

      fireEvent.click(screen.getByTestId('queue-delete-queue-1'));

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('deleteFailed');
      });
    });
  });

  describe('completed item', () => {
    it('shows delete button for completed items', () => {
      renderWithProviders(
        <QueueTableRow {...defaultProps} item={createQueueItem({ status: 'completed' })} />
      );

      expect(screen.getByTestId('queue-delete-queue-1')).toBeInTheDocument();
    });

    it('does not show retry button for completed items', () => {
      renderWithProviders(
        <QueueTableRow {...defaultProps} item={createQueueItem({ status: 'completed' })} />
      );

      expect(screen.queryByTestId('queue-retry-queue-1')).not.toBeInTheDocument();
    });
  });

  describe('processing item', () => {
    it('does not show any action buttons for processing items', () => {
      renderWithProviders(
        <QueueTableRow {...defaultProps} item={createQueueItem({ status: 'processing' })} />
      );

      expect(screen.queryByTestId('queue-retry-queue-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('queue-delete-queue-1')).not.toBeInTheDocument();
    });
  });
});
