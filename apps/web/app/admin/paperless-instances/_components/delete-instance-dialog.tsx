'use client';

import type { PaperlessInstanceListItem } from '@repo/api-client';
import { deletePaperlessInstancesById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';

type DeleteInstanceDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance: Omit<PaperlessInstanceListItem, 'apiToken'> | null;
  onSuccess: () => void;
}>;

export function DeleteInstanceDialog({
  open,
  onOpenChange,
  instance,
  onSuccess,
}: DeleteInstanceDialogProps) {
  const client = useApi();

  const handleDelete = async (instanceToDelete: Omit<PaperlessInstanceListItem, 'apiToken'>) => {
    return await deletePaperlessInstancesById({
      client,
      path: { id: instanceToDelete.id },
    });
  };

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      entity={instance}
      entityName="Instance"
      translationNamespace="admin.paperlessInstances"
      successMessageKey="instanceDeleted"
      onDelete={handleDelete}
      onSuccess={onSuccess}
    />
  );
}
