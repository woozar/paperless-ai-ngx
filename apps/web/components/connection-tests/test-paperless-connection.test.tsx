import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { TestPaperlessConnection } from './test-paperless-connection';
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

describe('TestPaperlessConnection', () => {
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
    it('disables button when apiUrl is empty', () => {
      renderWithIntl(
        <TestPaperlessConnection apiUrl="" apiToken="test-token" onTestResult={vi.fn()} />
      );

      const button = screen.getByTestId('test-paperless-connection-button');
      expect(button).toBeDisabled();
    });

    it('disables button when apiToken is empty', () => {
      renderWithIntl(
        <TestPaperlessConnection
          apiUrl="https://paperless.example.com"
          apiToken=""
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-paperless-connection-button');
      expect(button).toBeDisabled();
    });

    it('enables button when form is valid', () => {
      renderWithIntl(
        <TestPaperlessConnection
          apiUrl="https://paperless.example.com"
          apiToken="test-token"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-paperless-connection-button');
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
        <TestPaperlessConnection
          apiUrl="https://paperless.example.com"
          apiToken="test-token"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-paperless-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Connection successful! You can proceed to the next step.'
        );
      });
    });

    it('shows error toast after failed test', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, error: { message: 'connectionError' } }),
      } as Response);

      renderWithIntl(
        <TestPaperlessConnection
          apiUrl="https://paperless.example.com"
          apiToken="test-token"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-paperless-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Connection failed. Please check your URL and API token.'
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
        <TestPaperlessConnection
          apiUrl="https://paperless.example.com"
          apiToken="test-token"
          onTestResult={onTestResult}
        />
      );

      const button = screen.getByTestId('test-paperless-connection-button');
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
        <TestPaperlessConnection
          apiUrl="https://paperless.example.com"
          apiToken="test-token"
          onTestResult={onTestResult}
        />
      );

      const button = screen.getByTestId('test-paperless-connection-button');
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
        <TestPaperlessConnection
          apiUrl="https://paperless.example.com"
          apiToken="test-token"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-paperless-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(vi.mocked(fetch)).toHaveBeenCalledWith(
          '/api/test-paperless-connection',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer mock-token',
            },
            body: JSON.stringify({
              apiUrl: 'https://paperless.example.com',
              apiToken: 'test-token',
            }),
          })
        );
      });
    });

    it('handles network errors gracefully', async () => {
      const onTestResult = vi.fn();

      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(
        <TestPaperlessConnection
          apiUrl="https://paperless.example.com"
          apiToken="test-token"
          onTestResult={onTestResult}
        />
      );

      const button = screen.getByTestId('test-paperless-connection-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onTestResult).toHaveBeenCalledWith(false, 'connectionError');
        expect(toast.error).toHaveBeenCalledWith(
          'Connection failed. Please check your URL and API token.'
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
        <TestPaperlessConnection
          apiUrl="https://paperless.example.com"
          apiToken="test-token"
          onTestResult={vi.fn()}
        />
      );

      const button = screen.getByTestId('test-paperless-connection-button');
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
        <TestPaperlessConnection apiUrl="https://paperless.example.com" apiToken="test-token">
          {({ testButton }) => (
            <div data-testid="custom-container">
              <span>Custom Layout</span>
              {testButton}
            </div>
          )}
        </TestPaperlessConnection>
      );

      expect(screen.getByTestId('custom-container')).toBeInTheDocument();
      expect(screen.getByText('Custom Layout')).toBeInTheDocument();
      expect(screen.getByTestId('test-paperless-connection-button')).toBeInTheDocument();
    });
  });
});
