'use client';

import type { UserListItem } from '@repo/api-client';
import { deleteUsersById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';

type DeleteUserDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserListItem | null;
  onSuccess: () => void;
}>;

export function DeleteUserDialog({ open, onOpenChange, user, onSuccess }: DeleteUserDialogProps) {
  const client = useApi();

  const handleDelete = async (userToDelete: UserListItem) => {
    return await deleteUsersById({
      client,
      path: { id: userToDelete.id },
    });
  };

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      entity={user}
      entityName="User"
      translationNamespace="admin.users"
      successMessageKey="userDeleted"
      onDelete={handleDelete}
      onSuccess={onSuccess}
    />
  );
}
