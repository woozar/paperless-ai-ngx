'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Cpu, ArrowDown, ArrowUp, Euro, DollarSign } from 'lucide-react';
import { SuggestedTagsList } from './suggested-tags-list';
import { useFormatDate, useFormatDateOnly } from '@/hooks/use-format-date';
import { useSettings } from '@/components/settings-provider';
import type { DocumentAnalysisResult } from '@repo/api-client';

const CURRENCY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  EUR: Euro,
  USD: DollarSign,
};

type AnalysisResultContentProps = Readonly<{
  result: NonNullable<DocumentAnalysisResult>;
  metadata?: {
    processedAt: string;
    aiProvider: string;
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number | null;
  };
}>;

export function AnalysisResultContent({ result, metadata }: AnalysisResultContentProps) {
  const t = useTranslations('admin.documents');
  const formatDate = useFormatDate();
  const formatDateOnly = useFormatDateOnly();
  const { settings } = useSettings();
  const currency = settings['display.general.currency'] || 'EUR';
  const CurrencyIcon = CURRENCY_ICONS[currency] || Euro;

  // Format suggestedDate as date only (no time)
  const formattedSuggestedDate = result.suggestedDate ? formatDateOnly(result.suggestedDate) : null;

  return (
    <>
      {/* Metadata badges */}
      {metadata && (
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-cyan-500 whitespace-nowrap text-cyan-700 dark:text-cyan-400"
          >
            <Clock className="mr-1 h-3 w-3" />
            {formatDate(metadata.processedAt)}
          </Badge>
          <Badge
            variant="outline"
            className="border-purple-500 whitespace-nowrap text-purple-700 dark:text-purple-400"
          >
            <Cpu className="mr-1 h-3 w-3" />
            {metadata.aiProvider}
          </Badge>
          <Badge
            variant="outline"
            className="border-blue-500 whitespace-nowrap text-blue-700 dark:text-blue-400"
          >
            {metadata.inputTokens.toLocaleString()}
            <ArrowDown className="h-3 w-3" />
          </Badge>
          <Badge
            variant="outline"
            className="border-green-500 whitespace-nowrap text-green-700 dark:text-green-400"
          >
            {metadata.outputTokens.toLocaleString()}
            <ArrowUp className="h-3 w-3" />
          </Badge>
          {metadata.estimatedCost != null && (
            <Badge
              variant="outline"
              className="border-amber-500 whitespace-nowrap text-amber-700 dark:text-amber-400"
            >
              {metadata.estimatedCost.toFixed(4)}
              <CurrencyIcon className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}

      {/* Analysis results */}
      <div className="space-y-4 rounded-lg border p-4">
        <div className="space-y-3">
          <div>
            <Label className="text-muted-foreground text-xs">{t('analyze.suggestedTitle')}</Label>
            <p className="font-medium">{result.suggestedTitle}</p>
          </div>

          <div>
            <Label className="text-muted-foreground text-xs">
              {t('analyze.suggestedCorrespondent')}
            </Label>
            {result.suggestedCorrespondent ? (
              <p>
                {!result.suggestedCorrespondent.id && (
                  <Badge
                    variant="outline"
                    className="mr-2 border-green-500 text-green-700 dark:text-green-400"
                  >
                    {t('analyze.new')}
                  </Badge>
                )}
                {result.suggestedCorrespondent.name}
              </p>
            ) : (
              <p className="text-muted-foreground italic">{t('analyze.noCorrespondentFound')}</p>
            )}
          </div>

          <div>
            <Label className="text-muted-foreground text-xs">
              {t('analyze.suggestedDocumentType')}
            </Label>
            {result.suggestedDocumentType ? (
              <p>
                {!result.suggestedDocumentType.id && (
                  <Badge
                    variant="outline"
                    className="mr-2 border-green-500 text-green-700 dark:text-green-400"
                  >
                    {t('analyze.new')}
                  </Badge>
                )}
                {result.suggestedDocumentType.name}
              </p>
            ) : (
              <p className="text-muted-foreground italic">{t('analyze.noDocumentTypeFound')}</p>
            )}
          </div>

          {result.suggestedTags && result.suggestedTags.length > 0 && (
            <div>
              <Label className="text-muted-foreground text-xs">{t('analyze.suggestedTags')}</Label>
              <SuggestedTagsList tags={result.suggestedTags} />
            </div>
          )}

          {formattedSuggestedDate && (
            <div>
              <Label className="text-muted-foreground text-xs">{t('analyze.suggestedDate')}</Label>
              <p>{formattedSuggestedDate}</p>
            </div>
          )}

          <div>
            <Label className="text-muted-foreground text-xs">{t('analyze.confidence')}</Label>
            <p>{Math.round(result.confidence * 100)}%</p>
          </div>

          <div>
            <Label className="text-muted-foreground text-xs">{t('analyze.reasoning')}</Label>
            <p className="text-muted-foreground text-sm">{result.reasoning}</p>
          </div>
        </div>
      </div>
    </>
  );
}
