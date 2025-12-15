import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InstanceTableSkeleton } from './instance-table-skeleton';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockUseSettings = vi.fn();

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockUseSettings(),
}));

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
  beforeEach(() => {
    mockUseSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'BASIC' },
      isLoading: false,
    });
  });

  it('renders skeleton rows', () => {
    const { container } = renderInstanceTableSkeleton();
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBe(3);
  });

  it('renders 5 action buttons in BASIC mode', () => {
    const { container } = renderInstanceTableSkeleton();
    const firstRow = container.querySelector('tr');
    const actionButtons = firstRow?.querySelectorAll('td:last-child .h-9');
    expect(actionButtons?.length).toBe(5);
  });

  it('renders 6 action buttons in ADVANCED mode', () => {
    mockUseSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'ADVANCED' },
      isLoading: false,
    });

    const { container } = renderInstanceTableSkeleton();
    const firstRow = container.querySelector('tr');
    const actionButtons = firstRow?.querySelectorAll('td:last-child .h-9');
    expect(actionButtons?.length).toBe(6);
  });
});
