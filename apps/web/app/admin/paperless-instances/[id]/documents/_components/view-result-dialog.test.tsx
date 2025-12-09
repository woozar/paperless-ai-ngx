import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { ViewResultDialog } from './view-result-dialog';
import type { DocumentListItem, DocumentProcessingResult } from '@repo/api-client';

const mockGetResult = vi.fn();
vi.mock('@repo/api-client', () => ({
  getPaperlessInstancesByIdDocumentsByDocumentIdResult: (args: unknown) => mockGetResult(args),
}));

const mockShowError = vi.fn();
const mockErrorDisplayReturn = { showError: mockShowError };
vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => mockErrorDisplayReturn,
}));

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
}));

const mockFormatDate = (date: string) => new Date(date).toLocaleDateString('en-US');
vi.mock('@/hooks/use-format-date', () => ({
  useFormatDate: () => mockFormatDate,
}));

const mockDocument: DocumentListItem = {
  id: 'doc-123',
  paperlessId: 456,
  title: 'Test Document',
  status: 'processed',
  importedAt: '2024-01-15T10:00:00Z',
  lastProcessedAt: '2024-01-15T12:00:00Z',
};

const mockResult: DocumentProcessingResult = {
  id: 'result-123',
  processedAt: '2024-01-15T12:00:00Z',
  aiProvider: 'OpenAI GPT-4',
  tokensUsed: 1500,
  changes: {
    suggestedTitle: 'Invoice from ACME Corp',
    suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
    suggestedDocumentType: { id: 2, name: 'Invoice' },
    suggestedTags: [
      { id: 10, name: 'Finance' },
      { id: 11, name: 'Important' },
    ],
    confidence: 0.92,
    reasoning: 'The document clearly shows invoice details from ACME Corp.',
  },
  toolCalls: null,
  originalTitle: 'invoice-123.pdf',
};

describe('ViewResultDialog', () => {
  const mockOnOpenChange = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    document: mockDocument,
    instanceId: 'instance-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while fetching result', async () => {
    mockGetResult.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: mockResult }), 100))
    );

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    // The Loader2 component has animate-spin class
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('displays result data after successful fetch', async () => {
    mockGetResult.mockResolvedValueOnce({ data: mockResult });

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Invoice from ACME Corp')).toBeInTheDocument();
    });

    expect(screen.getByText('ACME Corp')).toBeInTheDocument();
    expect(screen.getByText('Invoice')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Important')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(
      screen.getByText('The document clearly shows invoice details from ACME Corp.')
    ).toBeInTheDocument();
    expect(screen.getByText('OpenAI GPT-4')).toBeInTheDocument();
    expect(screen.getByText('1500 tokens')).toBeInTheDocument();
  });

  it('shows error when API call fails', async () => {
    mockGetResult.mockResolvedValueOnce({ error: { message: 'Not found' } });

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('loadResultFailed');
    });
  });

  it('shows no result message when result has no changes', async () => {
    mockGetResult.mockResolvedValueOnce({
      data: { ...mockResult, changes: null },
    });

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('No analysis result available')).toBeInTheDocument();
    });
  });

  it('displays document title in dialog description', async () => {
    mockGetResult.mockResolvedValueOnce({ data: mockResult });

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    expect(screen.getByText('Test Document')).toBeInTheDocument();

    // Wait for async fetch to complete to avoid act() warning
    await waitFor(() => {
      expect(mockGetResult).toHaveBeenCalled();
    });
  });

  it('calls onOpenChange with false when close button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetResult.mockResolvedValueOnce({ data: mockResult });

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Invoice from ACME Corp')).toBeInTheDocument();
    });

    // Get the close buttons - there are two (X button and text button)
    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    // Click the text close button (the one in the footer, not the X)
    await user.click(closeButtons[0]);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not fetch result when dialog is closed', () => {
    renderWithIntl(<ViewResultDialog {...defaultProps} open={false} />);

    expect(mockGetResult).not.toHaveBeenCalled();
  });

  it('does not fetch result when document is null', () => {
    renderWithIntl(<ViewResultDialog {...defaultProps} document={null} />);

    expect(mockGetResult).not.toHaveBeenCalled();
  });

  it('shows "New" badge for new correspondent without id', async () => {
    mockGetResult.mockResolvedValueOnce({
      data: {
        ...mockResult,
        changes: {
          ...mockResult.changes,
          suggestedCorrespondent: { name: 'New Company' },
        },
      },
    });

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('New')).toBeInTheDocument();
    });
    expect(screen.getByText('New Company')).toBeInTheDocument();
  });

  it('shows "New" badge for new document type without id', async () => {
    mockGetResult.mockResolvedValueOnce({
      data: {
        ...mockResult,
        changes: {
          ...mockResult.changes,
          suggestedDocumentType: { name: 'New Type' },
        },
      },
    });

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('New Type')).toBeInTheDocument();
    });
    expect(screen.getAllByText('New').length).toBeGreaterThan(0);
  });

  it('shows no correspondent message when suggestedCorrespondent is null', async () => {
    mockGetResult.mockResolvedValueOnce({
      data: {
        ...mockResult,
        changes: {
          ...mockResult.changes,
          suggestedCorrespondent: null,
        },
      },
    });

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('No matching correspondent found')).toBeInTheDocument();
    });
  });

  it('shows no document type message when suggestedDocumentType is null', async () => {
    mockGetResult.mockResolvedValueOnce({
      data: {
        ...mockResult,
        changes: {
          ...mockResult.changes,
          suggestedDocumentType: null,
        },
      },
    });

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('No matching document type found')).toBeInTheDocument();
    });
  });

  it('does not render tags section when no tags are suggested', async () => {
    mockGetResult.mockResolvedValueOnce({
      data: {
        ...mockResult,
        changes: {
          ...mockResult.changes,
          suggestedTags: [],
        },
      },
    });

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Invoice from ACME Corp')).toBeInTheDocument();
    });

    expect(screen.queryByText('Suggested Tags')).not.toBeInTheDocument();
  });

  it('passes correct parameters to API call', async () => {
    mockGetResult.mockResolvedValueOnce({ data: mockResult });

    renderWithIntl(<ViewResultDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetResult).toHaveBeenCalledWith({
        client: {},
        path: { id: 'instance-123', documentId: 'doc-123' },
      });
    });
  });
});
