import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { PaginatedTable, type ColumnDefinition } from './paginated-table';

const defaultProps = {
  isEmpty: false,
  isLoading: false,
  emptyMessage: 'No items found',
  page: 1,
  limit: 10,
  total: 20,
  totalPages: 2,
  onPageChange: vi.fn(),
  onLimitChange: vi.fn(),
};

const basicColumns: ColumnDefinition[] = [
  { label: 'Name' },
  { label: 'Status' },
  { label: 'Actions', align: 'right' },
];

const columnsWithSort: ColumnDefinition[] = [
  { label: 'Name', sortKey: 'name' },
  { label: 'Date', sortKey: 'date' },
  { label: 'Actions', align: 'right' },
];

const columnsWithFilter: ColumnDefinition[] = [
  { label: 'Name', filterKey: 'name', filterPlaceholder: 'Search name...' },
  { label: 'Status' },
];

const columnsWithFilterNoPlaceholder: ColumnDefinition[] = [
  { label: 'Name', filterKey: 'name' },
  { label: 'Status' },
];

describe('PaginatedTable', () => {
  it('renders table with columns', () => {
    renderWithIntl(
      <PaginatedTable {...defaultProps} columns={basicColumns}>
        <tr>
          <td>Test Item</td>
          <td>Active</td>
          <td>Edit</td>
        </tr>
      </PaginatedTable>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('shows empty message when isEmpty is true and no filters', () => {
    renderWithIntl(
      <PaginatedTable {...defaultProps} isEmpty columns={basicColumns}>
        <tr />
      </PaginatedTable>
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('shows empty message in table when isEmpty is true with filters', () => {
    renderWithIntl(
      <PaginatedTable
        {...defaultProps}
        isEmpty
        columns={columnsWithFilter}
        filters={{ name: 'test' }}
        onFilterChange={vi.fn()}
      >
        <tr />
      </PaginatedTable>
    );

    // When filters are active, show table with empty message inside
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  describe('sorting', () => {
    it('renders sortable columns with sort button', () => {
      const onSortChange = vi.fn();
      renderWithIntl(
        <PaginatedTable
          {...defaultProps}
          columns={columnsWithSort}
          sort={null}
          onSortChange={onSortChange}
        >
          <tr>
            <td>Item</td>
            <td>2024-01-01</td>
            <td>Edit</td>
          </tr>
        </PaginatedTable>
      );

      expect(screen.getByRole('button', { name: /name/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /date/i })).toBeInTheDocument();
    });

    it('calls onSortChange when sort button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      const onSortChange = vi.fn();

      renderWithIntl(
        <PaginatedTable
          {...defaultProps}
          columns={columnsWithSort}
          sort={null}
          onSortChange={onSortChange}
        >
          <tr>
            <td>Item</td>
            <td>2024-01-01</td>
            <td>Edit</td>
          </tr>
        </PaginatedTable>
      );

      await user.click(screen.getByRole('button', { name: /name/i }));
      expect(onSortChange).toHaveBeenCalledWith('name');
    });

    it('shows ascending sort icon when sort direction is asc', () => {
      renderWithIntl(
        <PaginatedTable
          {...defaultProps}
          columns={columnsWithSort}
          sort={{ field: 'name', direction: 'asc' }}
          onSortChange={vi.fn()}
        >
          <tr>
            <td>Item</td>
            <td>2024-01-01</td>
            <td>Edit</td>
          </tr>
        </PaginatedTable>
      );

      // ChevronUp has a specific class pattern
      const nameButton = screen.getByRole('button', { name: /name/i });
      expect(nameButton.querySelector('svg')).toBeInTheDocument();
    });

    it('shows descending sort icon when sort direction is desc', () => {
      renderWithIntl(
        <PaginatedTable
          {...defaultProps}
          columns={columnsWithSort}
          sort={{ field: 'name', direction: 'desc' }}
          onSortChange={vi.fn()}
        >
          <tr>
            <td>Item</td>
            <td>2024-01-01</td>
            <td>Edit</td>
          </tr>
        </PaginatedTable>
      );

      const nameButton = screen.getByRole('button', { name: /name/i });
      expect(nameButton.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('filtering', () => {
    it('renders filter input with filter icon when column has filterKey', () => {
      renderWithIntl(
        <PaginatedTable
          {...defaultProps}
          columns={columnsWithFilter}
          filters={{}}
          onFilterChange={vi.fn()}
        >
          <tr>
            <td>Item</td>
            <td>Active</td>
          </tr>
        </PaginatedTable>
      );

      expect(screen.getByTestId('filter-name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search name...')).toBeInTheDocument();
      // Search icon is rendered as sibling to input
      const filterInput = screen.getByTestId('filter-name');
      const wrapper = filterInput.parentElement;
      expect(wrapper?.querySelector('svg')).toBeInTheDocument();
    });

    it('calls onFilterChange when filter input changes', async () => {
      const user = userEvent.setup({ delay: null });
      const onFilterChange = vi.fn();

      renderWithIntl(
        <PaginatedTable
          {...defaultProps}
          columns={columnsWithFilter}
          filters={{}}
          onFilterChange={onFilterChange}
        >
          <tr>
            <td>Item</td>
            <td>Active</td>
          </tr>
        </PaginatedTable>
      );

      await user.type(screen.getByTestId('filter-name'), 'test');
      expect(onFilterChange).toHaveBeenCalledWith('name', 't');
    });

    it('displays current filter value in input', () => {
      renderWithIntl(
        <PaginatedTable
          {...defaultProps}
          columns={columnsWithFilter}
          filters={{ name: 'existing value' }}
          onFilterChange={vi.fn()}
        >
          <tr>
            <td>Item</td>
            <td>Active</td>
          </tr>
        </PaginatedTable>
      );

      expect(screen.getByTestId('filter-name')).toHaveValue('existing value');
    });

    it('uses empty string as placeholder when filterPlaceholder is not provided', () => {
      renderWithIntl(
        <PaginatedTable
          {...defaultProps}
          columns={columnsWithFilterNoPlaceholder}
          filters={{}}
          onFilterChange={vi.fn()}
        >
          <tr>
            <td>Item</td>
            <td>Active</td>
          </tr>
        </PaginatedTable>
      );

      expect(screen.getByTestId('filter-name')).toHaveAttribute('placeholder', '');
    });

    it('handles undefined filters gracefully', () => {
      renderWithIntl(
        <PaginatedTable
          {...defaultProps}
          columns={columnsWithFilter}
          filters={undefined}
          onFilterChange={vi.fn()}
        >
          <tr>
            <td>Item</td>
            <td>Active</td>
          </tr>
        </PaginatedTable>
      );

      expect(screen.getByTestId('filter-name')).toHaveValue('');
    });
  });
});
