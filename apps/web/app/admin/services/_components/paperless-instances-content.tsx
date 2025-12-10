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
import { getPaperlessInstances, postPaperlessInstancesByIdImport } from '@repo/api-client';
import { toast } from 'sonner';

import type { PaperlessInstanceListItem } from '@repo/api-client';
import {
  InstanceTableSkeleton,
  InstanceTableRow,
  CreateInstanceDialog,
  EditInstanceDialog,
  DeleteInstanceDialog,
} from '../../paperless-instances/_components';
import { ShareDialog } from '@/components/sharing/share-dialog';

type InstanceItem = Omit<PaperlessInstanceListItem, 'apiToken'>;

export function PaperlessInstancesContent() {
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

  const columns: ColumnDefinition[] = useMemo(
    () => [
      { label: t('name') },
      { label: t('apiUrl') },
      { label: t('createdAt') },
      { label: t('actions'), align: 'right' },
    ],
    [t]
  );

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInstance, setEditingInstance] = useState<InstanceItem | null>(null);
  const [deletingInstance, setDeletingInstance] = useState<InstanceItem | null>(null);
  const [sharingInstance, setSharingInstance] = useState<InstanceItem | null>(null);
  const [importingInstanceId, setImportingInstanceId] = useState<string | null>(null);

  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleEditClose = useCallback((open: boolean) => !open && setEditingInstance(null), []);
  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleDeleteClose = useCallback((open: boolean) => !open && setDeletingInstance(null), []);
  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleShareClose = useCallback((open: boolean) => !open && setSharingInstance(null), []);

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
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">{t('description')}</p>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('createInstance')}
        </Button>
      </div>

      <PaginatedTable
        isEmpty={!isLoading && instances.length === 0 && total === 0}
        isLoading={isLoading}
        emptyMessage={t('noInstances')}
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

      <CreateInstanceDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={reload} />

      <EditInstanceDialog
        open={!!editingInstance}
        onOpenChange={handleEditClose}
        instance={editingInstance}
        onSuccess={reload}
      />

      <DeleteInstanceDialog
        open={!!deletingInstance}
        onOpenChange={handleDeleteClose}
        instance={deletingInstance}
        onSuccess={reload}
      />

      {/* v8 ignore next 2 -- @preserve - conditional rendering */}
      {sharingInstance && (
        <ShareDialog
          open={!!sharingInstance}
          onOpenChange={handleShareClose}
          resourceType="paperless-instances"
          resourceId={sharingInstance.id}
          resourceName={sharingInstance.name}
        />
      )}
    </>
  );
}
