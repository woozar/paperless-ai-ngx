import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { CreateBotDialog } from './create-bot-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiModelListItem } from '@repo/api-client';

const mockPostAiBots = vi.fn();
const mockGetAiModels = vi.fn();
let mockSelectCallbacks: Map<string, (value: string) => void> = new Map();

const mockModels: AiModelListItem[] = [
  {
    id: 'model-1',
    name: 'GPT-4',
    modelIdentifier: 'gpt-4',
    inputTokenPrice: null,
    outputTokenPrice: null,
    isActive: true,
    aiAccountId: 'account-1',
    aiAccount: {
      id: 'account-1',
      name: 'OpenAI',
      provider: 'openai',
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
];

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    postAiBots: (...args: any[]) => mockPostAiBots(...args),
    getAiModels: (...args: any[]) => mockGetAiModels(...args),
  };
});

let selectIndex = 0;

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: any) => {
    const id = `select-${selectIndex++}`;
    mockSelectCallbacks.set(id, onValueChange);
    return (
      <div data-testid="mock-select" data-value={value} data-select-id={id}>
        <select
          data-testid="select-native"
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="model-1">Model 1</option>
          <option value="DOCUMENT">Based on document</option>
          <option value="GERMAN">German</option>
          <option value="ENGLISH">English</option>
        </select>
        {children}
      </div>
    );
  },
  SelectTrigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  SelectValue: () => <div>Value</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <span className="flex items-center gap-2">{children}</span>,
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('CreateBotDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectCallbacks = new Map();
    selectIndex = 0;
    mockGetAiModels.mockResolvedValue({
      data: {
        items: mockModels,
        total: mockModels.length,
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

  it('renders dialog when open is true', async () => {
    renderWithIntl(<CreateBotDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<CreateBotDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls API with form data when submitted', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAiBots.mockResolvedValueOnce({ data: { id: 'new-bot' }, error: undefined });

    renderWithIntl(<CreateBotDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockGetAiModels).toHaveBeenCalled();
    });

    const nameInput = screen.getByTestId('create-bot-name-input');
    const systemPromptInput = screen.getByTestId('create-bot-systemPrompt-input');

    await user.type(nameInput, 'New Bot');
    await user.type(systemPromptInput, 'Be helpful');

    // Select model using the native select
    const selects = screen.getAllByTestId('select-native');
    // First select is aiModelId, second is responseLanguage
    fireEvent.change(selects[0]!, { target: { value: 'model-1' } });

    const submitButton = screen.getByTestId('create-bot-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPostAiBots).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          body: {
            name: 'New Bot',
            aiModelId: 'model-1',
            systemPrompt: 'Be helpful',
            responseLanguage: 'DOCUMENT',
          },
        })
      );
    });
  });

  it('closes dialog and calls onSuccess after successful creation', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    mockPostAiBots.mockResolvedValueOnce({ data: { id: 'new-bot' }, error: undefined });

    renderWithIntl(
      <CreateBotDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockGetAiModels).toHaveBeenCalled();
    });

    const nameInput = screen.getByTestId('create-bot-name-input');
    const systemPromptInput = screen.getByTestId('create-bot-systemPrompt-input');

    await user.type(nameInput, 'New Bot');
    await user.type(systemPromptInput, 'Be helpful');

    const selects = screen.getAllByTestId('select-native');
    fireEvent.change(selects[0]!, { target: { value: 'model-1' } });

    const submitButton = screen.getByTestId('create-bot-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on API error', async () => {
    const user = userEvent.setup({ delay: null });
    mockPostAiBots.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
      response: { status: 500 },
    });

    renderWithIntl(<CreateBotDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockGetAiModels).toHaveBeenCalled();
    });

    const nameInput = screen.getByTestId('create-bot-name-input');
    const systemPromptInput = screen.getByTestId('create-bot-systemPrompt-input');

    await user.type(nameInput, 'New Bot');
    await user.type(systemPromptInput, 'Be helpful');

    const selects = screen.getAllByTestId('select-native');
    fireEvent.change(selects[0]!, { target: { value: 'model-1' } });

    const submitButton = screen.getByTestId('create-bot-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('shows error when loading models fails', async () => {
    mockGetAiModels.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
    });

    renderWithIntl(<CreateBotDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });
});
