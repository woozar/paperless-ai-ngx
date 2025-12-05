'use client';

import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/components/settings-provider';

type ColumnConfig = {
  width: string; // Tailwind width class, e.g., 'w-32'
  height?: string; // Tailwind height class, defaults to 'h-4'
};

type TableSkeletonProps = Readonly<{
  columns: ColumnConfig[];
  rows?: number;
  baseButtonCount: number;
  hasShareButton?: boolean;
}>;

export function TableSkeleton({
  columns,
  rows = 3,
  baseButtonCount,
  hasShareButton = true,
}: TableSkeletonProps) {
  const { settings } = useSettings();
  const sharingMode = settings?.['security.sharing.mode'];
  const showShareButton = hasShareButton && sharingMode === 'ADVANCED';
  const buttonCount = showShareButton ? baseButtonCount + 1 : baseButtonCount;

  return (
    <>
      {Array.from({ length: rows })
        .map((_, i) => i)
        .map((i) => (
          <TableRow key={i}>
            {columns.map((col, colIndex) => (
              <TableCell key={`skeleton-cell-${colIndex}`}>
                <Skeleton
                  className={`${col.height ?? 'h-4'} ${col.width} animate-pulse duration-1000`}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              </TableCell>
            ))}
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {Array.from({ length: buttonCount })
                  .map((_, j) => j)
                  .map((j) => (
                    <Skeleton
                      key={j}
                      className="h-9 w-9 animate-pulse rounded-md duration-1000"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}
