'use client';

import type { AiProviderListItem } from '@repo/api-client';
import { deleteAiProvidersById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';

type DeleteProviderDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Omit<AiProviderListItem, 'apiKey'> | null;
  onSuccess: () => void;
}>;

export function DeleteProviderDialog({
  open,
  onOpenChange,
  provider,
  onSuccess,
}: DeleteProviderDialogProps) {
  const client = useApi();

  const handleDelete = async (providerToDelete: Omit<AiProviderListItem, 'apiKey'>) => {
    return await deleteAiProvidersById({
      client,
      path: { id: providerToDelete.id },
    });
  };

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      entity={provider}
      entityName="Provider"
      translationNamespace="admin.aiProviders"
      successMessageKey="providerDeleted"
      onDelete={handleDelete}
      onSuccess={onSuccess}
    />
  );
}
