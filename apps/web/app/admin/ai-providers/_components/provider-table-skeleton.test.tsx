import { describe, it, expect } from 'vitest';
import { ProviderTableSkeleton } from './provider-table-skeleton';
import { renderWithIntl } from '@/test-utils/render-with-intl';

function renderProviderTableSkeleton() {
  return renderWithIntl(
    <table>
      <tbody>
        <ProviderTableSkeleton />
      </tbody>
    </table>
  );
}

describe('ProviderTableSkeleton', () => {
  it('renders skeleton rows', () => {
    const { container } = renderProviderTableSkeleton();
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBe(3);
  });

  it('renders correct number of skeleton cells per row', () => {
    const { container } = renderProviderTableSkeleton();
    const firstRow = container.querySelector('tr');
    const cells = firstRow?.querySelectorAll('td');
    expect(cells?.length).toBe(6); // name, type, model, status, date, actions
  });
});
