import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, UserPlus, Trash2 } from 'lucide-react';
import type { AiProviderListItem } from '@repo/api-client';
import { useSettings } from '@/components/settings-provider';

type ProviderTableRowProps = Readonly<{
  provider: Omit<AiProviderListItem, 'apiKey'>;
  onEdit: (provider: Omit<AiProviderListItem, 'apiKey'>) => void;
  onDelete: (provider: Omit<AiProviderListItem, 'apiKey'>) => void;
  formatDate: (dateString: string) => string;
}>;

export const ProviderTableRow = memo(function ProviderTableRow({
  provider,
  onEdit,
  onDelete,
  formatDate,
}: ProviderTableRowProps) {
  const t = useTranslations('admin.aiProviders');
  const tCommon = useTranslations('common');
  const { settings } = useSettings();
  const showShareButton = settings['security.sharing.mode'] === 'ADVANCED';

  return (
    <TableRow>
      <TableCell className="font-medium">{provider.name}</TableCell>
      <TableCell>
        <Badge variant="outline">{t(`providerTypes.${provider.provider}`)}</Badge>
      </TableCell>
      <TableCell className="font-mono text-sm">{provider.model}</TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(provider.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {showShareButton && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" data-testid={`share-provider-${provider.id}`}>
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
            onClick={() => onEdit(provider)}
            data-testid={`edit-provider-${provider.id}`}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">{t('editProvider')}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(provider)}
            data-testid={`delete-provider-${provider.id}`}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t('deleteProvider')}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});
