import { describe, it, expect } from 'vitest';
import { BotTableSkeleton } from './bot-table-skeleton';
import { renderWithIntl } from '@/test-utils/render-with-intl';

function renderBotTableSkeleton() {
  return renderWithIntl(
    <table>
      <tbody>
        <BotTableSkeleton />
      </tbody>
    </table>
  );
}

describe('BotTableSkeleton', () => {
  it('renders skeleton rows', () => {
    const { container } = renderBotTableSkeleton();
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBe(3);
  });

  it('renders correct number of skeleton cells per row', () => {
    const { container } = renderBotTableSkeleton();
    const firstRow = container.querySelector('tr');
    const cells = firstRow?.querySelectorAll('td');
    expect(cells?.length).toBe(5); // name, provider, status, date, actions
  });
});
