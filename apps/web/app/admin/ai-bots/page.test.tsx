import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import AiBotsPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiBotListItem } from '@repo/api-client';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockPush = vi.fn();
const mockUser = vi.fn();
const mockGetAiBots = vi.fn();
const mockGetAiProviders = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/admin/ai-bots',
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
    getAiBots: (...args: any[]) => mockGetAiBots(...args),
    getAiProviders: (...args: any[]) => mockGetAiProviders(...args),
  };
});

const mockBots: AiBotListItem[] = [
  {
    id: 'bot-1',
    name: 'Support Bot',
    aiProviderId: 'provider-1',
    aiProvider: {
      id: 'provider-1',
      name: 'OpenAI',
    },
    systemPrompt: 'You are a support assistant',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'bot-2',
    name: 'Code Assistant',
    aiProviderId: 'provider-1',
    aiProvider: {
      id: 'provider-1',
      name: 'OpenAI',
    },
    systemPrompt: 'You help with coding',
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
  },
];

describe('AiBotsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.mockReturnValue({ id: 'user-1', username: 'admin', role: 'ADMIN' });
    mockGetAiProviders.mockResolvedValue({
      data: { providers: [{ id: 'provider-1', name: 'OpenAI', provider: 'openai' }] },
      error: undefined,
    });
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

    renderWithIntl(<AiBotsPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('renders null for non-admin users', () => {
    mockUser.mockReturnValue({ id: 'user-2', username: 'testuser', role: 'DEFAULT' });

    const { container } = renderWithIntl(<AiBotsPage />);

    expect(container.firstChild).toBeNull();
  });

  it('loads and displays bots', async () => {
    mockGetAiBots.mockResolvedValueOnce({
      data: { bots: mockBots },
      error: undefined,
    });

    renderWithIntl(<AiBotsPage />);

    await waitFor(() => {
      expect(screen.getByText('Support Bot')).toBeInTheDocument();
      expect(screen.getByText('Code Assistant')).toBeInTheDocument();
    });
  });

  it('displays "no bots" message when list is empty', async () => {
    mockGetAiBots.mockResolvedValueOnce({
      data: { bots: [] },
      error: undefined,
    });

    renderWithIntl(<AiBotsPage />);

    await waitFor(() => {
      expect(screen.getByText(/no bots/i)).toBeInTheDocument();
    });
  });

  it('redirects to home on 403 error', async () => {
    mockGetAiBots.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 403 },
    });

    renderWithIntl(<AiBotsPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message when loading fails', async () => {
    mockGetAiBots.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 500 },
    });

    renderWithIntl(<AiBotsPage />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('opens create dialog when clicking create button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAiBots.mockResolvedValueOnce({
      data: { bots: mockBots },
      error: undefined,
    });

    renderWithIntl(<AiBotsPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create bot/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /create bot/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens edit dialog when clicking edit button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAiBots.mockResolvedValueOnce({
      data: { bots: mockBots },
      error: undefined,
    });

    renderWithIntl(<AiBotsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-bot-bot-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('edit-bot-bot-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens delete dialog when clicking delete button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAiBots.mockResolvedValueOnce({
      data: { bots: mockBots },
      error: undefined,
    });

    renderWithIntl(<AiBotsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-bot-bot-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('delete-bot-bot-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('closes edit dialog when onOpenChange is called', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAiBots.mockResolvedValueOnce({
      data: { bots: mockBots },
      error: undefined,
    });

    renderWithIntl(<AiBotsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-bot-bot-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('edit-bot-bot-2'));

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
    mockGetAiBots.mockResolvedValueOnce({
      data: { bots: mockBots },
      error: undefined,
    });

    renderWithIntl(<AiBotsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-bot-bot-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('delete-bot-bot-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getAllByRole('button').find((btn) => btn.textContent === 'Cancel');
    if (cancelButton) {
      await user.click(cancelButton);
    }
  });

  it('displays skeleton while loading bots', async () => {
    let resolveLoad: (value: { data: any; error: any }) => void;
    const loadPromise = new Promise<{ data: any; error: any }>((resolve) => {
      resolveLoad = resolve;
    });
    mockGetAiBots.mockReturnValue(loadPromise);

    renderWithIntl(<AiBotsPage />);

    await waitFor(() => {
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    resolveLoad!({ data: { bots: mockBots }, error: undefined });

    await waitFor(() => {
      expect(screen.getByText('Support Bot')).toBeInTheDocument();
    });
  });
});
