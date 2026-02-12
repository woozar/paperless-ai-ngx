import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { StepAiBot } from './step-ai-bot';
import { renderWithIntl } from '@/test-utils/render-with-intl';

vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({
    showApiError: vi.fn(),
    showSuccess: vi.fn(),
  }),
}));

global.fetch = vi.fn();

describe('StepAiBot', () => {
  const defaultData = {
    name: '',
    systemPrompt: '',
    responseLanguage: 'DOCUMENT',
    documentMode: 'text',
    pdfMaxSizeMb: '',
  };

  const mockOnChange = vi.fn();
  const mockOnBack = vi.fn();
  const mockOnNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
      },
      writable: true,
    });
  });

  it('renders all form fields', () => {
    renderWithIntl(
      <StepAiBot
        data={defaultData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    expect(screen.getByTestId('setup-ai-bot-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('setup-ai-bot-systemPrompt-input')).toBeInTheDocument();
    expect(screen.getByTestId('setup-ai-bot-responseLanguage-input')).toBeInTheDocument();
    expect(screen.getByTestId('setup-ai-bot-documentMode-input')).toBeInTheDocument();
  });

  it('renders back and next buttons', () => {
    renderWithIntl(
      <StepAiBot
        data={defaultData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    expect(screen.getByTestId('setup-ai-bot-back-button')).toBeInTheDocument();
    expect(screen.getByTestId('setup-ai-bot-next-button')).toBeInTheDocument();
  });

  it('disables next button when required fields are empty', () => {
    renderWithIntl(
      <StepAiBot
        data={defaultData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-bot-next-button');
    expect(nextButton).toBeDisabled();
  });

  it('enables next button when name and systemPrompt are filled', () => {
    const filledData = {
      ...defaultData,
      name: 'Document Analyzer',
      systemPrompt: 'Analyze documents and extract metadata.',
    };

    renderWithIntl(
      <StepAiBot
        data={filledData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-bot-next-button');
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onBack when back button is clicked', () => {
    renderWithIntl(
      <StepAiBot
        data={defaultData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const backButton = screen.getByTestId('setup-ai-bot-back-button');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('calls onChange when name input changes', () => {
    renderWithIntl(
      <StepAiBot
        data={defaultData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nameInput = screen.getByTestId('setup-ai-bot-name-input');
    fireEvent.change(nameInput, { target: { value: 'My Bot' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'My Bot' }));
  });

  it('calls onChange when systemPrompt textarea changes', () => {
    renderWithIntl(
      <StepAiBot
        data={defaultData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const promptInput = screen.getByTestId('setup-ai-bot-systemPrompt-input');
    fireEvent.change(promptInput, { target: { value: 'New system prompt' } });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ systemPrompt: 'New system prompt' })
    );
  });

  it('creates bot on next click when bot does not exist', async () => {
    const filledData = {
      ...defaultData,
      name: 'Document Analyzer',
      systemPrompt: 'Analyze documents.',
      responseLanguage: 'ENGLISH',
      documentMode: 'text',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'new-bot-id' }),
    } as Response);

    renderWithIntl(
      <StepAiBot
        data={filledData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-bot-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/ai-bots',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Document Analyzer',
            aiModelId: 'model-1',
            systemPrompt: 'Analyze documents.',
            responseLanguage: 'ENGLISH',
            documentMode: 'text',
            pdfMaxSizeMb: null,
          }),
        })
      );
    });

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith('new-bot-id');
    });
  });

  it('proceeds directly when bot already exists', async () => {
    const existingData = {
      ...defaultData,
      id: 'existing-id',
      name: 'Existing Bot',
      systemPrompt: 'Existing prompt.',
    };

    renderWithIntl(
      <StepAiBot
        data={existingData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-bot-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith('existing-id');
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it('disables form fields when bot already exists', () => {
    const existingData = {
      ...defaultData,
      id: 'existing-id',
      name: 'Existing Bot',
      systemPrompt: 'Existing prompt.',
    };

    renderWithIntl(
      <StepAiBot
        data={existingData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    expect(screen.getByTestId('setup-ai-bot-name-input')).toBeDisabled();
    expect(screen.getByTestId('setup-ai-bot-systemPrompt-input')).toBeDisabled();
  });

  it('renders textarea for system prompt', () => {
    renderWithIntl(
      <StepAiBot
        data={defaultData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const textarea = screen.getByTestId('setup-ai-bot-systemPrompt-input');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('shows pdfMaxSizeMb input when documentMode is pdf', () => {
    const pdfModeData = {
      ...defaultData,
      documentMode: 'pdf',
    };

    renderWithIntl(
      <StepAiBot
        data={pdfModeData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    expect(screen.getByTestId('setup-ai-bot-pdfMaxSizeMb-input')).toBeInTheDocument();
  });

  it('hides pdfMaxSizeMb input when documentMode is text', () => {
    renderWithIntl(
      <StepAiBot
        data={defaultData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    expect(screen.queryByTestId('setup-ai-bot-pdfMaxSizeMb-input')).not.toBeInTheDocument();
  });

  it('shows error when API returns error response', async () => {
    const filledData = {
      ...defaultData,
      name: 'Document Analyzer',
      systemPrompt: 'Analyze documents.',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'error.serverError' } }),
    } as Response);

    renderWithIntl(
      <StepAiBot
        data={filledData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-bot-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('shows fallback error when API returns error without message', async () => {
    const filledData = {
      ...defaultData,
      name: 'Document Analyzer',
      systemPrompt: 'Analyze documents.',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);

    renderWithIntl(
      <StepAiBot
        data={filledData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-bot-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('shows error when network request fails', async () => {
    const filledData = {
      ...defaultData,
      name: 'Document Analyzer',
      systemPrompt: 'Analyze documents.',
    };

    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(
      <StepAiBot
        data={filledData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-bot-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('creates bot with pdfMaxSizeMb when documentMode is pdf', async () => {
    const pdfModeData = {
      ...defaultData,
      name: 'Document Analyzer',
      systemPrompt: 'Analyze documents.',
      responseLanguage: 'DOCUMENT',
      documentMode: 'pdf',
      pdfMaxSizeMb: '10',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'new-bot-id' }),
    } as Response);

    renderWithIntl(
      <StepAiBot
        data={pdfModeData}
        aiModelId="model-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-bot-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/ai-bots',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Document Analyzer',
            aiModelId: 'model-1',
            systemPrompt: 'Analyze documents.',
            responseLanguage: 'DOCUMENT',
            documentMode: 'pdf',
            pdfMaxSizeMb: 10,
          }),
        })
      );
    });
  });
});
