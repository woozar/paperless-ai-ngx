import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { AiBotsContent } from './ai-bots-content';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiBotListItem } from '@repo/api-client';

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
    }) => (
      <div data-testid="mock-select" data-value={value}>
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
        </select>
        {children}
      </div>
    ),
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

const mockGetAiBots = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getAiBots: (...args: any[]) => mockGetAiBots(...args),
  };
});

const mockShowError = vi.fn((key: string) => {
  const errorMessages: Record<string, string> = {
    loadFailed: 'Failed to load AI bots',
  };
  toast.error(errorMessages[key] || key);
});

vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({
    showError: mockShowError,
    showApiError: vi.fn(),
    showSuccess: vi.fn(),
    showInfo: vi.fn(),
  }),
}));

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
}));

vi.mock('@/hooks/use-format-date', () => ({
  useFormatDate: () => (dateString: string) => new Date(dateString).toLocaleDateString(),
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ isLoading: false }),
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'security.sharing.mode': 'BASIC' as const },
    updateSetting: vi.fn(),
  }),
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock the components imported from ai-bots
vi.mock('../../ai-bots/_components', () => ({
  BotTableSkeleton: () => (
    <tr>
      <td colSpan={4}>
        <div data-slot="skeleton">Loading...</div>
      </td>
    </tr>
  ),
  BotTableRow: ({ bot }: { bot: any }) => (
    <tr data-testid={`bot-row-${bot.id}`}>
      <td>{bot.name}</td>
      <td>{bot.aiModel?.name}</td>
      <td>{new Date(bot.createdAt).toLocaleDateString()}</td>
      <td>Actions</td>
    </tr>
  ),
  CreateBotDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Create Dialog</div> : null,
  EditBotDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Edit Dialog</div> : null,
  DeleteBotDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Delete Dialog</div> : null,
}));

// Mock ShareDialog
vi.mock('@/components/sharing/share-dialog', () => ({
  ShareDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Share Dialog</div> : null,
}));

const mockBots: AiBotListItem[] = [
  {
    id: 'bot-1',
    name: 'Support Bot',
    aiModelId: 'model-1',
    aiModel: {
      id: 'model-1',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
      aiAccount: {
        id: 'account-1',
        name: 'OpenAI',
        provider: 'openai',
      },
    },
    systemPrompt: 'You are a support assistant',
    responseLanguage: 'DOCUMENT',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'bot-2',
    name: 'Code Assistant',
    aiModelId: 'model-1',
    aiModel: {
      id: 'model-1',
      name: 'GPT-4',
      modelIdentifier: 'gpt-4',
      aiAccount: {
        id: 'account-1',
        name: 'OpenAI',
        provider: 'openai',
      },
    },
    systemPrompt: 'You help with coding',
    responseLanguage: 'ENGLISH',
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
  },
];

describe('AiBotsContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('loads and displays bots', async () => {
    mockGetAiBots.mockResolvedValueOnce({
      data: { items: mockBots, total: mockBots.length, page: 1, limit: 10, totalPages: 1 },
      error: undefined,
    });

    renderWithIntl(<AiBotsContent />);

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

    renderWithIntl(<AiBotsContent />);

    await waitFor(() => {
      expect(screen.getByText(/no bots/i)).toBeInTheDocument();
    });
  });

  it('displays error when loading fails', async () => {
    mockGetAiBots.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 500 },
    });

    renderWithIntl(<AiBotsContent />);

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

    renderWithIntl(<AiBotsContent />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create bot/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /create bot/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('displays skeleton while loading', async () => {
    let resolveLoad: (value: { data: any; error: any }) => void;
    const loadPromise = new Promise<{ data: any; error: any }>((resolve) => {
      resolveLoad = resolve;
    });
    mockGetAiBots.mockReturnValue(loadPromise);

    renderWithIntl(<AiBotsContent />);

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

  it('handles pagination', async () => {
    mockGetAiBots.mockResolvedValue({
      data: { items: mockBots, total: 25, page: 1, limit: 10, totalPages: 3 },
      error: undefined,
    });

    renderWithIntl(<AiBotsContent />);

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

    renderWithIntl(<AiBotsContent />);

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

  it('handles exception during load', async () => {
    mockGetAiBots.mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<AiBotsContent />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load AI bots');
    });
  });
});
