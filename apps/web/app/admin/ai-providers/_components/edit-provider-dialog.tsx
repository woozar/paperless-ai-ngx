'use client';

import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { EditAiProviderFormSchema } from '@/lib/api/schemas/ai-providers-ui';
import { patchAiProvidersById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import type { AiProviderListItem } from '@repo/api-client';

type EditProviderDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Omit<AiProviderListItem, 'apiKey'> | null;
  onSuccess: () => void;
}>;

export function EditProviderDialog({
  open,
  onOpenChange,
  provider,
  onSuccess,
}: EditProviderDialogProps) {
  const client = useApi();

  if (!provider) return null;

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={EditAiProviderFormSchema}
      titleKey="editProvider"
      description={provider.name}
      translationNamespace="admin.aiProviders"
      successMessageKey="providerUpdated"
      submitButtonKey="save"
      onSubmit={async (data) => {
        // Filter out unchanged fields
        const changes = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => {
            if (key === 'apiKey') return value !== '';
            if (key === 'baseUrl') return value !== (provider.baseUrl || '');
            return value !== provider[key as keyof typeof provider];
          })
        );

        // If no changes, return success
        if (Object.keys(changes).length === 0) {
          return { data: provider };
        }

        return patchAiProvidersById({
          client,
          path: { id: provider.id },
          body: changes,
        });
      }}
      onSuccess={onSuccess}
      testIdPrefix="edit-provider"
      initialData={{
        name: provider.name,
        provider: provider.provider,
        model: provider.model,
        apiKey: '',
        baseUrl: provider.baseUrl || '',
      }}
    />
  );
}
