'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Cpu } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useApi } from '@/lib/use-api';
import { useFormatDate } from '@/hooks/use-format-date';
import { getAiProviders } from '@repo/api-client';
import { TablePagination } from '@/components/table-pagination';

import type { AiProviderListItem } from '@repo/api-client';
import {
  ProviderTableSkeleton,
  ProviderTableRow,
  CreateProviderDialog,
  EditProviderDialog,
  DeleteProviderDialog,
} from './_components';
import { ShareDialog } from '@/components/sharing/share-dialog';

export default function AiProvidersPage() {
  const t = useTranslations('admin.aiProviders');
  const { showError } = useErrorDisplay('admin.aiProviders');
  const formatDate = useFormatDate();
  const router = useRouter();
  const { isLoading: isAuthLoading } = useAuth();
  const client = useApi();

  const [providers, setProviders] = useState<Omit<AiProviderListItem, 'apiKey'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Omit<AiProviderListItem, 'apiKey'> | null>(
    null
  );
  const [deletingProvider, setDeletingProvider] = useState<Omit<
    AiProviderListItem,
    'apiKey'
  > | null>(null);
  const [sharingProvider, setSharingProvider] = useState<Omit<AiProviderListItem, 'apiKey'> | null>(
    null
  );

  const loadProviders = useCallback(
    async (currentPage: number, currentLimit: number) => {
      setIsLoading(true);

      try {
        const response = await getAiProviders({
          client,
          query: { page: currentPage, limit: currentLimit },
        });

        if (response.error) {
          if (response.response.status === 403) {
            router.push('/');
            return;
          }
          showError('loadFailed');
          return;
        }

        setProviders(response.data.items);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } catch {
        showError('loadFailed');
      } finally {
        setIsLoading(false);
      }
    },
    [router, showError, client]
  );

  useEffect(() => {
    if (!isAuthLoading) {
      loadProviders(page, limit);
    }
  }, [isAuthLoading, loadProviders, page, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const reloadCurrentPage = () => {
    loadProviders(page, limit);
  };

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
        onShare={setSharingProvider}
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

        {!isLoading && providers.length === 0 && total === 0 ? (
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

      <CreateProviderDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={reloadCurrentPage}
      />

      <EditProviderDialog
        open={!!editingProvider}
        onOpenChange={(open) => !open && setEditingProvider(null)}
        provider={editingProvider}
        onSuccess={reloadCurrentPage}
      />

      <DeleteProviderDialog
        open={!!deletingProvider}
        onOpenChange={(open) => !open && setDeletingProvider(null)}
        provider={deletingProvider}
        onSuccess={reloadCurrentPage}
      />

      {sharingProvider && (
        <ShareDialog
          open={!!sharingProvider}
          onOpenChange={(open) => !open && setSharingProvider(null)}
          resourceType="ai-providers"
          resourceId={sharingProvider.id}
          resourceName={sharingProvider.name}
        />
      )}
    </AppShell>
  );
}
