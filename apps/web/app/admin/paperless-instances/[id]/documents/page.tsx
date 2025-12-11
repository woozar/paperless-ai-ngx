'use client';

import { useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { PaginatedTable, type ColumnDefinition } from '@/components/paginated-table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ArrowLeft } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useApi } from '@/lib/use-api';
import { useFormatDateOnly } from '@/hooks/use-format-date';
import { usePaginatedList, type FetchResult, type SortConfig } from '@/hooks/use-paginated-list';
import { getPaperlessInstancesByIdDocuments } from '@repo/api-client';

import type { DocumentListItem } from '@repo/api-client';
import {
  DocumentTableSkeleton,
  DocumentTableRow,
  AnalyzeDocumentDialog,
  ViewResultDialog,
  PreviewDialog,
} from './_components';

type StatusFilter = 'all' | 'processed' | 'unprocessed';

export default function DocumentsPage() {
  const params = useParams<{ id: string }>();
  const instanceId = params.id;
  const t = useTranslations('admin.documents');
  const { showError } = useErrorDisplay('admin.documents');
  const formatDate = useFormatDateOnly();
  const router = useRouter();
  const client = useApi();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [filters, setFilters] = useState<Record<string, string>>({});

  type FetchParams = {
    instanceId: string;
    status: StatusFilter;
    search?: string;
  };

  const fetchDocuments = useCallback(
    async (
      page: number,
      limit: number,
      params: FetchParams,
      sort: SortConfig
    ): Promise<FetchResult<DocumentListItem>> => {
      const response = await getPaperlessInstancesByIdDocuments({
        client,
        path: { id: params.instanceId },
        query: {
          page,
          limit,
          status: params.status,
          search: params.search || undefined,
          sortField: sort?.field as 'title' | 'documentDate' | undefined,
          sortDirection: sort?.direction,
        },
      });
      if (response.error) {
        return { data: undefined, error: { status: response.response.status } };
      }
      return { data: response.data, error: undefined };
    },
    [client]
  );

  const fetchParams = useMemo<FetchParams>(
    () => ({
      instanceId,
      status: statusFilter,
      search: filters.search,
    }),
    [instanceId, statusFilter, filters.search]
  );

  const {
    items: documents,
    isLoading,
    page,
    limit,
    sort,
    total,
    totalPages,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    reload,
  } = usePaginatedList({
    fetchFn: fetchDocuments,
    onError: () => showError('loadFailed'),
    forbiddenRedirect: '/admin/paperless-instances',
    notFoundRedirect: '/admin/paperless-instances',
    params: fetchParams,
    initialSort: { field: 'documentDate', direction: 'desc' },
  });

  const columns: ColumnDefinition[] = useMemo(
    () => [
      {
        label: t('table.title'),
        sortKey: 'title',
        filterKey: 'search',
        filterPlaceholder: t('filter.searchTitle'),
      },
      { label: t('table.status') },
      { label: t('table.documentDate'), sortKey: 'documentDate' },
      { label: t('table.actions'), align: 'right' },
    ],
    [t]
  );

  const [analyzingDocument, setAnalyzingDocument] = useState<DocumentListItem | null>(null);
  const [viewingDocument, setViewingDocument] = useState<DocumentListItem | null>(null);
  const [previewingDocument, setPreviewingDocument] = useState<DocumentListItem | null>(null);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as StatusFilter);
    handlePageChange(1);
  };

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      handlePageChange(1);
    },
    [handlePageChange]
  );

  const renderTableContent = () => {
    if (isLoading) {
      return <DocumentTableSkeleton />;
    }

    return documents.map((doc) => (
      <DocumentTableRow
        key={doc.id}
        document={doc}
        onAnalyze={setAnalyzingDocument}
        onViewResult={setViewingDocument}
        onPreview={setPreviewingDocument}
        formatDate={formatDate}
      />
    ));
  };

  return (
    <AppShell>
      <div className="container mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/paperless-instances')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToInstances')}
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                <FileText className="h-8 w-8" />
                {t('title')}
              </h1>
              <p className="text-muted-foreground mt-2">{t('description')}</p>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <Tabs value={statusFilter} onValueChange={handleStatusFilterChange} className="mb-4">
          <TabsList>
            <TabsTrigger value="all" data-testid="filter-all">
              {t('filter.all')}
            </TabsTrigger>
            <TabsTrigger value="unprocessed" data-testid="filter-unprocessed">
              {t('filter.unprocessed')}
            </TabsTrigger>
            <TabsTrigger value="processed" data-testid="filter-processed">
              {t('filter.processed')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <PaginatedTable
          isEmpty={!isLoading && documents.length === 0 && total === 0}
          isLoading={isLoading}
          emptyMessage={t('noDocuments')}
          columns={columns}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          sort={sort}
          onSortChange={handleSortChange}
          filters={filters}
          onFilterChange={handleFilterChange}
        >
          {renderTableContent()}
        </PaginatedTable>
      </div>

      <AnalyzeDocumentDialog
        open={!!analyzingDocument}
        onOpenChange={(open) => !open && setAnalyzingDocument(null)}
        document={analyzingDocument}
        instanceId={instanceId}
        onSuccess={reload}
      />

      <ViewResultDialog
        open={!!viewingDocument}
        onOpenChange={(open) => !open && setViewingDocument(null)}
        document={viewingDocument}
        instanceId={instanceId}
      />

      <PreviewDialog
        open={!!previewingDocument}
        onOpenChange={(open) => !open && setPreviewingDocument(null)}
        document={previewingDocument}
        instanceId={instanceId}
      />
    </AppShell>
  );
}
