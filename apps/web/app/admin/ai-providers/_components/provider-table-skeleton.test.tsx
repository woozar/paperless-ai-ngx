import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProviderTableSkeleton } from './provider-table-skeleton';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockUseSettings = vi.fn();

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => mockUseSettings(),
}));

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
  beforeEach(() => {
    mockUseSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'BASIC' },
      isLoading: false,
    });
  });

  it('renders skeleton rows', () => {
    const { container } = renderProviderTableSkeleton();
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBe(3);
  });

  it('renders 2 action buttons in BASIC mode', () => {
    const { container } = renderProviderTableSkeleton();
    const firstRow = container.querySelector('tr');
    const actionButtons = firstRow?.querySelectorAll('td:last-child .h-9');
    expect(actionButtons?.length).toBe(2);
  });

  it('renders 3 action buttons in ADVANCED mode', () => {
    mockUseSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'ADVANCED' },
      isLoading: false,
    });

    const { container } = renderProviderTableSkeleton();
    const firstRow = container.querySelector('tr');
    const actionButtons = firstRow?.querySelectorAll('td:last-child .h-9');
    expect(actionButtons?.length).toBe(3);
  });
});
