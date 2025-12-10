'use client';

import { useCallback } from 'react';
import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { EditAiModelFormSchema, type EditAiModelFormData } from '@/lib/api/schemas/ai-models-ui';
import { patchAiModelsById, getAiAccounts } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { useDynamicOptions } from '@/hooks/use-dynamic-options';
import type { AiModelListItem, AiAccountListItem } from '@repo/api-client';

type EditModelDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: AiModelListItem | null;
  onSuccess: () => void;
}>;

export function EditModelDialog({ open, onOpenChange, model, onSuccess }: EditModelDialogProps) {
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

  /* v8 ignore next 32 -- @preserve - onSubmit filters unchanged fields (optimization) */
  const handleSubmit = useCallback(
    async (data: EditAiModelFormData) => {
      if (!model) return { data: null };

      // Filter out unchanged fields
      const changes = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          if (key === 'inputTokenPrice' || key === 'outputTokenPrice') {
            const modelValue = model[key as keyof typeof model];
            return value !== modelValue;
          }
          return value !== model[key as keyof typeof model];
        })
      );

      // If no changes, return success
      if (Object.keys(changes).length === 0) {
        return { data: model };
      }

      return patchAiModelsById({
        client,
        path: { id: model.id },
        body: changes,
      });
    },
    [model, client]
  );

  if (!model) return null;

  /* v8 ignore next 7 -- @preserve - nullish coalescing for optional fields */
  const initialData = {
    name: model.name,
    modelIdentifier: model.modelIdentifier,
    aiAccountId: model.aiAccountId,
    inputTokenPrice: model.inputTokenPrice ?? undefined,
    outputTokenPrice: model.outputTokenPrice ?? undefined,
  };

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={EditAiModelFormSchema}
      titleKey="editModel"
      description={model.name}
      translationNamespace="admin.aiModels"
      successMessageKey="modelUpdated"
      submitButtonKey="save"
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      testIdPrefix="edit-model"
      dynamicOptions={{ aiAccountId: accounts }}
      initialData={initialData}
    />
  );
}
