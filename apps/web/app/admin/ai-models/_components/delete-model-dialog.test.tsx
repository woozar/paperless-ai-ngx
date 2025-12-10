import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { DeleteModelDialog } from './delete-model-dialog';
import type { AiModelListItem } from '@repo/api-client';

const mockDeleteAiModelsById = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    deleteAiModelsById: (...args: any[]) => mockDeleteAiModelsById(...args),
  };
});

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
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

describe('DeleteModelDialog', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders confirmation dialog when model is provided', () => {
    renderWithIntl(
      <DeleteModelDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        model={mockModel}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when model is null', () => {
    const { container } = renderWithIntl(
      <DeleteModelDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        model={null}
        onSuccess={mockOnSuccess}
      />
    );

    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it('calls delete API when confirmed with correct name', async () => {
    const user = userEvent.setup({ delay: null });
    mockDeleteAiModelsById.mockResolvedValueOnce({
      data: undefined,
      error: undefined,
      response: { status: 204 },
    });

    renderWithIntl(
      <DeleteModelDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        model={mockModel}
        onSuccess={mockOnSuccess}
      />
    );

    // Type the model name to enable delete button
    const nameInput = screen.getByTestId('confirm-name-input');
    await user.type(nameInput, 'GPT-4');

    const deleteButton = screen.getByTestId('submit-delete-button');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteAiModelsById).toHaveBeenCalledWith({
        client: mockClient,
        path: { id: 'model-1' },
      });
    });
  });

  it('calls onSuccess after successful deletion', async () => {
    const user = userEvent.setup({ delay: null });
    mockDeleteAiModelsById.mockResolvedValueOnce({
      data: undefined,
      error: undefined,
      response: { status: 204 },
    });

    renderWithIntl(
      <DeleteModelDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        model={mockModel}
        onSuccess={mockOnSuccess}
      />
    );

    // Type the model name to enable delete button
    const nameInput = screen.getByTestId('confirm-name-input');
    await user.type(nameInput, 'GPT-4');

    const deleteButton = screen.getByTestId('submit-delete-button');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
