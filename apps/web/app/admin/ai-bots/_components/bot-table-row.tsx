import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, UserPlus, Trash2 } from 'lucide-react';
import type { AiBotListItem } from '@repo/api-client';
import { useSettings } from '@/components/settings-provider';
import { ProviderLogo } from '@/components/provider-logo';

type BotWithPermissions = Omit<AiBotListItem, 'apiKey'> & {
  canEdit?: boolean;
  isOwner?: boolean;
};

type BotTableRowProps = Readonly<{
  bot: BotWithPermissions;
  onEdit: (bot: BotWithPermissions) => void;
  onDelete: (bot: BotWithPermissions) => void;
  onShare?: (bot: BotWithPermissions) => void;
  formatDate: (dateString: string) => string;
}>;

export const BotTableRow = memo(function BotTableRow({
  bot,
  onEdit,
  onDelete,
  onShare,
  formatDate,
}: BotTableRowProps) {
  const t = useTranslations('admin.aiBots');
  const tCommon = useTranslations('common');
  const { settings } = useSettings();
  const showShareButton = settings['security.sharing.mode'] === 'ADVANCED';

  // Default to true for backwards compatibility (owner can always edit)
  const canEdit = bot.canEdit ?? true;
  const isOwner = bot.isOwner ?? true;

  return (
    <TableRow>
      <TableCell className="font-medium">{bot.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ProviderLogo provider={bot.aiProvider.provider} size={20} />
          <span>{bot.aiProvider.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">{formatDate(bot.createdAt)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {showShareButton && onShare && isOwner && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onShare(bot)}
                  data-testid={`share-bot-${bot.id}`}
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
                  onClick={() => onEdit(bot)}
                  data-testid={`edit-bot-${bot.id}`}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">{t('editBot')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('editBot')}</TooltipContent>
            </Tooltip>
          )}
          {isOwner && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(bot)}
                  data-testid={`delete-bot-${bot.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t('deleteBot')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('deleteBot')}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});
