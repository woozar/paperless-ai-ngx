'use client';

import { useCallback } from 'react';
import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { CreateAiBotFormSchema } from '@/lib/api/schemas/ai-bots-ui';
import { postAiBots, getAiModels } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { useDynamicOptions } from '@/hooks/use-dynamic-options';
import type { AiModelListItem } from '@repo/api-client';

type CreateBotDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}>;

export function CreateBotDialog({ open, onOpenChange, onSuccess }: CreateBotDialogProps) {
  const client = useApi();

  const mapModel = useCallback(
    (m: AiModelListItem) => ({
      value: m.id,
      label: `${m.name} (${m.aiAccount.name})`,
    }),
    []
  );

  const models = useDynamicOptions({
    open,
    fetchFn: getAiModels,
    mapFn: mapModel,
    translationNamespace: 'admin.aiBots',
    errorKey: 'loadModelsFailed',
  });

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={CreateAiBotFormSchema}
      titleKey="createBot"
      descriptionKey="description"
      translationNamespace="admin.aiBots"
      successMessageKey="botCreated"
      submitButtonKey="save"
      onSubmit={(data) => postAiBots({ client, body: data })}
      onSuccess={onSuccess}
      testIdPrefix="create-bot"
      dynamicOptions={{ aiModelId: models }}
    />
  );
}
