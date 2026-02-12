import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { StepPaperless } from './step-paperless';
import { renderWithIntl } from '@/test-utils/render-with-intl';

vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({
    showApiError: vi.fn(),
    showSuccess: vi.fn(),
  }),
}));

vi.mock('@/components/connection-tests/test-paperless-connection', () => ({
  TestPaperlessConnection: ({
    onTestResult,
    children,
  }: {
    onTestResult: (success: boolean) => void;
    children?: (props: { testButton: React.ReactNode; alerts: React.ReactNode }) => React.ReactNode;
  }) => {
    const testButton = (
      <button onClick={() => onTestResult(true)} data-testid="mock-test-paperless-connection">
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

describe('StepPaperless', () => {
  const defaultData = {
    name: '',
    apiUrl: '',
    apiToken: '',
    tested: false,
    autoProcessEnabled: true,
    scanCronExpression: '0 * * * *',
  };

  const mockOnChange = vi.fn();
  const mockOnBack = vi.fn();
  const mockOnComplete = vi.fn();

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
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByTestId('setup-paperless-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('setup-paperless-url-input')).toBeInTheDocument();
    expect(screen.getByTestId('setup-paperless-token-input')).toBeInTheDocument();
  });

  it('renders back and finish buttons', () => {
    renderWithIntl(
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByTestId('setup-paperless-back-button')).toBeInTheDocument();
    expect(screen.getByTestId('setup-paperless-finish-button')).toBeInTheDocument();
  });

  it('renders connection test component', () => {
    renderWithIntl(
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByTestId('mock-test-paperless-connection')).toBeInTheDocument();
  });

  it('disables finish button when required fields are empty', () => {
    renderWithIntl(
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const finishButton = screen.getByTestId('setup-paperless-finish-button');
    expect(finishButton).toBeDisabled();
  });

  it('enables finish button when all fields are filled', () => {
    const filledData = {
      ...defaultData,
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-token',
    };

    renderWithIntl(
      <StepPaperless
        data={filledData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const finishButton = screen.getByTestId('setup-paperless-finish-button');
    expect(finishButton).not.toBeDisabled();
  });

  it('calls onBack when back button is clicked', () => {
    renderWithIntl(
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const backButton = screen.getByTestId('setup-paperless-back-button');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('calls onChange when name input changes', () => {
    renderWithIntl(
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const nameInput = screen.getByTestId('setup-paperless-name-input');
    fireEvent.change(nameInput, { target: { value: 'My Paperless' } });

    expect(mockOnChange).toHaveBeenCalledWith({ name: 'My Paperless' });
  });

  it('calls onChange when apiUrl input changes', () => {
    renderWithIntl(
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const urlInput = screen.getByTestId('setup-paperless-url-input');
    fireEvent.change(urlInput, { target: { value: 'https://paperless.example.com' } });

    expect(mockOnChange).toHaveBeenCalledWith({ apiUrl: 'https://paperless.example.com' });
  });

  it('calls onChange when apiToken input changes', () => {
    renderWithIntl(
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const tokenInput = screen.getByTestId('setup-paperless-token-input');
    fireEvent.change(tokenInput, { target: { value: 'my-secret-token' } });

    expect(mockOnChange).toHaveBeenCalledWith({ apiToken: 'my-secret-token' });
  });

  it('creates paperless instance on finish click', async () => {
    const filledData = {
      ...defaultData,
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-token',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'new-instance-id' }),
    } as Response);

    renderWithIntl(
      <StepPaperless
        data={filledData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const finishButton = screen.getByTestId('setup-paperless-finish-button');
    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/paperless-instances',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'My Paperless',
            apiUrl: 'https://paperless.example.com',
            apiToken: 'my-token',
            autoProcessEnabled: true,
            scanCronExpression: '0 * * * *',
            defaultAiBotId: 'test-bot-id',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('does not call onComplete when API request fails', async () => {
    const filledData = {
      ...defaultData,
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-token',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'error.serverError' } }),
    } as Response);

    renderWithIntl(
      <StepPaperless
        data={filledData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const finishButton = screen.getByTestId('setup-paperless-finish-button');
    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('disables back button while creating instance', async () => {
    const filledData = {
      ...defaultData,
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-token',
    };

    // Create a promise that we can resolve manually
    let resolvePromise: (value: Response) => void;
    const pendingPromise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(fetch).mockReturnValueOnce(pendingPromise);

    renderWithIntl(
      <StepPaperless
        data={filledData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const finishButton = screen.getByTestId('setup-paperless-finish-button');
    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(screen.getByTestId('setup-paperless-back-button')).toBeDisabled();
    });

    // Resolve the promise to clean up
    resolvePromise!({
      ok: true,
      json: async () => ({ id: 'id' }),
    } as Response);
  });

  it('connection test updates tested state via onTestResult', () => {
    renderWithIntl(
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const testButton = screen.getByTestId('mock-test-paperless-connection');
    fireEvent.click(testButton);

    expect(mockOnChange).toHaveBeenCalledWith({ tested: true });
  });

  it('shows error when network request fails', async () => {
    const filledData = {
      ...defaultData,
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-token',
    };

    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(
      <StepPaperless
        data={filledData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const finishButton = screen.getByTestId('setup-paperless-finish-button');
    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('toggles auto-processing via switch', () => {
    renderWithIntl(
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const autoProcessSwitch = screen.getByTestId('setup-paperless-autoProcessEnabled-switch');
    fireEvent.click(autoProcessSwitch);

    expect(mockOnChange).toHaveBeenCalledWith({ autoProcessEnabled: false });
  });

  it('shows scan interval select when auto-processing is enabled', () => {
    renderWithIntl(
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByTestId('setup-paperless-scanInterval-select')).toBeInTheDocument();
  });

  it('hides scan interval select when auto-processing is disabled', () => {
    const disabledAutoProcess = {
      ...defaultData,
      autoProcessEnabled: false,
    };

    renderWithIntl(
      <StepPaperless
        data={disabledAutoProcess}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.queryByTestId('setup-paperless-scanInterval-select')).not.toBeInTheDocument();
  });

  it('calls onChange when scan interval is changed', async () => {
    renderWithIntl(
      <StepPaperless
        data={defaultData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const selectTrigger = screen.getByTestId('setup-paperless-scanInterval-select');
    fireEvent.click(selectTrigger);

    // Wait for the dropdown to open and click on a different option
    await waitFor(() => {
      const dailyOption = screen.getByText('Daily');
      fireEvent.click(dailyOption);
    });

    expect(mockOnChange).toHaveBeenCalledWith({ scanCronExpression: '0 0 * * *' });
  });

  it('creates instance without auto-processing fields when disabled', async () => {
    const dataWithAutoProcessDisabled = {
      ...defaultData,
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-token',
      autoProcessEnabled: false,
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'new-instance-id' }),
    } as Response);

    renderWithIntl(
      <StepPaperless
        data={dataWithAutoProcessDisabled}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const finishButton = screen.getByTestId('setup-paperless-finish-button');
    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/paperless-instances',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'My Paperless',
            apiUrl: 'https://paperless.example.com',
            apiToken: 'my-token',
            autoProcessEnabled: false,
            scanCronExpression: undefined,
            defaultAiBotId: undefined,
          }),
        })
      );
    });
  });

  it('shows fallback error when API returns error without message', async () => {
    const filledData = {
      ...defaultData,
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      apiToken: 'my-token',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);

    renderWithIntl(
      <StepPaperless
        data={filledData}
        aiBotId="test-bot-id"
        onChange={mockOnChange}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const finishButton = screen.getByTestId('setup-paperless-finish-button');
    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(mockOnComplete).not.toHaveBeenCalled();
  });
});
