'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableRow, TableCell } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import type { UserListItem } from '@repo/api-client';

type UserTableRowProps = Readonly<{
  user: UserListItem;
  currentUserId: string | undefined;
  onEdit: (user: UserListItem) => void;
  onDelete: (user: UserListItem) => void;
  formatDate: (dateString: string) => string;
}>;

export const UserTableRow = memo(function UserTableRow({
  user,
  currentUserId,
  onEdit,
  onDelete,
  formatDate,
}: UserTableRowProps) {
  const t = useTranslations('admin.users');
  const isCurrentUser = user.id === currentUserId;

  const roleBadgeVariant = user.role === 'ADMIN' ? 'default' : 'secondary';
  const roleLabel = user.role === 'ADMIN' ? t('admin') : t('default');

  return (
    <TableRow>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell>
        <Badge variant={roleBadgeVariant}>{roleLabel}</Badge>
      </TableCell>
      <TableCell>{formatDate(user.createdAt)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
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
});
