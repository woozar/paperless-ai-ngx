'use client';

import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

type UserTableSkeletonProps = Readonly<{
  rows?: number;
}>;

export function UserTableSkeleton({ rows = 5 }: UserTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows })
        .map((_, i) => i)
        .map((i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-5 w-32" style={{ animationDelay: `${i * 200}ms` }} />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16" style={{ animationDelay: `${i * 200}ms` }} />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16" style={{ animationDelay: `${i * 200}ms` }} />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-28" style={{ animationDelay: `${i * 200}ms` }} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8" style={{ animationDelay: `${i * 200}ms` }} />
                <Skeleton className="h-8 w-8" style={{ animationDelay: `${i * 200}ms` }} />
                <Skeleton className="h-8 w-8" style={{ animationDelay: `${i * 200}ms` }} />
              </div>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}
