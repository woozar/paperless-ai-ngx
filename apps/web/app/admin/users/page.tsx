'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, UserCog } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useApi } from '@/lib/use-api';
import { useFormatDate } from '@/hooks/use-format-date';
import { getUsers, patchUsersById } from '@repo/api-client';
import { TablePagination } from '@/components/table-pagination';

import type { UserListItem } from '@repo/api-client';
import {
  UserTableSkeleton,
  UserTableRow,
  CreateUserDialog,
  EditUserDialog,
  DeleteUserDialog,
} from './_components';

export default function UsersPage() {
  const t = useTranslations('admin.users');
  const { showApiError, showSuccess, showError } = useErrorDisplay('admin.users');
  const formatDate = useFormatDate();
  const router = useRouter();
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  const client = useApi();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserListItem | null>(null);

  const loadUsers = useCallback(
    async (currentPage: number, currentLimit: number) => {
      setIsLoading(true);

      try {
        const response = await getUsers({
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

        setUsers(response.data.items);
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
    if (!isAuthLoading && currentUser?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    loadUsers(page, limit);
  }, [isAuthLoading, currentUser, router, loadUsers, page, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const reloadCurrentPage = () => {
    loadUsers(page, limit);
  };

  const handleToggleStatus = useCallback(
    async (user: UserListItem) => {
      try {
        const response = await patchUsersById({
          client,
          path: { id: user.id },
          body: { isActive: !user.isActive },
        });

        if (response.error) {
          showApiError(response.error);
          return;
        }

        showSuccess('userStatusUpdated');
        reloadCurrentPage();
      } catch {
        showError('updateFailed');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, showApiError, showSuccess, showError, page, limit]
  );

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
        onToggleStatus={handleToggleStatus}
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
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('createUser')}
          </Button>
        </div>

        {!isLoading && users.length === 0 && total === 0 ? (
          <div className="text-muted-foreground py-12 text-center">{t('noUsers')}</div>
        ) : (
          <div className="bg-card rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('username')}</TableHead>
                  <TableHead>{t('role')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
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

      <CreateUserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={reloadCurrentPage}
      />

      <EditUserDialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        user={editingUser}
        onSuccess={reloadCurrentPage}
      />

      <DeleteUserDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        user={deletingUser}
        onSuccess={reloadCurrentPage}
      />
    </AppShell>
  );
}
