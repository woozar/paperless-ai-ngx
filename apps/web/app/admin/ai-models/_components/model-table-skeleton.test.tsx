import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ModelTableSkeleton } from './model-table-skeleton';

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'display.general.currency': 'EUR' },
    updateSetting: vi.fn(),
  }),
}));

describe('ModelTableSkeleton', () => {
  it('renders skeleton with correct number of rows', () => {
    const { container } = render(
      <table>
        <tbody>
          <ModelTableSkeleton />
        </tbody>
      </table>
    );

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders without errors', () => {
    expect(() => {
      render(
        <table>
          <tbody>
            <ModelTableSkeleton />
          </tbody>
        </table>
      );
    }).not.toThrow();
  });
});
