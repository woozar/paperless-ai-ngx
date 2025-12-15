'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const COLORS = [
  'bg-amber-500/10',
  'bg-blue-500/10',
  'bg-green-500/10',
  'bg-green-500/10',
  'bg-red-500/10',
];

export function QueueTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <TableRow key={`skeleton-row-${i}`}>
          <TableCell>
            <Skeleton className="h-4 w-96" />
          </TableCell>
          <TableCell>
            <Skeleton className={`h-6 w-28 rounded-full ${COLORS[i]}`} />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-12" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end">
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
