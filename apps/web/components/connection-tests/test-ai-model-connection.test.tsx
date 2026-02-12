import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { TestAiModelConnection } from './test-ai-model-connection';
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

describe('TestAiModelConnection', () => {
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
    it('disables button when aiAccountId is empty', () => {
      renderWithIntl(
        <TestAiModelConnection aiAccountId="" modelIdentifier="gpt-4" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
      expect(button).toBeDisabled();
    });

    it('disables button when modelIdentifier is empty', () => {
      renderWithIntl(
        <TestAiModelConnection aiAccountId="account-1" modelIdentifier="" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
      expect(button).toBeDisabled();
    });

    it('enables button when form is valid', () => {
      renderWithIntl(
        <TestAiModelConnection
          aiAccountId="account-1"
          modelIdentifier="gpt-4"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
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
        <TestAiModelConnection
          aiAccountId="account-1"
          modelIdentifier="gpt-4"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Model connection successful!');
      });
    });

    it('shows error toast with details after failed test', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: { message: 'connectionError', params: { error: 'Model not found' } },
        }),
      } as Response);

      renderWithIntl(
        <TestAiModelConnection
          aiAccountId="account-1"
          modelIdentifier="invalid-model"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Model connection failed: Model not found');
      });
    });

    it('calls onTestResult with success=true on successful test', async () => {
      const onTestResult = vi.fn();

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      renderWithIntl(
        <TestAiModelConnection
          aiAccountId="account-1"
          modelIdentifier="gpt-4"
          onTestResult={onTestResult}
        />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
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
        <TestAiModelConnection
          aiAccountId="account-1"
          modelIdentifier="invalid-model"
          onTestResult={onTestResult}
        />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
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
        <TestAiModelConnection
          aiAccountId="account-1"
          modelIdentifier="gpt-4-turbo"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(vi.mocked(fetch)).toHaveBeenCalledWith(
          '/api/test-ai-model-connection',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer mock-token',
            },
            body: JSON.stringify({
              aiAccountId: 'account-1',
              modelIdentifier: 'gpt-4-turbo',
            }),
          })
        );
      });
    });

    it('handles network errors gracefully', async () => {
      const onTestResult = vi.fn();

      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(
        <TestAiModelConnection
          aiAccountId="account-1"
          modelIdentifier="gpt-4"
          onTestResult={onTestResult}
        />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onTestResult).toHaveBeenCalledWith(false, 'connectionError');
        expect(toast.error).toHaveBeenCalledWith('Model connection failed: Network error');
      });
    });

    it('handles non-Error exceptions gracefully', async () => {
      const onTestResult = vi.fn();

      vi.mocked(fetch).mockRejectedValueOnce('string error');

      renderWithIntl(
        <TestAiModelConnection
          aiAccountId="account-1"
          modelIdentifier="gpt-4"
          onTestResult={onTestResult}
        />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onTestResult).toHaveBeenCalledWith(false, 'connectionError');
        expect(toast.error).toHaveBeenCalledWith('Model connection failed: Unknown error');
      });
    });

    it('uses fallback error key when error has no message', async () => {
      const onTestResult = vi.fn();

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: {}, // No message field
        }),
      } as Response);

      renderWithIntl(
        <TestAiModelConnection
          aiAccountId="account-1"
          modelIdentifier="gpt-4"
          onTestResult={onTestResult}
        />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onTestResult).toHaveBeenCalledWith(false, 'connectionError');
        expect(toast.error).toHaveBeenCalledWith(
          'Model connection failed. Please check your model identifier.'
        );
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
        <TestAiModelConnection
          aiAccountId="account-1"
          modelIdentifier="gpt-4"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-ai-model-connection-button');
      fireEvent.click(button);

      // Button should be disabled immediately after click
      expect(button).toBeDisabled();

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });

      // Button should be enabled again after test completes
      expect(button).not.toBeDisabled();
    });
  });

  describe('render prop pattern', () => {
    it('supports children render prop for custom layout', () => {
      renderWithIntl(
        <TestAiModelConnection aiAccountId="account-1" modelIdentifier="gpt-4">
          {({ testButton }) => (
            <div data-testid="custom-container">
              <span>Custom Layout</span>
              {testButton}
            </div>
          )}
        </TestAiModelConnection>
      );

      expect(screen.getByTestId('custom-container')).toBeInTheDocument();
      expect(screen.getByText('Custom Layout')).toBeInTheDocument();
      expect(screen.getByTestId('test-ai-model-connection-button')).toBeInTheDocument();
    });
  });
});
