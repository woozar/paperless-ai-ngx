'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Database } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useApi } from '@/lib/use-api';
import { useFormatDate } from '@/hooks/use-format-date';
import { usePaginatedList, type FetchResult } from '@/hooks/use-paginated-list';
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
import { ShareDialog } from '@/components/sharing/share-dialog';

type InstanceItem = Omit<PaperlessInstanceListItem, 'apiToken'>;

export default function PaperlessInstancesPage() {
  const t = useTranslations('admin.paperlessInstances');
  const { showError } = useErrorDisplay('admin.paperlessInstances');
  const formatDate = useFormatDate();
  const client = useApi();

  const fetchInstances = useCallback(
    async (page: number, limit: number): Promise<FetchResult<InstanceItem>> => {
      const response = await getPaperlessInstances({
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
    items: instances,
    isLoading,
    page,
    limit,
    total,
    totalPages,
    handlePageChange,
    handleLimitChange,
    reload,
  } = usePaginatedList({
    fetchFn: fetchInstances,
    onError: () => showError('loadFailed'),
  });

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInstance, setEditingInstance] = useState<InstanceItem | null>(null);
  const [deletingInstance, setDeletingInstance] = useState<InstanceItem | null>(null);
  const [sharingInstance, setSharingInstance] = useState<InstanceItem | null>(null);
  const [importingInstanceId, setImportingInstanceId] = useState<string | null>(null);

  const handleImport = useCallback(
    async (instance: InstanceItem) => {
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
        onShare={setSharingInstance}
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

      <CreateInstanceDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={reload} />

      <EditInstanceDialog
        open={!!editingInstance}
        onOpenChange={(open) => !open && setEditingInstance(null)}
        instance={editingInstance}
        onSuccess={reload}
      />

      <DeleteInstanceDialog
        open={!!deletingInstance}
        onOpenChange={(open) => !open && setDeletingInstance(null)}
        instance={deletingInstance}
        onSuccess={reload}
      />

      {sharingInstance && (
        <ShareDialog
          open={!!sharingInstance}
          onOpenChange={(open) => !open && setSharingInstance(null)}
          resourceType="paperless-instances"
          resourceId={sharingInstance.id}
          resourceName={sharingInstance.name}
        />
      )}
    </AppShell>
  );
}
