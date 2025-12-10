'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { PaginatedTable, type ColumnDefinition } from '@/components/paginated-table';
import { Plus, UserCog, UserX } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useApi } from '@/lib/use-api';
import { useFormatDate } from '@/hooks/use-format-date';
import { usePaginatedList, type FetchResult } from '@/hooks/use-paginated-list';
import { getUsers } from '@repo/api-client';

import type { UserListItem } from '@repo/api-client';
import {
  UserTableSkeleton,
  UserTableRow,
  CreateUserDialog,
  EditUserDialog,
  DeleteUserDialog,
  RestoreUsersDialog,
} from './_components';

export default function UsersPage() {
  const t = useTranslations('admin.users');
  const { showError } = useErrorDisplay('admin.users');
  const formatDate = useFormatDate();
  const router = useRouter();
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  const client = useApi();

  // Admin role check
  useEffect(() => {
    if (!isAuthLoading && currentUser?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [isAuthLoading, currentUser, router]);

  const fetchUsers = useCallback(
    async (page: number, limit: number): Promise<FetchResult<UserListItem>> => {
      const response = await getUsers({
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
    items: users,
    isLoading,
    page,
    limit,
    total,
    totalPages,
    handlePageChange,
    handleLimitChange,
    reload,
  } = usePaginatedList({
    fetchFn: fetchUsers,
    onError: () => showError('loadFailed'),
  });

  const columns: ColumnDefinition[] = useMemo(
    () => [
      { label: t('username') },
      { label: t('role') },
      { label: t('createdAt') },
      { label: t('actions'), align: 'right' },
    ],
    [t]
  );

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserListItem | null>(null);

  if (currentUser?.role !== 'ADMIN') {
    return null;
  }

  const renderTableContent = () => {
    if (isLoading) {
      return <UserTableSkeleton />;
    }

    return users.map((user) => (
      <UserTableRow
        key={user.id}
        user={user}
        currentUserId={currentUser?.id}
        onEdit={setEditingUser}
        onDelete={setDeletingUser}
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
              <UserCog className="h-8 w-8" />
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-2">{t('description')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsRestoreOpen(true)}>
              <UserX className="mr-2 h-4 w-4" />
              {t('deletedUsers')}
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('createUser')}
            </Button>
          </div>
        </div>

        <PaginatedTable
          isEmpty={!isLoading && users.length === 0 && total === 0}
          isLoading={isLoading}
          emptyMessage={t('noUsers')}
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
      </div>

      <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={reload} />

      <EditUserDialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        user={editingUser}
        onSuccess={reload}
      />

      <DeleteUserDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        user={deletingUser}
        onSuccess={reload}
      />

      <RestoreUsersDialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen} onSuccess={reload} />
    </AppShell>
  );
}
