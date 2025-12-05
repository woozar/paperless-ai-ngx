import { useMemo } from 'react';
import { useFormatter } from 'next-intl';
import { formatDate } from '@/lib/format-date';

/**
 * Returns a stable formatDate callback for use with memo() components.
 */
export function useFormatDate() {
  const format = useFormatter();
  return useMemo(() => (dateString: string) => formatDate(dateString, format), [format]);
}
