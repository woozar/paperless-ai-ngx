'use client';

import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { CreateUserFormSchema } from '@/lib/api/schemas/users-ui';
import { postUsers } from '@repo/api-client';
import { useApi } from '@/lib/use-api';

type CreateUserDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}>;

export function CreateUserDialog({ open, onOpenChange, onSuccess }: CreateUserDialogProps) {
  const client = useApi();

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={CreateUserFormSchema}
      titleKey="createUser"
      translationNamespace="admin.users"
      successMessageKey="userCreated"
      submitButtonKey="save"
      onSubmit={(data) => postUsers({ client, body: data })}
      onSuccess={onSuccess}
      testIdPrefix="create-user"
    />
  );
}
