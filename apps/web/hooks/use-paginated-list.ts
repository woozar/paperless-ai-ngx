import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  totalPages: number;
};

export type FetchResult<T> =
  | { data: PaginatedResponse<T>; error: undefined }
  | { data: undefined; error: { status: number } };

export type SortDirection = 'asc' | 'desc';
export type SortConfig = { field: string; direction: SortDirection } | null;

export type UsePaginatedListOptions<T, TParams = void> = {
  /**
   * Function to fetch data. Should return standardized format.
   */
  fetchFn: (
    page: number,
    limit: number,
    params: TParams,
    sort: SortConfig
  ) => Promise<FetchResult<T>>;
  /**
   * Callback when an error occurs (excluding redirect cases).
   */
  onError: () => void;
  /**
   * Where to redirect on 403 errors. Defaults to '/'.
   */
  forbiddenRedirect?: string;
  /**
   * Where to redirect on 404 errors. Defaults to forbiddenRedirect.
   */
  notFoundRedirect?: string;
  /**
   * Initial page number. Defaults to 1.
   */
  initialPage?: number;
  /**
   * Initial items per page. Defaults to 10.
   */
  initialLimit?: number;
  /**
   * Initial sort configuration.
   */
  initialSort?: SortConfig;
  /**
   * Extra parameters to pass to fetchFn. When this changes, data is refetched.
   */
  params?: TParams;
};

export function usePaginatedList<T, TParams = void>({
  fetchFn,
  onError,
  forbiddenRedirect = '/',
  notFoundRedirect,
  initialPage = 1,
  initialLimit = 10,
  initialSort = null,
  params,
}: UsePaginatedListOptions<T, TParams>) {
  const router = useRouter();
  const { isLoading: isAuthLoading } = useAuth();

  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [sort, setSort] = useState<SortConfig>(initialSort);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Store params, sort, and onError in refs to use in loadData without causing re-fetches
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const sortRef = useRef(sort);
  sortRef.current = sort;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const loadData = useCallback(
    async (currentPage: number, currentLimit: number) => {
      setIsLoading(true);

      try {
        const result = await fetchFn(
          currentPage,
          currentLimit,
          paramsRef.current as TParams,
          sortRef.current
        );

        if (result.error) {
          const status = result.error.status;
          if (status === 403) {
            router.push(forbiddenRedirect);
            return;
          }
          if (status === 404 && notFoundRedirect) {
            router.push(notFoundRedirect);
            return;
          }
          onErrorRef.current();
          return;
        }

        setItems(result.data.items);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      } catch {
        onErrorRef.current();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn, router, forbiddenRedirect, notFoundRedirect]
  );

  // Reload when auth completes or pagination/params/sort change
  useEffect(() => {
    if (!isAuthLoading) {
      loadData(page, limit);
    }
  }, [isAuthLoading, loadData, page, limit, params, sort]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((field: string) => {
    setSort((currentSort) => {
      if (currentSort?.field !== field) {
        return { field, direction: 'asc' };
      }
      if (currentSort.direction === 'asc') {
        return { field, direction: 'desc' };
      }
      return null;
    });
    setPage(1);
  }, []);

  const reload = useCallback(() => {
    loadData(page, limit);
  }, [loadData, page, limit]);

  return {
    items,
    isLoading,
    page,
    limit,
    sort,
    total,
    totalPages,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    reload,
  };
}
