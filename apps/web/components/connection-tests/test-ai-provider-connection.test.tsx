import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { TestAiProviderConnection } from './test-ai-provider-connection';
import { renderWithIntl } from '@/test-utils/render-with-intl';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('TestAiProviderConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
      },
      writable: true,
    });
  });

  describe('button state', () => {
    it('disables button when provider is empty', () => {
      renderWithIntl(
        <TestAiProviderConnection provider="" apiKey="test-key" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      expect(button).toBeDisabled();
    });

    it('disables button when apiKey is empty', () => {
      renderWithIntl(
        <TestAiProviderConnection provider="openai" apiKey="" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      expect(button).toBeDisabled();
    });

    it('disables button when ollama provider has no baseUrl', () => {
      renderWithIntl(
        <TestAiProviderConnection provider="ollama" apiKey="test-key" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      expect(button).toBeDisabled();
    });

    it('disables button when custom provider has no baseUrl', () => {
      renderWithIntl(
        <TestAiProviderConnection provider="custom" apiKey="test-key" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      expect(button).toBeDisabled();
    });

    it('enables button when form is valid for openai', () => {
      renderWithIntl(
        <TestAiProviderConnection provider="openai" apiKey="test-key" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      expect(button).not.toBeDisabled();
    });

    it('enables button when form is valid for ollama with baseUrl', () => {
      renderWithIntl(
        <TestAiProviderConnection
          provider="ollama"
          apiKey="test-key"
          baseUrl="http://localhost:11434"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      expect(button).not.toBeDisabled();
    });

    it('enables button when form is valid for custom with baseUrl', () => {
      renderWithIntl(
        <TestAiProviderConnection
          provider="custom"
          apiKey="test-key"
          baseUrl="https://api.example.com"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('connection test', () => {
    it('shows success toast after successful test', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      renderWithIntl(
        <TestAiProviderConnection provider="openai" apiKey="test-key" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Connection successful!');
      });
    });

    it('shows error toast with status after failed test', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: { message: 'connectionError', params: { status: 401 } },
        }),
      } as Response);

      renderWithIntl(
        <TestAiProviderConnection provider="openai" apiKey="test-key" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Connection failed (HTTP 401). Please check your credentials.'
        );
      });
    });

    it('calls onTestResult with success=true on successful test', async () => {
      const onTestResult = vi.fn();

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      renderWithIntl(
        <TestAiProviderConnection provider="openai" apiKey="test-key" onTestResult={onTestResult} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onTestResult).toHaveBeenCalledWith(true);
      });
    });

    it('calls onTestResult with success=false and error on failed test', async () => {
      const onTestResult = vi.fn();

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, error: { message: 'connectionError' } }),
      } as Response);

      renderWithIntl(
        <TestAiProviderConnection provider="openai" apiKey="test-key" onTestResult={onTestResult} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onTestResult).toHaveBeenCalledWith(false, 'connectionError');
      });
    });

    it('calls API with correct parameters', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      renderWithIntl(
        <TestAiProviderConnection
          provider="openai"
          apiKey="test-key"
          baseUrl="https://api.example.com"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(vi.mocked(fetch)).toHaveBeenCalledWith(
          '/api/test-ai-provider-connection',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer mock-token',
            },
            body: JSON.stringify({
              provider: 'openai',
              apiKey: 'test-key',
              baseUrl: 'https://api.example.com',
            }),
          })
        );
      });
    });

    it('handles network errors gracefully', async () => {
      const onTestResult = vi.fn();

      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(
        <TestAiProviderConnection provider="openai" apiKey="test-key" onTestResult={onTestResult} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onTestResult).toHaveBeenCalledWith(false, 'connectionError');
        expect(toast.error).toHaveBeenCalledWith('Connection failed: Network error');
      });
    });

    it('disables button while testing', async () => {
      vi.mocked(fetch).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true }),
                } as Response),
              100
            )
          )
      );

      renderWithIntl(
        <TestAiProviderConnection provider="openai" apiKey="test-key" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      fireEvent.click(button);

      // Button should be disabled immediately after click
      expect(button).toBeDisabled();

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });

      // Button should be enabled again after test completes
      expect(button).not.toBeDisabled();
    });

    it('shows error toast with error details when params.error is provided', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: { message: 'connectionError', params: { error: 'Invalid API key format' } },
        }),
      } as Response);

      renderWithIntl(
        <TestAiProviderConnection provider="openai" apiKey="test-key" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-ai-provider-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Connection failed: Invalid API key format');
      });
    });
  });

  describe('render prop pattern', () => {
    it('supports children render prop for custom layout', () => {
      renderWithIntl(
        <TestAiProviderConnection provider="openai" apiKey="test-key">
          {({ testButton }) => (
            <div data-testid="custom-container">
              <span>Custom Layout</span>
              {testButton}
            </div>
          )}
        </TestAiProviderConnection>
      );

      expect(screen.getByTestId('custom-container')).toBeInTheDocument();
      expect(screen.getByText('Custom Layout')).toBeInTheDocument();
      expect(screen.getByTestId('test-ai-provider-connection-button')).toBeInTheDocument();
    });
  });
});
