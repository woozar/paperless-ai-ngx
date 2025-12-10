import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePaginatedList, type FetchResult } from './use-paginated-list';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ isLoading: false }),
}));

type TestItem = { id: string; name: string };

describe('usePaginatedList', () => {
  const mockFetchFn =
    vi.fn<(page: number, limit: number, params: undefined) => Promise<FetchResult<TestItem>>>();
  const mockOnError = vi.fn();

  const defaultItems: TestItem[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchFn.mockResolvedValue({
      data: { items: defaultItems, total: 2, totalPages: 1 },
      error: undefined,
    });
  });

  it('fetches data on mount', async () => {
    const { result } = renderHook(() =>
      usePaginatedList({
        fetchFn: mockFetchFn,
        onError: mockOnError,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchFn).toHaveBeenCalledWith(1, 10, undefined);
    expect(result.current.items).toEqual(defaultItems);
    expect(result.current.total).toBe(2);
    expect(result.current.totalPages).toBe(1);
  });

  it('updates page when handlePageChange is called', async () => {
    const { result } = renderHook(() =>
      usePaginatedList({
        fetchFn: mockFetchFn,
        onError: mockOnError,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handlePageChange(2);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });

    expect(mockFetchFn).toHaveBeenCalledWith(2, 10, undefined);
  });

  it('resets to page 1 when handleLimitChange is called', async () => {
    const { result } = renderHook(() =>
      usePaginatedList({
        fetchFn: mockFetchFn,
        onError: mockOnError,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // First go to page 2
    act(() => {
      result.current.handlePageChange(2);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });

    // Then change limit
    act(() => {
      result.current.handleLimitChange(25);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
      expect(result.current.limit).toBe(25);
    });

    expect(mockFetchFn).toHaveBeenCalledWith(1, 25, undefined);
  });

  it('reloads data when reload is called', async () => {
    const { result } = renderHook(() =>
      usePaginatedList({
        fetchFn: mockFetchFn,
        onError: mockOnError,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Clear mock and reload
    mockFetchFn.mockClear();

    act(() => {
      result.current.reload();
    });

    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalled();
    });
  });

  it('redirects on 403 error', async () => {
    mockFetchFn.mockResolvedValueOnce({
      data: undefined,
      error: { status: 403 },
    });

    renderHook(() =>
      usePaginatedList({
        fetchFn: mockFetchFn,
        onError: mockOnError,
      })
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('uses custom forbiddenRedirect', async () => {
    mockFetchFn.mockResolvedValueOnce({
      data: undefined,
      error: { status: 403 },
    });

    renderHook(() =>
      usePaginatedList({
        fetchFn: mockFetchFn,
        onError: mockOnError,
        forbiddenRedirect: '/admin',
      })
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });

  it('redirects on 404 when notFoundRedirect is provided', async () => {
    mockFetchFn.mockResolvedValueOnce({
      data: undefined,
      error: { status: 404 },
    });

    renderHook(() =>
      usePaginatedList({
        fetchFn: mockFetchFn,
        onError: mockOnError,
        notFoundRedirect: '/not-found',
      })
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/not-found');
    });
  });

  it('calls onError for 404 when notFoundRedirect is not provided', async () => {
    mockFetchFn.mockResolvedValueOnce({
      data: undefined,
      error: { status: 404 },
    });

    renderHook(() =>
      usePaginatedList({
        fetchFn: mockFetchFn,
        onError: mockOnError,
      })
    );

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('calls onError on other errors', async () => {
    mockFetchFn.mockResolvedValueOnce({
      data: undefined,
      error: { status: 500 },
    });

    renderHook(() =>
      usePaginatedList({
        fetchFn: mockFetchFn,
        onError: mockOnError,
      })
    );

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
    });
  });

  it('calls onError when fetch throws', async () => {
    mockFetchFn.mockRejectedValueOnce(new Error('Network error'));

    renderHook(() =>
      usePaginatedList({
        fetchFn: mockFetchFn,
        onError: mockOnError,
      })
    );

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
    });
  });

  it('uses custom initial values', async () => {
    const { result } = renderHook(() =>
      usePaginatedList({
        fetchFn: mockFetchFn,
        onError: mockOnError,
        initialPage: 2,
        initialLimit: 25,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.page).toBe(2);
    expect(result.current.limit).toBe(25);
    expect(mockFetchFn).toHaveBeenCalledWith(2, 25, undefined);
  });

  it('passes params to fetchFn', async () => {
    type ParamType = { filter: string };
    const mockFetchWithParams =
      vi.fn<(page: number, limit: number, params: ParamType) => Promise<FetchResult<TestItem>>>();
    mockFetchWithParams.mockResolvedValue({
      data: { items: defaultItems, total: 2, totalPages: 1 },
      error: undefined,
    });

    renderHook(() =>
      usePaginatedList<TestItem, ParamType>({
        fetchFn: mockFetchWithParams,
        onError: mockOnError,
        params: { filter: 'active' },
      })
    );

    await waitFor(() => {
      expect(mockFetchWithParams).toHaveBeenCalledWith(1, 10, { filter: 'active' });
    });
  });

  it('refetches when params change', async () => {
    type ParamType = { filter: string };
    const mockFetchWithParams =
      vi.fn<(page: number, limit: number, params: ParamType) => Promise<FetchResult<TestItem>>>();
    mockFetchWithParams.mockResolvedValue({
      data: { items: defaultItems, total: 2, totalPages: 1 },
      error: undefined,
    });

    const { rerender } = renderHook(
      ({ params }) =>
        usePaginatedList<TestItem, ParamType>({
          fetchFn: mockFetchWithParams,
          onError: mockOnError,
          params,
        }),
      { initialProps: { params: { filter: 'active' } } }
    );

    await waitFor(() => {
      expect(mockFetchWithParams).toHaveBeenCalledWith(1, 10, { filter: 'active' });
    });

    rerender({ params: { filter: 'inactive' } });

    await waitFor(() => {
      expect(mockFetchWithParams).toHaveBeenCalledWith(1, 10, { filter: 'inactive' });
    });
  });
});
