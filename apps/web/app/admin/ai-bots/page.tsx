'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Bot } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useApi } from '@/lib/use-api';
import { useFormatDate } from '@/hooks/use-format-date';
import { usePaginatedList, type FetchResult } from '@/hooks/use-paginated-list';
import { getAiBots } from '@repo/api-client';
import { TablePagination } from '@/components/table-pagination';

import type { AiBotListItem } from '@repo/api-client';
import {
  BotTableSkeleton,
  BotTableRow,
  CreateBotDialog,
  EditBotDialog,
  DeleteBotDialog,
} from './_components';
import { ShareDialog } from '@/components/sharing/share-dialog';

export default function AiBotsPage() {
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

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<AiBotListItem | null>(null);
  const [deletingBot, setDeletingBot] = useState<AiBotListItem | null>(null);
  const [sharingBot, setSharingBot] = useState<AiBotListItem | null>(null);

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
    <AppShell>
      <div className="container mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              <Bot className="h-8 w-8" />
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-2">{t('description')}</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('createBot')}
          </Button>
        </div>

        {!isLoading && bots.length === 0 && total === 0 ? (
          <div className="text-muted-foreground py-12 text-center">{t('noBots')}</div>
        ) : (
          <div className="bg-card rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('aiProvider')}</TableHead>
                  <TableHead>{t('createdAt')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderTableContent()}</TableBody>
            </Table>
            <TablePagination
              page={page}
              limit={limit}
              total={total}
              totalPages={totalPages}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </div>
        )}
      </div>

      <CreateBotDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={reload} />

      <EditBotDialog
        open={!!editingBot}
        onOpenChange={(open) => !open && setEditingBot(null)}
        bot={editingBot}
        onSuccess={reload}
      />

      <DeleteBotDialog
        open={!!deletingBot}
        onOpenChange={(open) => !open && setDeletingBot(null)}
        bot={deletingBot}
        onSuccess={reload}
      />

      {sharingBot && (
        <ShareDialog
          open={!!sharingBot}
          onOpenChange={(open) => !open && setSharingBot(null)}
          resourceType="ai-bots"
          resourceId={sharingBot.id}
          resourceName={sharingBot.name}
        />
      )}
    </AppShell>
  );
}
