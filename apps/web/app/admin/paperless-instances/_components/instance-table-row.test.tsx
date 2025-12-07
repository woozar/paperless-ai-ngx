import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { InstanceTableRow } from './instance-table-row';
import type { PaperlessInstanceListItem } from '@repo/api-client';
import type { Settings } from '@/lib/api/schemas/settings';

const mockUseSettings = vi.fn(() => ({
  settings: { 'security.sharing.mode': 'BASIC' } as Settings,
  updateSetting: vi.fn(),
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockUseSettings(),
}));

function renderInstanceTableRow(props: {
  instance: Omit<PaperlessInstanceListItem, 'apiToken'>;
  onEdit: (instance: Omit<PaperlessInstanceListItem, 'apiToken'>) => void;
  onDelete: (instance: Omit<PaperlessInstanceListItem, 'apiToken'>) => void;
  onImport: (instance: Omit<PaperlessInstanceListItem, 'apiToken'>) => void;
  isImporting: boolean;
  formatDate: (date: string) => string;
}) {
  return renderWithIntl(
    <table>
      <tbody>
        <InstanceTableRow {...props} />
      </tbody>
    </table>
  );
}

const mockInstance: Omit<PaperlessInstanceListItem, 'apiToken'> = {
  id: 'instance-123',
  name: 'Test Instance',
  apiUrl: 'http://localhost:8000',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

describe('InstanceTableRow', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnImport = vi.fn();
  const mockFormatDate = vi.fn(() => '2024-01-15');

  const defaultProps = {
    instance: mockInstance,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onImport: mockOnImport,
    isImporting: false,
    formatDate: mockFormatDate,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders instance name', () => {
    renderInstanceTableRow(defaultProps);
    expect(screen.getByText('Test Instance')).toBeInTheDocument();
  });

  it('renders instance API URL', () => {
    renderInstanceTableRow(defaultProps);
    expect(screen.getByText('http://localhost:8000')).toBeInTheDocument();
  });

  it('formats and displays creation date', () => {
    renderInstanceTableRow(defaultProps);
    expect(mockFormatDate).toHaveBeenCalledWith('2024-01-15T10:30:00Z');
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderInstanceTableRow(defaultProps);

    const editButton = screen.getByTestId('edit-instance-instance-123');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockInstance);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderInstanceTableRow(defaultProps);

    const deleteButton = screen.getByTestId('delete-instance-instance-123');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockInstance);
  });

  it('renders edit button with correct testid', () => {
    renderInstanceTableRow(defaultProps);
    expect(screen.getByTestId('edit-instance-instance-123')).toBeInTheDocument();
  });

  it('renders delete button with correct testid', () => {
    renderInstanceTableRow(defaultProps);
    expect(screen.getByTestId('delete-instance-instance-123')).toBeInTheDocument();
  });

  it('renders as table row', () => {
    const { container } = renderInstanceTableRow(defaultProps);
    expect(container.querySelector('tr')).toBeInTheDocument();
  });

  it('renders correct number of table cells', () => {
    const { container } = renderInstanceTableRow(defaultProps);
    const cells = container.querySelectorAll('td');
    expect(cells.length).toBe(4); // name, url, date, actions
  });

  it('renders import button with correct testid', () => {
    renderInstanceTableRow(defaultProps);
    expect(screen.getByTestId('import-instance-instance-123')).toBeInTheDocument();
  });

  it('calls onImport when import button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderInstanceTableRow(defaultProps);

    const importButton = screen.getByTestId('import-instance-instance-123');
    await user.click(importButton);

    expect(mockOnImport).toHaveBeenCalledWith(mockInstance);
  });

  it('disables import button when isImporting is true', () => {
    renderInstanceTableRow({ ...defaultProps, isImporting: true });

    const importButton = screen.getByTestId('import-instance-instance-123');
    expect(importButton).toBeDisabled();
  });

  it('enables import button when isImporting is false', () => {
    renderInstanceTableRow({ ...defaultProps, isImporting: false });

    const importButton = screen.getByTestId('import-instance-instance-123');
    expect(importButton).not.toBeDisabled();
  });

  it('does not call onImport when button is clicked while importing', async () => {
    const user = userEvent.setup({ delay: null });
    renderInstanceTableRow({ ...defaultProps, isImporting: true });

    const importButton = screen.getByTestId('import-instance-instance-123');
    await user.click(importButton);

    expect(mockOnImport).not.toHaveBeenCalled();
  });

  describe('share button', () => {
    it('does not render share button when sharing mode is BASIC', () => {
      mockUseSettings.mockReturnValue({
        settings: { 'security.sharing.mode': 'BASIC' } as Settings,
        updateSetting: vi.fn(),
      });
      renderInstanceTableRow(defaultProps);
      expect(screen.queryByTestId('share-instance-instance-123')).not.toBeInTheDocument();
    });

    it('renders share button when sharing mode is ADVANCED and onShare is provided', () => {
      mockUseSettings.mockReturnValue({
        settings: { 'security.sharing.mode': 'ADVANCED' } as Settings,
        updateSetting: vi.fn(),
      });
      renderInstanceTableRow({ ...defaultProps, onShare: vi.fn() });
      expect(screen.getByTestId('share-instance-instance-123')).toBeInTheDocument();
    });

    it('calls onShare when share button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      const mockOnShare = vi.fn();
      mockUseSettings.mockReturnValue({
        settings: { 'security.sharing.mode': 'ADVANCED' } as Settings,
        updateSetting: vi.fn(),
      });
      renderInstanceTableRow({ ...defaultProps, onShare: mockOnShare });

      const shareButton = screen.getByTestId('share-instance-instance-123');
      await user.click(shareButton);

      expect(mockOnShare).toHaveBeenCalledWith(mockInstance);
    });
  });
});
