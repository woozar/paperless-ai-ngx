import { useTranslations } from 'next-intl';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { PaperlessInstanceListItem } from '@repo/api-client';

type InstanceTableRowProps = Readonly<{
  instance: Omit<PaperlessInstanceListItem, 'apiToken'>;
  onEdit: (instance: Omit<PaperlessInstanceListItem, 'apiToken'>) => void;
  onDelete: (instance: Omit<PaperlessInstanceListItem, 'apiToken'>) => void;
  formatDate: (dateString: string) => string;
}>;

export function InstanceTableRow({
  instance,
  onEdit,
  onDelete,
  formatDate,
}: InstanceTableRowProps) {
  const t = useTranslations('admin.paperlessInstances');

  return (
    <TableRow>
      <TableCell className="font-medium">{instance.name}</TableCell>
      <TableCell className="font-mono text-sm">{instance.apiUrl}</TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(instance.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
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
}
