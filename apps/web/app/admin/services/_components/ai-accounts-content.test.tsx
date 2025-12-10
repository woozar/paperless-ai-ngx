import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { AiAccountsContent } from './ai-accounts-content';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiAccountListItem } from '@repo/api-client';

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

const mockGetAiAccounts = vi.fn();
const mockPostAiAccounts = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getAiAccounts: (...args: any[]) => mockGetAiAccounts(...args),
    postAiAccounts: (...args: any[]) => mockPostAiAccounts(...args),
  };
});

const mockShowError = vi.fn((key: string) => {
  const errorMessages: Record<string, string> = {
    loadFailed: 'Failed to load AI accounts',
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

// Mock the components imported from ai-accounts
vi.mock('../../ai-accounts/_components', () => ({
  AccountTableSkeleton: () => (
    <tr>
      <td colSpan={4}>
        <div data-slot="skeleton">Loading...</div>
      </td>
    </tr>
  ),
  AccountTableRow: ({ account }: { account: any }) => (
    <tr data-testid={`account-row-${account.id}`}>
      <td>{account.name}</td>
      <td>{account.provider}</td>
      <td>{new Date(account.createdAt).toLocaleDateString()}</td>
      <td>Actions</td>
    </tr>
  ),
  CreateAccountDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Create Dialog</div> : null,
  EditAccountDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Edit Dialog</div> : null,
  DeleteAccountDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Delete Dialog</div> : null,
}));

// Mock ShareDialog
vi.mock('@/components/sharing/share-dialog', () => ({
  ShareDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Share Dialog</div> : null,
}));

const mockAccounts: Omit<AiAccountListItem, 'apiKey'>[] = [
  {
    id: 'account-1',
    name: 'OpenAI Account',
    provider: 'openai',
    baseUrl: null,
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'account-2',
    name: 'Anthropic Account',
    provider: 'anthropic',
    baseUrl: null,
    isActive: true,
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
  },
];

describe('AiAccountsContent', () => {
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

  it('loads and displays accounts', async () => {
    mockGetAiAccounts.mockResolvedValueOnce({
      data: {
        items: mockAccounts,
        total: mockAccounts.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });

    renderWithIntl(<AiAccountsContent />);

    await waitFor(() => {
      expect(screen.getByText('OpenAI Account')).toBeInTheDocument();
      expect(screen.getByText('Anthropic Account')).toBeInTheDocument();
    });
  });

  it('displays "no accounts" message when list is empty', async () => {
    mockGetAiAccounts.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
      error: undefined,
    });

    renderWithIntl(<AiAccountsContent />);

    await waitFor(() => {
      expect(screen.getByText(/no accounts/i)).toBeInTheDocument();
    });
  });

  it('displays error when loading fails', async () => {
    mockGetAiAccounts.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 500 },
    });

    renderWithIntl(<AiAccountsContent />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('opens create dialog when clicking create button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAiAccounts.mockResolvedValueOnce({
      data: {
        items: mockAccounts,
        total: mockAccounts.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });

    renderWithIntl(<AiAccountsContent />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('displays skeleton while loading', async () => {
    let resolveLoad: (value: { data: any; error: any }) => void;
    const loadPromise = new Promise<{ data: any; error: any }>((resolve) => {
      resolveLoad = resolve;
    });
    mockGetAiAccounts.mockReturnValue(loadPromise);

    renderWithIntl(<AiAccountsContent />);

    await waitFor(() => {
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    resolveLoad!({
      data: {
        items: mockAccounts,
        total: mockAccounts.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });

    await waitFor(() => {
      expect(screen.getByText('OpenAI Account')).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    mockGetAiAccounts.mockResolvedValue({
      data: { items: mockAccounts, total: 25, page: 1, limit: 10, totalPages: 3 },
      error: undefined,
    });

    renderWithIntl(<AiAccountsContent />);

    await waitFor(() => {
      expect(screen.getByTestId('pagination-next')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByTestId('pagination-next'));

    await waitFor(() => {
      expect(mockGetAiAccounts).toHaveBeenCalledWith(
        expect.objectContaining({
          query: { page: 2, limit: 10 },
        })
      );
    });
  });

  it('resets to page 1 when limit changes', async () => {
    mockGetAiAccounts.mockResolvedValue({
      data: { items: mockAccounts, total: 25, page: 2, limit: 10, totalPages: 3 },
      error: undefined,
    });

    renderWithIntl(<AiAccountsContent />);

    await waitFor(() => {
      expect(screen.getByTestId('select-native')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('select-native'), { target: { value: '20' } });

    await waitFor(() => {
      expect(mockGetAiAccounts).toHaveBeenCalledWith(
        expect.objectContaining({
          query: { page: 1, limit: 20 },
        })
      );
    });
  });

  it('handles exception during load', async () => {
    mockGetAiAccounts.mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<AiAccountsContent />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load AI accounts');
    });
  });
});
