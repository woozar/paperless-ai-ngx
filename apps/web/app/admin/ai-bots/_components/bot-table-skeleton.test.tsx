import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BotTableSkeleton } from './bot-table-skeleton';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockUseSettings = vi.fn();

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockUseSettings(),
}));

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
  beforeEach(() => {
    mockUseSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'BASIC' },
      isLoading: false,
    });
  });

  it('renders skeleton rows', () => {
    const { container } = renderBotTableSkeleton();
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBe(3);
  });

  it('renders 2 action buttons in BASIC mode', () => {
    const { container } = renderBotTableSkeleton();
    const firstRow = container.querySelector('tr');
    const actionButtons = firstRow?.querySelectorAll('td:last-child .h-9');
    expect(actionButtons?.length).toBe(2);
  });

  it('renders 3 action buttons in ADVANCED mode', () => {
    mockUseSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'ADVANCED' },
      isLoading: false,
    });

    const { container } = renderBotTableSkeleton();
    const firstRow = container.querySelector('tr');
    const actionButtons = firstRow?.querySelectorAll('td:last-child .h-9');
    expect(actionButtons?.length).toBe(3);
  });
});
