'use client';

import type { AiModelListItem } from '@repo/api-client';
import { deleteAiModelsById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';

type DeleteModelDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: AiModelListItem | null;
  onSuccess: () => void;
}>;

export function DeleteModelDialog({
  open,
  onOpenChange,
  model,
  onSuccess,
}: DeleteModelDialogProps) {
  const client = useApi();

  const handleDelete = async (modelToDelete: AiModelListItem) => {
    return await deleteAiModelsById({
      client,
      path: { id: modelToDelete.id },
    });
  };

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      entity={model}
      entityName="Model"
      translationNamespace="admin.aiModels"
      successMessageKey="modelDeleted"
      onDelete={handleDelete}
      onSuccess={onSuccess}
    />
  );
}
