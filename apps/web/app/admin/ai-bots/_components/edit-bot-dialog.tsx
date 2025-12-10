'use client';

import { useCallback } from 'react';
import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { EditAiBotFormSchema } from '@/lib/api/schemas/ai-bots-ui';
import { patchAiBotsById, getAiModels } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { useDynamicOptions } from '@/hooks/use-dynamic-options';
import type { AiBotListItem, AiModelListItem } from '@repo/api-client';

type EditBotDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: AiBotListItem | null;
  onSuccess: () => void;
}>;

export function EditBotDialog({ open, onOpenChange, bot, onSuccess }: EditBotDialogProps) {
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

  if (!bot) return null;

  return (
    <AutoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      schema={EditAiBotFormSchema}
      titleKey="editBot"
      description={bot.name}
      translationNamespace="admin.aiBots"
      successMessageKey="botUpdated"
      submitButtonKey="save"
      onSubmit={async (data) => {
        // Filter out unchanged fields
        const changes = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => {
            return value !== bot[key as keyof AiBotListItem];
          })
        );

        // If no changes, return success
        if (Object.keys(changes).length === 0) {
          return { data: bot };
        }

        return patchAiBotsById({
          client,
          path: { id: bot.id },
          body: changes,
        });
      }}
      onSuccess={onSuccess}
      testIdPrefix="edit-bot"
      initialData={{
        name: bot.name,
        aiModelId: bot.aiModelId,
        systemPrompt: bot.systemPrompt,
        responseLanguage: bot.responseLanguage,
      }}
      dynamicOptions={{ aiModelId: models }}
    />
  );
}
