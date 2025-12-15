'use client';

import { useTranslations } from 'next-intl';
import { Clock, Loader2, CheckCircle, XCircle, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { QueueStats } from '@repo/api-client';

type QueueStatsCardsProps = Readonly<{
  stats: QueueStats;
}>;

type StatConfig = {
  key: keyof QueueStats;
  icon: LucideIcon;
  color: 'amber' | 'blue' | 'green' | 'red';
  animate?: boolean;
};

const colorClasses = {
  amber: {
    card: 'from-amber-50 dark:from-amber-950/10',
    header: 'border-amber-100 bg-amber-50/50 dark:border-amber-900/20 dark:bg-amber-900/10',
    text: 'text-amber-700 dark:text-amber-300',
    icon: 'text-amber-500 dark:text-amber-400',
  },
  blue: {
    card: 'from-blue-50 dark:from-blue-950/10',
    header: 'border-blue-100 bg-blue-50/50 dark:border-blue-900/20 dark:bg-blue-900/10',
    text: 'text-blue-700 dark:text-blue-300',
    icon: 'text-blue-500 dark:text-blue-400',
  },
  green: {
    card: 'from-green-50 dark:from-green-950/10',
    header: 'border-green-100 bg-green-50/50 dark:border-green-900/20 dark:bg-green-900/10',
    text: 'text-green-700 dark:text-green-300',
    icon: 'text-green-500 dark:text-green-400',
  },
  red: {
    card: 'from-red-50 dark:from-red-950/10',
    header: 'border-red-100 bg-red-50/50 dark:border-red-900/20 dark:bg-red-900/10',
    text: 'text-red-700 dark:text-red-300',
    icon: 'text-red-500 dark:text-red-400',
  },
};

const statConfigs: StatConfig[] = [
  { key: 'pending', icon: Clock, color: 'amber' },
  { key: 'processing', icon: Loader2, color: 'blue', animate: true },
  { key: 'completed', icon: CheckCircle, color: 'green' },
  { key: 'failed', icon: XCircle, color: 'red' },
];

export function QueueStatsCards({ stats }: QueueStatsCardsProps) {
  const t = useTranslations('admin.queue.stats');

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statConfigs.map(({ key, icon: Icon, color, animate }) => {
        const colors = colorClasses[color];
        return (
          <Card
            key={key}
            data-testid={`queue-stats-${key}`}
            className={`dark:to-background overflow-hidden border-0 bg-linear-to-br to-white shadow-sm ${colors.card}`}
          >
            <CardHeader
              className={`flex flex-row items-center justify-between space-y-0 border-b px-4 py-3 ${colors.header}`}
            >
              <CardTitle className={`text-sm font-medium ${colors.text}`}>{t(key)}</CardTitle>
              <Icon className={`h-4 w-4 ${animate ? 'animate-spin' : ''} ${colors.icon}`} />
            </CardHeader>
            <CardContent className="px-4 py-4">
              <div className={`text-right text-2xl font-bold ${colors.text}`}>{stats[key]}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
