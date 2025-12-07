'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useApi } from '@/lib/use-api';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RotateCcw, Loader2 } from 'lucide-react';
import { getUsersInactive, postUsersByIdRestore } from '@repo/api-client';
import type { UserListItem } from '@repo/api-client';

type RestoreUsersDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}>;

export function RestoreUsersDialog({ open, onOpenChange, onSuccess }: RestoreUsersDialogProps) {
  const t = useTranslations('admin.users');
  const { showApiError, showSuccess, showError } = useErrorDisplay('admin.users');
  const client = useApi();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restoringUserId, setRestoringUserId] = useState<string | null>(null);

  const loadInactiveUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getUsersInactive({
        client,
        query: { limit: 100 },
      });

      if (response.error) {
        showError('error.loadFailed');
        return;
      }

      setUsers(response.data.items);
    } catch {
      showError('error.loadFailed');
    } finally {
      setIsLoading(false);
    }
  }, [client, showError]);

  useEffect(() => {
    if (open) {
      loadInactiveUsers();
    }
  }, [open, loadInactiveUsers]);

  const handleRestore = async (user: UserListItem) => {
    setRestoringUserId(user.id);
    try {
      const response = await postUsersByIdRestore({
        client,
        path: { id: user.id },
      });

      if (response.error) {
        showApiError(response.error);
        return;
      }

      showSuccess('userRestored');
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      onSuccess();
    } catch {
      showError('error.restoreFailed');
    } finally {
      setRestoringUserId(null);
    }
  };

  const roleBadgeVariant = (role: string) => (role === 'ADMIN' ? 'default' : 'secondary');
  const roleLabel = (role: string) => (role === 'ADMIN' ? t('admin') : t('default'));

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      );
    }

    if (users.length === 0) {
      return <div className="text-muted-foreground py-8 text-center">{t('noDeletedUsers')}</div>;
    }

    return (
      <div className="max-h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('username')}</TableHead>
              <TableHead>{t('role')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>
                  <Badge variant={roleBadgeVariant(user.role)}>{roleLabel(user.role)}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRestore(user)}
                    disabled={restoringUserId === user.id}
                    data-testid={`restore-user-${user.id}`}
                  >
                    {restoringUserId === user.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RotateCcw className="mr-2 h-4 w-4" />
                    )}
                    {t('restore')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('deletedUsersTitle')}</DialogTitle>
          <DialogDescription>{t('deletedUsersDescription')}</DialogDescription>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
