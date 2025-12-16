import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RenamePasskeyDialog } from './rename-passkey-dialog';
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

describe('RenamePasskeyDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    credential: mockCredential,
    onRename: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dialog when open is true', async () => {
    renderWithIntl(<RenamePasskeyDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<RenamePasskeyDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('pre-fills input with current credential name', async () => {
    renderWithIntl(<RenamePasskeyDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('passkey-name-input')).toHaveValue('MacBook Pro');
    });
  });

  it('pre-fills empty string when credential has no name', async () => {
    const credentialWithoutName = { ...mockCredential, name: null };
    renderWithIntl(<RenamePasskeyDialog {...defaultProps} credential={credentialWithoutName} />);

    await waitFor(() => {
      expect(screen.getByTestId('passkey-name-input')).toHaveValue('');
    });
  });

  it('calls onRename when form is submitted', async () => {
    const user = userEvent.setup({ delay: null });
    const onRename = vi.fn().mockResolvedValue(undefined);

    renderWithIntl(<RenamePasskeyDialog {...defaultProps} onRename={onRename} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('passkey-name-input');
    await user.clear(input);
    await user.type(input, 'iPhone');

    const saveButton = screen.getByTestId('save-passkey-name');
    await user.click(saveButton);

    await waitFor(() => {
      expect(onRename).toHaveBeenCalledWith('cred-123', 'iPhone');
    });
  });

  it('shows loading state while saving', async () => {
    const user = userEvent.setup({ delay: null });
    const onRename = vi
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderWithIntl(<RenamePasskeyDialog {...defaultProps} onRename={onRename} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const saveButton = screen.getByTestId('save-passkey-name');
    await user.click(saveButton);

    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();

    renderWithIntl(<RenamePasskeyDialog {...defaultProps} onOpenChange={onOpenChange} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('resets name when dialog reopens', async () => {
    const { rerender } = renderWithIntl(<RenamePasskeyDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('passkey-name-input')).toHaveValue('MacBook Pro');
    });

    // Close dialog
    rerender(<RenamePasskeyDialog {...defaultProps} open={false} />);

    // Reopen with different credential
    const newCredential = { ...mockCredential, id: 'cred-456', name: 'New Device' };
    rerender(<RenamePasskeyDialog {...defaultProps} open={true} credential={newCredential} />);

    await waitFor(() => {
      expect(screen.getByTestId('passkey-name-input')).toHaveValue('New Device');
    });
  });
});
