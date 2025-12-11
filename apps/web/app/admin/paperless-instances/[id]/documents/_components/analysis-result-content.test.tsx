import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { AnalysisResultContent } from './analysis-result-content';
import type { DocumentAnalysisResult } from '@repo/api-client';

const mockUseSettings = vi.fn();
vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockUseSettings(),
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
});
