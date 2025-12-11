import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { DocumentTableRow } from './document-table-row';
import type { DocumentListItem } from '@repo/api-client';

function renderDocumentTableRow(props: {
  document: DocumentListItem;
  onAnalyze: (document: DocumentListItem) => void;
  onViewResult: (document: DocumentListItem) => void;
  onPreview: (document: DocumentListItem) => void;
  formatDate: (date: string) => string;
}) {
  return renderWithIntl(
    <table>
      <tbody>
        <DocumentTableRow {...props} />
      </tbody>
    </table>
  );
}

const mockUnprocessedDocument: DocumentListItem = {
  id: 'doc-123',
  paperlessId: 456,
  title: 'Test Document',
  status: 'unprocessed',
  documentDate: '2024-01-15T10:00:00Z',
  importedAt: '2024-01-10T10:00:00Z',
  lastProcessedAt: null,
};

const mockProcessedDocument: DocumentListItem = {
  id: 'doc-456',
  paperlessId: 789,
  title: 'Processed Document',
  status: 'processed',
  documentDate: '2024-01-10T08:00:00Z',
  importedAt: '2024-01-05T08:00:00Z',
  lastProcessedAt: '2024-01-15T12:00:00Z',
};

describe('DocumentTableRow', () => {
  const mockOnAnalyze = vi.fn();
  const mockOnViewResult = vi.fn();
  const mockOnPreview = vi.fn();
  const mockFormatDate = vi.fn((date: string) => new Date(date).toLocaleDateString('en-US'));

  const defaultPropsUnprocessed = {
    document: mockUnprocessedDocument,
    onAnalyze: mockOnAnalyze,
    onViewResult: mockOnViewResult,
    onPreview: mockOnPreview,
    formatDate: mockFormatDate,
  };

  const defaultPropsProcessed = {
    document: mockProcessedDocument,
    onAnalyze: mockOnAnalyze,
    onViewResult: mockOnViewResult,
    onPreview: mockOnPreview,
    formatDate: mockFormatDate,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders document title', () => {
    renderDocumentTableRow(defaultPropsUnprocessed);
    expect(screen.getByText('Test Document')).toBeInTheDocument();
  });

  it('renders unprocessed status badge', () => {
    renderDocumentTableRow(defaultPropsUnprocessed);
    expect(screen.getByText('Unprocessed')).toBeInTheDocument();
  });

  it('renders processed status badge', () => {
    renderDocumentTableRow(defaultPropsProcessed);
    expect(screen.getByText('Processed')).toBeInTheDocument();
  });

  it('formats and displays document date', () => {
    renderDocumentTableRow(defaultPropsUnprocessed);
    expect(mockFormatDate).toHaveBeenCalledWith('2024-01-15T10:00:00Z');
  });

  it('calls onAnalyze when analyze button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderDocumentTableRow(defaultPropsUnprocessed);

    const analyzeButton = screen.getByTestId('analyze-document-doc-123');
    await user.click(analyzeButton);

    expect(mockOnAnalyze).toHaveBeenCalledWith(mockUnprocessedDocument);
  });

  it('does not show view result button for unprocessed documents', () => {
    renderDocumentTableRow(defaultPropsUnprocessed);
    expect(screen.queryByTestId('view-result-doc-123')).not.toBeInTheDocument();
  });

  it('shows view result button for processed documents', () => {
    renderDocumentTableRow(defaultPropsProcessed);
    expect(screen.getByTestId('view-result-doc-456')).toBeInTheDocument();
  });

  it('calls onViewResult when view result button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderDocumentTableRow(defaultPropsProcessed);

    const viewResultButton = screen.getByTestId('view-result-doc-456');
    await user.click(viewResultButton);

    expect(mockOnViewResult).toHaveBeenCalledWith(mockProcessedDocument);
  });

  it('renders analyze button with correct testid', () => {
    renderDocumentTableRow(defaultPropsUnprocessed);
    expect(screen.getByTestId('analyze-document-doc-123')).toBeInTheDocument();
  });

  it('renders view result button with correct testid for processed document', () => {
    renderDocumentTableRow(defaultPropsProcessed);
    expect(screen.getByTestId('view-result-doc-456')).toBeInTheDocument();
  });

  it('renders title attribute with full document title for truncation tooltip', () => {
    renderDocumentTableRow(defaultPropsUnprocessed);
    const cell = screen.getByText('Test Document').closest('td');
    expect(cell).toHaveAttribute('title', 'Test Document');
  });

  it('shows em dash when documentDate is null', () => {
    const documentWithoutDate: DocumentListItem = {
      ...mockUnprocessedDocument,
      documentDate: null,
    };
    renderDocumentTableRow({
      ...defaultPropsUnprocessed,
      document: documentWithoutDate,
    });
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('always renders analyze button regardless of status', () => {
    renderDocumentTableRow(defaultPropsProcessed);
    expect(screen.getByTestId('analyze-document-doc-456')).toBeInTheDocument();
  });

  it('calls onAnalyze when analyze button is clicked on processed document', async () => {
    const user = userEvent.setup({ delay: null });
    renderDocumentTableRow(defaultPropsProcessed);

    const analyzeButton = screen.getByTestId('analyze-document-doc-456');
    await user.click(analyzeButton);

    expect(mockOnAnalyze).toHaveBeenCalledWith(mockProcessedDocument);
  });

  it('renders preview button for all documents', () => {
    renderDocumentTableRow(defaultPropsUnprocessed);
    expect(screen.getByTestId('preview-document-doc-123')).toBeInTheDocument();
  });

  it('calls onPreview when preview button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderDocumentTableRow(defaultPropsUnprocessed);

    const previewButton = screen.getByTestId('preview-document-doc-123');
    await user.click(previewButton);

    expect(mockOnPreview).toHaveBeenCalledWith(mockUnprocessedDocument);
  });
});
