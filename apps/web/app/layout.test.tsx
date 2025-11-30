import { describe, it, expect, vi } from 'vitest';
import { metadata } from './layout';

// Mock Next.js font
vi.mock('next/font/local', () => ({
  default: () => ({
    variable: '--font-test',
  }),
}));

// Mock next-intl
vi.mock('next-intl/server', () => ({
  getLocale: vi.fn().mockResolvedValue('en'),
  getMessages: vi.fn().mockResolvedValue({}),
}));

// Mock providers
vi.mock('@/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/toast-provider', () => ({
  ToastProvider: () => <div>ToastProvider</div>,
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('./globals.css', () => ({}));

describe('RootLayout', () => {
  it('can be imported without errors', async () => {
    const { default: RootLayout } = await import('./layout');
    expect(RootLayout).toBeDefined();
    expect(typeof RootLayout).toBe('function');
  });

  it('is an async function', async () => {
    const { default: RootLayout } = await import('./layout');
    const result = RootLayout({ children: <div>Test</div> });
    expect(result).toBeInstanceOf(Promise);
  });

  it('renders without errors', async () => {
    const { default: RootLayout } = await import('./layout');
    const element = await RootLayout({ children: <div>Test</div> });
    expect(element).toBeDefined();
    expect(element.type).toBe('html');
  });
});

describe('metadata', () => {
  it('exports correct metadata', () => {
    expect(metadata.title).toBe('Paperless AI ngx');
    expect(metadata.description).toBe('AI-powered document processing for Paperless-ngx');
  });
});
