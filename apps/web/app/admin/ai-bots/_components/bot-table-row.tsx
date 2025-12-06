import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, UserPlus, Trash2 } from 'lucide-react';
import type { AiBotListItem } from '@repo/api-client';
import { useSettings } from '@/components/settings-provider';
import { ProviderLogo } from '@/components/provider-logo';

type BotTableRowProps = Readonly<{
  bot: Omit<AiBotListItem, 'apiKey'>;
  onEdit: (bot: Omit<AiBotListItem, 'apiKey'>) => void;
  onDelete: (bot: Omit<AiBotListItem, 'apiKey'>) => void;
  formatDate: (dateString: string) => string;
}>;

export const BotTableRow = memo(function BotTableRow({
  bot,
  onEdit,
  onDelete,
  formatDate,
}: BotTableRowProps) {
  const t = useTranslations('admin.aiBots');
  const tCommon = useTranslations('common');
  const { settings } = useSettings();
  const showShareButton = settings['security.sharing.mode'] === 'ADVANCED';

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
          {showShareButton && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" data-testid={`share-bot-${bot.id}`}>
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
            onClick={() => onEdit(bot)}
            data-testid={`edit-bot-${bot.id}`}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">{t('editBot')}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(bot)}
            data-testid={`delete-bot-${bot.id}`}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t('deleteBot')}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});
