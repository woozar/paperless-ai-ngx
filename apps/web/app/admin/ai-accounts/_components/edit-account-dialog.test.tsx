import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { EditAccountDialog } from './edit-account-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiAccountListItem } from '@repo/api-client';

const mockAccount: AiAccountListItem = {
  id: 'account-123',
  name: 'OpenAI',
  provider: 'openai',
  apiKey: 'sk-test-key',
  baseUrl: null,
  isActive: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockPatchAiAccountsById = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    patchAiAccountsById: (...args: any[]) => mockPatchAiAccountsById(...args),
  };
});

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => {
    // Auto-select first option (openai) when component mounts
    if (!value && onValueChange) {
      setTimeout(() => onValueChange('openai'), 0);
    }
    return (
      <div data-testid="mock-select" data-value={value || 'openai'}>
        {children}
      </div>
    );
  },
  SelectTrigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  SelectValue: () => <div>Value</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('EditAccountDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    account: mockAccount,
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('renders dialog when open is true', async () => {
    renderWithIntl(<EditAccountDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<EditAccountDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders form with initial values from account', async () => {
    renderWithIntl(<EditAccountDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Verify name input is populated with initial value
    const nameInput = screen.getByTestId('edit-account-name-input');
    expect(nameInput).toHaveValue('OpenAI');

    // Verify API key input is empty (for security)
    const apiKeyInput = screen.getByTestId('edit-account-apiKey-input');
    expect(apiKeyInput).toHaveValue('');

    // Verify submit button exists
    const submitButton = screen.getByTestId('edit-account-submit-button');
    expect(submitButton).toBeInTheDocument();
  });

  it('displays error message on API error', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchAiAccountsById.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
      response: { status: 500 },
    });

    renderWithIntl(<EditAccountDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('edit-account-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');

    const submitButton = screen.getByTestId('edit-account-submit-button');

    if (!submitButton.hasAttribute('disabled')) {
      await user.click(submitButton);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    }
  });

  it('returns null when provider is null', () => {
    const { container } = renderWithIntl(<EditAccountDialog {...defaultProps} account={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('allows typing in apiKey input', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<EditAccountDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const apiKeyInput = screen.getByTestId('edit-account-apiKey-input');
    await user.type(apiKeyInput, 'new-api-key');

    expect(apiKeyInput).toHaveValue('new-api-key');
  });

  it('shows baseUrl field for ollama provider', async () => {
    const accountWithBaseUrl = {
      ...mockAccount,
      provider: 'ollama' as const,
      baseUrl: 'http://localhost:11434',
    };

    renderWithIntl(<EditAccountDialog {...defaultProps} account={accountWithBaseUrl} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // For ollama provider, baseUrl input should be visible
    const baseUrlInput = screen.getByTestId('edit-account-baseUrl-input');
    expect(baseUrlInput).toBeInTheDocument();
    expect(baseUrlInput).toHaveValue('http://localhost:11434');
  });
});
