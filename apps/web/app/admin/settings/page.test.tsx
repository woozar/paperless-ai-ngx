import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockPush = vi.fn();
const mockUser = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/admin/settings',
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ user: mockUser(), isLoading: false }),
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'security.sharing.mode': 'BASIC' as const },
    isLoading: false,
    updateSetting: vi.fn(),
  }),
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'system',
    setTheme: vi.fn(),
  }),
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.mockReturnValue({ id: 'user-1', username: 'admin', role: 'ADMIN' });
  });

  it('redirects non-admin users to home', async () => {
    mockUser.mockReturnValue({ id: 'user-2', username: 'testuser', role: 'DEFAULT' });

    renderWithIntl(<SettingsPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('renders settings page title for admin users', async () => {
    renderWithIntl(<SettingsPage />);

    // The title is rendered via translation key admin.settings.title
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Settings');
    });
  });

  it('renders appearance settings tab by default', async () => {
    renderWithIntl(<SettingsPage />);

    await waitFor(() => {
      // Appearance is the default tab, check for the theme mode selector
      expect(screen.getByTestId('setting-appearance.theme.mode')).toBeInTheDocument();
    });
  });

  it('renders security settings when Security tab is clicked', async () => {
    const user = userEvent.setup();
    renderWithIntl(<SettingsPage />);

    // Click on the Security tab
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /security/i })).toBeInTheDocument();
    });
    await user.click(screen.getByRole('tab', { name: /security/i }));

    // Now security settings should be visible
    await waitFor(() => {
      expect(screen.getByTestId('setting-security.sharing.mode')).toBeInTheDocument();
    });
  });

  it('does not redirect admin users', async () => {
    renderWithIntl(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('setting-appearance.theme.mode')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
