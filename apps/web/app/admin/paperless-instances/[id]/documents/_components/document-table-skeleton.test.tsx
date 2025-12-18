import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentTableSkeleton } from './document-table-skeleton';

vi.mock('@/components/table-skeleton', () => ({
  TableSkeleton: ({
    columns,
    baseButtonCount,
  }: {
    columns: unknown[];
    baseButtonCount: number;
  }) => (
    <div data-testid="table-skeleton" data-columns={columns.length} data-buttons={baseButtonCount}>
      Table Skeleton
    </div>
  ),
}));

describe('DocumentTableSkeleton', () => {
  it('renders TableSkeleton with correct column count', () => {
    render(<DocumentTableSkeleton />);

    const skeleton = screen.getByTestId('table-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.dataset.columns).toBe('4');
  });

  it('renders TableSkeleton with one action button', () => {
    render(<DocumentTableSkeleton />);

    const skeleton = screen.getByTestId('table-skeleton');
    expect(skeleton.dataset.buttons).toBe('1');
  });
});
