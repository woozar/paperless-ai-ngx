import type { useFormatter } from 'next-intl';

type Formatter = ReturnType<typeof useFormatter>;

/**
 * Global date formatting utility for consistent date display across the app
 */
export function formatDate(dateString: string, formatter: Formatter): string {
  return formatter.dateTime(new Date(dateString), {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  });
}
