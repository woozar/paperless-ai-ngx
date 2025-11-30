import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useApi } from './use-api';

describe('useApi', () => {
  let originalWindow: typeof globalThis.window;

  beforeEach(() => {
    originalWindow = globalThis.window;
    Object.defineProperty(globalThis, 'window', {
      value: {
        localStorage: {
          getItem: (key: string) => (key === 'auth_token' ? 'test-token' : null),
        },
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      writable: true,
      configurable: true,
    });
  });

  it('creates client with auth token when available', () => {
    const { result } = renderHook(() => useApi());
    const client = result.current;

    expect(client).toBeDefined();
    expect(client.getConfig().baseUrl).toBe('/api');
  });

  it('creates client without auth header when token is null', () => {
    Object.defineProperty(globalThis, 'window', {
      value: {
        localStorage: {
          getItem: () => null,
        },
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useApi());
    const client = result.current;

    expect(client).toBeDefined();
    const headers = client.getConfig().headers;
    expect(headers).toBeDefined();
    expect(headers).not.toHaveProperty('Authorization');
  });
});
