'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { getPaperlessInstancesByIdDocumentsByDocumentIdResult } from '@repo/api-client';
import type { DocumentListItem, DocumentProcessingResult } from '@repo/api-client';
import { AnalysisResultContent } from './analysis-result-content';
import { AnalysisResultSkeleton } from './analysis-result-skeleton';
import { useApi } from '@/lib/use-api';
import { useErrorDisplay } from '@/hooks/use-error-display';

type ViewResultDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentListItem | null;
  instanceId: string;
  onApplied?: () => void;
}>;

export function ViewResultDialog({
  open,
  onOpenChange,
  document,
  instanceId,
  onApplied,
}: ViewResultDialogProps) {
  const t = useTranslations('admin.documents');
  const { showError } = useErrorDisplay('admin.documents');
  const client = useApi();

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DocumentProcessingResult | null>(null);

  useEffect(() => {
    const loadResult = async () => {
      // v8 ignore next -- @preserve
      if (!document) return;

      setIsLoading(true);
      try {
        const response = await getPaperlessInstancesByIdDocumentsByDocumentIdResult({
          client,
          path: { id: instanceId, documentId: document.id },
        });

        if (response.error) {
          showError('loadResultFailed');
          setResult(null);
        } else {
          setResult(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (open && document) {
      loadResult();
    } else {
      setResult(null);
    }
  }, [open, document?.id, client, instanceId, showError, document]);

  const changes = result?.changes;

  const renderContent = () => {
    if (isLoading) {
      return <AnalysisResultSkeleton />;
    }

    if (!result || !changes) {
      return <div className="text-muted-foreground py-8 text-center">{t('result.noResult')}</div>;
    }

    return (
      <AnalysisResultContent
        result={changes}
        metadata={{
          processedAt: result.processedAt,
          aiProvider: result.aiProvider,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
          estimatedCost: result.estimatedCost,
        }}
        instanceId={instanceId}
        documentId={document?.id}
        onApplied={onApplied}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('result.title')}
          </DialogTitle>
          <DialogDescription>
            {document?.title ? t('result.description', { title: document.title }) : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">{renderContent()}</div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('result.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
