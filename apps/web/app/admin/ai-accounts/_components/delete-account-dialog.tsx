'use client';

import type { AiAccountListItem } from '@repo/api-client';
import { deleteAiAccountsById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';

type DeleteAccountDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Omit<AiAccountListItem, 'apiKey'> | null;
  onSuccess: () => void;
}>;

export function DeleteAccountDialog({
  open,
  onOpenChange,
  account,
  onSuccess,
}: DeleteAccountDialogProps) {
  const client = useApi();

  const handleDelete = async (accountToDelete: Omit<AiAccountListItem, 'apiKey'>) => {
    return await deleteAiAccountsById({
      client,
      path: { id: accountToDelete.id },
    });
  };

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      entity={account}
      entityName="Account"
      translationNamespace="admin.aiAccounts"
      successMessageKey="accountDeleted"
      onDelete={handleDelete}
      onSuccess={onSuccess}
    />
  );
}
