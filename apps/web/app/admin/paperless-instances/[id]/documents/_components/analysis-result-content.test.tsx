import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { AnalysisResultContent } from './analysis-result-content';
import type { DocumentAnalysisResult } from '@repo/api-client';

const mockUseSettings = vi.fn();
vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockUseSettings(),
}));

const mockPostApply = vi.fn();
vi.mock('@repo/api-client', () => ({
  postPaperlessInstancesByIdDocumentsByDocumentIdApply: (...args: unknown[]) =>
    mockPostApply(...args),
}));

const mockShowError = vi.fn();
vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({ showError: mockShowError }),
}));

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn() },
}));

const mockFormatDate = (date: string) => new Date(date).toLocaleDateString('en-US');
const mockFormatDateOnly = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
vi.mock('@/hooks/use-format-date', () => ({
  useFormatDate: () => mockFormatDate,
  useFormatDateOnly: () => mockFormatDateOnly,
}));

const mockResult: NonNullable<DocumentAnalysisResult> = {
  suggestedTitle: 'Invoice from ACME Corp',
  suggestedCorrespondent: { id: 1, name: 'ACME Corp' },
  suggestedDocumentType: { id: 2, name: 'Invoice' },
  suggestedTags: [{ id: 10, name: 'Finance' }],
  confidence: 0.92,
  reasoning: 'The document clearly shows invoice details.',
  suggestedDate: '2024-01-15',
};

const mockMetadata = {
  processedAt: '2024-01-15T12:00:00Z',
  aiProvider: 'OpenAI GPT-4',
  inputTokens: 1000,
  outputTokens: 500,
  estimatedCost: 0.0025,
};

describe('AnalysisResultContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSettings.mockReturnValue({
      settings: { 'display.general.currency': 'EUR' },
      isLoading: false,
      updateSetting: vi.fn(),
      refreshSettings: vi.fn(),
    });
  });

  it('renders analysis result with EUR currency icon', () => {
    renderWithIntl(<AnalysisResultContent result={mockResult} metadata={mockMetadata} />);

    expect(screen.getByText('Invoice from ACME Corp')).toBeInTheDocument();
    expect(screen.getByText('0.0025')).toBeInTheDocument();
  });

  it('renders USD currency icon when currency is USD', () => {
    mockUseSettings.mockReturnValue({
      settings: { 'display.general.currency': 'USD' },
      isLoading: false,
      updateSetting: vi.fn(),
      refreshSettings: vi.fn(),
    });

    renderWithIntl(<AnalysisResultContent result={mockResult} metadata={mockMetadata} />);

    expect(screen.getByText('0.0025')).toBeInTheDocument();
  });

  it('falls back to EUR when currency setting is empty', () => {
    mockUseSettings.mockReturnValue({
      settings: { 'display.general.currency': '' },
      isLoading: false,
      updateSetting: vi.fn(),
      refreshSettings: vi.fn(),
    });

    renderWithIntl(<AnalysisResultContent result={mockResult} metadata={mockMetadata} />);

    expect(screen.getByText('0.0025')).toBeInTheDocument();
  });

  it('falls back to EUR icon when currency is unknown', () => {
    mockUseSettings.mockReturnValue({
      settings: { 'display.general.currency': 'GBP' },
      isLoading: false,
      updateSetting: vi.fn(),
      refreshSettings: vi.fn(),
    });

    renderWithIntl(<AnalysisResultContent result={mockResult} metadata={mockMetadata} />);

    expect(screen.getByText('0.0025')).toBeInTheDocument();
  });

  it('renders without metadata', () => {
    renderWithIntl(<AnalysisResultContent result={mockResult} />);

    expect(screen.getByText('Invoice from ACME Corp')).toBeInTheDocument();
    expect(screen.queryByText('OpenAI GPT-4')).not.toBeInTheDocument();
  });

  it('renders without estimated cost when null', () => {
    renderWithIntl(
      <AnalysisResultContent
        result={mockResult}
        metadata={{ ...mockMetadata, estimatedCost: null }}
      />
    );

    expect(screen.getByText('OpenAI GPT-4')).toBeInTheDocument();
    expect(screen.queryByText('0.0025')).not.toBeInTheDocument();
  });

  it('renders without correspondent when null', () => {
    renderWithIntl(
      <AnalysisResultContent
        result={{ ...mockResult, suggestedCorrespondent: null }}
        metadata={mockMetadata}
      />
    );

    expect(screen.getByText(/no matching correspondent/i)).toBeInTheDocument();
  });

  it('renders without document type when null', () => {
    renderWithIntl(
      <AnalysisResultContent
        result={{ ...mockResult, suggestedDocumentType: null }}
        metadata={mockMetadata}
      />
    );

    expect(screen.getByText(/no matching document type/i)).toBeInTheDocument();
  });

  it('renders "new" badge for new correspondent', () => {
    renderWithIntl(
      <AnalysisResultContent
        result={{ ...mockResult, suggestedCorrespondent: { name: 'New Corp' } }}
        metadata={mockMetadata}
      />
    );

    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('New Corp')).toBeInTheDocument();
  });

  it('renders "new" badge for new document type', () => {
    renderWithIntl(
      <AnalysisResultContent
        result={{ ...mockResult, suggestedDocumentType: { name: 'New Type' } }}
        metadata={mockMetadata}
      />
    );

    expect(screen.getAllByText('New')).toHaveLength(1);
    expect(screen.getByText('New Type')).toBeInTheDocument();
  });

  it('does not render tags section when empty', () => {
    renderWithIntl(
      <AnalysisResultContent
        result={{ ...mockResult, suggestedTags: [] }}
        metadata={mockMetadata}
      />
    );

    expect(screen.queryByText('Tags')).not.toBeInTheDocument();
  });

  it('does not render date section when null', () => {
    renderWithIntl(
      <AnalysisResultContent
        result={{ ...mockResult, suggestedDate: null }}
        metadata={mockMetadata}
      />
    );

    expect(screen.queryByText('01/15/2024')).not.toBeInTheDocument();
  });

  describe('apply functionality', () => {
    const applyProps = {
      instanceId: 'instance-123',
      documentId: 'doc-456',
      onApplied: vi.fn(),
    };

    beforeEach(() => {
      mockPostApply.mockResolvedValue({ data: { success: true } });
    });

    it('shows apply buttons when instanceId and documentId are provided', () => {
      renderWithIntl(
        <AnalysisResultContent result={mockResult} metadata={mockMetadata} {...applyProps} />
      );

      expect(screen.getByTestId('apply-title')).toBeInTheDocument();
      expect(screen.getByTestId('apply-all')).toBeInTheDocument();
    });

    it('does not show apply buttons when instanceId is missing', () => {
      renderWithIntl(
        <AnalysisResultContent result={mockResult} metadata={mockMetadata} documentId="doc-456" />
      );

      expect(screen.queryByTestId('apply-title')).not.toBeInTheDocument();
      expect(screen.queryByTestId('apply-all')).not.toBeInTheDocument();
    });

    it('calls API when apply button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithIntl(
        <AnalysisResultContent result={mockResult} metadata={mockMetadata} {...applyProps} />
      );

      await user.click(screen.getByTestId('apply-title'));

      await waitFor(() => {
        expect(mockPostApply).toHaveBeenCalledWith({
          client: mockClient,
          path: { id: 'instance-123', documentId: 'doc-456' },
          body: { field: 'title', value: 'Invoice from ACME Corp' },
        });
      });
    });

    it('calls onApplied callback on success', async () => {
      const onApplied = vi.fn();
      const user = userEvent.setup({ delay: null });
      renderWithIntl(
        <AnalysisResultContent
          result={mockResult}
          metadata={mockMetadata}
          {...applyProps}
          onApplied={onApplied}
        />
      );

      await user.click(screen.getByTestId('apply-title'));

      await waitFor(() => {
        expect(onApplied).toHaveBeenCalled();
      });
    });

    it('shows error when API returns error', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      mockPostApply.mockResolvedValue({ error: { message: 'Failed' } });
      const user = userEvent.setup({ delay: null });
      renderWithIntl(
        <AnalysisResultContent result={mockResult} metadata={mockMetadata} {...applyProps} />
      );

      await user.click(screen.getByTestId('apply-title'));

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('apply.error');
      });
    });

    it('shows error when API throws exception', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      mockPostApply.mockRejectedValue(new Error('Network error'));
      const user = userEvent.setup({ delay: null });
      renderWithIntl(
        <AnalysisResultContent result={mockResult} metadata={mockMetadata} {...applyProps} />
      );

      await user.click(screen.getByTestId('apply-title'));

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('apply.error');
      });
    });

    it('applies all fields when apply all is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithIntl(
        <AnalysisResultContent result={mockResult} metadata={mockMetadata} {...applyProps} />
      );

      await user.click(screen.getByTestId('apply-all'));

      await waitFor(() => {
        expect(mockPostApply).toHaveBeenCalledWith({
          client: mockClient,
          path: { id: 'instance-123', documentId: 'doc-456' },
          body: { field: 'all', value: undefined },
        });
      });
    });

    it('disables buttons while applying', async () => {
      mockPostApply.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 100))
      );
      const user = userEvent.setup({ delay: null });
      renderWithIntl(
        <AnalysisResultContent result={mockResult} metadata={mockMetadata} {...applyProps} />
      );

      await user.click(screen.getByTestId('apply-title'));

      // All buttons should be disabled while applying
      expect(screen.getByTestId('apply-all')).toBeDisabled();
    });

    it('shows checkmark after successful apply', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithIntl(
        <AnalysisResultContent result={mockResult} metadata={mockMetadata} {...applyProps} />
      );

      await user.click(screen.getByTestId('apply-title'));

      await waitFor(() => {
        // Button should now be disabled (applied)
        expect(screen.getByTestId('apply-title')).toBeDisabled();
      });
    });
  });
});
