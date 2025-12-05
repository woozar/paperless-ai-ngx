import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table, TableBody } from '@/components/ui/table';
import { UserTableSkeleton } from './user-table-skeleton';

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'security.sharing.mode': 'BASIC' },
    isLoading: false,
  }),
}));

const renderWithTable = (ui: React.ReactNode) => {
  return render(
    <Table>
      <TableBody>{ui}</TableBody>
    </Table>
  );
};

describe('UserTableSkeleton', () => {
  it('renders default 5 skeleton rows', () => {
    renderWithTable(<UserTableSkeleton />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(5);
  });

  it('renders custom number of rows when specified', () => {
    renderWithTable(<UserTableSkeleton rows={3} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
  });

  it('renders correct number of cells per row (5 columns)', () => {
    renderWithTable(<UserTableSkeleton rows={1} />);
    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(5);
  });

  it('applies staggered animation delays to rows', () => {
    const { container } = renderWithTable(<UserTableSkeleton rows={3} />);
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');

    const delays = new Set<string>();
    skeletons.forEach((skeleton) => {
      const style = skeleton.getAttribute('style');
      if (style) delays.add(style);
    });

    expect(delays.size).toBeGreaterThan(1);
  });
});
