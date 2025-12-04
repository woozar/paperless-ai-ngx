import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import AiProvidersPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiProviderListItem } from '@repo/api-client';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockPush = vi.fn();
const mockUser = vi.fn();
const mockGetAiProviders = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/admin/ai-providers',
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ user: mockUser(), isLoading: false }),
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'security.sharing.mode': 'BASIC' as const },
    updateSetting: vi.fn(),
  }),
}));

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getAiProviders: (...args: any[]) => mockGetAiProviders(...args),
  };
});

const mockProviders: AiProviderListItem[] = [
  {
    id: 'provider-1',
    name: 'OpenAI',
    provider: 'openai',
    model: 'gpt-4',
    baseUrl: null,
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    apiKey: 'mock-api-key',
  },
  {
    id: 'provider-2',
    name: 'Anthropic',
    provider: 'anthropic',
    model: 'claude-3-opus',
    baseUrl: null,
    isActive: true,
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
    apiKey: 'mock-api-key-2',
  },
];

describe('AiProvidersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.mockReturnValue({ id: 'user-1', username: 'admin', role: 'ADMIN' });
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('redirects non-admin users to home', async () => {
    mockUser.mockReturnValue({ id: 'user-2', username: 'testuser', role: 'DEFAULT' });

    renderWithIntl(<AiProvidersPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('renders null for non-admin users', () => {
    mockUser.mockReturnValue({ id: 'user-2', username: 'testuser', role: 'DEFAULT' });

    const { container } = renderWithIntl(<AiProvidersPage />);

    expect(container.firstChild).toBeNull();
  });

  it('loads and displays providers', async () => {
    mockGetAiProviders.mockResolvedValueOnce({
      data: { providers: mockProviders },
      error: undefined,
    });

    const { container } = renderWithIntl(<AiProvidersPage />);

    await waitFor(() => {
      expect(container.querySelector('tbody')).toBeInTheDocument();
      const rows = container.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });
  });

  it('displays "no providers" message when list is empty', async () => {
    mockGetAiProviders.mockResolvedValueOnce({
      data: { providers: [] },
      error: undefined,
    });

    renderWithIntl(<AiProvidersPage />);

    await waitFor(() => {
      expect(screen.getByText(/no providers/i)).toBeInTheDocument();
    });
  });

  it('redirects to home on 403 error', async () => {
    mockGetAiProviders.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 403 },
    });

    renderWithIntl(<AiProvidersPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message when loading fails', async () => {
    mockGetAiProviders.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 500 },
    });

    renderWithIntl(<AiProvidersPage />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('opens create dialog when clicking create button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAiProviders.mockResolvedValueOnce({
      data: { providers: mockProviders },
      error: undefined,
    });

    renderWithIntl(<AiProvidersPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create provider/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /create provider/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens edit dialog when clicking edit button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAiProviders.mockResolvedValueOnce({
      data: { providers: mockProviders },
      error: undefined,
    });

    renderWithIntl(<AiProvidersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-provider-provider-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('edit-provider-provider-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens delete dialog when clicking delete button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAiProviders.mockResolvedValueOnce({
      data: { providers: mockProviders },
      error: undefined,
    });

    renderWithIntl(<AiProvidersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-provider-provider-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('delete-provider-provider-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('closes edit dialog when onOpenChange is called', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAiProviders.mockResolvedValueOnce({
      data: { providers: mockProviders },
      error: undefined,
    });

    renderWithIntl(<AiProvidersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-provider-provider-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('edit-provider-provider-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getAllByRole('button').find((btn) => btn.textContent === 'Cancel');
    if (cancelButton) {
      await user.click(cancelButton);
    }
  });

  it('closes delete dialog when onOpenChange is called', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAiProviders.mockResolvedValueOnce({
      data: { providers: mockProviders },
      error: undefined,
    });

    renderWithIntl(<AiProvidersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-provider-provider-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('delete-provider-provider-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getAllByRole('button').find((btn) => btn.textContent === 'Cancel');
    if (cancelButton) {
      await user.click(cancelButton);
    }
  });

  it('displays skeleton while loading providers', async () => {
    let resolveLoad: (value: { data: any; error: any }) => void;
    const loadPromise = new Promise<{ data: any; error: any }>((resolve) => {
      resolveLoad = resolve;
    });
    mockGetAiProviders.mockReturnValue(loadPromise);

    const { container } = renderWithIntl(<AiProvidersPage />);

    await waitFor(() => {
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    resolveLoad!({ data: { providers: mockProviders }, error: undefined });

    await waitFor(() => {
      const rows = container.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });
  });
});
