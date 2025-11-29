'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableRow, TableCell } from '@/components/ui/table';
import { Pencil, Trash2, Ban, CheckCircle } from 'lucide-react';
import type { UserListItem } from '@repo/api-client';

type UserTableRowProps = Readonly<{
  user: UserListItem;
  currentUserId: string | undefined;
  onEdit: (user: UserListItem) => void;
  onDelete: (user: UserListItem) => void;
  onToggleStatus: (user: UserListItem) => void;
  formatDate: (dateString: string) => string;
}>;

export function UserTableRow({
  user,
  currentUserId,
  onEdit,
  onDelete,
  onToggleStatus,
  formatDate,
}: UserTableRowProps) {
  const t = useTranslations('admin.users');
  const isCurrentUser = user.id === currentUserId;

  const roleBadgeVariant = user.role === 'ADMIN' ? 'default' : 'secondary';
  const roleLabel = user.role === 'ADMIN' ? t('admin') : t('default');

  const statusBadgeVariant = user.isActive ? 'default' : 'destructive';
  const statusLabel = user.isActive ? t('active') : t('suspended');

  const StatusIcon = user.isActive ? Ban : CheckCircle;
  const statusTitle = user.isActive ? t('suspend') : t('activate');

  return (
    <TableRow>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell>
        <Badge variant={roleBadgeVariant}>{roleLabel}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={statusBadgeVariant}>{statusLabel}</Badge>
      </TableCell>
      <TableCell>{formatDate(user.createdAt)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleStatus(user)}
            disabled={isCurrentUser}
            title={statusTitle}
            data-testid={`toggle-status-${user.id}`}
          >
            <StatusIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(user)}
            data-testid={`edit-user-${user.id}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(user)}
            disabled={isCurrentUser}
            data-testid={`delete-user-${user.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
