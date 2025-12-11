import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { PreviewDialog } from './preview-dialog';
import type { DocumentListItem } from '@repo/api-client';

const mockDocument: DocumentListItem = {
  id: 'doc-123',
  paperlessId: 456,
  title: 'Test Document',
  status: 'unprocessed',
  importedAt: '2024-01-15T10:00:00Z',
  documentDate: '2024-01-10T00:00:00Z',
  lastProcessedAt: null,
};

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockBlobUrl = 'blob:http://localhost:3000/mock-blob-id';
vi.stubGlobal('URL', {
  ...URL,
  createObjectURL: vi.fn().mockReturnValue(mockBlobUrl),
  revokeObjectURL: vi.fn(),
});

describe('PreviewDialog', () => {
  const mockOnOpenChange = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    document: mockDocument,
    instanceId: 'instance-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('test-token'),
    });
    // Mock successful fetch by default
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(new Blob(['mock pdf'], { type: 'application/pdf' })),
      })
    );
  });

  it('renders dialog with correct title when open', () => {
    renderWithIntl(<PreviewDialog {...defaultProps} />);

    expect(screen.getByText('Document Preview')).toBeInTheDocument();
  });

  it('displays document title in dialog description', () => {
    renderWithIntl(<PreviewDialog {...defaultProps} />);

    expect(screen.getByText(/Test Document/)).toBeInTheDocument();
  });

  it('fetches PDF with Authorization header and renders blob URL in iframe', async () => {
    renderWithIntl(<PreviewDialog {...defaultProps} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/paperless-instances/instance-123/documents/doc-123/preview',
        { headers: { Authorization: 'Bearer test-token' } }
      );
    });

    await waitFor(() => {
      const iframe = screen.getByTestId('preview-iframe');
      expect(iframe.getAttribute('src')).toBe(mockBlobUrl);
    });
  });

  it('shows loading spinner initially', () => {
    renderWithIntl(<PreviewDialog {...defaultProps} />);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('hides loading spinner after PDF loads', async () => {
    renderWithIntl(<PreviewDialog {...defaultProps} />);

    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    renderWithIntl(<PreviewDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load preview')).toBeInTheDocument();
    });
  });

  it('calls onOpenChange with false when close button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<PreviewDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('preview-iframe')).toBeInTheDocument();
    });

    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    await user.click(closeButtons[0]!);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not render iframe when document is null', () => {
    renderWithIntl(<PreviewDialog {...defaultProps} document={null} />);

    expect(screen.queryByTestId('preview-iframe')).not.toBeInTheDocument();
  });

  it('does not fetch when dialog is closed', () => {
    renderWithIntl(<PreviewDialog {...defaultProps} open={false} />);

    expect(fetch).not.toHaveBeenCalled();
  });

  it('uses correct iframe title for accessibility', async () => {
    renderWithIntl(<PreviewDialog {...defaultProps} />);

    await waitFor(() => {
      const iframe = screen.getByTestId('preview-iframe');
      expect(iframe).toHaveAttribute('title', 'Test Document');
    });
  });

  it('uses fallback title when document title is empty', async () => {
    const docWithoutTitle = { ...mockDocument, title: '' };
    renderWithIntl(<PreviewDialog {...defaultProps} document={docWithoutTitle} />);

    await waitFor(() => {
      const iframe = screen.getByTestId('preview-iframe');
      expect(iframe).toHaveAttribute('title', 'Document Preview');
    });
  });

  it('revokes blob URL when dialog closes', async () => {
    const { rerender } = renderWithIntl(<PreviewDialog {...defaultProps} />);

    // Wait for iframe to be rendered (indicating blobUrl is set)
    await waitFor(() => {
      expect(screen.getByTestId('preview-iframe')).toBeInTheDocument();
    });

    // Also verify URL.createObjectURL was called (blob URL was created)
    expect(URL.createObjectURL).toHaveBeenCalled();

    // Clear the mock to only track cleanup calls
    vi.mocked(URL.revokeObjectURL).mockClear();

    // Close the dialog
    rerender(<PreviewDialog {...defaultProps} open={false} />);

    // Wait for cleanup effect to run
    await waitFor(() => {
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockBlobUrl);
    });
  });

  it('cleans up blob URL on unmount', async () => {
    const { unmount } = renderWithIntl(<PreviewDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('preview-iframe')).toBeInTheDocument();
    });

    // Clear the mock to verify only unmount cleanup
    vi.mocked(URL.revokeObjectURL).mockClear();

    // Unmount the component
    unmount();

    // Should revoke the blob URL during cleanup
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockBlobUrl);
  });
});
