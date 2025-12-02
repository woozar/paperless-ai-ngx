import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import LoginPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockPush = vi.fn();
const mockLogin = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders login form when page loads', () => {
    renderWithIntl(<LoginPage />);

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls API with username and password when submitted', async () => {
    const user = userEvent.setup({ delay: null });
    const mockResponse = {
      token: 'mock-token',
      user: { id: '1', username: 'testuser', role: 'DEFAULT', mustChangePassword: false },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderWithIntl(<LoginPage />);

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('mock-token', mockResponse.user);
    });
  });

  it('closes dialog and calls login after successful authentication', async () => {
    const user = userEvent.setup({ delay: null });
    const mockResponse = {
      token: 'mock-token',
      user: { id: '1', username: 'testuser', role: 'DEFAULT', mustChangePassword: false },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderWithIntl(<LoginPage />);

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message on invalid credentials', async () => {
    const user = userEvent.setup({ delay: null });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'error.invalidCredentials' }),
    });

    renderWithIntl(<LoginPage />);

    await user.type(screen.getByPlaceholderText(/username/i), 'wronguser');
    await user.type(screen.getByPlaceholderText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Invalid username or password');
    });
  });

  it('redirects to change-password when mustChangePassword is true', async () => {
    const user = userEvent.setup({ delay: null });
    const mockResponse = {
      token: 'mock-token',
      user: { id: '1', username: 'testuser', role: 'DEFAULT', mustChangePassword: true },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderWithIntl(<LoginPage />);

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/change-password');
    });
  });

  it('displays generic error on network failure', async () => {
    const user = userEvent.setup({ delay: null });

    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<LoginPage />);

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });
});
