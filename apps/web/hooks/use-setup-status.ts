import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';

type SetupStatus = {
  setupNeeded: boolean;
  setupComplete: boolean;
};

export function useSetupStatus() {
  const { user, isLoading: authLoading } = useAuth();
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      // If auth is still loading or user is not admin, don't check setup
      if (authLoading) {
        return;
      }

      if (user?.role !== 'ADMIN') {
        setSetupNeeded(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/setup/status', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        if (response.ok) {
          const data: SetupStatus = await response.json();
          setSetupNeeded(data.setupNeeded ?? false);
        } else {
          setSetupNeeded(false);
        }
      } catch {
        setSetupNeeded(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkStatus();
  }, [user, authLoading]);

  return { setupNeeded, isLoading };
}
