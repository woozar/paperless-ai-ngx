import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { ModelTableRow } from './model-table-row';
import type { AiModelListItem } from '@repo/api-client';

const mockSettings = vi.fn();
vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockSettings(),
}));

const mockModel: AiModelListItem & { canEdit?: boolean; canShare?: boolean; isOwner?: boolean } = {
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

describe('ModelTableRow', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnShare = vi.fn();
  const mockFormatDate = vi.fn((dateString: string) => new Date(dateString).toLocaleDateString());

  beforeEach(() => {
    vi.clearAllMocks();
    mockSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'BASIC' as const },
      updateSetting: vi.fn(),
    });
  });

  it('renders model information', () => {
    renderWithIntl(
      <table>
        <tbody>
          <ModelTableRow
            model={mockModel}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            formatDate={mockFormatDate}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('GPT-4')).toBeInTheDocument();
    expect(screen.getByText('gpt-4')).toBeInTheDocument();
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(
      <table>
        <tbody>
          <ModelTableRow
            model={mockModel}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            formatDate={mockFormatDate}
          />
        </tbody>
      </table>
    );

    const editButton = screen.getByTestId('edit-model-model-1');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockModel);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    renderWithIntl(
      <table>
        <tbody>
          <ModelTableRow
            model={mockModel}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            formatDate={mockFormatDate}
          />
        </tbody>
      </table>
    );

    const deleteButton = screen.getByTestId('delete-model-model-1');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockModel);
  });

  it('shows share button in ADVANCED mode when canShare is true', () => {
    mockSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'ADVANCED' as const },
      updateSetting: vi.fn(),
    });

    renderWithIntl(
      <table>
        <tbody>
          <ModelTableRow
            model={{ ...mockModel, canShare: true }}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onShare={mockOnShare}
            formatDate={mockFormatDate}
          />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('share-model-model-1')).toBeInTheDocument();
  });

  it('does not show share button in BASIC mode', () => {
    renderWithIntl(
      <table>
        <tbody>
          <ModelTableRow
            model={mockModel}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onShare={mockOnShare}
            formatDate={mockFormatDate}
          />
        </tbody>
      </table>
    );

    expect(screen.queryByTestId('share-model-model-1')).not.toBeInTheDocument();
  });

  it('calls onShare when share button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    mockSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'ADVANCED' as const },
      updateSetting: vi.fn(),
    });

    renderWithIntl(
      <table>
        <tbody>
          <ModelTableRow
            model={{ ...mockModel, canShare: true }}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onShare={mockOnShare}
            formatDate={mockFormatDate}
          />
        </tbody>
      </table>
    );

    const shareButton = screen.getByTestId('share-model-model-1');
    await user.click(shareButton);

    expect(mockOnShare).toHaveBeenCalledWith({ ...mockModel, canShare: true });
  });

  it('hides edit button when canEdit is false', () => {
    renderWithIntl(
      <table>
        <tbody>
          <ModelTableRow
            model={{ ...mockModel, canEdit: false }}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            formatDate={mockFormatDate}
          />
        </tbody>
      </table>
    );

    expect(screen.queryByTestId('edit-model-model-1')).not.toBeInTheDocument();
  });

  it('hides delete button when isOwner is false', () => {
    renderWithIntl(
      <table>
        <tbody>
          <ModelTableRow
            model={{ ...mockModel, isOwner: false }}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            formatDate={mockFormatDate}
          />
        </tbody>
      </table>
    );

    expect(screen.queryByTestId('delete-model-model-1')).not.toBeInTheDocument();
  });
});
