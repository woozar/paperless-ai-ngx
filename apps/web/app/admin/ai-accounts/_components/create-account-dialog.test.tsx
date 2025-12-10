import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { CreateAccountDialog } from './create-account-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockPostAiAccounts = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    postAiAccounts: (...args: any[]) => mockPostAiAccounts(...args),
  };
});

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange, defaultValue }: any) => {
    const effectiveValue = value ?? defaultValue ?? 'openai';
    // Trigger initial value on mount using React's useEffect pattern
    React.useEffect(() => {
      if (onValueChange && !value) {
        onValueChange('openai');
      }
    }, [onValueChange, value]);
    return (
      <div data-testid="mock-select" data-value={effectiveValue}>
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

describe('CreateAccountDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
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
    renderWithIntl(<CreateAccountDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<CreateAccountDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders form with all required fields', async () => {
    renderWithIntl(<CreateAccountDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Verify name input is present and accepts input
    const nameInput = screen.getByTestId('create-account-name-input');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('');

    // Verify API key input is present
    const apiKeyInput = screen.getByTestId('create-account-apiKey-input');
    expect(apiKeyInput).toBeInTheDocument();

    // Verify provider select is present
    const providerInput = screen.getByTestId('create-account-provider-input');
    expect(providerInput).toBeInTheDocument();

    // Verify submit button exists
    const submitButton = screen.getByTestId('create-account-submit-button');
    expect(submitButton).toBeInTheDocument();
  });

  it('displays error message on API error', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAiAccounts.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
      response: { status: 500 },
    });

    renderWithIntl(<CreateAccountDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('create-account-name-input');
    const apiKeyInput = screen.getByTestId('create-account-apiKey-input');

    await user.type(nameInput, 'New Account');
    await user.type(apiKeyInput, 'sk-test-key');

    const submitButton = screen.getByTestId('create-account-submit-button');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });
});
