import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, UserPlus, Trash2 } from 'lucide-react';
import type { AiModelListItem } from '@repo/api-client';
import { useSettings } from '@/components/settings-provider';
import { ProviderLogo } from '@/components/provider-logo';

type ModelWithPermissions = AiModelListItem & {
  canEdit?: boolean;
  canShare?: boolean;
  isOwner?: boolean;
};

type ModelTableRowProps = Readonly<{
  model: ModelWithPermissions;
  onEdit: (model: ModelWithPermissions) => void;
  onDelete: (model: ModelWithPermissions) => void;
  onShare?: (model: ModelWithPermissions) => void;
  formatDate: (dateString: string) => string;
}>;

export const ModelTableRow = memo(function ModelTableRow({
  model,
  onEdit,
  onDelete,
  onShare,
  formatDate,
}: ModelTableRowProps) {
  const t = useTranslations('admin.aiModels');
  const tCommon = useTranslations('common');
  const { settings } = useSettings();
  const showShareButton = settings['security.sharing.mode'] === 'ADVANCED';

  // Default to true for backwards compatibility (owner can always edit/share)
  const canEdit = model.canEdit ?? true;
  const canShare = model.canShare ?? model.isOwner ?? true;
  const isOwner = model.isOwner ?? true;

  return (
    <TableRow>
      <TableCell className="font-medium">{model.name}</TableCell>
      <TableCell className="font-mono text-sm">{model.modelIdentifier}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ProviderLogo provider={model.aiAccount.provider} size={20} />
          <span>{model.aiAccount.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">{formatDate(model.createdAt)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {showShareButton && onShare && canShare && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onShare(model)}
                  data-testid={`share-model-${model.id}`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="sr-only">{tCommon('share')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tCommon('shareTooltip')}</TooltipContent>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(model)}
                  data-testid={`edit-model-${model.id}`}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">{t('editModel')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('editModel')}</TooltipContent>
            </Tooltip>
          )}
          {isOwner && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(model)}
                  data-testid={`delete-model-${model.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t('deleteModel')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('deleteModel')}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});
