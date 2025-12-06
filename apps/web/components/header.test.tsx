import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './header';
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

// Mock UI components that use ResizeObserver or other browser APIs if needed
// For now, Sheet components should render fine in jsdom if properly mocked or if radix/ui handles it.

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.mockReturnValue({ id: '1', username: 'testuser', role: 'DEFAULT' });
    mockPathname.mockReturnValue('/');
  });

  it('renders app name', () => {
    renderWithIntl(<Header />);
    expect(screen.getAllByText('Paperless AI ngx')[0]).toBeInTheDocument();
  });

  it('renders dashboard link', () => {
    renderWithIntl(<Header />);
    // There might be multiple dashboard links (desktop + mobile sheet), but usually only one visible or available in DOM
    // If mobile menu is hidden, we might still find it in the DOM depending on Sheet implementation.
    // Let's just check if at least one exists.
    const links = screen.getAllByRole('link', { name: /dashboard/i });
    expect(links[0]).toHaveAttribute('href', '/');
  });

  it('shows Users link for admin users', () => {
    mockUser.mockReturnValue({ id: '1', username: 'admin', role: 'ADMIN' });

    renderWithIntl(<Header />);

    const links = screen.getAllByRole('link', { name: /users/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('href', '/admin/users');
  });

  it('hides Users link for non-admin users', () => {
    mockUser.mockReturnValue({ id: '1', username: 'user', role: 'DEFAULT' });

    renderWithIntl(<Header />);

    expect(screen.queryByRole('link', { name: /users/i })).not.toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    mockPathname.mockReturnValue('/');

    renderWithIntl(<Header />);

    // Desktop links use text-primary for active state
    const dashboardLinks = screen.getAllByRole('link', { name: /dashboard/i });
    expect(dashboardLinks[0]).toHaveClass('text-primary');
  });

  it('displays username', () => {
    mockUser.mockReturnValue({ id: '1', username: 'johndoe', role: 'DEFAULT' });

    renderWithIntl(<Header />);

    // Username appears in desktop and mobile menu
    expect(screen.getAllByText('johndoe')[0]).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(<Header />);

    // There are two logout buttons (desktop and mobile).
    // We'll click the first available visible one (likely desktop).
    const logoutButtons = screen.getAllByTitle('Logout');
    await user.click(logoutButtons[0]);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('renders GitHub link', () => {
    renderWithIntl(<Header />);

    // Icon link, might not have text "GitHub" visible, but we can look by href
    const links = screen.getAllByRole('link');
    const githubLink = links.find(
      (link) => link.getAttribute('href') === 'https://github.com/woozar/paperless-ai-ngx'
    );
    expect(githubLink).toBeInTheDocument();
  });

  it('closes mobile menu when a link is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    mockUser.mockReturnValue({ id: '1', username: 'admin', role: 'ADMIN' });

    renderWithIntl(<Header />);

    // Open the mobile sheet menu
    const menuButton = screen.getByRole('button', { name: '' }); // Menu icon button
    await user.click(menuButton);

    // Wait for the sheet to be visible and find the mobile dashboard link
    // The sheet content has nav links that call setIsOpen(false) on click
    const sheetLinks = await screen.findAllByRole('link', { name: /dashboard/i });
    // Click the link in the mobile sheet (there should be 2 - desktop and mobile)
    const mobileLink = sheetLinks[sheetLinks.length - 1];
    await user.click(mobileLink);

    // After clicking, the sheet closes and the mobile link is removed from DOM
    // Verify that clicking worked by checking the sheet closed
    await waitFor(() => {
      // There should now only be the desktop link visible
      const linksAfterClick = screen.getAllByRole('link', { name: /dashboard/i });
      expect(linksAfterClick.length).toBe(1);
    });
  });
});
