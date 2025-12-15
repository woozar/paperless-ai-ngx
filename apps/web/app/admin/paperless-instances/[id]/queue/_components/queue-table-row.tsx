'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useApi } from '@/lib/use-api';
import { useErrorDisplay } from '@/hooks/use-error-display';
import {
  postPaperlessInstancesByIdQueueByQueueIdRetry,
  deletePaperlessInstancesByIdQueueByQueueId,
} from '@repo/api-client';
import type { ProcessingQueueItem } from '@repo/api-client';

type QueueTableRowProps = Readonly<{
  item: ProcessingQueueItem;
  instanceId: string;
  onRefresh: () => void;
}>;

export function QueueTableRow({ item, instanceId, onRefresh }: QueueTableRowProps) {
  const t = useTranslations('admin.queue');
  const client = useApi();
  const { showError, showSuccess } = useErrorDisplay('admin.queue');
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const response = await postPaperlessInstancesByIdQueueByQueueIdRetry({
        client,
        path: { id: instanceId, queueId: item.id },
      });

      if (response.error) {
        showError('retryFailed');
      } else {
        showSuccess('retrySuccess');
        onRefresh();
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deletePaperlessInstancesByIdQueueByQueueId({
        client,
        path: { id: instanceId, queueId: item.id },
      });

      if (response.error) {
        showError('deleteFailed');
      } else {
        showSuccess('deleteSuccess');
        onRefresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <TooltipProvider>
        {item.status === 'failed' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRetry}
                disabled={isRetrying}
                data-testid={`queue-retry-${item.id}`}
              >
                <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('actions.retry')}</p>
              {item.lastError && (
                <p className="text-muted-foreground mt-1 max-w-xs text-xs">{item.lastError}</p>
              )}
            </TooltipContent>
          </Tooltip>
        )}

        {(item.status === 'pending' || item.status === 'completed') && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                data-testid={`queue-delete-${item.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('actions.delete')}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}
