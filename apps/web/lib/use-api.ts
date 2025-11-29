import { useMemo } from 'react';
import { createClient, createConfig } from '@repo/api-client/client';
import type { ClientOptions } from '@repo/api-client';

/**
 * React hook that returns a configured API client with authorization headers.
 * The client is memoized and automatically includes the Bearer token from localStorage.
 */
export function useApi() {
  const client = useMemo(() => {
    const token = globalThis.window ? localStorage.getItem('auth_token') : null;

    return createClient(
      createConfig<ClientOptions>({
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
    );
  }, []);

  return client;
}
