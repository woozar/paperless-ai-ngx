import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsProvider, useSettings } from './settings-provider';
import * as authProviderModule from './auth-provider';

// Mock the auth provider hook
vi.mock('./auth-provider', () => ({
  useAuth: vi.fn(),
}));

// Test component to access the hook
function TestConsumer({ onUpdateError }: { onUpdateError?: (e: Error) => void }) {
  const { settings, isLoading, updateSetting, refreshSettings } = useSettings();

  const handleUpdate = async () => {
    try {
      await updateSetting('security.sharing.mode', 'ADVANCED');
    } catch (e) {
      onUpdateError?.(e as Error);
    }
  };

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="settings">{JSON.stringify(settings)}</div>
      <div data-testid="sharing-mode">{settings['security.sharing.mode']}</div>
      <button onClick={handleUpdate}>Update Setting</button>
      <button onClick={() => refreshSettings()}>Refresh</button>
    </div>
  );
}

describe('SettingsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches settings for admin users', async () => {
    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    localStorage.setItem('auth_token', 'test-token');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 'security.sharing.mode': 'BASIC' }),
    });

    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await waitFor(() => {
      expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');
    });
  });

  it('does not fetch settings for non-admin users but provides client defaults', async () => {
    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: {
        id: '2',
        username: 'user',
        role: 'DEFAULT',
        mustChangePassword: false,
        createdAt: '',
      },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Non-admins get client defaults
    expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('does not fetch settings when auth is still loading', async () => {
    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    // Should still be loading since auth is loading
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('handles settings fetch error gracefully by keeping client defaults', async () => {
    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    localStorage.setItem('auth_token', 'test-token');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false });

    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Client defaults are preserved on error
    expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');
  });

  it('handles network error during settings fetch by keeping client defaults', async () => {
    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    localStorage.setItem('auth_token', 'test-token');

    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Client defaults are preserved on network error
    expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');
  });

  it('updateSetting updates setting via API and updates state', async () => {
    const user = userEvent.setup({ delay: null });

    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    localStorage.setItem('auth_token', 'test-token');

    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 'security.sharing.mode': 'BASIC' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 'security.sharing.mode': 'ADVANCED' }),
      });

    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');
    });

    await user.click(screen.getByText('Update Setting'));

    await waitFor(() => {
      expect(screen.getByTestId('sharing-mode')).toHaveTextContent('ADVANCED');
    });

    // Verify the PUT request was made to the new route
    expect(global.fetch).toHaveBeenCalledWith('/api/settings/security.sharing.mode', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: 'ADVANCED' }),
    });
  });

  it('updateSetting throws error on network failure', async () => {
    const user = userEvent.setup({ delay: null });
    const onUpdateError = vi.fn();

    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    localStorage.setItem('auth_token', 'test-token');

    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 'security.sharing.mode': 'BASIC' }),
      })
      .mockRejectedValueOnce(new Error('Network error'));

    render(
      <SettingsProvider>
        <TestConsumer onUpdateError={onUpdateError} />
      </SettingsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');
    });

    await user.click(screen.getByText('Update Setting'));

    await waitFor(() => {
      expect(onUpdateError).toHaveBeenCalledWith(expect.any(Error));
    });

    // Setting should remain BASIC since update failed
    expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');
  });

  it('updateSetting throws error with message and params on API error response', async () => {
    const user = userEvent.setup({ delay: null });
    const onUpdateError = vi.fn();

    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    localStorage.setItem('auth_token', 'test-token');

    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 'security.sharing.mode': 'BASIC' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            message: 'error.settingsValidationError',
            params: { key: 'security.sharing.mode', value: 'INVALID', expectedType: 'boolean' },
          }),
      });

    render(
      <SettingsProvider>
        <TestConsumer onUpdateError={onUpdateError} />
      </SettingsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');
    });

    await user.click(screen.getByText('Update Setting'));

    await waitFor(() => {
      expect(onUpdateError).toHaveBeenCalled();
    });

    const error = onUpdateError.mock.calls[0]?.[0] as Error & { params?: Record<string, string> };
    expect(error.message).toBe('error.settingsValidationError');
    expect(error.params).toEqual({
      key: 'security.sharing.mode',
      value: 'INVALID',
      expectedType: 'boolean',
    });
  });

  it('updateSetting throws error without params when API error has no params', async () => {
    const user = userEvent.setup({ delay: null });
    const onUpdateError = vi.fn();

    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    localStorage.setItem('auth_token', 'test-token');

    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 'security.sharing.mode': 'BASIC' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'error.serverError' }), // no params
      });

    render(
      <SettingsProvider>
        <TestConsumer onUpdateError={onUpdateError} />
      </SettingsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');
    });

    await user.click(screen.getByText('Update Setting'));

    await waitFor(() => {
      expect(onUpdateError).toHaveBeenCalled();
    });

    const error = onUpdateError.mock.calls[0]?.[0] as Error & { params?: Record<string, string> };
    expect(error.message).toBe('error.serverError');
    expect(error.params).toBeUndefined();
  });

  it('updateSetting throws fallback error when API response has no message', async () => {
    const user = userEvent.setup({ delay: null });
    const onUpdateError = vi.fn();

    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    localStorage.setItem('auth_token', 'test-token');

    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 'security.sharing.mode': 'BASIC' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}), // Empty error response - no message field
      });

    render(
      <SettingsProvider>
        <TestConsumer onUpdateError={onUpdateError} />
      </SettingsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');
    });

    await user.click(screen.getByText('Update Setting'));

    await waitFor(() => {
      expect(onUpdateError).toHaveBeenCalled();
    });

    const error = onUpdateError.mock.calls[0]?.[0] as Error;
    expect(error.message).toBe('Failed to update setting');
  });

  it('updateSetting does nothing without token', async () => {
    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    // No token in localStorage

    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Client defaults are used since no token to fetch server settings
    expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Update Setting'));

    // No fetch calls should be made (no token)
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('refreshSettings re-fetches settings', async () => {
    const user = userEvent.setup({ delay: null });

    vi.mocked(authProviderModule.useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    localStorage.setItem('auth_token', 'test-token');

    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 'security.sharing.mode': 'BASIC' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 'security.sharing.mode': 'ADVANCED' }),
      });

    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sharing-mode')).toHaveTextContent('BASIC');
    });

    await user.click(screen.getByText('Refresh'));

    await waitFor(() => {
      expect(screen.getByTestId('sharing-mode')).toHaveTextContent('ADVANCED');
    });
  });
});

describe('useSettings', () => {
  it('throws error when used outside SettingsProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useSettings must be used within a SettingsProvider');

    consoleSpy.mockRestore();
  });
});
