import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { TablePagination } from './table-pagination';

// Mock Radix Select to make onValueChange testable
vi.mock('@/components/ui/select', async () => {
  const actual = await vi.importActual('@/components/ui/select');
  return {
    ...actual,
    Select: ({
      children,
      onValueChange,
      value,
    }: {
      children: React.ReactNode;
      onValueChange: (value: string) => void;
      value: string;
    }) => (
      <div data-testid="mock-select" data-value={value}>
        <select
          data-testid="select-native"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        {children}
      </div>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectValue: () => null,
    SelectContent: () => null,
    SelectItem: () => null,
  };
});

const messages = {
  common: {
    pagination: {
      showing: 'Showing {start} to {end} of {total}',
      rowsPerPage: 'Rows per page',
      pageOf: 'Page {page} of {totalPages}',
    },
  },
};

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('TablePagination', () => {
  const defaultProps = {
    page: 1,
    limit: 10,
    total: 25,
    totalPages: 3,
    onPageChange: vi.fn(),
    onLimitChange: vi.fn(),
  };

  it('renders pagination controls when total > min page size', () => {
    renderWithIntl(<TablePagination {...defaultProps} />);

    expect(screen.getByText('Showing 1 to 10 of 25')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('hides pagination when loading', () => {
    const { container } = renderWithIntl(<TablePagination {...defaultProps} isLoading={true} />);

    expect(container.firstChild).toBeNull();
  });

  it('hides pagination when total <= min page size (10)', () => {
    const { container } = renderWithIntl(
      <TablePagination {...defaultProps} total={10} totalPages={1} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows pagination when total > min page size (10)', () => {
    renderWithIntl(<TablePagination {...defaultProps} total={11} totalPages={2} />);

    expect(screen.getByText('Showing 1 to 10 of 11')).toBeInTheDocument();
  });

  describe('navigation buttons', () => {
    it('calls onPageChange(1) when clicking first page button', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      renderWithIntl(
        <TablePagination {...defaultProps} page={3} totalPages={5} onPageChange={onPageChange} />
      );

      await user.click(screen.getByTestId('pagination-first'));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('calls onPageChange(page - 1) when clicking previous button', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      renderWithIntl(
        <TablePagination {...defaultProps} page={3} totalPages={5} onPageChange={onPageChange} />
      );

      await user.click(screen.getByTestId('pagination-prev'));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange(page + 1) when clicking next button', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      renderWithIntl(
        <TablePagination {...defaultProps} page={3} totalPages={5} onPageChange={onPageChange} />
      );

      await user.click(screen.getByTestId('pagination-next'));
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('calls onPageChange(totalPages) when clicking last page button', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      renderWithIntl(
        <TablePagination {...defaultProps} page={3} totalPages={5} onPageChange={onPageChange} />
      );

      await user.click(screen.getByTestId('pagination-last'));
      expect(onPageChange).toHaveBeenCalledWith(5);
    });

    it('disables first and previous buttons on page 1', () => {
      renderWithIntl(<TablePagination {...defaultProps} page={1} totalPages={3} />);

      expect(screen.getByTestId('pagination-first')).toBeDisabled();
      expect(screen.getByTestId('pagination-prev')).toBeDisabled();
      expect(screen.getByTestId('pagination-next')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-last')).not.toBeDisabled();
    });

    it('disables next and last buttons on last page', () => {
      renderWithIntl(<TablePagination {...defaultProps} page={3} totalPages={3} />);

      expect(screen.getByTestId('pagination-first')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-prev')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-next')).toBeDisabled();
      expect(screen.getByTestId('pagination-last')).toBeDisabled();
    });
  });

  describe('limit selector', () => {
    it('calls onLimitChange when selecting a new limit', () => {
      const onLimitChange = vi.fn();

      renderWithIntl(<TablePagination {...defaultProps} onLimitChange={onLimitChange} />);

      fireEvent.change(screen.getByTestId('select-native'), { target: { value: '20' } });

      expect(onLimitChange).toHaveBeenCalledWith(20);
    });
  });

  describe('auto-navigate to valid page', () => {
    it('navigates to page 1 when on page 2 and total drops to fit on one page', () => {
      const onPageChange = vi.fn();

      // Simulate: User was on page 2 with 11 items, then deleted one item
      // Now total is 10, maxPage is 1, so navigate to page 1
      renderWithIntl(
        <TablePagination
          page={2}
          limit={10}
          total={10}
          totalPages={1}
          isLoading={false}
          onPageChange={onPageChange}
          onLimitChange={vi.fn()}
        />
      );

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('navigates to page 2 when on page 3 and total drops to fit on 2 pages', () => {
      const onPageChange = vi.fn();

      // Simulate: User was on page 3 with 25 items, then deleted items
      // Now total is 15, maxPage is 2, so navigate to page 2
      renderWithIntl(
        <TablePagination
          page={3}
          limit={10}
          total={15}
          totalPages={2}
          isLoading={false}
          onPageChange={onPageChange}
          onLimitChange={vi.fn()}
        />
      );

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('does not navigate when on a valid page', () => {
      const onPageChange = vi.fn();

      renderWithIntl(
        <TablePagination
          page={2}
          limit={10}
          total={15}
          totalPages={2}
          isLoading={false}
          onPageChange={onPageChange}
          onLimitChange={vi.fn()}
        />
      );

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('does not navigate when already on page 1', () => {
      const onPageChange = vi.fn();

      renderWithIntl(
        <TablePagination
          page={1}
          limit={10}
          total={10}
          totalPages={1}
          isLoading={false}
          onPageChange={onPageChange}
          onLimitChange={vi.fn()}
        />
      );

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('does not navigate while loading', () => {
      const onPageChange = vi.fn();

      renderWithIntl(
        <TablePagination
          page={3}
          limit={10}
          total={15}
          totalPages={2}
          isLoading={true}
          onPageChange={onPageChange}
          onLimitChange={vi.fn()}
        />
      );

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('does not navigate when total is 0', () => {
      const onPageChange = vi.fn();

      renderWithIntl(
        <TablePagination
          page={2}
          limit={10}
          total={0}
          totalPages={0}
          isLoading={false}
          onPageChange={onPageChange}
          onLimitChange={vi.fn()}
        />
      );

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });
});
