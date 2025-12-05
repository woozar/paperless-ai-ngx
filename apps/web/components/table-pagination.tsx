'use client';

import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TablePaginationProps = Readonly<{
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}>;

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const MIN_PAGE_SIZE = PAGE_SIZE_OPTIONS[0]!;

export function TablePagination({
  page,
  limit,
  total,
  totalPages,
  isLoading = false,
  onPageChange,
  onLimitChange,
}: TablePaginationProps) {
  const t = useTranslations('common.pagination');

  // Auto-navigate to last valid page when current page is empty
  useEffect(() => {
    if (isLoading || total === 0) return;

    const maxPage = Math.ceil(total / limit);
    if (page > maxPage) onPageChange(maxPage);
  }, [isLoading, total, limit, page, onPageChange]);

  // Hide pagination when loading or when all items fit on one page (using min page size)
  if (isLoading || total <= MIN_PAGE_SIZE) {
    return null;
  }

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-muted-foreground text-sm">
        {t('showing', { start: startItem, end: endItem, total })}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm">{t('rowsPerPage')}</span>
          <Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v))}>
            <SelectTrigger className="h-8 w-[70px]" data-testid="pagination-limit-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            data-testid="pagination-first"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            data-testid="pagination-prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="px-2 text-sm">
            {t('pageOf', { page, totalPages: Math.max(1, totalPages) })}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            data-testid="pagination-next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            data-testid="pagination-last"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
