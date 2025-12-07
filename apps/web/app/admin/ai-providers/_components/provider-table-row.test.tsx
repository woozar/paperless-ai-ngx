import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { ProviderTableRow } from './provider-table-row';
import type { AiProviderListItem } from '@repo/api-client';
import type { Settings } from '@/lib/api/schemas/settings';

const mockUseSettings = vi.fn(() => ({
  settings: { 'security.sharing.mode': 'BASIC' } as Settings,
  updateSetting: vi.fn(),
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockUseSettings(),
}));

function renderProviderTableRow(props: {
  provider: Omit<AiProviderListItem, 'apiKey'>;
  onEdit: (provider: Omit<AiProviderListItem, 'apiKey'>) => void;
  onDelete: (provider: Omit<AiProviderListItem, 'apiKey'>) => void;
  formatDate: (date: string) => string;
}) {
  return renderWithIntl(
    <table>
      <tbody>
        <ProviderTableRow {...props} />
      </tbody>
    </table>
  );
}

const mockProvider: Omit<AiProviderListItem, 'apiKey'> = {
  id: 'provider-123',
  name: 'OpenAI',
  provider: 'openai',
  model: 'gpt-4',
  baseUrl: null,
  isActive: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

describe('ProviderTableRow', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockFormatDate = vi.fn(() => '2024-01-15');

  const defaultProps = {
    provider: mockProvider,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    formatDate: mockFormatDate,
  };

  it('renders provider name in first column', () => {
    const { container } = renderProviderTableRow(defaultProps);
    const cells = container.querySelectorAll('td');
    expect(cells[0]).toHaveTextContent('OpenAI');
  });

  it('renders provider type badge', () => {
    const { container } = renderProviderTableRow(defaultProps);
    const cells = container.querySelectorAll('td');
    expect(cells[1]).toHaveTextContent('OpenAI');
  });

  it('renders model', () => {
    renderProviderTableRow(defaultProps);
    expect(screen.getByText('gpt-4')).toBeInTheDocument();
  });

  it('formats and displays creation date', () => {
    renderProviderTableRow(defaultProps);
    expect(mockFormatDate).toHaveBeenCalledWith('2024-01-15T10:30:00Z');
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderProviderTableRow(defaultProps);

    const editButton = screen.getByTestId('edit-provider-provider-123');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockProvider);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderProviderTableRow(defaultProps);

    const deleteButton = screen.getByTestId('delete-provider-provider-123');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockProvider);
  });

  it('renders edit button with correct testid', () => {
    renderProviderTableRow(defaultProps);
    expect(screen.getByTestId('edit-provider-provider-123')).toBeInTheDocument();
  });

  it('renders delete button with correct testid', () => {
    renderProviderTableRow(defaultProps);
    expect(screen.getByTestId('delete-provider-provider-123')).toBeInTheDocument();
  });

  it('renders as table row', () => {
    const { container } = renderProviderTableRow(defaultProps);
    expect(container.querySelector('tr')).toBeInTheDocument();
  });

  it('renders correct number of table cells', () => {
    const { container } = renderProviderTableRow(defaultProps);
    const cells = container.querySelectorAll('td');
    expect(cells.length).toBe(5); // name, type, model, date, actions
  });

  describe('share button', () => {
    it('does not render share button when sharing mode is BASIC', () => {
      mockUseSettings.mockReturnValue({
        settings: { 'security.sharing.mode': 'BASIC' },
        updateSetting: vi.fn(),
      });
      renderProviderTableRow(defaultProps);
      expect(screen.queryByTestId('share-provider-provider-123')).not.toBeInTheDocument();
    });

    it('renders share button when sharing mode is ADVANCED and onShare is provided', () => {
      mockUseSettings.mockReturnValue({
        settings: { 'security.sharing.mode': 'ADVANCED' } as Settings,
        updateSetting: vi.fn(),
      });
      renderProviderTableRow({ ...defaultProps, onShare: vi.fn() });
      expect(screen.getByTestId('share-provider-provider-123')).toBeInTheDocument();
    });

    it('calls onShare when share button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      const mockOnShare = vi.fn();
      mockUseSettings.mockReturnValue({
        settings: { 'security.sharing.mode': 'ADVANCED' } as Settings,
        updateSetting: vi.fn(),
      });
      renderProviderTableRow({ ...defaultProps, onShare: mockOnShare });

      const shareButton = screen.getByTestId('share-provider-provider-123');
      await user.click(shareButton);

      expect(mockOnShare).toHaveBeenCalledWith(mockProvider);
    });
  });
});
