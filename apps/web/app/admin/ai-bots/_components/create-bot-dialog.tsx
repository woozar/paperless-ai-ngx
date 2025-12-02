'use client';

import { useState, useEffect } from 'react';
import { AutoFormDialog } from '@/components/dialogs/auto-form-dialog';
import { CreateAiBotFormSchema } from '@/lib/api/schemas/ai-bots-ui';
import { postAiBots, getAiProviders } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { useErrorDisplay } from '@/hooks/use-error-display';

type CreateBotDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}>;

export function CreateBotDialog({ open, onOpenChange, onSuccess }: CreateBotDialogProps) {
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
            response.data.providers.map((p) => ({
              value: p.id,
              label: p.name,
            }))
          );
        }
      });
    }
  }, [open, client, showError]);

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
      dynamicOptions={{ aiProviderId: providers }}
    />
  );
}
