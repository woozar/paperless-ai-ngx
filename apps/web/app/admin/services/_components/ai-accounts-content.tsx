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
import { getAiAccounts } from '@repo/api-client';

import type { AiAccountListItem } from '@repo/api-client';
import {
  AccountTableSkeleton,
  AccountTableRow,
  CreateAccountDialog,
  EditAccountDialog,
  DeleteAccountDialog,
} from '../../ai-accounts/_components';
import { ShareDialog } from '@/components/sharing/share-dialog';

type AccountItem = Omit<AiAccountListItem, 'apiKey'>;

export function AiAccountsContent() {
  const t = useTranslations('admin.aiAccounts');
  const { showError } = useErrorDisplay('admin.aiAccounts');
  const formatDate = useFormatDate();
  const client = useApi();

  const fetchAccounts = useCallback(
    async (page: number, limit: number): Promise<FetchResult<AccountItem>> => {
      const response = await getAiAccounts({
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
    items: accounts,
    isLoading,
    page,
    limit,
    total,
    totalPages,
    handlePageChange,
    handleLimitChange,
    reload,
  } = usePaginatedList({
    fetchFn: fetchAccounts,
    onError: () => showError('loadFailed'),
  });

  const columns: ColumnDefinition[] = useMemo(
    () => [
      { label: t('name') },
      { label: t('provider') },
      { label: t('createdAt') },
      { label: t('actions'), align: 'right' },
    ],
    [t]
  );

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountItem | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<AccountItem | null>(null);
  const [sharingAccount, setSharingAccount] = useState<AccountItem | null>(null);

  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleEditClose = useCallback((open: boolean) => !open && setEditingAccount(null), []);
  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleDeleteClose = useCallback((open: boolean) => !open && setDeletingAccount(null), []);
  /* v8 ignore next 2 -- @preserve - onOpenChange callback */
  const handleShareClose = useCallback((open: boolean) => !open && setSharingAccount(null), []);

  const renderTableContent = () => {
    if (isLoading) {
      return <AccountTableSkeleton />;
    }

    return accounts.map((account) => (
      <AccountTableRow
        key={account.id}
        account={account}
        onEdit={setEditingAccount}
        onDelete={setDeletingAccount}
        onShare={setSharingAccount}
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
          {t('createAccount')}
        </Button>
      </div>

      <PaginatedTable
        isEmpty={!isLoading && accounts.length === 0 && total === 0}
        isLoading={isLoading}
        emptyMessage={t('noAccounts')}
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

      <CreateAccountDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={reload} />

      <EditAccountDialog
        open={!!editingAccount}
        onOpenChange={handleEditClose}
        account={editingAccount}
        onSuccess={reload}
      />

      <DeleteAccountDialog
        open={!!deletingAccount}
        onOpenChange={handleDeleteClose}
        account={deletingAccount}
        onSuccess={reload}
      />

      {/* v8 ignore next 2 -- @preserve - conditional rendering */}
      {sharingAccount && (
        <ShareDialog
          open={!!sharingAccount}
          onOpenChange={handleShareClose}
          resourceType="ai-accounts"
          resourceId={sharingAccount.id}
          resourceName={sharingAccount.name}
        />
      )}
    </>
  );
}
