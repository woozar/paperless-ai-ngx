import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Trash2, Download, Loader2, UserPlus, FileText, ListTodo } from 'lucide-react';
import type { PaperlessInstanceListItem } from '@repo/api-client';
import { useSettings } from '@/components/settings-provider';

type InstanceWithPermissions = Omit<PaperlessInstanceListItem, 'apiToken'> & {
  canEdit?: boolean;
  canShare?: boolean;
  isOwner?: boolean;
};

type InstanceTableRowProps = Readonly<{
  instance: InstanceWithPermissions;
  onEdit: (instance: InstanceWithPermissions) => void;
  onDelete: (instance: InstanceWithPermissions) => void;
  onShare?: (instance: InstanceWithPermissions) => void;
  onImport: (instance: InstanceWithPermissions) => void;
  isImporting: boolean;
  formatDate: (dateString: string) => string;
}>;

export const InstanceTableRow = memo(function InstanceTableRow({
  instance,
  onEdit,
  onDelete,
  onShare,
  onImport,
  isImporting,
  formatDate,
}: InstanceTableRowProps) {
  const t = useTranslations('admin.paperlessInstances');
  const tCommon = useTranslations('common');
  const { settings } = useSettings();
  const router = useRouter();
  const showShareButton = settings['security.sharing.mode'] === 'ADVANCED';

  // Default to true for backwards compatibility (owner can always edit/share)
  const canEdit = instance.canEdit ?? true;
  const canShare = instance.canShare ?? instance.isOwner ?? true;
  const isOwner = instance.isOwner ?? true;

  return (
    <TableRow>
      <TableCell className="font-medium">{instance.name}</TableCell>
      <TableCell className="font-mono text-sm">{instance.apiUrl}</TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(instance.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/admin/paperless-instances/${instance.id}/documents`)}
                data-testid={`documents-instance-${instance.id}`}
              >
                <FileText className="h-4 w-4" />
                <span className="sr-only">{tCommon('documents')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{tCommon('documents')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/admin/paperless-instances/${instance.id}/queue`)}
                data-testid={`queue-instance-${instance.id}`}
              >
                <ListTodo className="h-4 w-4" />
                <span className="sr-only">{t('queue')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('queue')}</TooltipContent>
          </Tooltip>
          {showShareButton && onShare && canShare && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onShare(instance)}
                  data-testid={`share-instance-${instance.id}`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="sr-only">{tCommon('share')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tCommon('shareTooltip')}</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>{t('importDocuments')}</TooltipContent>
          </Tooltip>
          {canEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(instance)}
                  data-testid={`edit-instance-${instance.id}`}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">{t('editInstance')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('editInstance')}</TooltipContent>
            </Tooltip>
          )}
          {isOwner && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(instance)}
                  data-testid={`delete-instance-${instance.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t('deleteInstance')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('deleteInstance')}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});
