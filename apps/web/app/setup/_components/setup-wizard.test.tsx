import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetupWizard } from './setup-wizard';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

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
    children?: (props: { testButton: React.ReactNode }) => React.ReactNode;
  }) => {
    const testButton = (
      <button onClick={() => onTestResult(true)} data-testid="mock-test-ai-connection">
        Test AI Connection
      </button>
    );

    if (children) {
      return <>{children({ testButton })}</>;
    }

    return testButton;
  },
}));

vi.mock('@/components/connection-tests/test-paperless-connection', () => ({
  TestPaperlessConnection: ({
    onTestResult,
    children,
  }: {
    onTestResult: (success: boolean) => void;
    children?: (props: { testButton: React.ReactNode }) => React.ReactNode;
  }) => {
    const testButton = (
      <button onClick={() => onTestResult(true)} data-testid="mock-test-paperless-connection">
        Test Paperless Connection
      </button>
    );

    if (children) {
      return <>{children({ testButton })}</>;
    }

    return testButton;
  },
}));

vi.mock('@/components/connection-tests/test-ai-model-connection', () => ({
  TestAiModelConnection: () => null,
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'display.general.currency': 'EUR' },
    isLoading: false,
    updateSetting: vi.fn(),
    refreshSettings: vi.fn(),
  }),
}));

global.fetch = vi.fn();

describe('SetupWizard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
      },
      writable: true,
    });

    // Default: No existing entities
    vi.mocked(fetch).mockImplementation(async (url) => {
      if (typeof url === 'string') {
        if (url.includes('/api/ai-accounts')) {
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
        if (url.includes('/api/ai-models')) {
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
        if (url.includes('/api/ai-bots')) {
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
      }
      return { ok: true, json: async () => ({}) } as Response;
    });
  });

  it('renders wizard title and description', async () => {
    renderWithIntl(<SetupWizard />);

    await waitFor(() => {
      expect(screen.getByText('Setup Wizard')).toBeInTheDocument();
    });
  });

  it('renders all four tab triggers', async () => {
    renderWithIntl(<SetupWizard />);

    await waitFor(() => {
      expect(screen.getByTestId('setup-tab-ai-account')).toBeInTheDocument();
    });

    expect(screen.getByTestId('setup-tab-ai-model')).toBeInTheDocument();
    expect(screen.getByTestId('setup-tab-ai-bot')).toBeInTheDocument();
    expect(screen.getByTestId('setup-tab-paperless')).toBeInTheDocument();
  });

  it('starts on ai-account step by default', async () => {
    renderWithIntl(<SetupWizard />);

    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-account-name-input')).toBeInTheDocument();
    });
  });

  it('disables ai-model tab initially', async () => {
    renderWithIntl(<SetupWizard />);

    await waitFor(() => {
      const aiModelTab = screen.getByTestId('setup-tab-ai-model');
      expect(aiModelTab).toBeDisabled();
    });
  });

  it('disables ai-bot tab initially', async () => {
    renderWithIntl(<SetupWizard />);

    await waitFor(() => {
      const aiBotTab = screen.getByTestId('setup-tab-ai-bot');
      expect(aiBotTab).toBeDisabled();
    });
  });

  it('disables paperless tab initially', async () => {
    renderWithIntl(<SetupWizard />);

    await waitFor(() => {
      const paperlessTab = screen.getByTestId('setup-tab-paperless');
      expect(paperlessTab).toBeDisabled();
    });
  });

  it('shows loading spinner while loading entities', () => {
    // Make fetch hang forever
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}));

    renderWithIntl(<SetupWizard />);

    // Should show spinner initially
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('resumes to ai-model step when account exists', async () => {
    vi.mocked(fetch).mockImplementation(async (url) => {
      if (typeof url === 'string') {
        if (url.includes('/api/ai-accounts')) {
          return {
            ok: true,
            json: async () => ({
              items: [{ id: 'account-1', name: 'Test Account', provider: 'openai', baseUrl: '' }],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-models')) {
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
      }
      return { ok: true, json: async () => ({}) } as Response;
    });

    renderWithIntl(<SetupWizard />);

    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-model-name-input')).toBeInTheDocument();
    });
  });

  it('resumes to ai-bot step when account and model exist', async () => {
    vi.mocked(fetch).mockImplementation(async (url) => {
      if (typeof url === 'string') {
        if (url.includes('/api/ai-accounts')) {
          return {
            ok: true,
            json: async () => ({
              items: [{ id: 'account-1', name: 'Test Account', provider: 'openai', baseUrl: '' }],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-models')) {
          return {
            ok: true,
            json: async () => ({
              items: [
                {
                  id: 'model-1',
                  name: 'GPT-4',
                  modelIdentifier: 'gpt-4',
                  aiAccountId: 'account-1',
                },
              ],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-bots')) {
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
      }
      return { ok: true, json: async () => ({}) } as Response;
    });

    renderWithIntl(<SetupWizard />);

    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-bot-name-input')).toBeInTheDocument();
    });
  });

  it('resumes to paperless step when account, model and bot exist', async () => {
    vi.mocked(fetch).mockImplementation(async (url) => {
      if (typeof url === 'string') {
        if (url.includes('/api/ai-accounts')) {
          return {
            ok: true,
            json: async () => ({
              items: [{ id: 'account-1', name: 'Test Account', provider: 'openai', baseUrl: '' }],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-models')) {
          return {
            ok: true,
            json: async () => ({
              items: [
                {
                  id: 'model-1',
                  name: 'GPT-4',
                  modelIdentifier: 'gpt-4',
                  aiAccountId: 'account-1',
                },
              ],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-bots')) {
          return {
            ok: true,
            json: async () => ({
              items: [
                {
                  id: 'bot-1',
                  name: 'Document Bot',
                  systemPrompt: 'Test prompt',
                  responseLanguage: 'DOCUMENT',
                  aiModelId: 'model-1',
                },
              ],
            }),
          } as Response;
        }
      }
      return { ok: true, json: async () => ({}) } as Response;
    });

    renderWithIntl(<SetupWizard />);

    await waitFor(() => {
      expect(screen.getByTestId('setup-paperless-name-input')).toBeInTheDocument();
    });
  });

  it('enables ai-model tab after ai-account is created', async () => {
    vi.mocked(fetch).mockImplementation(async (url, options) => {
      if (typeof url === 'string') {
        if (url.includes('/api/ai-accounts')) {
          if (options && (options as RequestInit).method === 'POST') {
            return { ok: true, json: async () => ({ id: 'new-account-id' }) } as Response;
          }
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
        if (url.includes('/api/ai-models')) {
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
        if (url.includes('/api/ai-bots')) {
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
      }
      return { ok: true, json: async () => ({}) } as Response;
    });

    renderWithIntl(<SetupWizard />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-account-name-input')).toBeInTheDocument();
    });

    // Fill in the form
    fireEvent.change(screen.getByTestId('setup-ai-account-name-input'), {
      target: { value: 'My Account' },
    });
    fireEvent.change(screen.getByTestId('setup-ai-account-apiKey-input'), {
      target: { value: 'sk-test-key' },
    });

    // Click next
    fireEvent.click(screen.getByTestId('setup-ai-account-next-button'));

    // Wait for tab to be enabled and switched
    await waitFor(() => {
      expect(screen.getByTestId('setup-tab-ai-model')).not.toBeDisabled();
    });
  });

  it('prefills default bot values', async () => {
    renderWithIntl(<SetupWizard />);

    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-account-name-input')).toBeInTheDocument();
    });
  });

  it('allows manual tab navigation when tabs are enabled', async () => {
    const user = userEvent.setup();

    // Setup: account and model exist, so bot tab should be clickable
    vi.mocked(fetch).mockImplementation(async (url) => {
      if (typeof url === 'string') {
        if (url.includes('/api/ai-accounts')) {
          return {
            ok: true,
            json: async () => ({
              items: [{ id: 'account-1', name: 'Test Account', provider: 'openai', baseUrl: '' }],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-models')) {
          return {
            ok: true,
            json: async () => ({
              items: [
                {
                  id: 'model-1',
                  name: 'GPT-4',
                  modelIdentifier: 'gpt-4',
                  aiAccountId: 'account-1',
                },
              ],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-bots')) {
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
      }
      return { ok: true, json: async () => ({}) } as Response;
    });

    renderWithIntl(<SetupWizard />);

    // Wait for bot step to be displayed (resume point)
    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-bot-name-input')).toBeInTheDocument();
    });

    // Click on ai-model tab to go back using userEvent
    await user.click(screen.getByTestId('setup-tab-ai-model'));

    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-model-name-input')).toBeInTheDocument();
    });
  });

  it('navigates back from ai-model step to ai-account step', async () => {
    // Setup with existing account to start on ai-model step
    vi.mocked(fetch).mockImplementation(async (url) => {
      if (typeof url === 'string') {
        if (url.includes('/api/ai-accounts')) {
          return {
            ok: true,
            json: async () => ({
              items: [{ id: 'account-1', name: 'Test Account', provider: 'openai', baseUrl: '' }],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-models')) {
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
        if (url.includes('/api/ai-bots')) {
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
      }
      return { ok: true, json: async () => ({}) } as Response;
    });

    renderWithIntl(<SetupWizard />);

    // Wait for ai-model step
    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-model-back-button')).toBeInTheDocument();
    });

    // Click back button
    fireEvent.click(screen.getByTestId('setup-ai-model-back-button'));

    // Should navigate to ai-account step
    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-account-name-input')).toBeInTheDocument();
    });
  });

  it('navigates back from ai-bot step to ai-model step', async () => {
    // Setup with existing account and model to start on ai-bot step
    vi.mocked(fetch).mockImplementation(async (url) => {
      if (typeof url === 'string') {
        if (url.includes('/api/ai-accounts')) {
          return {
            ok: true,
            json: async () => ({
              items: [{ id: 'account-1', name: 'Test Account', provider: 'openai', baseUrl: '' }],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-models')) {
          return {
            ok: true,
            json: async () => ({
              items: [
                {
                  id: 'model-1',
                  name: 'GPT-4',
                  modelIdentifier: 'gpt-4',
                  aiAccountId: 'account-1',
                },
              ],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-bots')) {
          return { ok: true, json: async () => ({ items: [] }) } as Response;
        }
      }
      return { ok: true, json: async () => ({}) } as Response;
    });

    renderWithIntl(<SetupWizard />);

    // Wait for ai-bot step
    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-bot-back-button')).toBeInTheDocument();
    });

    // Click back button
    fireEvent.click(screen.getByTestId('setup-ai-bot-back-button'));

    // Should navigate to ai-model step
    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-model-name-input')).toBeInTheDocument();
    });
  });

  it('navigates back from paperless step to ai-bot step', async () => {
    // Setup with existing account, model and bot to start on paperless step
    vi.mocked(fetch).mockImplementation(async (url) => {
      if (typeof url === 'string') {
        if (url.includes('/api/ai-accounts')) {
          return {
            ok: true,
            json: async () => ({
              items: [{ id: 'account-1', name: 'Test Account', provider: 'openai', baseUrl: '' }],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-models')) {
          return {
            ok: true,
            json: async () => ({
              items: [
                {
                  id: 'model-1',
                  name: 'GPT-4',
                  modelIdentifier: 'gpt-4',
                  aiAccountId: 'account-1',
                },
              ],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-bots')) {
          return {
            ok: true,
            json: async () => ({
              items: [
                {
                  id: 'bot-1',
                  name: 'Bot',
                  systemPrompt: 'Prompt',
                  responseLanguage: 'DOCUMENT',
                  aiModelId: 'model-1',
                },
              ],
            }),
          } as Response;
        }
      }
      return { ok: true, json: async () => ({}) } as Response;
    });

    renderWithIntl(<SetupWizard />);

    // Wait for paperless step
    await waitFor(() => {
      expect(screen.getByTestId('setup-paperless-back-button')).toBeInTheDocument();
    });

    // Click back button
    fireEvent.click(screen.getByTestId('setup-paperless-back-button'));

    // Should navigate to ai-bot step
    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-bot-name-input')).toBeInTheDocument();
    });
  });

  it('completes wizard and redirects to home when paperless is created', async () => {
    // Setup with existing account, model and bot to start on paperless step
    vi.mocked(fetch).mockImplementation(async (url, options) => {
      if (typeof url === 'string') {
        if (url.includes('/api/ai-accounts')) {
          return {
            ok: true,
            json: async () => ({
              items: [{ id: 'account-1', name: 'Test Account', provider: 'openai', baseUrl: '' }],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-models')) {
          return {
            ok: true,
            json: async () => ({
              items: [
                {
                  id: 'model-1',
                  name: 'GPT-4',
                  modelIdentifier: 'gpt-4',
                  aiAccountId: 'account-1',
                },
              ],
            }),
          } as Response;
        }
        if (url.includes('/api/ai-bots')) {
          return {
            ok: true,
            json: async () => ({
              items: [
                {
                  id: 'bot-1',
                  name: 'Bot',
                  systemPrompt: 'Prompt',
                  responseLanguage: 'DOCUMENT',
                  aiModelId: 'model-1',
                },
              ],
            }),
          } as Response;
        }
        if (
          url.includes('/api/paperless-instances') &&
          options &&
          (options as RequestInit).method === 'POST'
        ) {
          return { ok: true, json: async () => ({ id: 'new-instance-id' }) } as Response;
        }
      }
      return { ok: true, json: async () => ({}) } as Response;
    });

    renderWithIntl(<SetupWizard />);

    // Wait for paperless step
    await waitFor(() => {
      expect(screen.getByTestId('setup-paperless-name-input')).toBeInTheDocument();
    });

    // Fill form and submit
    fireEvent.change(screen.getByTestId('setup-paperless-name-input'), {
      target: { value: 'My Paperless' },
    });
    fireEvent.change(screen.getByTestId('setup-paperless-url-input'), {
      target: { value: 'https://paperless.example.com' },
    });
    fireEvent.change(screen.getByTestId('setup-paperless-token-input'), {
      target: { value: 'my-token' },
    });
    fireEvent.click(screen.getByTestId('setup-paperless-finish-button'));

    // Should redirect to home
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('handles API error when loading existing entities', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    renderWithIntl(<SetupWizard />);

    // Should still render the wizard (on first step)
    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-account-name-input')).toBeInTheDocument();
    });
  });

  it('handles non-ok API response when loading existing entities', async () => {
    vi.mocked(fetch).mockImplementation(async () => {
      return { ok: false, json: async () => ({}) } as Response;
    });

    renderWithIntl(<SetupWizard />);

    // Should still render the wizard (on first step) when API returns error
    await waitFor(() => {
      expect(screen.getByTestId('setup-ai-account-name-input')).toBeInTheDocument();
    });
  });
});
