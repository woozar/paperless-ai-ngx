import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './auth-provider';

// Mock next/navigation
const mockPush = vi.fn();
const mockPathname = vi.fn(() => '/');
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname(),
}));

// Test component to access the hook
function TestConsumer() {
  const { user, isLoading, isAuthenticated, login, logout, updateUser, refreshUser } = useAuth();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</div>
      <div data-testid="username">{user?.username ?? 'none'}</div>
      <button
        onClick={() =>
          login('test-token', {
            id: '1',
            username: 'testuser',
            role: 'DEFAULT',
            mustChangePassword: false,
            createdAt: '2024-01-01T00:00:00Z',
          })
        }
      >
        Login
      </button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => updateUser({ username: 'updated' })}>Update</button>
      <button onClick={() => refreshUser()}>Refresh</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.cookie = '';
    mockPathname.mockReturnValue('/');
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides initial unauthenticated state and redirects to login', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
    expect(screen.getByTestId('username')).toHaveTextContent('none');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('login sets user and stores token', async () => {
    const user = userEvent.setup({ delay: null });
    mockPathname.mockReturnValue('/login'); // On login page to avoid redirect

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await user.click(screen.getByText('Login'));

    expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
    expect(screen.getByTestId('username')).toHaveTextContent('testuser');
    expect(localStorage.getItem('auth_token')).toBe('test-token');
    expect(localStorage.getItem('auth_user')).toContain('testuser');
  });

  it('logout clears user and redirects to login', async () => {
    const user = userEvent.setup({ delay: null });
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    mockPathname.mockReturnValue('/login'); // Start on login page

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await user.click(screen.getByText('Login'));
    expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');

    mockPathname.mockReturnValue('/'); // Now on a protected page
    await user.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
    });
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('updateUser updates user state', async () => {
    const user = userEvent.setup({ delay: null });
    mockPathname.mockReturnValue('/login'); // On login page to avoid redirect

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await user.click(screen.getByText('Login'));
    expect(screen.getByTestId('username')).toHaveTextContent('testuser');

    await user.click(screen.getByText('Update'));
    expect(screen.getByTestId('username')).toHaveTextContent('updated');
  });

  it('restores user from localStorage on mount', async () => {
    localStorage.setItem('auth_token', 'stored-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({
        id: '2',
        username: 'storeduser',
        role: 'ADMIN',
        mustChangePassword: false,
      })
    );
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: '2',
          username: 'storeduser',
          role: 'ADMIN',
          mustChangePassword: false,
        }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
    expect(screen.getByTestId('username')).toHaveTextContent('storeduser');
  });

  it('redirects to change-password when mustChangePassword is true', async () => {
    localStorage.setItem('auth_token', 'token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({
        id: '1',
        username: 'user',
        role: 'DEFAULT',
        mustChangePassword: true,
      })
    );
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ id: '1', username: 'user', role: 'DEFAULT', mustChangePassword: true }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/change-password');
    });
  });

  it('clears auth when API returns invalid token and redirects to login', async () => {
    localStorage.setItem('auth_token', 'expired-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({
        id: '1',
        username: 'user',
        role: 'DEFAULT',
        mustChangePassword: false,
      })
    );
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Initially shows stored user, then clears after refresh
    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('handles fetch error during refresh gracefully and redirects to login', async () => {
    localStorage.setItem('auth_token', 'token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({
        id: '1',
        username: 'user',
        role: 'DEFAULT',
        mustChangePassword: false,
      })
    );
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // User should be cleared after fetch error
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('handles invalid JSON in localStorage gracefully and redirects to login', async () => {
    localStorage.setItem('auth_token', 'token');
    localStorage.setItem('auth_user', 'invalid-json');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Should clear invalid data and redirect
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('handles logout fetch error gracefully', async () => {
    const user = userEvent.setup({ delay: null });
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));
    mockPathname.mockReturnValue('/login'); // Start on login page

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await user.click(screen.getByText('Login'));
    expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');

    mockPathname.mockReturnValue('/'); // Now on a protected page
    await user.click(screen.getByText('Logout'));

    // Should still logout even if API call fails
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
    });
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('does not redirect when on change-password page with mustChangePassword', async () => {
    mockPathname.mockReturnValue('/change-password');
    localStorage.setItem('auth_token', 'token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({
        id: '1',
        username: 'user',
        role: 'DEFAULT',
        mustChangePassword: true,
      })
    );
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ id: '1', username: 'user', role: 'DEFAULT', mustChangePassword: true }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Should not redirect since already on change-password page
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not redirect when on login page with mustChangePassword', async () => {
    mockPathname.mockReturnValue('/login');
    localStorage.setItem('auth_token', 'token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({
        id: '1',
        username: 'user',
        role: 'DEFAULT',
        mustChangePassword: true,
      })
    );
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ id: '1', username: 'user', role: 'DEFAULT', mustChangePassword: true }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Should not redirect since on exempt path
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('updateUser does nothing when user is null', async () => {
    mockPathname.mockReturnValue('/login'); // On login page to avoid redirect

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Update'));

    // Username should still be 'none' since no user is logged in
    expect(screen.getByTestId('username')).toHaveTextContent('none');
  });

  it('refreshUser does nothing when no token in localStorage', async () => {
    mockPathname.mockReturnValue('/login'); // On login page to avoid redirect

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Ensure no token exists
    expect(localStorage.getItem('auth_token')).toBeNull();

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Refresh'));

    // User should still be null after refresh without token
    expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
    expect(screen.getByTestId('username')).toHaveTextContent('none');
  });
});

describe('useAuth', () => {
  it('throws error when used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});
