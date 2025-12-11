import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormatDate, useFormatDateOnly } from './use-format-date';

vi.mock('next-intl', () => ({
  useFormatter: () => ({
    dateTime: (date: Date, options: Intl.DateTimeFormatOptions) =>
      date.toLocaleDateString('en-US', options),
  }),
}));

vi.mock('@/lib/format-date', () => ({
  formatDate: (dateString: string) => `formatted:${dateString}`,
}));

describe('useFormatDate', () => {
  it('returns a stable format function', () => {
    const { result } = renderHook(() => useFormatDate());

    expect(typeof result.current).toBe('function');
    expect(result.current('2024-01-15T10:00:00Z')).toBe('formatted:2024-01-15T10:00:00Z');
  });
});

describe('useFormatDateOnly', () => {
  it('returns a stable format function that formats date without time', () => {
    const { result } = renderHook(() => useFormatDateOnly());

    expect(typeof result.current).toBe('function');
    const formatted = result.current('2024-01-15T10:00:00Z');
    expect(formatted).toMatch(/01\/15\/2024/);
  });
});
