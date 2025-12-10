import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { AccountTableRow } from './account-table-row';
import type { AiAccountListItem } from '@repo/api-client';
import type { Settings } from '@/lib/api/schemas/settings';

const mockUseSettings = vi.fn(() => ({
  settings: { 'security.sharing.mode': 'BASIC', 'display.general.currency': 'EUR' } as Settings,
  updateSetting: vi.fn(),
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockUseSettings(),
}));

function renderAccountTableRow(props: {
  account: Omit<AiAccountListItem, 'apiKey'>;
  onEdit: (account: Omit<AiAccountListItem, 'apiKey'>) => void;
  onDelete: (account: Omit<AiAccountListItem, 'apiKey'>) => void;
  onShare?: (account: Omit<AiAccountListItem, 'apiKey'>) => void;
  formatDate: (date: string) => string;
}) {
  return renderWithIntl(
    <table>
      <tbody>
        <AccountTableRow {...props} />
      </tbody>
    </table>
  );
}

const mockAccount: Omit<AiAccountListItem, 'apiKey'> = {
  id: 'account-123',
  name: 'OpenAI',
  provider: 'openai',
  baseUrl: null,
  isActive: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

describe('AccountTableRow', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockFormatDate = vi.fn(() => '2024-01-15');

  const defaultProps = {
    account: mockAccount,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    formatDate: mockFormatDate,
  };

  it('renders account name in first column', () => {
    const { container } = renderAccountTableRow(defaultProps);
    const cells = container.querySelectorAll('td');
    expect(cells[0]).toHaveTextContent('OpenAI');
  });

  it('renders provider type', () => {
    const { container } = renderAccountTableRow(defaultProps);
    const cells = container.querySelectorAll('td');
    expect(cells[1]).toHaveTextContent('OpenAI');
  });

  it('formats and displays creation date', () => {
    renderAccountTableRow(defaultProps);
    expect(mockFormatDate).toHaveBeenCalledWith('2024-01-15T10:30:00Z');
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderAccountTableRow(defaultProps);

    const editButton = screen.getByTestId('edit-account-account-123');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockAccount);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderAccountTableRow(defaultProps);

    const deleteButton = screen.getByTestId('delete-account-account-123');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockAccount);
  });

  it('renders edit button with correct testid', () => {
    renderAccountTableRow(defaultProps);
    expect(screen.getByTestId('edit-account-account-123')).toBeInTheDocument();
  });

  it('renders delete button with correct testid', () => {
    renderAccountTableRow(defaultProps);
    expect(screen.getByTestId('delete-account-account-123')).toBeInTheDocument();
  });

  it('renders as table row', () => {
    const { container } = renderAccountTableRow(defaultProps);
    expect(container.querySelector('tr')).toBeInTheDocument();
  });

  it('renders correct number of table cells', () => {
    const { container } = renderAccountTableRow(defaultProps);
    const cells = container.querySelectorAll('td');
    expect(cells.length).toBe(4); // name, type, date, actions
  });

  describe('share button', () => {
    it('does not render share button when sharing mode is BASIC', () => {
      mockUseSettings.mockReturnValue({
        settings: {
          'security.sharing.mode': 'BASIC',
          'display.general.currency': 'EUR',
        } as Settings,
        updateSetting: vi.fn(),
      });
      renderAccountTableRow(defaultProps);
      expect(screen.queryByTestId('share-account-account-123')).not.toBeInTheDocument();
    });

    it('renders share button when sharing mode is ADVANCED and onShare is provided', () => {
      mockUseSettings.mockReturnValue({
        settings: {
          'security.sharing.mode': 'ADVANCED',
          'display.general.currency': 'EUR',
        } as Settings,
        updateSetting: vi.fn(),
      });
      renderAccountTableRow({ ...defaultProps, onShare: vi.fn() });
      expect(screen.getByTestId('share-account-account-123')).toBeInTheDocument();
    });

    it('calls onShare when share button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      const mockOnShare = vi.fn();
      mockUseSettings.mockReturnValue({
        settings: {
          'security.sharing.mode': 'ADVANCED',
          'display.general.currency': 'EUR',
        } as Settings,
        updateSetting: vi.fn(),
      });
      renderAccountTableRow({ ...defaultProps, onShare: mockOnShare });

      const shareButton = screen.getByTestId('share-account-account-123');
      await user.click(shareButton);

      expect(mockOnShare).toHaveBeenCalledWith(mockAccount);
    });
  });
});
