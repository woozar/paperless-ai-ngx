'use client';

import type { ReactNode } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/table-pagination';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown, ChevronsUpDown, Filter } from 'lucide-react';
import type { SortConfig } from '@/hooks/use-paginated-list';

export type ColumnDefinition = {
  label: string;
  align?: 'left' | 'right';
  sortKey?: string;
  filterKey?: string;
  filterPlaceholder?: string;
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
  sort?: SortConfig;
  onSortChange?: (field: string) => void;
  filters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
};

function SortIcon({ field, sort }: Readonly<{ field: string; sort?: SortConfig }>) {
  if (sort?.field !== field) {
    return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />;
  }
  if (sort.direction === 'asc') {
    return <ChevronUp className="ml-1 h-4 w-4" />;
  }
  return <ChevronDown className="ml-1 h-4 w-4" />;
}

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
  sort,
  onSortChange,
  filters,
  onFilterChange,
}: Readonly<PaginatedTableProps>) {
  const hasFilters = columns.some((col) => col.filterKey);

  // Show simple empty message only if no filters are active
  if (isEmpty && !hasFilters) {
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
                <div
                  className={`flex items-center gap-2 ${col.align === 'right' ? 'justify-end' : ''}`}
                >
                  {col.sortKey && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(col.sortKey!)}
                      className="hover:text-foreground inline-flex items-center font-medium"
                    >
                      {col.label}
                      <SortIcon field={col.sortKey} sort={sort} />
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
                  {col.filterKey && onFilterChange && (
                    <div className="relative ml-auto">
                      <Filter className="text-muted-foreground absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2" />
                      <Input
                        placeholder={col.filterPlaceholder ?? ''}
                        value={filters?.[col.filterKey] ?? ''}
                        onChange={(e) => onFilterChange(col.filterKey!, e.target.value)}
                        className="h-7 w-40 pl-7"
                        data-testid={`filter-${col.filterKey}`}
                      />
                    </div>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableHead colSpan={columns.length} className="h-24 text-center">
                <span className="text-muted-foreground">{emptyMessage}</span>
              </TableHead>
            </TableRow>
          ) : (
            children
          )}
        </TableBody>
      </Table>
      {!isEmpty && (
        <TablePagination
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}
