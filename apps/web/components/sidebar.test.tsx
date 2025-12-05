import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './sidebar';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockLogout = vi.fn();
const mockUser = vi.fn();
const mockPathname = vi.fn(() => '/');

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({
    user: mockUser(),
    logout: mockLogout,
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

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.mockReturnValue({ id: '1', username: 'testuser', role: 'DEFAULT' });
    mockPathname.mockReturnValue('/');
  });

  it('renders app name', () => {
    renderWithIntl(<Sidebar />);
    expect(screen.getByText('Paperless AI ngx')).toBeInTheDocument();
  });

  it('renders dashboard link', () => {
    renderWithIntl(<Sidebar />);
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/');
  });

  it('shows Users link for admin users', () => {
    mockUser.mockReturnValue({ id: '1', username: 'admin', role: 'ADMIN' });

    renderWithIntl(<Sidebar />);

    expect(screen.getByRole('link', { name: /users/i })).toHaveAttribute('href', '/admin/users');
  });

  it('hides Users link for non-admin users', () => {
    mockUser.mockReturnValue({ id: '1', username: 'user', role: 'DEFAULT' });

    renderWithIntl(<Sidebar />);

    expect(screen.queryByRole('link', { name: /users/i })).not.toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    mockPathname.mockReturnValue('/');

    renderWithIntl(<Sidebar />);

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveClass('from-sidebar-accent');
  });

  it('displays username', () => {
    mockUser.mockReturnValue({ id: '1', username: 'johndoe', role: 'DEFAULT' });

    renderWithIntl(<Sidebar />);

    expect(screen.getByText('johndoe')).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<Sidebar />);

    const logoutButton = screen.getByTitle('Logout');
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('renders version number', () => {
    renderWithIntl(<Sidebar />);

    expect(screen.getByText(/^v\d/)).toBeInTheDocument();
  });

  it('renders GitHub link', () => {
    renderWithIntl(<Sidebar />);

    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/woozar/paperless-ai-ngx'
    );
  });
});
