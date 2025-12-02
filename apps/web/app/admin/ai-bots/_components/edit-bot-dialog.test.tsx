import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { EditBotDialog } from './edit-bot-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiBotListItem, AiProviderListItem } from '@repo/api-client';

const mockBot: AiBotListItem = {
  id: 'bot-123',
  name: 'Test Bot',
  aiProviderId: 'provider-1',
  systemPrompt: 'You are a helpful assistant',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  aiProvider: {
    id: 'provider-1',
    name: 'OpenAI',
  },
};

const mockProviders: Omit<AiProviderListItem, 'apiKey'>[] = [
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

const mockPatchAiBotsById = vi.fn();
const mockGetAiProviders = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    patchAiBotsById: (...args: any[]) => mockPatchAiBotsById(...args),
    getAiProviders: (...args: any[]) => mockGetAiProviders(...args),
  };
});

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: any) => (
    <div data-testid="mock-select" data-value={value}>
      {children}
    </div>
  ),
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

describe('EditBotDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    bot: mockBot,
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
    renderWithIntl(<EditBotDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<EditBotDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls API with form data when submitted', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchAiBotsById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<EditBotDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('edit-bot-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Bot');

    const submitButton = screen.getByTestId('edit-bot-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchAiBotsById).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          path: { id: 'bot-123' },
          body: { name: 'Updated Bot' },
        })
      );
    });
  });

  it('closes dialog and calls onSuccess after successful update', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    mockPatchAiBotsById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(
      <EditBotDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('edit-bot-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Bot');

    const submitButton = screen.getByTestId('edit-bot-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on API error', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchAiBotsById.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
      response: { status: 500 },
    });

    renderWithIntl(<EditBotDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('edit-bot-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');

    const submitButton = screen.getByTestId('edit-bot-submit-button');
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

    renderWithIntl(<EditBotDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('returns null when bot is null', async () => {
    const { container } = renderWithIntl(<EditBotDialog {...defaultProps} bot={null} />);
    expect(container.firstChild).toBeNull();
    // Wait for any pending state updates to complete
    await waitFor(() => {});
  });

  it('returns early success when no changes are made', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();

    renderWithIntl(
      <EditBotDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Submit without making changes - button should still be clickable
    const submitButton = screen.getByTestId('edit-bot-submit-button');
    await user.click(submitButton);

    // Should close dialog and call onSuccess without calling the API
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });

    // API should not have been called since no changes were made
    expect(mockPatchAiBotsById).not.toHaveBeenCalled();
  });
});
