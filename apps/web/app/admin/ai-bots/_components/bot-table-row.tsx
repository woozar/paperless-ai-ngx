import { useTranslations } from 'next-intl';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { AiBotListItem } from '@repo/api-client';

type BotTableRowProps = Readonly<{
  bot: Omit<AiBotListItem, 'apiKey'>;
  onEdit: (bot: Omit<AiBotListItem, 'apiKey'>) => void;
  onDelete: (bot: Omit<AiBotListItem, 'apiKey'>) => void;
  formatDate: (dateString: string) => string;
}>;

export function BotTableRow({ bot, onEdit, onDelete, formatDate }: BotTableRowProps) {
  const t = useTranslations('admin.aiBots');

  return (
    <TableRow>
      <TableCell className="font-medium">{bot.name}</TableCell>
      <TableCell>{bot.aiProvider.name}</TableCell>
      <TableCell className="text-muted-foreground text-sm">{formatDate(bot.createdAt)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
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
}
