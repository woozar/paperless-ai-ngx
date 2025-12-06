'use client';

import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { CreateAiProviderFormSchema } from '@/lib/api/schemas/ai-providers-ui';
import { postAiProviders } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { ProviderLogo } from '@/components/provider-logo';

type CreateProviderDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}>;

export function CreateProviderDialog({ open, onOpenChange, onSuccess }: CreateProviderDialogProps) {
  const client = useApi();

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={CreateAiProviderFormSchema}
      titleKey="createProvider"
      descriptionKey="description"
      translationNamespace="admin.aiProviders"
      successMessageKey="providerCreated"
      submitButtonKey="save"
      onSubmit={(data) => postAiProviders({ client, body: data })}
      onSuccess={onSuccess}
      testIdPrefix="create-provider"
      renderOptionIcon={(_fieldName, value) => <ProviderLogo provider={value} size={20} />}
    />
  );
}
