import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { BotTableRow } from './bot-table-row';
import type { AiBotListItem } from '@repo/api-client';
import type { Settings } from '@/lib/api/schemas/settings';

const mockUseSettings = vi.fn(() => ({
  settings: { 'security.sharing.mode': 'BASIC' } as Settings,
  updateSetting: vi.fn(),
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockUseSettings(),
}));

function renderBotTableRow(props: {
  bot: AiBotListItem;
  onEdit: (bot: AiBotListItem) => void;
  onDelete: (bot: AiBotListItem) => void;
  formatDate: (date: string) => string;
}) {
  return renderWithIntl(
    <table>
      <tbody>
        <BotTableRow {...props} />
      </tbody>
    </table>
  );
}

const mockBot: AiBotListItem = {
  id: 'bot-123',
  name: 'Test Bot',
  aiProviderId: 'provider-1',
  aiProvider: {
    id: 'provider-1',
    name: 'OpenAI',
    provider: 'openai',
  },
  systemPrompt: 'You are a helpful assistant',
  responseLanguage: 'DOCUMENT',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

describe('BotTableRow', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockFormatDate = vi.fn(() => '2024-01-15');

  const defaultProps = {
    bot: mockBot,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    formatDate: mockFormatDate,
  };

  it('renders bot name', () => {
    renderBotTableRow(defaultProps);
    expect(screen.getByText('Test Bot')).toBeInTheDocument();
  });

  it('renders AI provider name', () => {
    renderBotTableRow(defaultProps);
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
  });

  it('formats and displays creation date', () => {
    renderBotTableRow(defaultProps);
    expect(mockFormatDate).toHaveBeenCalledWith('2024-01-15T10:30:00Z');
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderBotTableRow(defaultProps);

    const editButton = screen.getByTestId('edit-bot-bot-123');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockBot);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderBotTableRow(defaultProps);

    const deleteButton = screen.getByTestId('delete-bot-bot-123');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockBot);
  });

  it('renders edit button with correct testid', () => {
    renderBotTableRow(defaultProps);
    expect(screen.getByTestId('edit-bot-bot-123')).toBeInTheDocument();
  });

  it('renders delete button with correct testid', () => {
    renderBotTableRow(defaultProps);
    expect(screen.getByTestId('delete-bot-bot-123')).toBeInTheDocument();
  });

  it('renders as table row', () => {
    const { container } = renderBotTableRow(defaultProps);
    expect(container.querySelector('tr')).toBeInTheDocument();
  });

  it('renders correct number of table cells', () => {
    const { container } = renderBotTableRow(defaultProps);
    const cells = container.querySelectorAll('td');
    expect(cells.length).toBe(4); // name, provider, date, actions
  });

  describe('share button', () => {
    it('does not render share button when sharing mode is BASIC', () => {
      mockUseSettings.mockReturnValue({
        settings: { 'security.sharing.mode': 'BASIC' },
        updateSetting: vi.fn(),
      });
      renderBotTableRow(defaultProps);
      expect(screen.queryByTestId('share-bot-bot-123')).not.toBeInTheDocument();
    });

    it('renders share button when sharing mode is ADVANCED and onShare is provided', () => {
      mockUseSettings.mockReturnValue({
        settings: { 'security.sharing.mode': 'ADVANCED' } as Settings,
        updateSetting: vi.fn(),
      });
      renderBotTableRow({ ...defaultProps, onShare: vi.fn() });
      expect(screen.getByTestId('share-bot-bot-123')).toBeInTheDocument();
    });

    it('calls onShare when share button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      const mockOnShare = vi.fn();
      mockUseSettings.mockReturnValue({
        settings: { 'security.sharing.mode': 'ADVANCED' } as Settings,
        updateSetting: vi.fn(),
      });
      renderBotTableRow({ ...defaultProps, onShare: mockOnShare });

      const shareButton = screen.getByTestId('share-bot-bot-123');
      await user.click(shareButton);

      expect(mockOnShare).toHaveBeenCalledWith(mockBot);
    });
  });
});
