import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { CreateModelDialog } from './create-model-dialog';

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

const mockPostAiModels = vi.fn();
const mockGetAiAccounts = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    postAiModels: (...args: any[]) => mockPostAiModels(...args),
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

describe('CreateModelDialog', () => {
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

  it('loads accounts when dialog opens', async () => {
    renderWithIntl(
      <CreateModelDialog open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />
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
      <CreateModelDialog open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('loadAccountsFailed');
    });
  });

  it('does not load accounts when dialog is closed', () => {
    renderWithIntl(
      <CreateModelDialog open={false} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />
    );

    expect(mockGetAiAccounts).not.toHaveBeenCalled();
  });

  it('renders form with all required fields', async () => {
    renderWithIntl(
      <CreateModelDialog open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('create-model-name-input')).toBeInTheDocument();
    });

    expect(screen.getByTestId('create-model-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('create-model-modelIdentifier-input')).toBeInTheDocument();
    expect(screen.getByTestId('create-model-submit-button')).toBeInTheDocument();
  });
});
