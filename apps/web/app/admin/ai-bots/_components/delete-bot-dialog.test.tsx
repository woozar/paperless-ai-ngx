import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteBotDialog } from './delete-bot-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiBotListItem } from '@repo/api-client';

const mockBot: AiBotListItem = {
  id: 'bot-123',
  name: 'Test Bot',
  aiModelId: 'model-1',
  systemPrompt: 'You are a helpful assistant',
  responseLanguage: 'DOCUMENT',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  aiModel: {
    id: 'model-1',
    name: 'GPT-4',
    modelIdentifier: 'gpt-4',
    aiAccount: {
      id: 'account-1',
      name: 'OpenAI',
      provider: 'openai',
    },
  },
};

const mockDeleteAiBotsById = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    deleteAiBotsById: (...args: any[]) => mockDeleteAiBotsById(...args),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('DeleteBotDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    bot: mockBot,
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
    renderWithIntl(<DeleteBotDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<DeleteBotDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls deleteAiBotsById with correct bot ID', async () => {
    const user = userEvent.setup({ delay: null });
    const onSuccess = vi.fn();
    mockDeleteAiBotsById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<DeleteBotDialog {...defaultProps} onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    await user.type(input, 'Test Bot');

    const deleteButton = screen.getByTestId('submit-delete-button');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteAiBotsById).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          path: { id: 'bot-123' },
        })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
