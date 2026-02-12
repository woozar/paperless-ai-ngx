import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { StepAiAccount } from './step-ai-account';
import { renderWithIntl } from '@/test-utils/render-with-intl';

vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({
    showApiError: vi.fn(),
    showSuccess: vi.fn(),
  }),
}));

vi.mock('@/lib/use-api', () => ({
  useApi: () => ({}),
}));

vi.mock('@/components/connection-tests/test-ai-provider-connection', () => ({
  TestAiProviderConnection: ({
    onTestResult,
    children,
  }: {
    onTestResult: (success: boolean) => void;
    children?: (props: { testButton: React.ReactNode; alerts: React.ReactNode }) => React.ReactNode;
  }) => {
    const testButton = (
      <button onClick={() => onTestResult(true)} data-testid="mock-test-connection">
        Test Connection
      </button>
    );
    const alerts = null;

    if (children) {
      return <>{children({ testButton, alerts })}</>;
    }

    return testButton;
  },
}));

global.fetch = vi.fn();

describe('StepAiAccount', () => {
  const defaultData = {
    name: '',
    provider: 'openai',
    apiKey: '',
    baseUrl: '',
    tested: false,
  };

  const mockOnChange = vi.fn();
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
      <StepAiAccount data={defaultData} onChange={mockOnChange} onNext={mockOnNext} />
    );

    expect(screen.getByTestId('setup-ai-account-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('setup-ai-account-provider-input')).toBeInTheDocument();
    expect(screen.getByTestId('setup-ai-account-apiKey-input')).toBeInTheDocument();
  });

  it('shows cost warning alert', () => {
    renderWithIntl(
      <StepAiAccount data={defaultData} onChange={mockOnChange} onNext={mockOnNext} />
    );

    expect(screen.getByText(/cost/i)).toBeInTheDocument();
  });

  it('disables next button when form is incomplete', () => {
    renderWithIntl(
      <StepAiAccount data={defaultData} onChange={mockOnChange} onNext={mockOnNext} />
    );

    const nextButton = screen.getByTestId('setup-ai-account-next-button');
    expect(nextButton).toBeDisabled();
  });

  it('enables next button when required fields are filled', () => {
    const filledData = {
      ...defaultData,
      name: 'My Account',
      provider: 'openai',
      apiKey: 'sk-test-key',
    };

    renderWithIntl(<StepAiAccount data={filledData} onChange={mockOnChange} onNext={mockOnNext} />);

    const nextButton = screen.getByTestId('setup-ai-account-next-button');
    expect(nextButton).not.toBeDisabled();
  });

  it('shows baseUrl field for ollama provider', () => {
    const ollamaData = {
      ...defaultData,
      name: 'Ollama Account',
      provider: 'ollama',
      apiKey: 'test-key',
    };

    renderWithIntl(<StepAiAccount data={ollamaData} onChange={mockOnChange} onNext={mockOnNext} />);

    expect(screen.getByTestId('setup-ai-account-baseUrl-input')).toBeInTheDocument();
  });

  it('shows baseUrl field for custom provider', () => {
    const customData = {
      ...defaultData,
      name: 'Custom Account',
      provider: 'custom',
      apiKey: 'test-key',
    };

    renderWithIntl(<StepAiAccount data={customData} onChange={mockOnChange} onNext={mockOnNext} />);

    expect(screen.getByTestId('setup-ai-account-baseUrl-input')).toBeInTheDocument();
  });

  it('hides baseUrl field for openai provider', () => {
    const openaiData = {
      ...defaultData,
      name: 'OpenAI Account',
      provider: 'openai',
      apiKey: 'test-key',
    };

    renderWithIntl(<StepAiAccount data={openaiData} onChange={mockOnChange} onNext={mockOnNext} />);

    expect(screen.queryByTestId('setup-ai-account-baseUrl-input')).not.toBeInTheDocument();
  });

  it('shows baseUrl field when provider is ollama', () => {
    const ollamaData = {
      ...defaultData,
      name: 'Ollama Account',
      provider: 'ollama',
      apiKey: 'test-key',
      baseUrl: '',
    };

    renderWithIntl(<StepAiAccount data={ollamaData} onChange={mockOnChange} onNext={mockOnNext} />);

    // baseUrl field should be visible for ollama
    expect(screen.getByTestId('setup-ai-account-baseUrl-input')).toBeInTheDocument();
  });

  it('enables next when baseUrl is provided for ollama', () => {
    const ollamaData = {
      ...defaultData,
      name: 'Ollama Account',
      provider: 'ollama',
      apiKey: 'test-key',
      baseUrl: 'http://localhost:11434',
    };

    renderWithIntl(<StepAiAccount data={ollamaData} onChange={mockOnChange} onNext={mockOnNext} />);

    const nextButton = screen.getByTestId('setup-ai-account-next-button');
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onChange when name input changes', () => {
    renderWithIntl(
      <StepAiAccount data={defaultData} onChange={mockOnChange} onNext={mockOnNext} />
    );

    const nameInput = screen.getByTestId('setup-ai-account-name-input');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Name' }));
  });

  it('calls onChange when apiKey input changes', () => {
    renderWithIntl(
      <StepAiAccount data={defaultData} onChange={mockOnChange} onNext={mockOnNext} />
    );

    const apiKeyInput = screen.getByTestId('setup-ai-account-apiKey-input');
    fireEvent.change(apiKeyInput, { target: { value: 'new-api-key' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ apiKey: 'new-api-key' }));
  });

  it('creates account on next click when account does not exist', async () => {
    const filledData = {
      ...defaultData,
      name: 'My Account',
      provider: 'openai',
      apiKey: 'sk-test-key',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'new-account-id' }),
    } as Response);

    renderWithIntl(<StepAiAccount data={filledData} onChange={mockOnChange} onNext={mockOnNext} />);

    const nextButton = screen.getByTestId('setup-ai-account-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/ai-accounts',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'My Account',
            provider: 'openai',
            apiKey: 'sk-test-key',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith('new-account-id');
    });
  });

  it('proceeds directly when account already exists', async () => {
    const existingData = {
      ...defaultData,
      id: 'existing-id',
      name: 'Existing Account',
      provider: 'openai',
      apiKey: 'sk-test-key',
    };

    renderWithIntl(
      <StepAiAccount data={existingData} onChange={mockOnChange} onNext={mockOnNext} />
    );

    const nextButton = screen.getByTestId('setup-ai-account-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith('existing-id');
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it('disables form fields when account already exists', () => {
    const existingData = {
      ...defaultData,
      id: 'existing-id',
      name: 'Existing Account',
      provider: 'openai',
      apiKey: 'sk-test-key',
    };

    renderWithIntl(
      <StepAiAccount data={existingData} onChange={mockOnChange} onNext={mockOnNext} />
    );

    expect(screen.getByTestId('setup-ai-account-name-input')).toBeDisabled();
    expect(screen.getByTestId('setup-ai-account-apiKey-input')).toBeDisabled();
  });

  it('hides connection test when account already exists', () => {
    const existingData = {
      ...defaultData,
      id: 'existing-id',
      name: 'Existing Account',
      provider: 'openai',
      apiKey: 'sk-test-key',
    };

    renderWithIntl(
      <StepAiAccount data={existingData} onChange={mockOnChange} onNext={mockOnNext} />
    );

    expect(screen.queryByTestId('mock-test-connection')).not.toBeInTheDocument();
  });

  it('shows connection test button when account does not exist', () => {
    const filledData = {
      ...defaultData,
      name: 'My Account',
      provider: 'openai',
      apiKey: 'sk-test-key',
    };

    renderWithIntl(<StepAiAccount data={filledData} onChange={mockOnChange} onNext={mockOnNext} />);

    expect(screen.getByTestId('mock-test-connection')).toBeInTheDocument();
  });

  it('shows error when API returns error response', async () => {
    const filledData = {
      ...defaultData,
      name: 'My Account',
      provider: 'openai',
      apiKey: 'sk-test-key',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'error.serverError' } }),
    } as Response);

    renderWithIntl(<StepAiAccount data={filledData} onChange={mockOnChange} onNext={mockOnNext} />);

    const nextButton = screen.getByTestId('setup-ai-account-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('shows fallback error when API returns error without message', async () => {
    const filledData = {
      ...defaultData,
      name: 'My Account',
      provider: 'openai',
      apiKey: 'sk-test-key',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);

    renderWithIntl(<StepAiAccount data={filledData} onChange={mockOnChange} onNext={mockOnNext} />);

    const nextButton = screen.getByTestId('setup-ai-account-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('shows error when network request fails', async () => {
    const filledData = {
      ...defaultData,
      name: 'My Account',
      provider: 'openai',
      apiKey: 'sk-test-key',
    };

    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<StepAiAccount data={filledData} onChange={mockOnChange} onNext={mockOnNext} />);

    const nextButton = screen.getByTestId('setup-ai-account-next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('updates tested state when connection test succeeds', () => {
    renderWithIntl(
      <StepAiAccount data={defaultData} onChange={mockOnChange} onNext={mockOnNext} />
    );

    const testButton = screen.getByTestId('mock-test-connection');
    fireEvent.click(testButton);

    expect(mockOnChange).toHaveBeenCalledWith({ tested: true });
  });
});
