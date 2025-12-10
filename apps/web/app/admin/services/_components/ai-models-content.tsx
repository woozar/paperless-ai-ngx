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
import { getAiModels } from '@repo/api-client';

import type { AiModelListItem } from '@repo/api-client';
import {
  ModelTableSkeleton,
  ModelTableRow,
  CreateModelDialog,
  EditModelDialog,
  DeleteModelDialog,
} from '../../ai-models/_components';
import { ShareDialog } from '@/components/sharing/share-dialog';

export function AiModelsContent() {
  const t = useTranslations('admin.aiModels');
  const { showError } = useErrorDisplay('admin.aiModels');
  const formatDate = useFormatDate();
  const client = useApi();

  const fetchModels = useCallback(
    async (page: number, limit: number): Promise<FetchResult<AiModelListItem>> => {
      const response = await getAiModels({
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
    items: models,
    isLoading,
    page,
    limit,
    total,
    totalPages,
    handlePageChange,
    handleLimitChange,
    reload,
  } = usePaginatedList({
    fetchFn: fetchModels,
    onError: () => showError('loadFailed'),
  });

  const columns: ColumnDefinition[] = useMemo(
    () => [
      { label: t('name') },
      { label: t('modelIdentifier') },
      { label: t('aiAccount') },
      { label: t('createdAt') },
      { label: t('actions'), align: 'right' },
    ],
    [t]
  );

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AiModelListItem | null>(null);
  const [deletingModel, setDeletingModel] = useState<AiModelListItem | null>(null);
  const [sharingModel, setSharingModel] = useState<AiModelListItem | null>(null);

  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleEditClose = useCallback((open: boolean) => !open && setEditingModel(null), []);
  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleDeleteClose = useCallback((open: boolean) => !open && setDeletingModel(null), []);
  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleShareClose = useCallback((open: boolean) => !open && setSharingModel(null), []);

  const renderTableContent = () => {
    if (isLoading) {
      return <ModelTableSkeleton />;
    }

    return models.map((model) => (
      <ModelTableRow
        key={model.id}
        model={model}
        onEdit={setEditingModel}
        onDelete={setDeletingModel}
        onShare={setSharingModel}
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
          {t('createModel')}
        </Button>
      </div>

      <PaginatedTable
        isEmpty={!isLoading && models.length === 0 && total === 0}
        isLoading={isLoading}
        emptyMessage={t('noModels')}
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

      <CreateModelDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={reload} />

      <EditModelDialog
        open={!!editingModel}
        onOpenChange={handleEditClose}
        model={editingModel}
        onSuccess={reload}
      />

      <DeleteModelDialog
        open={!!deletingModel}
        onOpenChange={handleDeleteClose}
        model={deletingModel}
        onSuccess={reload}
      />

      <ShareDialog
        open={!!sharingModel}
        onOpenChange={handleShareClose}
        resourceType="ai-models"
        resourceId={sharingModel?.id ?? ''}
        resourceName={sharingModel?.name ?? ''}
      />
    </>
  );
}
