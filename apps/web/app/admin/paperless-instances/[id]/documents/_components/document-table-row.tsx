import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Eye, FileSearch } from 'lucide-react';
import type { DocumentListItem } from '@repo/api-client';

type DocumentTableRowProps = Readonly<{
  document: DocumentListItem;
  onAnalyze: (document: DocumentListItem) => void;
  onViewResult: (document: DocumentListItem) => void;
  onPreview: (document: DocumentListItem) => void;
  formatDate: (dateString: string) => string;
}>;

export const DocumentTableRow = memo(function DocumentTableRow({
  document,
  onAnalyze,
  onViewResult,
  onPreview,
  formatDate,
}: DocumentTableRowProps) {
  const t = useTranslations('admin.documents');
  const isProcessed = document.status === 'processed';

  return (
    <TableRow>
      <TableCell className="max-w-md truncate font-medium" title={document.title}>
        {document.title}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={
            document.status === 'processed'
              ? 'border-blue-500 text-blue-700 dark:text-blue-400'
              : undefined
          }
        >
          {t(`status.${document.status}`)}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {document.documentDate ? formatDate(document.documentDate) : '—'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          {isProcessed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onViewResult(document)}
                  data-testid={`view-result-${document.id}`}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">{t('result.viewButton')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('result.viewButton')}</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onAnalyze(document)}
                data-testid={`analyze-document-${document.id}`}
              >
                <Sparkles className="h-4 w-4" />
                <span className="sr-only">{t('analyze.button')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('analyze.button')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPreview(document)}
                data-testid={`preview-document-${document.id}`}
              >
                <FileSearch className="h-4 w-4" />
                <span className="sr-only">{t('preview.button')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('preview.button')}</TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
});
