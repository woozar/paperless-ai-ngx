import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockUser = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/profile',
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ user: mockUser(), isLoading: false }),
}));

const mockSetTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'system',
    setTheme: mockSetTheme,
  }),
}));

const mockGetAuthWebauthnCredentials = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getAuthWebauthnCredentials: (...args: unknown[]) => mockGetAuthWebauthnCredentials(...args),
  };
});

vi.mock('@simplewebauthn/browser', () => ({
  browserSupportsWebAuthn: () => true,
  startRegistration: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSetTheme.mockClear();
    mockUser.mockReturnValue({ id: 'user-1', username: 'testuser', role: 'DEFAULT' });
    mockGetAuthWebauthnCredentials.mockResolvedValue({
      data: { credentials: [] },
      error: null,
    });
  });

  it('renders profile page title', async () => {
    renderWithIntl(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Profile');
    });
  });

  it('renders appearance tab by default', async () => {
    renderWithIntl(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /appearance/i })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });
  });

  it('renders security tab', async () => {
    renderWithIntl(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /security/i })).toBeInTheDocument();
    });
  });

  it('switches to security tab when clicked', async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /security/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('tab', { name: /security/i }));

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /security/i })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });
  });

  it('shows theme settings in appearance tab', async () => {
    renderWithIntl(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('profile-theme-select')).toBeInTheDocument();
    });
  });

  it('calls setTheme when theme is changed', async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('profile-theme-select')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('profile-theme-select'));

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /dark/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('option', { name: /dark/i }));

    await waitFor(() => {
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
  });

  it('shows passkeys section in security tab', async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /security/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('tab', { name: /security/i }));

    await waitFor(() => {
      // The passkey section should be visible after clicking security tab
      expect(screen.getByText(/passkeys/i, { selector: 'h3' })).toBeInTheDocument();
    });
  });

  it('shows password section in security tab', async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /security/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('tab', { name: /security/i }));

    await waitFor(() => {
      // The title is "Password" per translations - the section contains password change functionality
      expect(screen.getByText('Password', { selector: 'h3' })).toBeInTheDocument();
    });
  });
});
