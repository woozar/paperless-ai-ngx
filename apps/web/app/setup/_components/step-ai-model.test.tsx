import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { StepAiModel } from './step-ai-model';
import { renderWithIntl } from '@/test-utils/render-with-intl';

vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({
    showApiError: vi.fn(),
    showSuccess: vi.fn(),
  }),
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'display.general.currency': 'EUR' },
    isLoading: false,
    updateSetting: vi.fn(),
    refreshSettings: vi.fn(),
  }),
}));

vi.mock('@/components/connection-tests/test-ai-model-connection', () => ({
  TestAiModelConnection: () => null,
}));

global.fetch = vi.fn();

describe('StepAiModel', () => {
  const defaultData = {
    name: '',
    modelIdentifier: '',
    inputTokenPrice: '',
    outputTokenPrice: '',
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
      <StepAiModel
        data={defaultData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    expect(screen.getByTestId('setup-ai-model-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('setup-ai-model-modelIdentifier-input')).toBeInTheDocument();
    expect(screen.getByTestId('setup-ai-model-inputTokenPrice-input')).toBeInTheDocument();
    expect(screen.getByTestId('setup-ai-model-outputTokenPrice-input')).toBeInTheDocument();
  });

  it('renders back and next buttons', () => {
    renderWithIntl(
      <StepAiModel
        data={defaultData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    expect(screen.getByTestId('setup-ai-model-back-button')).toBeInTheDocument();
    expect(screen.getByTestId('setup-ai-model-next-button')).toBeInTheDocument();
  });

  it('disables next button when required fields are empty', () => {
    renderWithIntl(
      <StepAiModel
        data={defaultData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-model-next-button');
    expect(nextButton).toBeDisabled();
  });

  it('enables next button when name and modelIdentifier are filled', () => {
    const filledData = {
      ...defaultData,
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
    };

    renderWithIntl(
      <StepAiModel
        data={filledData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-model-next-button');
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onBack when back button is clicked', () => {
    renderWithIntl(
      <StepAiModel
        data={defaultData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const backButton = screen.getByTestId('setup-ai-model-back-button');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('calls onChange when name input changes', () => {
    renderWithIntl(
      <StepAiModel
        data={defaultData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nameInput = screen.getByTestId('setup-ai-model-name-input');
    fireEvent.change(nameInput, { target: { value: 'GPT-4' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'GPT-4' }));
  });

  it('calls onChange when modelIdentifier input changes', () => {
    renderWithIntl(
      <StepAiModel
        data={defaultData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const identifierInput = screen.getByTestId('setup-ai-model-modelIdentifier-input');
    fireEvent.change(identifierInput, { target: { value: 'gpt-4-turbo' } });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ modelIdentifier: 'gpt-4-turbo' })
    );
  });

  it('calls onChange when inputTokenPrice input changes', () => {
    renderWithIntl(
      <StepAiModel
        data={defaultData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const priceInput = screen.getByTestId('setup-ai-model-inputTokenPrice-input');
    fireEvent.change(priceInput, { target: { value: '0.01' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ inputTokenPrice: '0.01' }));
  });

  it('creates model on next click when model does not exist', async () => {
    const filledData = {
      ...defaultData,
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
      inputTokenPrice: '0.01',
      outputTokenPrice: '0.03',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'new-model-id' }),
    } as Response);

    renderWithIntl(
      <StepAiModel
        data={filledData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-model-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/ai-models',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'GPT-4',
            modelIdentifier: 'gpt-4',
            aiAccountId: 'account-1',
            inputTokenPrice: 0.01,
            outputTokenPrice: 0.03,
          }),
        })
      );
    });

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith('new-model-id');
    });
  });

  it('sends null for empty token prices', async () => {
    const filledData = {
      ...defaultData,
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
      inputTokenPrice: '',
      outputTokenPrice: '',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'new-model-id' }),
    } as Response);

    renderWithIntl(
      <StepAiModel
        data={filledData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-model-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/ai-models',
        expect.objectContaining({
          body: JSON.stringify({
            name: 'GPT-4',
            modelIdentifier: 'gpt-4',
            aiAccountId: 'account-1',
            inputTokenPrice: null,
            outputTokenPrice: null,
          }),
        })
      );
    });
  });

  it('proceeds directly when model already exists', async () => {
    const existingData = {
      ...defaultData,
      id: 'existing-id',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
    };

    renderWithIntl(
      <StepAiModel
        data={existingData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-model-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith('existing-id');
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it('disables form fields when model already exists', () => {
    const existingData = {
      ...defaultData,
      id: 'existing-id',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
    };

    renderWithIntl(
      <StepAiModel
        data={existingData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    expect(screen.getByTestId('setup-ai-model-name-input')).toBeDisabled();
    expect(screen.getByTestId('setup-ai-model-modelIdentifier-input')).toBeDisabled();
    expect(screen.getByTestId('setup-ai-model-inputTokenPrice-input')).toBeDisabled();
    expect(screen.getByTestId('setup-ai-model-outputTokenPrice-input')).toBeDisabled();
  });

  it('shows error when API returns error response', async () => {
    const filledData = {
      ...defaultData,
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'error.serverError' } }),
    } as Response);

    renderWithIntl(
      <StepAiModel
        data={filledData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-model-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('shows fallback error when API returns error without message', async () => {
    const filledData = {
      ...defaultData,
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);

    renderWithIntl(
      <StepAiModel
        data={filledData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-model-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('shows error when network request fails', async () => {
    const filledData = {
      ...defaultData,
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
    };

    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(
      <StepAiModel
        data={filledData}
        aiAccountId="account-1"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByTestId('setup-ai-model-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });
});
