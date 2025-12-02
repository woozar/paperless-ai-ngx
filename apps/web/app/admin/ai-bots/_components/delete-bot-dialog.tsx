'use client';

import type { AiBotListItem } from '@repo/api-client';
import { deleteAiBotsById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';

type DeleteBotDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: AiBotListItem | null;
  onSuccess: () => void;
}>;

export function DeleteBotDialog({ open, onOpenChange, bot, onSuccess }: DeleteBotDialogProps) {
  const client = useApi();

  const handleDelete = async (botToDelete: AiBotListItem) => {
    return await deleteAiBotsById({
      client,
      path: { id: botToDelete.id },
    });
  };

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      entity={bot}
      entityName="Bot"
      translationNamespace="admin.aiBots"
      successMessageKey="botDeleted"
      onDelete={handleDelete}
      onSuccess={onSuccess}
    />
  );
}
