import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { AiModelsContent } from './ai-models-content';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiModelListItem } from '@repo/api-client';

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

const mockGetAiModels = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getAiModels: (...args: any[]) => mockGetAiModels(...args),
  };
});

const mockShowError = vi.fn((key: string) => {
  const errorMessages: Record<string, string> = {
    loadFailed: 'Failed to load AI models',
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

// Mock the components imported from ai-models
vi.mock('../../ai-models/_components', () => ({
  ModelTableSkeleton: () => (
    <tr>
      <td colSpan={5}>
        <div data-slot="skeleton">Loading...</div>
      </td>
    </tr>
  ),
  ModelTableRow: ({ model }: { model: any }) => (
    <tr data-testid={`model-row-${model.id}`}>
      <td>{model.name}</td>
      <td>{model.modelIdentifier}</td>
      <td>{model.aiAccount?.name}</td>
      <td>{new Date(model.createdAt).toLocaleDateString()}</td>
      <td>Actions</td>
    </tr>
  ),
  CreateModelDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Create Dialog</div> : null,
  EditModelDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Edit Dialog</div> : null,
  DeleteModelDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Delete Dialog</div> : null,
}));

// Mock ShareDialog
vi.mock('@/components/sharing/share-dialog', () => ({
  ShareDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Share Dialog</div> : null,
}));

const mockModels: AiModelListItem[] = [
  {
    id: 'model-1',
    name: 'GPT-4',
    modelIdentifier: 'gpt-4',
    aiAccountId: 'account-1',
    aiAccount: {
      id: 'account-1',
      name: 'OpenAI',
      provider: 'openai',
    },
    inputTokenPrice: 0.03,
    outputTokenPrice: 0.06,
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'model-2',
    name: 'Claude 3',
    modelIdentifier: 'claude-3-opus',
    aiAccountId: 'account-2',
    aiAccount: {
      id: 'account-2',
      name: 'Anthropic',
      provider: 'anthropic',
    },
    inputTokenPrice: 0.015,
    outputTokenPrice: 0.075,
    isActive: true,
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
  },
];

describe('AiModelsContent', () => {
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

  it('loads and displays models', async () => {
    mockGetAiModels.mockResolvedValueOnce({
      data: { items: mockModels, total: mockModels.length, page: 1, limit: 10, totalPages: 1 },
      error: undefined,
    });

    renderWithIntl(<AiModelsContent />);

    await waitFor(() => {
      expect(screen.getByText('GPT-4')).toBeInTheDocument();
      expect(screen.getByText('Claude 3')).toBeInTheDocument();
    });
  });

  it('displays "no models" message when list is empty', async () => {
    mockGetAiModels.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
      error: undefined,
    });

    renderWithIntl(<AiModelsContent />);

    await waitFor(() => {
      expect(screen.getByText(/no models/i)).toBeInTheDocument();
    });
  });

  it('displays error when loading fails', async () => {
    mockGetAiModels.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 500 },
    });

    renderWithIntl(<AiModelsContent />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('opens create dialog when clicking create button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAiModels.mockResolvedValueOnce({
      data: { items: mockModels, total: mockModels.length, page: 1, limit: 10, totalPages: 1 },
      error: undefined,
    });

    renderWithIntl(<AiModelsContent />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create model/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /create model/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('displays skeleton while loading', async () => {
    let resolveLoad: (value: { data: any; error: any }) => void;
    const loadPromise = new Promise<{ data: any; error: any }>((resolve) => {
      resolveLoad = resolve;
    });
    mockGetAiModels.mockReturnValue(loadPromise);

    renderWithIntl(<AiModelsContent />);

    await waitFor(() => {
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    resolveLoad!({
      data: { items: mockModels, total: mockModels.length, page: 1, limit: 10, totalPages: 1 },
      error: undefined,
    });

    await waitFor(() => {
      expect(screen.getByText('GPT-4')).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    mockGetAiModels.mockResolvedValue({
      data: { items: mockModels, total: 25, page: 1, limit: 10, totalPages: 3 },
      error: undefined,
    });

    renderWithIntl(<AiModelsContent />);

    await waitFor(() => {
      expect(screen.getByTestId('pagination-next')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByTestId('pagination-next'));

    await waitFor(() => {
      expect(mockGetAiModels).toHaveBeenCalledWith(
        expect.objectContaining({
          query: { page: 2, limit: 10 },
        })
      );
    });
  });

  it('resets to page 1 when limit changes', async () => {
    mockGetAiModels.mockResolvedValue({
      data: { items: mockModels, total: 25, page: 2, limit: 10, totalPages: 3 },
      error: undefined,
    });

    renderWithIntl(<AiModelsContent />);

    await waitFor(() => {
      expect(screen.getByTestId('select-native')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('select-native'), { target: { value: '20' } });

    await waitFor(() => {
      expect(mockGetAiModels).toHaveBeenCalledWith(
        expect.objectContaining({
          query: { page: 1, limit: 20 },
        })
      );
    });
  });

  it('handles exception during load', async () => {
    mockGetAiModels.mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<AiModelsContent />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load AI models');
    });
  });
});
