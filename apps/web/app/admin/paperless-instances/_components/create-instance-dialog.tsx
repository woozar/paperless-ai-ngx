'use client';

import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { CreatePaperlessInstanceFormSchema } from '@/lib/api/schemas/paperless-instances-ui';
import { postPaperlessInstances } from '@repo/api-client';
import { useApi } from '@/lib/use-api';

type CreateInstanceDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}>;

export function CreateInstanceDialog({ open, onOpenChange, onSuccess }: CreateInstanceDialogProps) {
  const client = useApi();

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={CreatePaperlessInstanceFormSchema}
      titleKey="createInstance"
      descriptionKey="description"
      translationNamespace="admin.paperlessInstances"
      successMessageKey="instanceCreated"
      submitButtonKey="save"
      onSubmit={(data) => postPaperlessInstances({ client, body: data })}
      onSuccess={onSuccess}
      testIdPrefix="create-instance"
    />
  );
}
