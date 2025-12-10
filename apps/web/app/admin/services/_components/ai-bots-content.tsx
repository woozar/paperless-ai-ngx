'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { PaginatedTable, type ColumnDefinition } from '@/components/paginated-table';
import { Plus } from 'lucide-react';
import { useApi } from '@/lib/use-api';
import { useFormatDate } from '@/hooks/use-format-date';
import { usePaginatedList, type FetchResult } from '@/hooks/use-paginated-list';
import { getAiBots } from '@repo/api-client';

import type { AiBotListItem } from '@repo/api-client';
import {
  BotTableSkeleton,
  BotTableRow,
  CreateBotDialog,
  EditBotDialog,
  DeleteBotDialog,
} from '../../ai-bots/_components';
import { ShareDialog } from '@/components/sharing/share-dialog';

export function AiBotsContent() {
  const t = useTranslations('admin.aiBots');
  const { showError } = useErrorDisplay('admin.aiBots');
  const formatDate = useFormatDate();
  const client = useApi();

  const fetchBots = useCallback(
    async (page: number, limit: number): Promise<FetchResult<AiBotListItem>> => {
      const response = await getAiBots({
        client,
        query: { page, limit },
      });
      if (response.error) {
        return { data: undefined, error: { status: response.response.status } };
      }
      return { data: response.data, error: undefined };
    },
    [client]
  );

  const {
    items: bots,
    isLoading,
    page,
    limit,
    total,
    totalPages,
    handlePageChange,
    handleLimitChange,
    reload,
  } = usePaginatedList({
    fetchFn: fetchBots,
    onError: () => showError('loadFailed'),
  });

  const columns: ColumnDefinition[] = useMemo(
    () => [
      { label: t('name') },
      { label: t('aiModel') },
      { label: t('createdAt') },
      { label: t('actions'), align: 'right' },
    ],
    [t]
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<AiBotListItem | null>(null);
  const [deletingBot, setDeletingBot] = useState<AiBotListItem | null>(null);
  const [sharingBot, setSharingBot] = useState<AiBotListItem | null>(null);

  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleEditClose = useCallback((open: boolean) => !open && setEditingBot(null), []);
  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleDeleteClose = useCallback((open: boolean) => !open && setDeletingBot(null), []);
  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleShareClose = useCallback((open: boolean) => !open && setSharingBot(null), []);

  const renderTableContent = () => {
    if (isLoading) {
      return <BotTableSkeleton />;
    }

    return bots.map((bot) => (
      <BotTableRow
        key={bot.id}
        bot={bot}
        onEdit={setEditingBot}
        onDelete={setDeletingBot}
        onShare={setSharingBot}
        formatDate={formatDate}
      />
    ));
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">{t('description')}</p>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('createBot')}
        </Button>
      </div>

      <PaginatedTable
        isEmpty={!isLoading && bots.length === 0 && total === 0}
        isLoading={isLoading}
        emptyMessage={t('noBots')}
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

      <CreateBotDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={reload} />

      <EditBotDialog
        open={!!editingBot}
        onOpenChange={handleEditClose}
        bot={editingBot}
        onSuccess={reload}
      />

      <DeleteBotDialog
        open={!!deletingBot}
        onOpenChange={handleDeleteClose}
        bot={deletingBot}
        onSuccess={reload}
      />

      {/* v8 ignore next 2 -- @preserve - conditional rendering */}
      {sharingBot && (
        <ShareDialog
          open={!!sharingBot}
          onOpenChange={handleShareClose}
          resourceType="ai-bots"
          resourceId={sharingBot.id}
          resourceName={sharingBot.name}
        />
      )}
    </>
  );
}
