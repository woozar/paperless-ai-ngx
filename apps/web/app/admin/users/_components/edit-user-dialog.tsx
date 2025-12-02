'use client';

import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { EditUserFormSchema } from '@/lib/api/schemas/users-ui';
import { patchUsersById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import type { UserListItem } from '@repo/api-client';

type EditUserDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserListItem | null;
  onSuccess: () => void;
}>;

export function EditUserDialog({ open, onOpenChange, user, onSuccess }: EditUserDialogProps) {
  const client = useApi();

  if (!user) return null;

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={EditUserFormSchema}
      titleKey="editUser"
      description={user.username}
      translationNamespace="admin.users"
      successMessageKey="userUpdated"
      submitButtonKey="save"
      onSubmit={async (data) => {
        // Filter out unchanged fields
        const changes = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => {
            if (key === 'resetPassword') return value !== '';
            return value !== user[key as keyof UserListItem];
          })
        );

        // If only resetPassword is in changes and it's empty, no changes were made
        if (
          Object.keys(changes).length === 0 ||
          (Object.keys(changes).length === 1 &&
            'resetPassword' in changes &&
            !changes.resetPassword)
        ) {
          return { data: user };
        }

        return patchUsersById({
          client,
          path: { id: user.id },
          body: changes,
        });
      }}
      onSuccess={onSuccess}
      testIdPrefix="edit-user"
      initialData={{
        username: user.username,
        role: user.role,
        resetPassword: '',
      }}
    />
  );
}
