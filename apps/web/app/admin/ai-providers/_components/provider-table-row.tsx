import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, UserPlus, Trash2 } from 'lucide-react';
import type { AiProviderListItem } from '@repo/api-client';
import { useSettings } from '@/components/settings-provider';
import { ProviderLogo } from '@/components/provider-logo';

type ProviderWithPermissions = Omit<AiProviderListItem, 'apiKey'> & {
  canEdit?: boolean;
  isOwner?: boolean;
};

type ProviderTableRowProps = Readonly<{
  provider: ProviderWithPermissions;
  onEdit: (provider: ProviderWithPermissions) => void;
  onDelete: (provider: ProviderWithPermissions) => void;
  onShare?: (provider: ProviderWithPermissions) => void;
  formatDate: (dateString: string) => string;
}>;

export const ProviderTableRow = memo(function ProviderTableRow({
  provider,
  onEdit,
  onDelete,
  onShare,
  formatDate,
}: ProviderTableRowProps) {
  const t = useTranslations('admin.aiProviders');
  const tCommon = useTranslations('common');
  const { settings } = useSettings();
  const showShareButton = settings['security.sharing.mode'] === 'ADVANCED';

  // Default to true for backwards compatibility (owner can always edit)
  const canEdit = provider.canEdit ?? true;
  const isOwner = provider.isOwner ?? true;

  return (
    <TableRow>
      <TableCell className="font-medium">{provider.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ProviderLogo provider={provider.provider} size={20} />
          <span>{t(`providerTypes.${provider.provider}`)}</span>
        </div>
      </TableCell>
      <TableCell className="font-mono text-sm">{provider.model}</TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(provider.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {showShareButton && onShare && isOwner && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onShare(provider)}
                  data-testid={`share-provider-${provider.id}`}
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
                  onClick={() => onEdit(provider)}
                  data-testid={`edit-provider-${provider.id}`}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">{t('editProvider')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('editProvider')}</TooltipContent>
            </Tooltip>
          )}
          {isOwner && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(provider)}
                  data-testid={`delete-provider-${provider.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t('deleteProvider')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('deleteProvider')}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});
