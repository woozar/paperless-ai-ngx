'use client';

import { useCallback } from 'react';
import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { CreateAiModelFormSchema } from '@/lib/api/schemas/ai-models-ui';
import { postAiModels, getAiAccounts } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { useDynamicOptions } from '@/hooks/use-dynamic-options';
import type { AiAccountListItem } from '@repo/api-client';

type CreateModelDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}>;

export function CreateModelDialog({ open, onOpenChange, onSuccess }: CreateModelDialogProps) {
  const client = useApi();

  const mapAccount = useCallback(
    (a: AiAccountListItem) => ({
      value: a.id,
      label: a.name,
    }),
    []
  );

  const accounts = useDynamicOptions({
    open,
    fetchFn: getAiAccounts,
    mapFn: mapAccount,
    translationNamespace: 'admin.aiModels',
    errorKey: 'loadAccountsFailed',
  });

  // v8 ignore next 2 -- @preserve - onSubmit delegates to API
  const handleSubmit = (data: NonNullable<Parameters<typeof postAiModels>[0]>['body']) =>
    postAiModels({ client, body: data });

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={CreateAiModelFormSchema}
      titleKey="createModel"
      descriptionKey="description"
      translationNamespace="admin.aiModels"
      successMessageKey="modelCreated"
      submitButtonKey="save"
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      testIdPrefix="create-model"
      dynamicOptions={{ aiAccountId: accounts }}
    />
  );
}
