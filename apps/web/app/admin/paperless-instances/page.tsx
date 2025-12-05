'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Database } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useApi } from '@/lib/use-api';
import { useFormatDate } from '@/hooks/use-format-date';
import { getPaperlessInstances, postPaperlessInstancesByIdImport } from '@repo/api-client';
import { toast } from 'sonner';
import { TablePagination } from '@/components/table-pagination';

import type { PaperlessInstanceListItem } from '@repo/api-client';
import {
  InstanceTableSkeleton,
  InstanceTableRow,
  CreateInstanceDialog,
  EditInstanceDialog,
  DeleteInstanceDialog,
} from './_components';

export default function PaperlessInstancesPage() {
  const t = useTranslations('admin.paperlessInstances');
  const { showError } = useErrorDisplay('admin.paperlessInstances');
  const formatDate = useFormatDate();
  const router = useRouter();
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  const client = useApi();

  const [instances, setInstances] = useState<Omit<PaperlessInstanceListItem, 'apiToken'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInstance, setEditingInstance] = useState<Omit<
    PaperlessInstanceListItem,
    'apiToken'
  > | null>(null);
  const [deletingInstance, setDeletingInstance] = useState<Omit<
    PaperlessInstanceListItem,
    'apiToken'
  > | null>(null);
  const [importingInstanceId, setImportingInstanceId] = useState<string | null>(null);

  const loadInstances = useCallback(
    async (currentPage: number, currentLimit: number) => {
      setIsLoading(true);

      try {
        const response = await getPaperlessInstances({
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

        setInstances(response.data.items);
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

  const handleImport = useCallback(
    async (instance: Omit<PaperlessInstanceListItem, 'apiToken'>) => {
      setImportingInstanceId(instance.id);

      try {
        const response = await postPaperlessInstancesByIdImport({
          client,
          path: { id: instance.id },
        });

        if (response.error) {
          showError('importFailed');
          return;
        }

        toast.success(t('importSuccess', { count: response.data.imported }));
      } catch {
        showError('importFailed');
      } finally {
        setImportingInstanceId(null);
      }
    },
    [client, showError, t]
  );

  useEffect(() => {
    if (!isAuthLoading && currentUser?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    loadInstances(page, limit);
  }, [isAuthLoading, currentUser, router, loadInstances, page, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const reloadCurrentPage = () => {
    loadInstances(page, limit);
  };

  if (currentUser?.role !== 'ADMIN') {
    return null;
  }

  const renderTableContent = () => {
    if (isLoading) {
      return <InstanceTableSkeleton />;
    }

    return instances.map((instance) => (
      <InstanceTableRow
        key={instance.id}
        instance={instance}
        onEdit={setEditingInstance}
        onDelete={setDeletingInstance}
        onImport={handleImport}
        isImporting={importingInstanceId === instance.id}
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
              <Database className="h-8 w-8" />
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-2">{t('description')}</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('createInstance')}
          </Button>
        </div>

        {!isLoading && instances.length === 0 && total === 0 ? (
          <div className="text-muted-foreground py-12 text-center">{t('noInstances')}</div>
        ) : (
          <div className="bg-card rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('apiUrl')}</TableHead>
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

      <CreateInstanceDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={reloadCurrentPage}
      />

      <EditInstanceDialog
        open={!!editingInstance}
        onOpenChange={(open) => !open && setEditingInstance(null)}
        instance={editingInstance}
        onSuccess={reloadCurrentPage}
      />

      <DeleteInstanceDialog
        open={!!deletingInstance}
        onOpenChange={(open) => !open && setDeletingInstance(null)}
        instance={deletingInstance}
        onSuccess={reloadCurrentPage}
      />
    </AppShell>
  );
}
