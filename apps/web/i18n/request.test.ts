import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cookies, headers } from 'next/headers';

// Mock Next.js headers and cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
  headers: vi.fn(),
}));

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getRequestConfig: vi.fn((fn) => fn),
}));

// Helper functions to create properly typed mocks
function createMockCookies(cookieValue?: string) {
  return {
    get: vi.fn((name: string) => {
      if (name === 'locale' && cookieValue) {
        return { value: cookieValue };
      }
      return undefined;
    }),
  };
}

function createMockHeaders(acceptLanguage?: string) {
  return {
    get: vi.fn((name: string) => {
      if (name === 'accept-language' && acceptLanguage) {
        return acceptLanguage;
      }
      return null;
    }),
  };
}

describe('i18n/request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses locale from cookie when available', async () => {
    vi.mocked(cookies).mockResolvedValue(createMockCookies('de') as never);
    vi.mocked(headers).mockResolvedValue(createMockHeaders() as never);

    // Import the module after mocking
    const getRequestConfig = (await import('./request')).default;
    const config = await getRequestConfig({ requestLocale: Promise.resolve(undefined) });

    expect(config.locale).toBe('de');
    expect(config.messages).toBeDefined();
  });

  it('uses locale from Accept-Language header when cookie is not available', async () => {
    vi.mocked(cookies).mockResolvedValue(createMockCookies() as never);
    vi.mocked(headers).mockResolvedValue(
      createMockHeaders('de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7') as never
    );

    const getRequestConfig = (await import('./request')).default;
    const config = await getRequestConfig({ requestLocale: Promise.resolve(undefined) });

    expect(config.locale).toBe('de');
    expect(config.messages).toBeDefined();
  });

  it('uses default locale when neither cookie nor header is available', async () => {
    vi.mocked(cookies).mockResolvedValue(createMockCookies() as never);
    vi.mocked(headers).mockResolvedValue(createMockHeaders() as never);

    const getRequestConfig = (await import('./request')).default;
    const config = await getRequestConfig({ requestLocale: Promise.resolve(undefined) });

    expect(config.locale).toBe('en');
    expect(config.messages).toBeDefined();
  });

  it('uses default locale when cookie contains invalid locale', async () => {
    vi.mocked(cookies).mockResolvedValue(createMockCookies('fr') as never);
    vi.mocked(headers).mockResolvedValue(createMockHeaders() as never);

    const getRequestConfig = (await import('./request')).default;
    const config = await getRequestConfig({ requestLocale: Promise.resolve(undefined) });

    expect(config.locale).toBe('en');
  });

  it('uses default locale when Accept-Language header contains invalid locale', async () => {
    vi.mocked(cookies).mockResolvedValue(createMockCookies() as never);
    vi.mocked(headers).mockResolvedValue(createMockHeaders('fr-FR,fr;q=0.9') as never);

    const getRequestConfig = (await import('./request')).default;
    const config = await getRequestConfig({ requestLocale: Promise.resolve(undefined) });

    expect(config.locale).toBe('en');
  });

  it('prefers cookie locale over Accept-Language header', async () => {
    vi.mocked(cookies).mockResolvedValue(createMockCookies('en') as never);
    vi.mocked(headers).mockResolvedValue(createMockHeaders('de-DE,de;q=0.9') as never);

    const getRequestConfig = (await import('./request')).default;
    const config = await getRequestConfig({ requestLocale: Promise.resolve(undefined) });

    expect(config.locale).toBe('en');
  });

  it('falls back to browser locale when cookie has invalid locale', async () => {
    vi.mocked(cookies).mockResolvedValue(createMockCookies('fr') as never);
    vi.mocked(headers).mockResolvedValue(createMockHeaders('de-DE,de;q=0.9') as never);

    const getRequestConfig = (await import('./request')).default;
    const config = await getRequestConfig({ requestLocale: Promise.resolve(undefined) });

    expect(config.locale).toBe('de');
  });

  it('loads correct messages for selected locale', async () => {
    vi.mocked(cookies).mockResolvedValue(createMockCookies('de') as never);
    vi.mocked(headers).mockResolvedValue(createMockHeaders() as never);

    const getRequestConfig = (await import('./request')).default;
    const config = await getRequestConfig({ requestLocale: Promise.resolve(undefined) });

    expect(config.locale).toBe('de');
    expect(config.messages).toBeDefined();
    if (config.messages) {
      expect(config.messages.common).toBeDefined();

      expect((config.messages as any).common.appName).toBe('Paperless AI ngx');
    }
  });

  it('handles Accept-Language header with multiple locales', async () => {
    vi.mocked(cookies).mockResolvedValue(createMockCookies() as never);
    vi.mocked(headers).mockResolvedValue(
      createMockHeaders('en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7') as never
    );

    const getRequestConfig = (await import('./request')).default;
    const config = await getRequestConfig({ requestLocale: Promise.resolve(undefined) });

    expect(config.locale).toBe('en');
  });

  it('extracts locale from Accept-Language header with region code', async () => {
    vi.mocked(cookies).mockResolvedValue(createMockCookies() as never);
    vi.mocked(headers).mockResolvedValue(createMockHeaders('de-AT') as never);

    const getRequestConfig = (await import('./request')).default;
    const config = await getRequestConfig({ requestLocale: Promise.resolve(undefined) });

    expect(config.locale).toBe('de');
  });
});
