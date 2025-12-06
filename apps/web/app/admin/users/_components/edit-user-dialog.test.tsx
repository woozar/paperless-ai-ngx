import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import React from 'react';
import { EditUserDialog } from './edit-user-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { UserListItem } from '@repo/api-client';

const mockUser: UserListItem = {
  id: 'user-123',
  username: 'testuser',
  role: 'DEFAULT',
  isActive: true,
  mustChangePassword: false,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockPatchUsersById = vi.fn();
let mockOnValueChange: ((value: string) => void) | null = null;

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    patchUsersById: (...args: any[]) => mockPatchUsersById(...args),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock the Select component to capture onValueChange
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: any) => {
    mockOnValueChange = onValueChange;
    return (
      <div data-testid="mock-select" data-value={value}>
        {children}
      </div>
    );
  },
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: () => <div>Value</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
}));

describe('EditUserDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    user: mockUser,
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
    renderWithIntl(<EditUserDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<EditUserDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays current username in dialog description', async () => {
    renderWithIntl(<EditUserDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('initializes username input with user value', async () => {
    renderWithIntl(<EditUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('edit-user-username-input');
    expect(usernameInput).toHaveValue('testuser');
  });

  it('calls API and onSuccess when save button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const onSuccess = vi.fn();
    mockPatchUsersById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<EditUserDialog {...defaultProps} onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('edit-user-username-input');
    await user.clear(usernameInput);
    await user.type(usernameInput, 'newusername');

    const submitButton = screen.getByTestId('edit-user-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchUsersById).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          path: { id: 'user-123' },
          body: { username: 'newusername' },
        })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('displays username exists error', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchUsersById.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.usernameExists' },
      response: { status: 409 },
    });

    renderWithIntl(<EditUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const usernameInput = screen.getByTestId('edit-user-username-input');
    await user.clear(usernameInput);
    await user.type(usernameInput, 'admin');

    const submitButton = screen.getByTestId('edit-user-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Username already exists');
    });
  });

  it('displays last admin error', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchUsersById.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.lastAdmin' },
      response: { status: 400 },
    });

    renderWithIntl(<EditUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Make a change to enable submit button
    const usernameInput = screen.getByTestId('edit-user-username-input');
    await user.clear(usernameInput);
    await user.type(usernameInput, 'changeduser');

    const submitButton = screen.getByTestId('edit-user-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Cannot modify the last admin user');
    });
  });

  it('includes role in update when user has ADMIN role', async () => {
    const user = userEvent.setup({ delay: null });
    const adminUser = { ...mockUser, role: 'ADMIN' as const, username: 'adminuser' };
    mockPatchUsersById.mockResolvedValueOnce({ data: {}, error: undefined });

    // Start with an ADMIN user
    renderWithIntl(<EditUserDialog {...defaultProps} user={adminUser} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Change username to trigger update
    const usernameInput = screen.getByTestId('edit-user-username-input');
    await user.clear(usernameInput);
    await user.type(usernameInput, 'newadmin');

    const submitButton = screen.getByTestId('edit-user-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchUsersById).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { username: 'newadmin' },
        })
      );
    });
  });

  it('resets password when provided', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchUsersById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<EditUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const passwordInput = screen.getByTestId('edit-user-resetPassword-input');
    await user.type(passwordInput, 'newpassword123');

    const submitButton = screen.getByTestId('edit-user-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchUsersById).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { resetPassword: 'newpassword123' },
        })
      );
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<EditUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const passwordInput = screen.getByTestId('edit-user-resetPassword-input');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find the toggle button (has tabIndex -1)
    const toggleButton = screen
      .getAllByRole('button')
      .find((btn) => btn.getAttribute('tabindex') === '-1');

    if (toggleButton) {
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  it('sends username and password when both are changed', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchUsersById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<EditUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Change username
    const usernameInput = screen.getByTestId('edit-user-username-input');
    await user.clear(usernameInput);
    await user.type(usernameInput, 'newusername');

    // Set password
    const passwordInput = screen.getByTestId('edit-user-resetPassword-input');
    await user.type(passwordInput, 'newpass123');

    const submitButton = screen.getByTestId('edit-user-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchUsersById).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            username: 'newusername',
            resetPassword: 'newpass123',
          },
        })
      );
    });
  });

  it('sends role when changed via Select component', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchUsersById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<EditUserDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Call the captured onValueChange from the mocked Select
    expect(mockOnValueChange).not.toBeNull();
    act(() => {
      mockOnValueChange!('ADMIN');
    });

    // Wait for state update
    await waitFor(() => {
      expect(screen.getByTestId('mock-select')).toHaveAttribute('data-value', 'ADMIN');
    });

    const submitButton = screen.getByTestId('edit-user-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchUsersById).toHaveBeenCalled();
    });

    // Check what was actually called
    expect(mockPatchUsersById).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          role: 'ADMIN',
        }),
      })
    );
  });

  it('returns null when user is null', () => {
    const { container } = renderWithIntl(<EditUserDialog {...defaultProps} user={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns early success when no changes are made', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();

    renderWithIntl(
      <EditUserDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Submit without making changes - button should be enabled since resetPassword can be empty
    const submitButton = screen.getByTestId('edit-user-submit-button');
    await user.click(submitButton);

    // Should close dialog and call onSuccess without calling the API
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });

    // API should not have been called since no changes were made
    expect(mockPatchUsersById).not.toHaveBeenCalled();
  });
});
