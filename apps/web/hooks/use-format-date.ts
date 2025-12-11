import { useMemo } from 'react';
import { useFormatter } from 'next-intl';
import { formatDate } from '@/lib/format-date';

/**
 * Returns a stable formatDate callback for use with memo() components.
 * Includes date and time.
 */
export function useFormatDate() {
  const format = useFormatter();
  return useMemo(() => (dateString: string) => formatDate(dateString, format), [format]);
}

/**
 * Returns a stable formatDateOnly callback for use with memo() components.
 * Only includes date (no time).
 */
export function useFormatDateOnly() {
  const format = useFormatter();
  return useMemo(
    () => (dateString: string) =>
      format.dateTime(new Date(dateString), {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    [format]
  );
}
