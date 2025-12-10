'use client';

import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { CreateAiAccountFormSchema } from '@/lib/api/schemas/ai-accounts-ui';
import { postAiAccounts } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { ProviderLogo } from '@/components/provider-logo';

type CreateAccountDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}>;

export function CreateAccountDialog({ open, onOpenChange, onSuccess }: CreateAccountDialogProps) {
  const client = useApi();

  // v8 ignore next 2 -- @preserve
  const handleSubmit = (data: NonNullable<Parameters<typeof postAiAccounts>[0]>['body']) =>
    postAiAccounts({ client, body: data });

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={CreateAiAccountFormSchema}
      titleKey="createAccount"
      descriptionKey="description"
      translationNamespace="admin.aiAccounts"
      successMessageKey="accountCreated"
      submitButtonKey="save"
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      testIdPrefix="create-account"
      renderOptionIcon={(_fieldName, value) => <ProviderLogo provider={value} size={20} />}
    />
  );
}
