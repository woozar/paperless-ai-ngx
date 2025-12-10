'use client';

import type { ReactNode } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/table-pagination';

export type ColumnDefinition = {
  label: string;
  align?: 'left' | 'right';
  // Future: sortKey?: string;
};

type PaginatedTableProps = {
  isEmpty: boolean;
  isLoading: boolean;
  emptyMessage: string;
  columns: ColumnDefinition[];
  children: ReactNode;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export function PaginatedTable({
  isEmpty,
  isLoading,
  emptyMessage,
  columns,
  children,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: Readonly<PaginatedTableProps>) {
  if (isEmpty) {
    return <div className="text-muted-foreground py-12 text-center">{emptyMessage}</div>;
  }

  return (
    <div className="bg-card rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.label}
                className={col.align === 'right' ? 'text-right' : undefined}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
      <TablePagination
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}
