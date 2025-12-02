import { useTranslations } from 'next-intl';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import type { AiProviderListItem } from '@repo/api-client';

type ProviderTableRowProps = Readonly<{
  provider: Omit<AiProviderListItem, 'apiKey'>;
  onEdit: (provider: Omit<AiProviderListItem, 'apiKey'>) => void;
  onDelete: (provider: Omit<AiProviderListItem, 'apiKey'>) => void;
  formatDate: (dateString: string) => string;
}>;

export function ProviderTableRow({
  provider,
  onEdit,
  onDelete,
  formatDate,
}: ProviderTableRowProps) {
  const t = useTranslations('admin.aiProviders');

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
}
