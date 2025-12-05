'use client';

import { useMemo } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/components/settings-provider';

type UserTableSkeletonProps = Readonly<{
  rows?: number;
}>;

export function UserTableSkeleton({ rows = 5 }: UserTableSkeletonProps) {
  const { settings } = useSettings();
  const sharingMode = settings?.['security.sharing.mode'];
  // User table currently always has 3 buttons: Toggle Status, Edit, Delete
  // Sharing is not yet implemented for users directly in the row, but checking to be consistent if it changes
  // Actually, UserTableRow has 3 buttons hardcoded. Sharing logic is in BotTableRow.
  // Let's keep it at 3 for UserTableSkeleton as it matches UserTableRow.

  return (
    <>
      {Array.from({ length: rows })
        .map((_, i) => i)
        .map((i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton
                className="h-5 w-32 animate-pulse duration-1000"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            </TableCell>
            <TableCell>
              <Skeleton
                className="h-5 w-16 animate-pulse duration-1000"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            </TableCell>
            <TableCell>
              <Skeleton
                className="h-5 w-16 animate-pulse duration-1000"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            </TableCell>
            <TableCell>
              <Skeleton
                className="h-5 w-28 animate-pulse duration-1000"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Skeleton
                  className="h-9 w-9 rounded-md"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
                <Skeleton
                  className="h-9 w-9 rounded-md"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
                <Skeleton
                  className="h-9 w-9 rounded-md"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}
