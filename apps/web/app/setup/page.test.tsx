import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import SetupPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockPush = vi.fn();
const mockUser = vi.fn();
const mockSetupStatus = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => mockUser(),
}));

vi.mock('@/hooks/use-setup-status', () => ({
  useSetupStatus: () => mockSetupStatus(),
}));

vi.mock('./_components/setup-wizard', () => ({
  SetupWizard: () => <div data-testid="setup-wizard">Setup Wizard Component</div>,
}));

describe('SetupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner while auth is loading', () => {
    mockUser.mockReturnValue({ user: null, isLoading: true });
    mockSetupStatus.mockReturnValue({ setupNeeded: false, isLoading: false });

    renderWithIntl(<SetupPage />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows loading spinner while setup status is loading', () => {
    mockUser.mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN' },
      isLoading: false,
    });
    mockSetupStatus.mockReturnValue({ setupNeeded: true, isLoading: true });

    renderWithIntl(<SetupPage />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('redirects non-admin users to home', async () => {
    mockUser.mockReturnValue({
      user: { id: '1', username: 'user', role: 'DEFAULT' },
      isLoading: false,
    });
    mockSetupStatus.mockReturnValue({ setupNeeded: true, isLoading: false });

    renderWithIntl(<SetupPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('redirects to home when user is not logged in', async () => {
    mockUser.mockReturnValue({ user: null, isLoading: false });
    mockSetupStatus.mockReturnValue({ setupNeeded: true, isLoading: false });

    renderWithIntl(<SetupPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('redirects to home when setup is already complete', async () => {
    mockUser.mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN' },
      isLoading: false,
    });
    mockSetupStatus.mockReturnValue({ setupNeeded: false, isLoading: false });

    renderWithIntl(<SetupPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('renders SetupWizard when admin and setup is needed', async () => {
    mockUser.mockReturnValue({
      user: { id: '1', username: 'admin', role: 'ADMIN' },
      isLoading: false,
    });
    mockSetupStatus.mockReturnValue({ setupNeeded: true, isLoading: false });

    renderWithIntl(<SetupPage />);

    await waitFor(() => {
      expect(screen.getByTestId('setup-wizard')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
