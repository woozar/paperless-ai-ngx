'use client';

import { useCallback } from 'react';
import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import {
  EditAiAccountFormSchema,
  type EditAiAccountFormData,
} from '@/lib/api/schemas/ai-accounts-ui';
import { patchAiAccountsById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import type { AiAccountListItem } from '@repo/api-client';
import { ProviderLogo } from '@/components/provider-logo';

type EditAccountDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Omit<AiAccountListItem, 'apiKey'> | null;
  onSuccess: () => void;
}>;

export function EditAccountDialog({
  open,
  onOpenChange,
  account,
  onSuccess,
}: EditAccountDialogProps) {
  const client = useApi();

  /* v8 ignore next 25 -- @preserve - onSubmit filters unchanged fields (optimization) */
  const handleSubmit = useCallback(
    async (data: EditAiAccountFormData) => {
      if (!account) return { data: null };

      // Filter out unchanged fields
      const changes = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          if (key === 'apiKey') return value !== '';
          if (key === 'baseUrl') return value !== (account.baseUrl || '');
          return value !== account[key as keyof typeof account];
        })
      );

      // If no changes, return success
      if (Object.keys(changes).length === 0) {
        return { data: account };
      }

      return patchAiAccountsById({
        client,
        path: { id: account.id },
        body: changes,
      });
    },
    [account, client]
  );

  if (!account) return null;

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={EditAiAccountFormSchema}
      titleKey="editAccount"
      description={account.name}
      translationNamespace="admin.aiAccounts"
      successMessageKey="accountUpdated"
      submitButtonKey="save"
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      testIdPrefix="edit-account"
      renderOptionIcon={(_fieldName, value) => <ProviderLogo provider={value} size={20} />}
      initialData={{
        name: account.name,
        provider: account.provider,
        apiKey: '',
        baseUrl: account.baseUrl || '',
      }}
    />
  );
}
