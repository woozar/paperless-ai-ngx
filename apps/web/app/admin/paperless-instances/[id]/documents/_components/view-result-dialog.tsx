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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Clock, Cpu } from 'lucide-react';
import { getPaperlessInstancesByIdDocumentsByDocumentIdResult } from '@repo/api-client';
import type { DocumentListItem, DocumentProcessingResult } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { useFormatDate } from '@/hooks/use-format-date';

type ViewResultDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentListItem | null;
  instanceId: string;
}>;

export function ViewResultDialog({
  open,
  onOpenChange,
  document,
  instanceId,
}: ViewResultDialogProps) {
  const t = useTranslations('admin.documents');
  const { showError } = useErrorDisplay('admin.documents');
  const client = useApi();
  const formatDate = useFormatDate();

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
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (!result || !changes) {
      return <div className="text-muted-foreground py-8 text-center">{t('result.noResult')}</div>;
    }

    return (
      <>
        {/* Metadata */}
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDate(result.processedAt)}
          </div>
          <div className="flex items-center gap-1">
            <Cpu className="h-4 w-4" />
            {result.aiProvider}
          </div>
          <Badge variant="outline">{result.tokensUsed} tokens</Badge>
        </div>

        {/* Results */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">{t('analyze.suggestedTitle')}</Label>
              <p className="font-medium">{changes.suggestedTitle}</p>
            </div>

            <div>
              <Label className="text-muted-foreground text-xs">
                {t('analyze.suggestedCorrespondent')}
              </Label>
              {changes.suggestedCorrespondent ? (
                <p>
                  {!changes.suggestedCorrespondent.id && (
                    <Badge variant="outline" className="mr-2">
                      {t('analyze.new')}
                    </Badge>
                  )}
                  {changes.suggestedCorrespondent.name}
                </p>
              ) : (
                <p className="text-muted-foreground italic">{t('analyze.noCorrespondentFound')}</p>
              )}
            </div>

            <div>
              <Label className="text-muted-foreground text-xs">
                {t('analyze.suggestedDocumentType')}
              </Label>
              {changes.suggestedDocumentType ? (
                <p>
                  {!changes.suggestedDocumentType.id && (
                    <Badge variant="outline" className="mr-2">
                      {t('analyze.new')}
                    </Badge>
                  )}
                  {changes.suggestedDocumentType.name}
                </p>
              ) : (
                <p className="text-muted-foreground italic">{t('analyze.noDocumentTypeFound')}</p>
              )}
            </div>

            {changes.suggestedTags.length > 0 && (
              <div>
                <Label className="text-muted-foreground text-xs">
                  {t('analyze.suggestedTags')}
                </Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {changes.suggestedTags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="text-muted-foreground text-xs">{t('analyze.confidence')}</Label>
              <p>{Math.round(changes.confidence * 100)}%</p>
            </div>

            <div>
              <Label className="text-muted-foreground text-xs">{t('analyze.reasoning')}</Label>
              <p className="text-muted-foreground text-sm">{changes.reasoning}</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('result.title')}
          </DialogTitle>
          <DialogDescription>{document?.title ?? ''}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {renderContent()}

          {/* Actions */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('analyze.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
