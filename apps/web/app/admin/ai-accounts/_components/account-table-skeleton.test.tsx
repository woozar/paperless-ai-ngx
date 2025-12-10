import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountTableSkeleton } from './account-table-skeleton';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockUseSettings = vi.fn();

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockUseSettings(),
}));

function renderAccountTableSkeleton() {
  return renderWithIntl(
    <table>
      <tbody>
        <AccountTableSkeleton />
      </tbody>
    </table>
  );
}

describe('AccountTableSkeleton', () => {
  beforeEach(() => {
    mockUseSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'BASIC' },
      isLoading: false,
    });
  });

  it('renders skeleton rows', () => {
    const { container } = renderAccountTableSkeleton();
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBe(3);
  });

  it('renders 2 action buttons in BASIC mode', () => {
    const { container } = renderAccountTableSkeleton();
    const firstRow = container.querySelector('tr');
    const actionButtons = firstRow?.querySelectorAll('td:last-child .h-9');
    expect(actionButtons?.length).toBe(2);
  });

  it('renders 3 action buttons in ADVANCED mode', () => {
    mockUseSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'ADVANCED' },
      isLoading: false,
    });

    const { container } = renderAccountTableSkeleton();
    const firstRow = container.querySelector('tr');
    const actionButtons = firstRow?.querySelectorAll('td:last-child .h-9');
    expect(actionButtons?.length).toBe(3);
  });
});
