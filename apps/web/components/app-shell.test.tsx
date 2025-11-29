import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from './app-shell';
import { renderWithIntl } from '@/test-utils/render-with-intl';

vi.mock('@/components/sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

const mockIsLoading = vi.fn();
const mockUser = vi.fn();

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({
    user: mockUser(),
    isLoading: mockIsLoading(),
  }),
}));

describe('AppShell', () => {
  beforeEach(() => {
    mockIsLoading.mockReturnValue(false);
    mockUser.mockReturnValue({ id: '1', username: 'test', role: 'ADMIN' });
  });

  it('renders children content after auth loads', () => {
    renderWithIntl(
      <AppShell>
        <div data-testid="content">Page Content</div>
      </AppShell>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('renders sidebar', () => {
    renderWithIntl(
      <AppShell>
        <div>Content</div>
      </AppShell>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('wraps content in main element', () => {
    renderWithIntl(
      <AppShell>
        <div data-testid="content">Content</div>
      </AppShell>
    );

    const main = screen.getByRole('main');
    expect(main).toContainElement(screen.getByTestId('content'));
  });

  it('shows authenticating message while auth is initializing', () => {
    mockIsLoading.mockReturnValue(true);
    mockUser.mockReturnValue(null);

    renderWithIntl(
      <AppShell>
        <div data-testid="content">Page Content</div>
      </AppShell>
    );

    // Children sollten nicht sichtbar sein
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    expect(screen.queryByText('Page Content')).not.toBeInTheDocument();

    // "Verifying authentication" sollte sichtbar sein
    expect(screen.getByText('Verifying authentication')).toBeInTheDocument();

    // Sidebar sollte NICHT da sein während Loading
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('renders children after auth finishes loading', () => {
    mockIsLoading.mockReturnValue(false);
    mockUser.mockReturnValue({ id: '1', username: 'test', role: 'ADMIN' });

    renderWithIntl(
      <AppShell>
        <div data-testid="content">Page Content</div>
      </AppShell>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });
});
