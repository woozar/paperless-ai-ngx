import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { CreateProviderDialog } from './create-provider-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockPostAiProviders = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    postAiProviders: (...args: any[]) => mockPostAiProviders(...args),
  };
});

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value }: any) => {
    return (
      <div data-testid="mock-select" data-value={value}>
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

describe('CreateProviderDialog', () => {
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
    renderWithIntl(<CreateProviderDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<CreateProviderDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls API with form data when submitted', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAiProviders.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<CreateProviderDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('create-provider-name-input');
    const modelInput = screen.getByTestId('create-provider-model-input');
    const apiKeyInput = screen.getByTestId('create-provider-apiKey-input');

    await user.type(nameInput, 'OpenAI Provider');
    await user.type(modelInput, 'gpt-4');
    await user.type(apiKeyInput, 'sk-test-key');

    const submitButton = screen.getByTestId('create-provider-submit-button');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPostAiProviders).toHaveBeenCalled();
      expect(mockPostAiProviders.mock.calls[0]?.[0]?.body).toMatchObject({
        name: 'OpenAI Provider',
        provider: 'openai',
        model: 'gpt-4',
        apiKey: 'sk-test-key',
      });
    });
  });

  it('closes dialog and calls onSuccess after successful creation', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    mockPostAiProviders.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(
      <CreateProviderDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('create-provider-name-input');
    const modelInput = screen.getByTestId('create-provider-model-input');
    const apiKeyInput = screen.getByTestId('create-provider-apiKey-input');

    await user.type(nameInput, 'New Provider');
    await user.type(modelInput, 'gpt-4');
    await user.type(apiKeyInput, 'sk-test-key');

    const submitButton = screen.getByTestId('create-provider-submit-button');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on API error', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAiProviders.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
      response: { status: 500 },
    });

    renderWithIntl(<CreateProviderDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('create-provider-name-input');
    const modelInput = screen.getByTestId('create-provider-model-input');
    const apiKeyInput = screen.getByTestId('create-provider-apiKey-input');

    await user.type(nameInput, 'New Provider');
    await user.type(modelInput, 'gpt-4');
    await user.type(apiKeyInput, 'sk-test-key');

    const submitButton = screen.getByTestId('create-provider-submit-button');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });
});
