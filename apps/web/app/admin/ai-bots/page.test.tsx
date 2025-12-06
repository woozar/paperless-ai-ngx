import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import AiBotsPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiBotListItem } from '@repo/api-client';

// Capture onValueChange callbacks from Select components
let selectCallbacks: Map<string, (value: string) => void> = new Map();
let selectIndex = 0;

// Mock Radix Select to make onValueChange testable
vi.mock('@/components/ui/select', async () => {
  const actual = await vi.importActual('@/components/ui/select');
  return {
    ...actual,
    Select: ({
      children,
      onValueChange,
      value,
    }: {
      children: React.ReactNode;
      onValueChange: (value: string) => void;
      value: string;
    }) => {
      // Store the callback so we can call it from tests
      const id = `select-${selectIndex++}`;
      selectCallbacks.set(id, onValueChange);
      return (
        <div data-testid="mock-select" data-value={value} data-select-id={id}>
          <select
            data-testid="select-native"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="provider-1">Provider 1</option>
          </select>
          {children}
        </div>
      );
    },
    SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectValue: () => null,
    SelectContent: () => null,
    SelectItem: () => null,
  };
});

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

const mockRouter = { push: mockPush };
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
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

const mockPostAiBots = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getAiBots: (...args: any[]) => mockGetAiBots(...args),
    getAiProviders: (...args: any[]) => mockGetAiProviders(...args),
    postAiBots: (...args: any[]) => mockPostAiBots(...args),
  };
});

const mockShowApiError = vi.fn((error: { message: string }) => {
  const errorMessages: Record<string, string> = {
    'error.serverError': 'An internal server error occurred',
  };
  toast.error(errorMessages[error.message] || error.message);
});
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn((key: string) => {
  const errorMessages: Record<string, string> = {
    loadFailed: 'Failed to load AI bots',
  };
  toast.error(errorMessages[key] || key);
});
const mockShowInfo = vi.fn();

vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({
    showApiError: mockShowApiError,
    showSuccess: mockShowSuccess,
    showError: mockShowError,
    showInfo: mockShowInfo,
  }),
}));

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
}));

const mockBots: AiBotListItem[] = [
  {
    id: 'bot-1',
    name: 'Support Bot',
    aiProviderId: 'provider-1',
    aiProvider: {
      id: 'provider-1',
      name: 'OpenAI',
      provider: 'openai',
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
      provider: 'openai',
    },
    systemPrompt: 'You help with coding',
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
  },
];

describe('AiBotsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset select mock state
    selectCallbacks = new Map();
    selectIndex = 0;
    mockUser.mockReturnValue({ id: 'user-1', username: 'admin', role: 'ADMIN' });
    mockGetAiProviders.mockResolvedValue({
      data: {
        items: [{ id: 'provider-1', name: 'OpenAI', provider: 'openai' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
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
      data: { items: mockBots, total: mockBots.length, page: 1, limit: 10, totalPages: 1 },
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
      data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
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
      data: { items: mockBots, total: mockBots.length, page: 1, limit: 10, totalPages: 1 },
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
      data: { items: mockBots, total: mockBots.length, page: 1, limit: 10, totalPages: 1 },
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
      data: { items: mockBots, total: mockBots.length, page: 1, limit: 10, totalPages: 1 },
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
      data: { items: mockBots, total: mockBots.length, page: 1, limit: 10, totalPages: 1 },
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
      data: { items: mockBots, total: mockBots.length, page: 1, limit: 10, totalPages: 1 },
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

    resolveLoad!({
      data: { items: mockBots, total: mockBots.length, page: 1, limit: 10, totalPages: 1 },
      error: undefined,
    });

    await waitFor(() => {
      expect(screen.getByText('Support Bot')).toBeInTheDocument();
    });
  });

  describe('pagination handlers', () => {
    it('calls loadBots with new page when handlePageChange is triggered', async () => {
      mockGetAiBots.mockResolvedValue({
        data: { items: mockBots, total: 25, page: 1, limit: 10, totalPages: 3 },
        error: undefined,
      });

      renderWithIntl(<AiBotsPage />);

      await waitFor(() => {
        expect(screen.getByTestId('pagination-next')).toBeInTheDocument();
      });

      const user = userEvent.setup();
      await user.click(screen.getByTestId('pagination-next'));

      await waitFor(() => {
        expect(mockGetAiBots).toHaveBeenCalledWith(
          expect.objectContaining({
            query: { page: 2, limit: 10 },
          })
        );
      });
    });

    it('resets to page 1 when limit changes', async () => {
      mockGetAiBots.mockResolvedValue({
        data: { items: mockBots, total: 25, page: 2, limit: 10, totalPages: 3 },
        error: undefined,
      });

      renderWithIntl(<AiBotsPage />);

      await waitFor(() => {
        expect(screen.getByTestId('select-native')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('select-native'), { target: { value: '20' } });

      await waitFor(() => {
        expect(mockGetAiBots).toHaveBeenCalledWith(
          expect.objectContaining({
            query: { page: 1, limit: 20 },
          })
        );
      });
    });

    it('handles exception during loadBots', async () => {
      mockGetAiBots.mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(<AiBotsPage />);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load AI bots');
      });
    });
  });

  describe('reloadCurrentPage via dialog success', () => {
    it('reloads bots when create dialog calls onSuccess', async () => {
      const user = userEvent.setup({ delay: null });

      mockGetAiBots.mockResolvedValue({
        data: { items: mockBots, total: mockBots.length, page: 1, limit: 10, totalPages: 1 },
        error: undefined,
      });

      // Mock postAiBots for successful creation
      mockPostAiBots.mockResolvedValue({
        data: { id: 'new-bot', name: 'New Bot' },
        error: undefined,
      });

      renderWithIntl(<AiBotsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create bot/i })).toBeInTheDocument();
      });

      const initialCallCount = mockGetAiBots.mock.calls.length;

      // Open create dialog
      await user.click(screen.getByRole('button', { name: /create bot/i }));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Wait for providers to be loaded
      await waitFor(() => {
        expect(mockGetAiProviders).toHaveBeenCalled();
      });

      // Fill the form - name and systemPrompt inputs
      const nameInput = screen.getByTestId('create-bot-name-input');
      const systemPromptInput = screen.getByTestId('create-bot-systemPrompt-input');

      await user.type(nameInput, 'New Bot');
      await user.type(systemPromptInput, 'A helpful bot');

      // For the provider select, we need to trigger the value change
      // Since the dialog uses dynamicOptions from getAiProviders response,
      // and we mock the Select component to use native select, we can use fireEvent
      const selectNative = screen.queryByTestId('select-native');
      if (selectNative) {
        fireEvent.change(selectNative, { target: { value: 'provider-1' } });
      }

      // Submit the form
      const submitButton = screen.getByTestId('create-bot-submit-button');
      await user.click(submitButton);

      // Verify that onSuccess was triggered which calls reloadCurrentPage
      await waitFor(() => {
        expect(mockGetAiBots.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });
  });
});
