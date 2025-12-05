'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Cpu } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useApi } from '@/lib/use-api';
import { formatDate } from '@/lib/format-date';
import { getAiProviders } from '@repo/api-client';

import type { AiProviderListItem } from '@repo/api-client';
import {
  ProviderTableSkeleton,
  ProviderTableRow,
  CreateProviderDialog,
  EditProviderDialog,
  DeleteProviderDialog,
} from './_components';

export default function AiProvidersPage() {
  const t = useTranslations('admin.aiProviders');
  const { showError } = useErrorDisplay('admin.aiProviders');
  const format = useFormatter();
  const router = useRouter();
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  const client = useApi();

  const [providers, setProviders] = useState<Omit<AiProviderListItem, 'apiKey'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Omit<AiProviderListItem, 'apiKey'> | null>(
    null
  );
  const [deletingProvider, setDeletingProvider] = useState<Omit<
    AiProviderListItem,
    'apiKey'
  > | null>(null);

  const loadProviders = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getAiProviders({ client });

      if (response.error) {
        if (response.response.status === 403) {
          router.push('/');
          return;
        }
        showError('loadFailed');
        return;
      }

      setProviders(response.data.providers);
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
    loadProviders();
  }, [isAuthLoading, currentUser, router, loadProviders]);

  if (currentUser?.role !== 'ADMIN') {
    return null;
  }

  const renderTableContent = () => {
    if (isLoading) {
      return <ProviderTableSkeleton />;
    }

    return providers.map((provider) => (
      <ProviderTableRow
        key={provider.id}
        provider={provider}
        onEdit={setEditingProvider}
        onDelete={setDeletingProvider}
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
              <Cpu className="h-8 w-8" />
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-2">{t('description')}</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('createProvider')}
          </Button>
        </div>

        {!isLoading && providers.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center">{t('noProviders')}</div>
        ) : (
          <div className="bg-card rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('provider')}</TableHead>
                  <TableHead>{t('model')}</TableHead>
                  <TableHead>{t('createdAt')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderTableContent()}</TableBody>
            </Table>
          </div>
        )}
      </div>

      <CreateProviderDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={loadProviders}
      />

      <EditProviderDialog
        open={!!editingProvider}
        onOpenChange={(open) => !open && setEditingProvider(null)}
        provider={editingProvider}
        onSuccess={loadProviders}
      />

      <DeleteProviderDialog
        open={!!deletingProvider}
        onOpenChange={(open) => !open && setDeletingProvider(null)}
        provider={deletingProvider}
        onSuccess={loadProviders}
      />
    </AppShell>
  );
}
