'use client';

import { useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { PaginatedTable, type ColumnDefinition } from '@/components/paginated-table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TableCell, TableRow } from '@/components/ui/table';
import { ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useApi } from '@/lib/use-api';
import { useFormatDate } from '@/hooks/use-format-date';
import { usePaginatedList, type FetchResult, type SortConfig } from '@/hooks/use-paginated-list';
import {
  getPaperlessInstancesByIdQueue,
  postPaperlessInstancesByIdQueueBulkRetry,
  deletePaperlessInstancesByIdQueueBulkCompleted,
} from '@repo/api-client';

import type { ProcessingQueueItem, QueueStats } from '@repo/api-client';
import { QueueTableSkeleton, QueueTableRow, QueueStatsCards } from './_components';

type StatusFilter = 'all' | 'pending' | 'processing' | 'completed' | 'failed';

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export default function QueuePage() {
  const params = useParams<{ id: string }>();
  const instanceId = params.id;
  const t = useTranslations('admin.queue');
  const { showError, showSuccess } = useErrorDisplay('admin.queue');
  const formatDateTime = useFormatDate();
  const router = useRouter();
  const client = useApi();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [stats, setStats] = useState<QueueStats>({
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  });
  const [isBulkRetrying, setIsBulkRetrying] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  type FetchParams = {
    instanceId: string;
    status: StatusFilter;
  };

  const fetchQueueItems = useCallback(
    async (
      page: number,
      limit: number,
      params: FetchParams,
      _sort: SortConfig
    ): Promise<FetchResult<ProcessingQueueItem>> => {
      const response = await getPaperlessInstancesByIdQueue({
        client,
        path: { id: params.instanceId },
        query: {
          status: params.status === 'all' ? undefined : params.status,
          page,
          limit,
        },
      });

      if (response.error) {
        return { data: undefined, error: { status: response.response.status } };
      }

      setStats(response.data.stats);

      return {
        data: response.data,
        error: undefined,
      };
    },
    [client]
  );

  const fetchParams = useMemo<FetchParams>(
    () => ({
      instanceId,
      status: statusFilter,
    }),
    [instanceId, statusFilter]
  );

  const {
    items,
    total,
    totalPages,
    page,
    limit,
    isLoading,
    handlePageChange,
    handleLimitChange,
    reload,
  } = usePaginatedList<ProcessingQueueItem, FetchParams>({
    fetchFn: fetchQueueItems,
    onError: () => showError('loadFailed'),
    forbiddenRedirect: '/admin/paperless-instances',
    notFoundRedirect: '/admin/paperless-instances',
    params: fetchParams,
    initialLimit: 20,
  });

  const handleBulkRetry = async () => {
    setIsBulkRetrying(true);
    try {
      const response = await postPaperlessInstancesByIdQueueBulkRetry({
        client,
        path: { id: instanceId },
      });

      if (response.error) {
        showError('bulkRetryFailed');
      } else {
        showSuccess('bulkRetrySuccess', { count: response.data.retriedCount });
        reload();
      }
    } finally {
      setIsBulkRetrying(false);
    }
  };

  const handleBulkDeleteCompleted = async () => {
    setIsBulkDeleting(true);
    try {
      const response = await deletePaperlessInstancesByIdQueueBulkCompleted({
        client,
        path: { id: instanceId },
      });

      if (response.error) {
        showError('bulkDeleteFailed');
      } else {
        showSuccess('bulkDeleteSuccess', { count: response.data.deletedCount });
        reload();
      }
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const columns: ColumnDefinition[] = useMemo(
    () => [
      { label: t('table.document') },
      { label: t('table.status') },
      { label: t('table.attempts') },
      { label: t('table.aiBot') },
      { label: t('table.scheduledFor') },
      { label: t('table.actions'), align: 'right' },
    ],
    [t]
  );

  const renderTableContent = () => {
    if (isLoading) {
      return <QueueTableSkeleton />;
    }

    return items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.documentTitle ?? `ID: ${item.paperlessDocumentId}`}</TableCell>
        <TableCell>
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[item.status]}`}
          >
            {t(`status.${item.status}`)}
          </span>
        </TableCell>
        <TableCell>{`${item.attempts}/${item.maxAttempts}`}</TableCell>
        <TableCell>{item.aiBotName ?? '-'}</TableCell>
        <TableCell>{formatDateTime(item.scheduledFor)}</TableCell>
        <TableCell className="text-right">
          <QueueTableRow item={item} instanceId={instanceId} onRefresh={reload} />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin/paperless-instances')}
              data-testid="queue-back-button"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{t('title')}</h1>
              <p className="text-muted-foreground text-sm">{t('description')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {stats.failed > 0 && (
              <Button
                variant="outline"
                onClick={handleBulkRetry}
                disabled={isBulkRetrying}
                data-testid="queue-bulk-retry-button"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isBulkRetrying ? 'animate-spin' : ''}`} />
                {t('bulkRetry')}
              </Button>
            )}
            {stats.completed > 0 && (
              <Button
                variant="outline"
                onClick={handleBulkDeleteCompleted}
                disabled={isBulkDeleting}
                data-testid="queue-bulk-delete-button"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('clearCompleted')}
              </Button>
            )}
          </div>
        </div>

        <QueueStatsCards stats={stats} />

        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <TabsList>
            <TabsTrigger value="all" data-testid="queue-filter-all">
              {t('filter.all')} ({stats.pending + stats.processing + stats.completed + stats.failed}
              )
            </TabsTrigger>
            <TabsTrigger value="pending" data-testid="queue-filter-pending">
              {t('filter.pending')} ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="processing" data-testid="queue-filter-processing">
              {t('filter.processing')} ({stats.processing})
            </TabsTrigger>
            <TabsTrigger value="failed" data-testid="queue-filter-failed">
              {t('filter.failed')} ({stats.failed})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="queue-filter-completed">
              {t('filter.completed')} ({stats.completed})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <PaginatedTable
          isEmpty={!isLoading && items.length === 0 && total === 0}
          isLoading={isLoading}
          emptyMessage={t('noItems')}
          columns={columns}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        >
          {renderTableContent()}
        </PaginatedTable>
      </div>
    </AppShell>
  );
}
