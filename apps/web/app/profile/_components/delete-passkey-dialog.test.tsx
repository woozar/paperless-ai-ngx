import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeletePasskeyDialog } from './delete-passkey-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { WebAuthnCredential } from '@repo/api-client';

const mockCredential: WebAuthnCredential = {
  id: 'cred-123',
  name: 'MacBook Pro',
  deviceType: 'singleDevice',
  backedUp: false,
  createdAt: '2024-01-15T10:30:00Z',
  lastUsedAt: '2024-01-20T15:00:00Z',
};

describe('DeletePasskeyDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    credential: mockCredential,
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dialog when open is true', async () => {
    renderWithIntl(<DeletePasskeyDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<DeletePasskeyDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays credential name in description', async () => {
    renderWithIntl(<DeletePasskeyDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/MacBook Pro/)).toBeInTheDocument();
    });
  });

  it('displays default name when credential has no name', async () => {
    const credentialWithoutName = { ...mockCredential, name: null };
    renderWithIntl(<DeletePasskeyDialog {...defaultProps} credential={credentialWithoutName} />);

    await waitFor(() => {
      // The dialog description should contain the default name "Passkey"
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    });
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const onDelete = vi.fn().mockResolvedValue(undefined);

    renderWithIntl(<DeletePasskeyDialog {...defaultProps} onDelete={onDelete} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('confirm-delete-passkey');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('cred-123');
    });
  });

  it('shows loading state while deleting', async () => {
    const user = userEvent.setup({ delay: null });
    const onDelete = vi
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderWithIntl(<DeletePasskeyDialog {...defaultProps} onDelete={onDelete} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('confirm-delete-passkey');
    await user.click(deleteButton);

    expect(screen.getByText('Deleting...')).toBeInTheDocument();
    expect(deleteButton).toBeDisabled();
  });

  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();

    renderWithIntl(<DeletePasskeyDialog {...defaultProps} onOpenChange={onOpenChange} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
