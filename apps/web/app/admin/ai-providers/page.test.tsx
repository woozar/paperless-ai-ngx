import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import AiProvidersPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiProviderListItem } from '@repo/api-client';

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
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="ollama">Ollama</option>
          <option value="custom">Custom</option>
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

const mockPush = vi.fn();
const mockUser = vi.fn();
const mockGetAiProviders = vi.fn();

const mockRouter = { push: mockPush };
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
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

const mockPostAiProviders = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getAiProviders: (...args: any[]) => mockGetAiProviders(...args),
    postAiProviders: (...args: any[]) => mockPostAiProviders(...args),
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
    loadFailed: 'Failed to load AI providers',
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
      data: {
        items: mockProviders,
        total: mockProviders.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
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
      data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
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
      data: {
        items: mockProviders,
        total: mockProviders.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
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
      data: {
        items: mockProviders,
        total: mockProviders.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
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
      data: {
        items: mockProviders,
        total: mockProviders.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
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
      data: {
        items: mockProviders,
        total: mockProviders.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
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
      data: {
        items: mockProviders,
        total: mockProviders.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
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

    resolveLoad!({
      data: {
        items: mockProviders,
        total: mockProviders.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      error: undefined,
    });

    await waitFor(() => {
      const rows = container.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });
  });

  describe('pagination handlers', () => {
    it('calls loadProviders with new page when handlePageChange is triggered', async () => {
      mockGetAiProviders.mockResolvedValue({
        data: { items: mockProviders, total: 25, page: 1, limit: 10, totalPages: 3 },
        error: undefined,
      });

      renderWithIntl(<AiProvidersPage />);

      await waitFor(() => {
        expect(screen.getByTestId('pagination-next')).toBeInTheDocument();
      });

      const user = userEvent.setup();
      await user.click(screen.getByTestId('pagination-next'));

      await waitFor(() => {
        expect(mockGetAiProviders).toHaveBeenCalledWith(
          expect.objectContaining({
            query: { page: 2, limit: 10 },
          })
        );
      });
    });

    it('resets to page 1 when limit changes', async () => {
      mockGetAiProviders.mockResolvedValue({
        data: { items: mockProviders, total: 25, page: 2, limit: 10, totalPages: 3 },
        error: undefined,
      });

      renderWithIntl(<AiProvidersPage />);

      await waitFor(() => {
        expect(screen.getByTestId('select-native')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('select-native'), { target: { value: '20' } });

      await waitFor(() => {
        expect(mockGetAiProviders).toHaveBeenCalledWith(
          expect.objectContaining({
            query: { page: 1, limit: 20 },
          })
        );
      });
    });

    it('handles exception during loadProviders', async () => {
      mockGetAiProviders.mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(<AiProvidersPage />);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load AI providers');
      });
    });
  });

  describe('reloadCurrentPage via dialog success', () => {
    it('reloads providers when create dialog calls onSuccess', async () => {
      const user = userEvent.setup({ delay: null });

      mockGetAiProviders.mockResolvedValue({
        data: {
          items: mockProviders,
          total: mockProviders.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        error: undefined,
      });

      mockPostAiProviders.mockResolvedValue({
        data: { id: 'new-provider', name: 'New Provider' },
        error: undefined,
      });

      renderWithIntl(<AiProvidersPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create provider/i })).toBeInTheDocument();
      });

      const initialCallCount = mockGetAiProviders.mock.calls.length;

      // Open create dialog
      await user.click(screen.getByRole('button', { name: /create provider/i }));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Fill the form - name, model, and apiKey inputs
      const nameInput = screen.getByTestId('create-provider-name-input');
      const modelInput = screen.getByTestId('create-provider-model-input');
      const apiKeyInput = screen.getByTestId('create-provider-apiKey-input');

      await user.type(nameInput, 'New Provider');
      await user.type(modelInput, 'gpt-4');
      await user.type(apiKeyInput, 'sk-test-key');

      // Select provider type
      const selectNative = screen.queryAllByTestId('select-native')[1]; // Second select is the provider type
      if (selectNative) {
        fireEvent.change(selectNative, { target: { value: 'openai' } });
      }

      // Submit the form
      const submitButton = screen.getByTestId('create-provider-submit-button');
      await user.click(submitButton);

      // Verify that onSuccess was triggered which calls reloadCurrentPage
      await waitFor(() => {
        expect(mockGetAiProviders.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });
  });
});
