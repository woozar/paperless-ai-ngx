'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { CurrentUser } from '@repo/api-client';

interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: CurrentUser) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<CurrentUser>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_EXEMPT_PATHS = ['/login'];
const CHANGE_PASSWORD_PATH = '/change-password';

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  const login = useCallback((token: string, userData: CurrentUser) => {
    setCookie('auth_token', token, 7);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Ignore errors during logout
    } finally {
      deleteCookie('auth_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const updateUser = useCallback((updates: Partial<CurrentUser>) => {
    setUser((prev: CurrentUser | null) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('auth_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData: CurrentUser = await response.json();
        localStorage.setItem('auth_user', JSON.stringify(userData));
        setUser(userData);
      } else {
        // Token invalid or expired
        deleteCookie('auth_token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser) as CurrentUser;
          setUser(parsedUser);
          // Verify token is still valid in background
          refreshUser();
        } catch {
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
          deleteCookie('auth_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  // Handle mustChangePassword redirect
  useEffect(() => {
    if (isLoading) return;

    const isExemptPath = AUTH_EXEMPT_PATHS.includes(pathname);
    const isChangePasswordPath = pathname === CHANGE_PASSWORD_PATH;

    // If user must change password and is not on change-password page, redirect
    if (user?.mustChangePassword && !isChangePasswordPath && !isExemptPath) {
      router.push(CHANGE_PASSWORD_PATH);
    }
  }, [user, isLoading, pathname, router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      updateUser,
      refreshUser,
    }),
    [user, isLoading, isAuthenticated, login, logout, updateUser, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
