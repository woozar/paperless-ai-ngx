import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table, TableBody } from '@/components/ui/table';
import { QueueTableSkeleton } from './queue-table-skeleton';

const renderWithTable = (ui: React.ReactNode) => {
  return render(
    <Table>
      <TableBody>{ui}</TableBody>
    </Table>
  );
};

describe('QueueTableSkeleton', () => {
  it('renders 5 skeleton rows', () => {
    renderWithTable(<QueueTableSkeleton />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(5);
  });

  it('renders 6 cells per row (document, status, attempts, aiBot, scheduledFor, actions)', () => {
    renderWithTable(<QueueTableSkeleton />);
    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(30); // 5 rows * 6 columns
  });

  it('renders skeleton elements inside cells', () => {
    const { container } = renderWithTable(<QueueTableSkeleton />);
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
