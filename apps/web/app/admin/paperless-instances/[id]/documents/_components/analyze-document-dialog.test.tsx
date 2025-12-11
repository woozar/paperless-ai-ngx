import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { AnalyzeDocumentDialog } from './analyze-document-dialog';
import type { DocumentListItem, AiBotListItem } from '@repo/api-client';

const mockGetAiBots = vi.fn();
const mockPostAnalyze = vi.fn();

vi.mock('@repo/api-client', () => ({
  getAiBots: (args: unknown) => mockGetAiBots(args),
  postPaperlessInstancesByIdDocumentsByDocumentIdAnalyze: (args: unknown) => mockPostAnalyze(args),
}));

const mockShowError = vi.fn();
vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({ showError: mockShowError }),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn() },
}));

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
}));

const mockDocument: DocumentListItem = {
  id: 'doc-123',
  paperlessId: 456,
  title: 'Test Document',
  status: 'unprocessed',
  importedAt: '2024-01-15T10:00:00Z',
  documentDate: '2024-01-10T00:00:00Z',
  lastProcessedAt: null,
};

const mockBots: AiBotListItem[] = [
  {
    id: 'bot-1',
    name: 'GPT-4 Bot',
    systemPrompt: 'You are a helpful assistant',
    responseLanguage: 'DOCUMENT',
    aiModelId: 'model-1',
    aiModel: {
      id: 'model-1',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
      aiAccount: { id: 'account-1', name: 'OpenAI', provider: 'openai' },
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'bot-2',
    name: 'Claude Bot',
    systemPrompt: 'You are a helpful assistant',
    responseLanguage: 'DOCUMENT',
    aiModelId: 'model-2',
    aiModel: {
      id: 'model-2',
      name: 'Claude',
      modelIdentifier: 'claude-3',
      aiAccount: { id: 'account-2', name: 'Anthropic', provider: 'anthropic' },
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

const mockAnalysisResult = {
  suggestedTitle: 'Invoice from ACME',
  suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
  suggestedDocumentType: { id: 2, name: 'Invoice' },
  suggestedTags: [{ id: 10, name: 'Finance' }],
  confidence: 0.92,
  reasoning: 'The document shows invoice details.',
};

describe('AnalyzeDocumentDialog', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSuccess = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    document: mockDocument,
    instanceId: 'instance-123',
    onSuccess: mockOnSuccess,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAiBots.mockResolvedValue({ data: { items: mockBots } });
  });

  it('loads and displays available AI bots', async () => {
    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalledWith({
        client: mockClient,
        query: { limit: 100 },
      });
    });
  });

  it('shows document title in description', async () => {
    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    expect(screen.getByText(/Test Document/)).toBeInTheDocument();

    // Wait for async loadBots to complete to avoid act() warning
    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });
  });

  it('disables start button when no bot is selected', async () => {
    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    const startButton = screen.getByTestId('start-analysis');
    expect(startButton).toBeDisabled();
  });

  it('starts analysis when bot is selected and button clicked', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAnalyze.mockResolvedValue({
      data: {
        success: true,
        result: mockAnalysisResult,
        inputTokens: 700,
        outputTokens: 300,
        estimatedCost: 0.001,
      },
    });

    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    // Select a bot
    const selectTrigger = screen.getByTestId('select-bot');
    await user.click(selectTrigger);

    await waitFor(() => {
      expect(screen.getByText('GPT-4 Bot')).toBeInTheDocument();
    });

    await user.click(screen.getByText('GPT-4 Bot'));

    // Start analysis
    const startButton = screen.getByTestId('start-analysis');
    expect(startButton).not.toBeDisabled();
    await user.click(startButton);

    await waitFor(() => {
      expect(mockPostAnalyze).toHaveBeenCalledWith({
        client: mockClient,
        path: { id: 'instance-123', documentId: 'doc-123' },
        body: { aiBotId: 'bot-1' },
      });
    });
  });

  it('displays analysis result after successful analysis', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAnalyze.mockResolvedValue({
      data: {
        success: true,
        result: mockAnalysisResult,
        inputTokens: 700,
        outputTokens: 300,
        estimatedCost: 0.001,
      },
    });

    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    // Select a bot and start analysis
    const selectTrigger = screen.getByTestId('select-bot');
    await user.click(selectTrigger);
    await user.click(screen.getByText('GPT-4 Bot'));
    await user.click(screen.getByTestId('start-analysis'));

    await waitFor(() => {
      expect(screen.getByText('Invoice from ACME')).toBeInTheDocument();
    });

    expect(screen.getByText('ACME Corp')).toBeInTheDocument();
    expect(screen.getByText('Invoice')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('calls onSuccess after successful analysis', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAnalyze.mockResolvedValue({
      data: {
        success: true,
        result: mockAnalysisResult,
        inputTokens: 700,
        outputTokens: 300,
        estimatedCost: 0.001,
      },
    });

    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    const selectTrigger = screen.getByTestId('select-bot');
    await user.click(selectTrigger);
    await user.click(screen.getByText('GPT-4 Bot'));
    await user.click(screen.getByTestId('start-analysis'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('shows error when API call fails', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAnalyze.mockResolvedValue({ error: { message: 'Analysis failed' } });

    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    const selectTrigger = screen.getByTestId('select-bot');
    await user.click(selectTrigger);
    await user.click(screen.getByText('GPT-4 Bot'));
    await user.click(screen.getByTestId('start-analysis'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('analyzeFailed');
    });
  });

  it('shows error when loading bots fails', async () => {
    mockGetAiBots.mockResolvedValue({ error: { message: 'Load failed' } });

    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('loadBotsFailed');
    });
  });

  it('does not load bots when dialog is closed', () => {
    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} open={false} />);

    expect(mockGetAiBots).not.toHaveBeenCalled();
  });

  it('resets state when dialog reopens', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAnalyze.mockResolvedValue({
      data: {
        success: true,
        result: mockAnalysisResult,
        inputTokens: 700,
        outputTokens: 300,
        estimatedCost: 0.001,
      },
    });

    const { rerender } = renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    // Complete an analysis
    const selectTrigger = screen.getByTestId('select-bot');
    await user.click(selectTrigger);
    await user.click(screen.getByText('GPT-4 Bot'));
    await user.click(screen.getByTestId('start-analysis'));

    await waitFor(() => {
      expect(screen.getByText('Invoice from ACME')).toBeInTheDocument();
    });

    // Close and reopen dialog
    rerender(<AnalyzeDocumentDialog {...defaultProps} open={false} />);
    rerender(<AnalyzeDocumentDialog {...defaultProps} open={true} />);

    await waitFor(() => {
      expect(screen.queryByText('Invoice from ACME')).not.toBeInTheDocument();
    });
  });

  it('shows "New" badge for correspondent without id', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAnalyze.mockResolvedValue({
      data: {
        success: true,
        result: {
          ...mockAnalysisResult,
          suggestedCorrespondent: { name: 'New Company' },
        },
        inputTokens: 700,
        outputTokens: 300,
        estimatedCost: 0.001,
      },
    });

    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    const selectTrigger = screen.getByTestId('select-bot');
    await user.click(selectTrigger);
    await user.click(screen.getByText('GPT-4 Bot'));
    await user.click(screen.getByTestId('start-analysis'));

    await waitFor(() => {
      expect(screen.getByText('New')).toBeInTheDocument();
    });
    expect(screen.getByText('New Company')).toBeInTheDocument();
  });

  it('shows no correspondent message when suggestedCorrespondent is null', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAnalyze.mockResolvedValue({
      data: {
        success: true,
        result: {
          ...mockAnalysisResult,
          suggestedCorrespondent: null,
        },
        inputTokens: 700,
        outputTokens: 300,
        estimatedCost: 0.001,
      },
    });

    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    const selectTrigger = screen.getByTestId('select-bot');
    await user.click(selectTrigger);
    await user.click(screen.getByText('GPT-4 Bot'));
    await user.click(screen.getByTestId('start-analysis'));

    await waitFor(() => {
      expect(screen.getByText('No matching correspondent found')).toBeInTheDocument();
    });
  });

  it('calls onOpenChange with false when cancel button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    // Find and click the cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows close button after analysis completes', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAnalyze.mockResolvedValue({
      data: {
        success: true,
        result: mockAnalysisResult,
        inputTokens: 700,
        outputTokens: 300,
        estimatedCost: 0.001,
      },
    });

    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    // Select bot and start analysis
    const selectTrigger = screen.getByTestId('select-bot');
    await user.click(selectTrigger);
    await user.click(screen.getByText('GPT-4 Bot'));
    await user.click(screen.getByTestId('start-analysis'));

    await waitFor(() => {
      expect(screen.getByText('Invoice from ACME')).toBeInTheDocument();
    });

    // Close button should now show "close" text instead of "cancel"
    // Use getAllByRole since there may be multiple close buttons (dialog X button and text button)
    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    await user.click(closeButtons[0]!);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows empty description when document is null', async () => {
    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} document={null} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    // The description should be empty, so Test Document should not appear
    expect(screen.queryByText(/Test Document/)).not.toBeInTheDocument();
  });

  it('does not call API when document is null but bot is selected', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} document={null} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    // Select a bot
    const selectTrigger = screen.getByTestId('select-bot');
    await user.click(selectTrigger);
    await user.click(screen.getByText('GPT-4 Bot'));

    // Click start analysis - it should early return without calling API
    await user.click(screen.getByTestId('start-analysis'));

    // Verify API was not called
    expect(mockPostAnalyze).not.toHaveBeenCalled();
  });

  it('shows "New" badge for document type without id', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAnalyze.mockResolvedValue({
      data: {
        success: true,
        result: {
          ...mockAnalysisResult,
          suggestedDocumentType: { name: 'New Document Type' },
        },
        inputTokens: 700,
        outputTokens: 300,
        estimatedCost: 0.001,
      },
    });

    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    const selectTrigger = screen.getByTestId('select-bot');
    await user.click(selectTrigger);
    await user.click(screen.getByText('GPT-4 Bot'));
    await user.click(screen.getByTestId('start-analysis'));

    await waitFor(() => {
      expect(screen.getByText('New Document Type')).toBeInTheDocument();
    });
    // There should be a "New" badge for the document type
    const newBadges = screen.getAllByText('New');
    expect(newBadges.length).toBeGreaterThan(0);
  });

  it('shows no document type message when suggestedDocumentType is null', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAnalyze.mockResolvedValue({
      data: {
        success: true,
        result: {
          ...mockAnalysisResult,
          suggestedDocumentType: null,
        },
        inputTokens: 700,
        outputTokens: 300,
        estimatedCost: 0.001,
      },
    });

    renderWithIntl(<AnalyzeDocumentDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAiBots).toHaveBeenCalled();
    });

    const selectTrigger = screen.getByTestId('select-bot');
    await user.click(selectTrigger);
    await user.click(screen.getByText('GPT-4 Bot'));
    await user.click(screen.getByTestId('start-analysis'));

    await waitFor(() => {
      expect(screen.getByText('No matching document type found')).toBeInTheDocument();
    });
  });
});
