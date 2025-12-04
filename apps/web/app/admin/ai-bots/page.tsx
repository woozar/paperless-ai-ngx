'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Bot } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useApi } from '@/lib/use-api';
import { formatDate } from '@/lib/format-date';
import { getAiBots } from '@repo/api-client';

import type { AiBotListItem } from '@repo/api-client';
import {
  BotTableSkeleton,
  BotTableRow,
  CreateBotDialog,
  EditBotDialog,
  DeleteBotDialog,
} from './_components';

export default function AiBotsPage() {
  const t = useTranslations('admin.aiBots');
  const { showError } = useErrorDisplay('admin.aiBots');
  const format = useFormatter();
  const router = useRouter();
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  const client = useApi();

  const [bots, setBots] = useState<AiBotListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<AiBotListItem | null>(null);
  const [deletingBot, setDeletingBot] = useState<AiBotListItem | null>(null);

  const loadBots = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getAiBots({ client });

      if (response.error) {
        if (response.response.status === 403) {
          router.push('/');
          return;
        }
        showError('loadFailed');
        return;
      }

      setBots(response.data.bots);
    } catch {
      showError('loadFailed');
    } finally {
      setIsLoading(false);
    }
  }, [router, showError, client]);

  useEffect(() => {
    if (!isAuthLoading && currentUser?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    loadBots();
  }, [isAuthLoading, currentUser, router, loadBots]);

  if (currentUser?.role !== 'ADMIN') {
    return null;
  }

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
        formatDate={(dateString) => formatDate(dateString, format)}
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

        {!isLoading && bots.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center">{t('noBots')}</div>
        ) : (
          <div className="rounded-md border">
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
          </div>
        )}
      </div>

      <CreateBotDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={loadBots} />

      <EditBotDialog
        open={!!editingBot}
        onOpenChange={(open) => !open && setEditingBot(null)}
        bot={editingBot}
        onSuccess={loadBots}
      />

      <DeleteBotDialog
        open={!!deletingBot}
        onOpenChange={(open) => !open && setDeletingBot(null)}
        bot={deletingBot}
        onSuccess={loadBots}
      />
    </AppShell>
  );
}
