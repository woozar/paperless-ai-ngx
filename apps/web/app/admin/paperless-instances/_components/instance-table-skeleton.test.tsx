import { describe, it, expect } from 'vitest';
import { InstanceTableSkeleton } from './instance-table-skeleton';
import { renderWithIntl } from '@/test-utils/render-with-intl';

function renderInstanceTableSkeleton() {
  return renderWithIntl(
    <table>
      <tbody>
        <InstanceTableSkeleton />
      </tbody>
    </table>
  );
}

describe('InstanceTableSkeleton', () => {
  it('renders skeleton rows', () => {
    const { container } = renderInstanceTableSkeleton();
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBe(3);
  });

  it('renders correct number of skeleton cells per row', () => {
    const { container } = renderInstanceTableSkeleton();
    const firstRow = container.querySelector('tr');
    const cells = firstRow?.querySelectorAll('td');
    expect(cells?.length).toBe(5); // name, url, status, date, actions
  });
});
