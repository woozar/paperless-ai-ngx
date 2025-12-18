'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Cpu,
  ArrowDown,
  ArrowUp,
  Euro,
  DollarSign,
  Check,
  Loader2,
  Save,
} from 'lucide-react';
import { SuggestedTagsList } from './suggested-tags-list';
import { useFormatDate, useFormatDateOnly } from '@/hooks/use-format-date';
import { useSettings } from '@/components/settings-provider';
import { useApi } from '@/lib/use-api';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { toast } from 'sonner';
import { postPaperlessInstancesByIdDocumentsByDocumentIdApply } from '@repo/api-client';
import type {
  DocumentAnalysisResult,
  ApplyField,
  SuggestedItem,
  SuggestedTag,
} from '@repo/api-client';

const CURRENCY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  EUR: Euro,
  USD: DollarSign,
};

// Helper to get the icon for apply button based on state
function getApplyButtonIcon(isApplying: boolean, isApplied: boolean) {
  if (isApplying) return <Loader2 className="h-4 w-4 animate-spin" />;
  if (isApplied) return <Check className="h-4 w-4 text-green-600" />;
  return <Save className="h-4 w-4" />;
}

// Extracted ApplyButton component to avoid component-in-component
type ApplyButtonProps = Readonly<{
  field: ApplyField;
  value?: string | SuggestedItem | SuggestedTag[];
  disabled?: boolean;
  isApplying: boolean;
  isApplied: boolean;
  isAnyFieldApplying: boolean;
  onApply: (field: ApplyField, value?: string | SuggestedItem | SuggestedTag[]) => void;
}>;

function ApplyButton({
  field,
  value,
  disabled = false,
  isApplying,
  isApplied,
  isAnyFieldApplying,
  onApply,
}: ApplyButtonProps) {
  const isDisabled = disabled || isApplying || isApplied || isAnyFieldApplying;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0"
      onClick={() => onApply(field, value)}
      disabled={isDisabled}
      data-testid={`apply-${field}`}
    >
      {getApplyButtonIcon(isApplying, isApplied)}
    </Button>
  );
}

// Helper to render Apply All button content
function getApplyAllButtonContent(
  isApplying: boolean,
  isApplied: boolean,
  t: (key: string) => string
) {
  if (isApplying) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {t('apply.applying')}
      </>
    );
  }
  if (isApplied) {
    return (
      <>
        <Check className="mr-2 h-4 w-4" />
        {t('apply.allApplied')}
      </>
    );
  }
  return (
    <>
      <Save className="mr-2 h-4 w-4" />
      {t('apply.all')}
    </>
  );
}

type AnalysisResultContentProps = Readonly<{
  result: NonNullable<DocumentAnalysisResult>;
  metadata?: {
    processedAt: string;
    aiProvider: string;
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number | null;
  };
  // Optional props for apply functionality
  instanceId?: string;
  documentId?: string;
  onApplied?: () => void;
}>;

export function AnalysisResultContent({
  result,
  metadata,
  instanceId,
  documentId,
  onApplied,
}: AnalysisResultContentProps) {
  const t = useTranslations('admin.documents');
  const formatDate = useFormatDate();
  const formatDateOnly = useFormatDateOnly();
  const { settings } = useSettings();
  const client = useApi();
  const { showError } = useErrorDisplay('admin.documents');
  const currency = settings['display.general.currency'] || 'EUR';
  const CurrencyIcon = CURRENCY_ICONS[currency] || Euro;

  const [applyingField, setApplyingField] = useState<ApplyField | null>(null);
  const [appliedFields, setAppliedFields] = useState<Set<ApplyField>>(new Set());

  // Format suggestedDate as date only (no time)
  const formattedSuggestedDate = result.suggestedDate ? formatDateOnly(result.suggestedDate) : null;

  // Check if apply functionality is available
  const canApply = instanceId && documentId;

  const handleApply = async (
    field: ApplyField,
    value?: string | SuggestedItem | SuggestedTag[]
  ) => {
    // v8 ignore next -- @preserve (ApplyButton not rendered when canApply is false)
    if (!canApply) return;

    setApplyingField(field);
    try {
      const response = await postPaperlessInstancesByIdDocumentsByDocumentIdApply({
        client,
        path: { id: instanceId, documentId },
        body: { field, value },
      });

      if (response.error) {
        console.error('Apply error:', response.error);
        showError('apply.error');
      } else {
        toast.success(t('apply.success'));
        setAppliedFields((prev) => new Set(prev).add(field));
        onApplied?.();
      }
    } catch (err) {
      console.error('Apply exception:', err);
      showError('apply.error');
    } finally {
      setApplyingField(null);
    }
  };

  // Helper to render ApplyButton with current state
  const renderApplyButton = (
    field: ApplyField,
    value?: string | SuggestedItem | SuggestedTag[],
    disabled = false
  ) => {
    if (!canApply) return null;
    return (
      <ApplyButton
        field={field}
        value={value}
        disabled={disabled}
        isApplying={applyingField === field}
        isApplied={appliedFields.has(field)}
        isAnyFieldApplying={applyingField !== null}
        onApply={handleApply}
      />
    );
  };

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
            <ArrowUp className="h-3 w-3" />
            {metadata.inputTokens.toLocaleString()}
          </Badge>
          <Badge
            variant="outline"
            className="border-green-500 whitespace-nowrap text-green-700 dark:text-green-400"
          >
            <ArrowDown className="h-3 w-3" />
            {metadata.outputTokens.toLocaleString()}
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
          {/* Title */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Label className="text-muted-foreground text-xs">{t('analyze.suggestedTitle')}</Label>
              <p className="font-medium">{result.suggestedTitle}</p>
            </div>
            {renderApplyButton('title', result.suggestedTitle)}
          </div>

          {/* Correspondent */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
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
            {result.suggestedCorrespondent &&
              renderApplyButton('correspondent', result.suggestedCorrespondent)}
          </div>

          {/* Document Type */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
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
            {result.suggestedDocumentType &&
              renderApplyButton('documentType', result.suggestedDocumentType)}
          </div>

          {/* Tags */}
          {result.suggestedTags && result.suggestedTags.length > 0 && (
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Label className="text-muted-foreground text-xs">
                  {t('analyze.suggestedTags')}
                </Label>
                <SuggestedTagsList tags={result.suggestedTags} />
              </div>
              {renderApplyButton('tags', result.suggestedTags)}
            </div>
          )}

          {/* Date */}
          {formattedSuggestedDate && (
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Label className="text-muted-foreground text-xs">
                  {t('analyze.suggestedDate')}
                </Label>
                <p>{formattedSuggestedDate}</p>
              </div>
              {renderApplyButton('date', result.suggestedDate)}
            </div>
          )}

          {/* Confidence */}
          <div>
            <Label className="text-muted-foreground text-xs">{t('analyze.confidence')}</Label>
            <p>{Math.round(result.confidence * 100)}%</p>
          </div>

          {/* Reasoning */}
          <div>
            <Label className="text-muted-foreground text-xs">{t('analyze.reasoning')}</Label>
            <p className="text-muted-foreground text-sm">{result.reasoning}</p>
          </div>
        </div>

        {/* Apply All Button */}
        {canApply && (
          <div className="border-t pt-4">
            <Button
              variant="default"
              className="w-full"
              onClick={() => handleApply('all')}
              disabled={applyingField !== null || appliedFields.has('all')}
              data-testid="apply-all"
            >
              {getApplyAllButtonContent(applyingField === 'all', appliedFields.has('all'), t)}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
