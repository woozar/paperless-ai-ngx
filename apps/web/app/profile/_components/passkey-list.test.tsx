import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasskeyList } from './passkey-list';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { WebAuthnCredential } from '@repo/api-client';

const mockGetAuthWebauthnCredentials = vi.fn();
const mockPatchAuthWebauthnCredentialsById = vi.fn();
const mockDeleteAuthWebauthnCredentialsById = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getAuthWebauthnCredentials: (...args: unknown[]) => mockGetAuthWebauthnCredentials(...args),
    patchAuthWebauthnCredentialsById: (...args: unknown[]) =>
      mockPatchAuthWebauthnCredentialsById(...args),
    deleteAuthWebauthnCredentialsById: (...args: unknown[]) =>
      mockDeleteAuthWebauthnCredentialsById(...args),
  };
});

const mockBrowserSupportsWebAuthn = vi.fn();

vi.mock('@simplewebauthn/browser', () => ({
  startRegistration: vi.fn(),
  browserSupportsWebAuthn: () => mockBrowserSupportsWebAuthn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockCredentials: WebAuthnCredential[] = [
  {
    id: 'cred-1',
    name: 'MacBook Pro',
    deviceType: 'singleDevice',
    backedUp: false,
    createdAt: '2024-01-15T10:30:00Z',
    lastUsedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: 'cred-2',
    name: null,
    deviceType: 'multiDevice',
    backedUp: true,
    createdAt: '2024-01-10T08:00:00Z',
    lastUsedAt: null,
  },
];

describe('PasskeyList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBrowserSupportsWebAuthn.mockReturnValue(true);
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('shows loading skeleton while fetching credentials', async () => {
    mockGetAuthWebauthnCredentials.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { container } = renderWithIntl(<PasskeyList />);

    // Should show skeletons while loading
    await waitFor(() => {
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  it('shows empty state when no credentials exist', async () => {
    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: { credentials: [] },
      error: undefined,
    });

    renderWithIntl(<PasskeyList />);

    await waitFor(() => {
      expect(screen.getByText(/No passkeys registered yet/i)).toBeInTheDocument();
    });
  });

  it('displays list of credentials', async () => {
    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: { credentials: mockCredentials },
      error: undefined,
    });

    renderWithIntl(<PasskeyList />);

    await waitFor(() => {
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
      expect(screen.getByText('Passkey 2')).toBeInTheDocument(); // Default name for unnamed
    });
  });

  it('shows backed up indicator for synced passkeys', async () => {
    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: { credentials: mockCredentials },
      error: undefined,
    });

    renderWithIntl(<PasskeyList />);

    await waitFor(() => {
      // Second credential is backed up
      const backedUpIcons = document.querySelectorAll('[class*="text-success"]');
      expect(backedUpIcons.length).toBe(1);
    });
  });

  it('opens rename dialog when rename button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: { credentials: mockCredentials },
      error: undefined,
    });

    renderWithIntl(<PasskeyList />);

    await waitFor(() => {
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    });

    const renameButton = screen.getByTestId('rename-passkey-cred-1');
    await user.click(renameButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens delete dialog when delete button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: { credentials: mockCredentials },
      error: undefined,
    });

    renderWithIntl(<PasskeyList />);

    await waitFor(() => {
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('delete-passkey-cred-1');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('successfully renames a credential', async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: { credentials: mockCredentials },
      error: undefined,
    });

    mockPatchAuthWebauthnCredentialsById.mockResolvedValue({
      data: { success: true },
      error: undefined,
    });

    renderWithIntl(<PasskeyList />);

    await waitFor(() => {
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    });

    const renameButton = screen.getByTestId('rename-passkey-cred-1');
    await user.click(renameButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('passkey-name-input');
    await user.clear(input);
    await user.type(input, 'New Name');

    const saveButton = screen.getByTestId('save-passkey-name');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockPatchAuthWebauthnCredentialsById).toHaveBeenCalledWith(
        expect.objectContaining({
          path: { id: 'cred-1' },
          body: { name: 'New Name' },
        })
      );
    });
  });

  it('successfully deletes a credential', async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: { credentials: mockCredentials },
      error: undefined,
    });

    mockDeleteAuthWebauthnCredentialsById.mockResolvedValue({
      data: { success: true },
      error: undefined,
    });

    renderWithIntl(<PasskeyList />);

    await waitFor(() => {
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('delete-passkey-cred-1');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId('confirm-delete-passkey');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteAuthWebauthnCredentialsById).toHaveBeenCalledWith(
        expect.objectContaining({
          path: { id: 'cred-1' },
        })
      );
    });
  });

  it('handles load error gracefully', async () => {
    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: null,
      error: { message: 'Failed to load' },
    });

    renderWithIntl(<PasskeyList />);

    await waitFor(() => {
      expect(mockGetAuthWebauthnCredentials).toHaveBeenCalled();
    });
  });

  it('handles empty response gracefully', async () => {
    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: undefined,
      error: undefined,
    });

    renderWithIntl(<PasskeyList />);

    await waitFor(() => {
      expect(mockGetAuthWebauthnCredentials).toHaveBeenCalled();
    });
  });

  it('handles rename error gracefully', async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: { credentials: mockCredentials },
      error: undefined,
    });

    mockPatchAuthWebauthnCredentialsById.mockResolvedValue({
      data: null,
      error: { message: 'Rename failed' },
    });

    renderWithIntl(<PasskeyList />);

    await waitFor(() => {
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    });

    const renameButton = screen.getByTestId('rename-passkey-cred-1');
    await user.click(renameButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('passkey-name-input');
    await user.clear(input);
    await user.type(input, 'New Name');

    const saveButton = screen.getByTestId('save-passkey-name');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockPatchAuthWebauthnCredentialsById).toHaveBeenCalled();
    });
  });

  it('handles delete error gracefully', async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: { credentials: mockCredentials },
      error: undefined,
    });

    mockDeleteAuthWebauthnCredentialsById.mockResolvedValue({
      data: null,
      error: { message: 'Delete failed' },
    });

    renderWithIntl(<PasskeyList />);

    await waitFor(() => {
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('delete-passkey-cred-1');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId('confirm-delete-passkey');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteAuthWebauthnCredentialsById).toHaveBeenCalled();
    });
  });
});
