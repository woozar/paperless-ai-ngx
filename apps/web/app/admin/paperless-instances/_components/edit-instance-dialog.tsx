'use client';

import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { EditPaperlessInstanceFormSchema } from '@/lib/api/schemas/paperless-instances-ui';
import { patchPaperlessInstancesById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import type { PaperlessInstanceListItem } from '@repo/api-client';

type EditInstanceDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance: Omit<PaperlessInstanceListItem, 'apiToken'> | null;
  onSuccess: () => void;
}>;

export function EditInstanceDialog({
  open,
  onOpenChange,
  instance,
  onSuccess,
}: EditInstanceDialogProps) {
  const client = useApi();

  if (!instance) return null;

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={EditPaperlessInstanceFormSchema}
      titleKey="editInstance"
      description={instance.name}
      translationNamespace="admin.paperlessInstances"
      successMessageKey="instanceUpdated"
      submitButtonKey="save"
      onSubmit={async (data) => {
        // Filter out unchanged fields
        const changes = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => {
            if (key === 'apiToken') return value !== '';
            return value !== instance[key as keyof typeof instance];
          })
        );

        // If no changes, return success
        if (Object.keys(changes).length === 0) {
          return { data: instance };
        }

        return patchPaperlessInstancesById({
          client,
          path: { id: instance.id },
          body: changes,
        });
      }}
      onSuccess={onSuccess}
      testIdPrefix="edit-instance"
      initialData={{
        name: instance.name,
        apiUrl: instance.apiUrl,
        apiToken: '',
      }}
    />
  );
}
