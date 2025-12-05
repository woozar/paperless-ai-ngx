import { useMemo } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/components/settings-provider';

export function ProviderTableSkeleton() {
  const { settings } = useSettings();
  const sharingMode = settings?.['security.sharing.mode'];
  const showShareButton = useMemo(() => sharingMode === 'ADVANCED', [sharingMode]);
  // Standard buttons: Edit, Delete (2) + optional Share (1)
  const buttonCount = showShareButton ? 3 : 2;

  return (
    <>
      {Array.from({ length: 3 })
        .map((_, i) => i)
        .map((i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {Array.from({ length: buttonCount })
                  .map((_, j) => j)
                  .map((j) => (
                    <Skeleton key={j} className="h-9 w-9 rounded-md" />
                  ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}
