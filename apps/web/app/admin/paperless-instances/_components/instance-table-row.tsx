import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Trash2, Download, Loader2, UserPlus } from 'lucide-react';
import type { PaperlessInstanceListItem } from '@repo/api-client';
import { useSettings } from '@/components/settings-provider';

type InstanceTableRowProps = Readonly<{
  instance: Omit<PaperlessInstanceListItem, 'apiToken'>;
  onEdit: (instance: Omit<PaperlessInstanceListItem, 'apiToken'>) => void;
  onDelete: (instance: Omit<PaperlessInstanceListItem, 'apiToken'>) => void;
  onImport: (instance: Omit<PaperlessInstanceListItem, 'apiToken'>) => void;
  isImporting: boolean;
  formatDate: (dateString: string) => string;
}>;

export const InstanceTableRow = memo(function InstanceTableRow({
  instance,
  onEdit,
  onDelete,
  onImport,
  isImporting,
  formatDate,
}: InstanceTableRowProps) {
  const t = useTranslations('admin.paperlessInstances');
  const tCommon = useTranslations('common');
  const { settings } = useSettings();
  const showShareButton = settings['security.sharing.mode'] === 'ADVANCED';

  return (
    <TableRow>
      <TableCell className="font-medium">{instance.name}</TableCell>
      <TableCell className="font-mono text-sm">{instance.apiUrl}</TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(instance.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {showShareButton && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" data-testid={`share-instance-${instance.id}`}>
                  <UserPlus className="h-4 w-4" />
                  <span className="sr-only">{tCommon('share')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tCommon('shareTooltip')}</TooltipContent>
            </Tooltip>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onImport(instance)}
            disabled={isImporting}
            data-testid={`import-instance-${instance.id}`}
          >
            {isImporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="sr-only">{t('importDocuments')}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(instance)}
            data-testid={`edit-instance-${instance.id}`}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">{t('editInstance')}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(instance)}
            data-testid={`delete-instance-${instance.id}`}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t('deleteInstance')}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});
