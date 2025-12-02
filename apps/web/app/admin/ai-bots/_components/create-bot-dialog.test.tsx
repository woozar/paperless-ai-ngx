import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { CreateBotDialog } from './create-bot-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiProviderListItem } from '@repo/api-client';

const mockPostAiBots = vi.fn();
const mockGetAiProviders = vi.fn();
let mockOnProviderChange: ((value: string) => void) | undefined;

const mockProviders: AiProviderListItem[] = [
  {
    id: 'provider-1',
    name: 'OpenAI',
    provider: 'openai',
    model: 'gpt-4',
    baseUrl: null,
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
];

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    postAiBots: (...args: any[]) => mockPostAiBots(...args),
    getAiProviders: (...args: any[]) => mockGetAiProviders(...args),
  };
});

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: any) => {
    mockOnProviderChange = onValueChange;
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

describe('CreateBotDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAiProviders.mockResolvedValue({
      data: { providers: mockProviders },
      error: undefined,
    });
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
    renderWithIntl(<CreateBotDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<CreateBotDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls API with form data when submitted', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAiBots.mockResolvedValueOnce({ data: { id: 'new-bot' }, error: undefined });

    renderWithIntl(<CreateBotDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockGetAiProviders).toHaveBeenCalled();
    });

    const nameInput = screen.getByTestId('create-bot-name-input');
    const systemPromptInput = screen.getByTestId('create-bot-systemPrompt-input');

    await user.type(nameInput, 'New Bot');
    await user.type(systemPromptInput, 'Be helpful');

    act(() => {
      mockOnProviderChange?.('provider-1');
    });

    const submitButton = screen.getByTestId('create-bot-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPostAiBots).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          body: {
            name: 'New Bot',
            aiProviderId: 'provider-1',
            systemPrompt: 'Be helpful',
          },
        })
      );
    });
  });

  it('closes dialog and calls onSuccess after successful creation', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    mockPostAiBots.mockResolvedValueOnce({ data: { id: 'new-bot' }, error: undefined });

    renderWithIntl(
      <CreateBotDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockGetAiProviders).toHaveBeenCalled();
    });

    const nameInput = screen.getByTestId('create-bot-name-input');
    const systemPromptInput = screen.getByTestId('create-bot-systemPrompt-input');

    await user.type(nameInput, 'New Bot');
    await user.type(systemPromptInput, 'Be helpful');

    act(() => {
      mockOnProviderChange?.('provider-1');
    });

    const submitButton = screen.getByTestId('create-bot-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on API error', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAiBots.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
      response: { status: 500 },
    });

    renderWithIntl(<CreateBotDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockGetAiProviders).toHaveBeenCalled();
    });

    const nameInput = screen.getByTestId('create-bot-name-input');
    const systemPromptInput = screen.getByTestId('create-bot-systemPrompt-input');

    await user.type(nameInput, 'New Bot');
    await user.type(systemPromptInput, 'Be helpful');

    act(() => {
      mockOnProviderChange?.('provider-1');
    });

    const submitButton = screen.getByTestId('create-bot-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('shows error when loading providers fails', async () => {
    mockGetAiProviders.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
    });

    renderWithIntl(<CreateBotDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });
});
