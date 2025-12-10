import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteAccountDialog } from './delete-account-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiAccountListItem } from '@repo/api-client';

const mockAccount: Omit<AiAccountListItem, 'apiKey'> = {
  id: 'account-123',
  name: 'OpenAI',
  provider: 'openai',
  baseUrl: null,
  isActive: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockDeleteAiAccountsById = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    deleteAiAccountsById: (...args: any[]) => mockDeleteAiAccountsById(...args),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('DeleteAccountDialog', () => {
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
    renderWithIntl(<DeleteAccountDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<DeleteAccountDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls deleteAiAccountsById with correct account ID', async () => {
    const user = userEvent.setup({ delay: null });
    const onSuccess = vi.fn();
    mockDeleteAiAccountsById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<DeleteAccountDialog {...defaultProps} onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    await user.type(input, 'OpenAI');

    const deleteButton = screen.getByTestId('submit-delete-button');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteAiAccountsById).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          path: { id: 'account-123' },
        })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
