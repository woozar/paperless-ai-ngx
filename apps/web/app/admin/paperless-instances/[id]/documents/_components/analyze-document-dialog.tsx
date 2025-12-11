'use client';

import { useState, useEffect, useCallback } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  getAiBots,
  postPaperlessInstancesByIdDocumentsByDocumentIdAnalyze,
} from '@repo/api-client';
import type { DocumentListItem, AiBotListItem, AnalyzeDocumentResponse } from '@repo/api-client';
import { AnalysisResultContent } from './analysis-result-content';
import { useApi } from '@/lib/use-api';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { toast } from 'sonner';

type AnalyzeDocumentDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentListItem | null;
  instanceId: string;
  onSuccess?: () => void;
}>;

export function AnalyzeDocumentDialog({
  open,
  onOpenChange,
  document,
  instanceId,
  onSuccess,
}: AnalyzeDocumentDialogProps) {
  const t = useTranslations('admin.documents');
  const { showError } = useErrorDisplay('admin.documents');
  const client = useApi();

  const [bots, setBots] = useState<AiBotListItem[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string>('');
  const [isLoadingBots, setIsLoadingBots] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzeDocumentResponse | null>(null);

  const loadBots = useCallback(async () => {
    setIsLoadingBots(true);
    try {
      const response = await getAiBots({ client, query: { limit: 100 } });
      if (response.error) {
        showError('loadBotsFailed');
        setBots([]);
      } else {
        setBots(response.data.items);
      }
    } finally {
      setIsLoadingBots(false);
    }
  }, [client, showError]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setResult(null);
      setSelectedBotId('');
      loadBots();
    }
  }, [open, loadBots]);

  const handleAnalyze = async () => {
    if (!document || !selectedBotId) return;

    setIsAnalyzing(true);
    try {
      const response = await postPaperlessInstancesByIdDocumentsByDocumentIdAnalyze({
        client,
        path: { id: instanceId, documentId: document.id },
        body: { aiBotId: selectedBotId },
      });

      if (response.error) {
        showError('analyzeFailed');
      } else {
        setResult(response.data);
        toast.success(t('analyze.success'));
        onSuccess?.();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {t('analyze.title')}
          </DialogTitle>
          <DialogDescription>
            {document?.title ? t('analyze.description', { title: document.title }) : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bot Selection */}
          {!result && (
            <div className="space-y-2">
              <Label htmlFor="bot-select">{t('analyze.selectBot')}</Label>
              <Select
                value={selectedBotId}
                onValueChange={setSelectedBotId}
                disabled={isLoadingBots || isAnalyzing}
              >
                <SelectTrigger id="bot-select" data-testid="select-bot">
                  <SelectValue placeholder={t('analyze.selectBotPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {bots.map((bot) => (
                    <SelectItem key={bot.id} value={bot.id}>
                      {bot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Analysis Result */}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">{t('analyze.completed')}</span>
              </div>
              <AnalysisResultContent
                result={result.result}
                metadata={{
                  processedAt: new Date().toISOString(),
                  // v8 ignore next -- @preserve
                  aiProvider: bots.find((b) => b.id === selectedBotId)?.name ?? '',
                  inputTokens: result.inputTokens,
                  outputTokens: result.outputTokens,
                  estimatedCost: result.estimatedCost,
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {result ? t('analyze.close') : t('analyze.cancel')}
            </Button>
            {!result && (
              <Button
                onClick={handleAnalyze}
                disabled={!selectedBotId || isAnalyzing}
                data-testid="start-analysis"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('analyze.analyzing')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('analyze.start')}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
