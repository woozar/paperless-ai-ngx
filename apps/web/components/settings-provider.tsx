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
import type { Settings } from '@/lib/api/schemas/settings';
import { getSettingsDefaults } from '@/lib/api/schemas/settings';
import { useAuth } from './auth-provider';

function getClientDefaults(): Settings {
  return getSettingsDefaults();
}

interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { user, isLoading: authLoading } = useAuth();
  const [settings, setSettings] = useState<Settings>(getClientDefaults);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: Settings = await response.json();
        setSettings(data);
      }
    } catch {
      // Keep client defaults on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSetting = useCallback(
    async <K extends keyof Settings>(key: K, value: Settings[K]) => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`/api/settings/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message ?? 'Failed to update setting');
        (error as Error & { params?: Record<string, string> }).params = errorData.params;
        throw error;
      }

      const data: Settings = await response.json();
      setSettings(data);
    },
    []
  );

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  // Fetch settings when user is authenticated and is admin
  useEffect(() => {
    if (authLoading) return;

    if (user?.role === 'ADMIN') {
      fetchSettings();
    } else {
      // Non-admins keep client defaults
      setIsLoading(false);
    }
  }, [user, authLoading, fetchSettings]);

  const value = useMemo(
    () => ({
      settings,
      isLoading,
      updateSetting,
      refreshSettings,
    }),
    [settings, isLoading, updateSetting, refreshSettings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
