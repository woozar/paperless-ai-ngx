import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { EditModelDialog } from './edit-model-dialog';
import type { AiModelListItem } from '@repo/api-client';

vi.mock('@/components/ui/select', async () => {
  const actual = await vi.importActual('@/components/ui/select');
  return {
    ...actual,
    Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SelectValue: () => null,
    SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

const mockPatchAiModelsById = vi.fn();
const mockGetAiAccounts = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    patchAiModelsById: (...args: any[]) => mockPatchAiModelsById(...args),
    getAiAccounts: (...args: any[]) => mockGetAiAccounts(...args),
  };
});

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
}));

const mockShowError = vi.fn();
vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({
    showError: mockShowError,
    showApiError: vi.fn(),
    showSuccess: vi.fn(),
    showInfo: vi.fn(),
  }),
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'display.general.currency': 'EUR' },
    updateSetting: vi.fn(),
  }),
}));

const mockModel: AiModelListItem = {
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
};

describe('EditModelDialog', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAiAccounts.mockResolvedValue({
      data: {
        items: [
          { id: 'account-1', name: 'OpenAI Account' },
          { id: 'account-2', name: 'Anthropic Account' },
        ],
      },
      error: undefined,
    });
  });

  it('returns null when model is null', async () => {
    const { container } = renderWithIntl(
      <EditModelDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        model={null}
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('loads accounts when dialog opens', async () => {
    renderWithIntl(
      <EditModelDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        model={mockModel}
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(mockGetAiAccounts).toHaveBeenCalledWith({ client: mockClient });
    });
  });

  it('handles account loading failure', async () => {
    mockGetAiAccounts.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'Failed to load accounts' },
    });

    renderWithIntl(
      <EditModelDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        model={mockModel}
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('loadAccountsFailed');
    });
  });

  it('renders form with pre-filled model data', async () => {
    renderWithIntl(
      <EditModelDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        model={mockModel}
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-model-name-input')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('edit-model-name-input') as HTMLInputElement;
    const identifierInput = screen.getByTestId(
      'edit-model-modelIdentifier-input'
    ) as HTMLInputElement;

    expect(nameInput.value).toBe('GPT-4');
    expect(identifierInput.value).toBe('gpt-4');
  });
});
