import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import Home from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockUser = vi.fn();
const mockPathname = vi.fn(() => '/');

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({
    user: mockUser(),
    logout: vi.fn(),
  }),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
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

  it('renders complete setup button', () => {
    renderWithIntl(<Home />);

    expect(screen.getByRole('link', { name: /complete setup/i })).toHaveAttribute('href', '/setup');
  });

  it('renders within AppShell', () => {
    renderWithIntl(<Home />);

    // AppShell renders main element
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
