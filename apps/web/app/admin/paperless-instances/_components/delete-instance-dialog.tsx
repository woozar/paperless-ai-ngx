'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { PaperlessInstanceListItem, PaperlessInstanceStatsResponse } from '@repo/api-client';
import { deletePaperlessInstancesById, getPaperlessInstancesByIdStats } from '@repo/api-client';
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
  const t = useTranslations('admin.paperlessInstances');
  const [stats, setStats] = useState<PaperlessInstanceStatsResponse | null>(null);

  useEffect(() => {
    if (open && instance) {
      getPaperlessInstancesByIdStats({
        client,
        path: { id: instance.id },
      }).then((response) => {
        if (response.data) {
          setStats(response.data);
        }
      });
    } else {
      setStats(null);
    }
  }, [open, instance, client]);

  const handleDelete = async (instanceToDelete: Omit<PaperlessInstanceListItem, 'apiToken'>) => {
    return await deletePaperlessInstancesById({
      client,
      path: { id: instanceToDelete.id },
    });
  };

  const warningMessage =
    stats && (stats.documents > 0 || stats.processingQueue > 0)
      ? t('deleteWarning', {
          documents: stats.documents,
          processingQueue: stats.processingQueue,
        })
      : undefined;

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
      warning={warningMessage}
    />
  );
}
