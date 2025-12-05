'use client';

import { useState, useEffect } from 'react';
import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { EditAiBotFormSchema } from '@/lib/api/schemas/ai-bots-ui';
import { patchAiBotsById, getAiProviders } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { useErrorDisplay } from '@/hooks/use-error-display';
import type { AiBotListItem } from '@repo/api-client';

type EditBotDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: AiBotListItem | null;
  onSuccess: () => void;
}>;

export function EditBotDialog({ open, onOpenChange, bot, onSuccess }: EditBotDialogProps) {
  const client = useApi();
  const { showError } = useErrorDisplay('admin.aiBots');
  const [providers, setProviders] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    if (open) {
      // Load providers when dialog opens
      getAiProviders({ client }).then((response) => {
        if (response.error) {
          showError('loadProvidersFailed');
          setProviders([]);
        } else {
          setProviders(
            response.data.items.map((p) => ({
              value: p.id,
              label: p.name,
            }))
          );
        }
      });
    }
  }, [open, client, showError]);

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
        aiProviderId: bot.aiProviderId,
        systemPrompt: bot.systemPrompt,
      }}
      dynamicOptions={{ aiProviderId: providers }}
    />
  );
}
