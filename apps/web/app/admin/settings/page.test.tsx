import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
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

  it('renders AutoSettingsPage component', async () => {
    renderWithIntl(<SettingsPage />);

    await waitFor(() => {
      // AutoSettingsPage renders settings controls
      expect(screen.getByTestId('setting-security.sharing.mode')).toBeInTheDocument();
    });
  });

  it('does not redirect admin users', async () => {
    renderWithIntl(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('setting-security.sharing.mode')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
