import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import Home from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockUser = vi.fn();
const mockPathname = vi.fn(() => '/');
const mockSetupStatus = vi.fn();
const mockPush = vi.fn();

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({
    user: mockUser(),
    logout: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-setup-status', () => ({
  useSetupStatus: () => mockSetupStatus(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.mockReturnValue({ id: '1', username: 'testuser', role: 'DEFAULT' });
    mockSetupStatus.mockReturnValue({ setupNeeded: false, isLoading: false });
    mockPush.mockClear();
  });

  it('renders welcome title', () => {
    renderWithIntl(<Home />);

    expect(screen.getByText(/welcome to paperless ai ngx/i)).toBeInTheDocument();
  });

  it('renders page description', () => {
    renderWithIntl(<Home />);

    expect(screen.getByText(/ai-powered document processing/i)).toBeInTheDocument();
  });

  it('renders auto processing card', () => {
    renderWithIntl(<Home />);

    expect(screen.getByText('Auto Processing')).toBeInTheDocument();
  });

  it('renders document queue card', () => {
    renderWithIntl(<Home />);

    expect(screen.getByText('Document Queue')).toBeInTheDocument();
  });

  it('renders configuration card', () => {
    renderWithIntl(<Home />);

    expect(screen.getByText('Configuration')).toBeInTheDocument();
  });

  it('redirects to setup when setup is needed', async () => {
    mockSetupStatus.mockReturnValue({ setupNeeded: true, isLoading: false });

    renderWithIntl(<Home />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/setup');
    });
  });

  it('shows configured message when setup is complete', () => {
    mockSetupStatus.mockReturnValue({ setupNeeded: false, isLoading: false });

    renderWithIntl(<Home />);

    expect(screen.getByText(/your paperless ai instance is ready/i)).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows loading skeleton while checking setup status', () => {
    mockSetupStatus.mockReturnValue({ setupNeeded: false, isLoading: true });

    renderWithIntl(<Home />);

    expect(screen.getByText(/checking/i)).toBeInTheDocument();
  });

  it('does not redirect while loading', () => {
    mockSetupStatus.mockReturnValue({ setupNeeded: true, isLoading: true });

    renderWithIntl(<Home />);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('renders within AppShell', () => {
    renderWithIntl(<Home />);

    // AppShell renders main element
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
