import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSetupStatus } from './use-setup-status';
import { useAuth } from '@/components/auth-provider';
import type { ReactNode } from 'react';

vi.mock('@/components/auth-provider', () => ({
  useAuth: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('useSetupStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
      },
      writable: true,
    });
  });

  it('returns setupNeeded=false and isLoading=true while auth is loading', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    const { result } = renderHook(() => useSetupStatus());

    expect(result.current.setupNeeded).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it('returns setupNeeded=false for non-admin users', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        username: 'testuser',
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

    const { result } = renderHook(() => useSetupStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.setupNeeded).toBe(false);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it('returns setupNeeded=false for non-authenticated users', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    const { result } = renderHook(() => useSetupStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.setupNeeded).toBe(false);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it('returns setupNeeded=true when admin has no instances', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ setupNeeded: true, setupComplete: false }),
    } as Response);

    const { result } = renderHook(() => useSetupStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.setupNeeded).toBe(true);
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      '/api/setup/status',
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer mock-token',
        },
      })
    );
  });

  it('returns setupNeeded=false when admin has instances', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ setupNeeded: false, setupComplete: true }),
    } as Response);

    const { result } = renderHook(() => useSetupStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.setupNeeded).toBe(false);
  });

  it('returns setupNeeded=false when API request fails', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() => useSetupStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.setupNeeded).toBe(false);
  });

  it('returns setupNeeded=false when fetch throws error', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN', mustChangePassword: false, createdAt: '' },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSetupStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.setupNeeded).toBe(false);
  });
});
