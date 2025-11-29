import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Table, TableBody } from '@/components/ui/table';
import { UserTableRow } from './user-table-row';
import type { UserListItem } from '@repo/api-client';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/locales/en.json';

const mockUser: UserListItem = {
  id: 'user-123',
  username: 'testuser',
  role: 'DEFAULT',
  isActive: true,
  mustChangePassword: false,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockAdminUser: UserListItem = {
  id: 'admin-456',
  username: 'adminuser',
  role: 'ADMIN',
  isActive: true,
  mustChangePassword: false,
  createdAt: '2024-01-10T08:00:00Z',
  updatedAt: '2024-01-10T08:00:00Z',
};

const mockSuspendedUser: UserListItem = {
  id: 'suspended-789',
  username: 'suspendeduser',
  role: 'DEFAULT',
  isActive: false,
  mustChangePassword: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Table>
        <TableBody>{ui}</TableBody>
      </Table>
    </NextIntlClientProvider>
  );
};

describe('UserTableRow', () => {
  const defaultProps = {
    user: mockUser,
    currentUserId: 'different-user',
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onToggleStatus: vi.fn(),
    formatDate: (date: string) => new Date(date).toLocaleDateString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays username in the row', () => {
    renderWithProviders(<UserTableRow {...defaultProps} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('displays formatted date using provided formatter', () => {
    const formatDate = vi.fn().mockReturnValue('15.01.2024');
    renderWithProviders(<UserTableRow {...defaultProps} formatDate={formatDate} />);

    expect(formatDate).toHaveBeenCalledWith('2024-01-15T10:30:00Z');
    expect(screen.getByText('15.01.2024')).toBeInTheDocument();
  });

  it('calls onEdit with user when edit button is clicked', () => {
    const onEdit = vi.fn();
    renderWithProviders(<UserTableRow {...defaultProps} onEdit={onEdit} />);

    const editButton = screen.getByTestId(`edit-user-${mockUser.id}`);
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });

  it('calls onDelete with user when delete button is clicked', () => {
    const onDelete = vi.fn();
    renderWithProviders(<UserTableRow {...defaultProps} onDelete={onDelete} />);

    const deleteButton = screen.getByTestId(`delete-user-${mockUser.id}`);
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockUser);
  });

  it('calls onToggleStatus with user when status button is clicked', () => {
    const onToggleStatus = vi.fn();
    renderWithProviders(<UserTableRow {...defaultProps} onToggleStatus={onToggleStatus} />);

    const toggleButton = screen.getByTestId(`toggle-status-${mockUser.id}`);
    fireEvent.click(toggleButton);

    expect(onToggleStatus).toHaveBeenCalledWith(mockUser);
  });

  it('disables status toggle and delete buttons for current user', () => {
    renderWithProviders(<UserTableRow {...defaultProps} currentUserId={mockUser.id} />);

    const toggleButton = screen.getByTestId(`toggle-status-${mockUser.id}`);
    const editButton = screen.getByTestId(`edit-user-${mockUser.id}`);
    const deleteButton = screen.getByTestId(`delete-user-${mockUser.id}`);

    expect(toggleButton).toBeDisabled();
    expect(editButton).not.toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('enables all action buttons for non-current users', () => {
    renderWithProviders(<UserTableRow {...defaultProps} />);

    const toggleButton = screen.getByTestId(`toggle-status-${mockUser.id}`);
    const editButton = screen.getByTestId(`edit-user-${mockUser.id}`);
    const deleteButton = screen.getByTestId(`delete-user-${mockUser.id}`);

    expect(toggleButton).not.toBeDisabled();
    expect(editButton).not.toBeDisabled();
    expect(deleteButton).not.toBeDisabled();
  });

  it('renders suspend title for active users', () => {
    renderWithProviders(<UserTableRow {...defaultProps} />);
    const toggleButton = screen.getByTestId(`toggle-status-${mockUser.id}`);
    expect(toggleButton).toHaveAttribute('title', messages.admin.users.suspend);
  });

  it('renders activate title for suspended users', () => {
    renderWithProviders(<UserTableRow {...defaultProps} user={mockSuspendedUser} />);
    const toggleButton = screen.getByTestId(`toggle-status-${mockSuspendedUser.id}`);
    expect(toggleButton).toHaveAttribute('title', messages.admin.users.activate);
  });

  it('renders admin badge for admin users', () => {
    renderWithProviders(<UserTableRow {...defaultProps} user={mockAdminUser} />);
    expect(screen.getByText(messages.admin.users.admin)).toBeInTheDocument();
  });

  it('renders user badge for default role users', () => {
    renderWithProviders(<UserTableRow {...defaultProps} />);
    expect(screen.getByText(messages.admin.users.default)).toBeInTheDocument();
  });

  it('renders active status badge for active users', () => {
    renderWithProviders(<UserTableRow {...defaultProps} />);
    expect(screen.getByText(messages.admin.users.active)).toBeInTheDocument();
  });

  it('renders suspended status badge for suspended users', () => {
    renderWithProviders(<UserTableRow {...defaultProps} user={mockSuspendedUser} />);
    expect(screen.getByText(messages.admin.users.suspended)).toBeInTheDocument();
  });
});
