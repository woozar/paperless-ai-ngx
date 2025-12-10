import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDynamicOptions } from './use-dynamic-options';

// Mock useApi
vi.mock('@/lib/use-api', () => ({
  useApi: () => ({}),
}));

// Mock useErrorDisplay
const mockShowError = vi.fn();
vi.mock('@/hooks/use-error-display', () => ({
  useErrorDisplay: () => ({ showError: mockShowError }),
}));

describe('useDynamicOptions', () => {
  const mockMapFn = vi.fn((item: { id: string; name: string }) => ({
    value: item.id,
    label: item.name,
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array when dialog is closed', () => {
    const fetchFn = vi.fn();

    const { result } = renderHook(() =>
      useDynamicOptions({
        open: false,
        fetchFn,
        mapFn: mockMapFn,
        translationNamespace: 'test',
        errorKey: 'error.loading',
      })
    );

    expect(result.current).toEqual([]);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('fetches and maps options when dialog opens', async () => {
    const mockItems = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];
    const fetchFn = vi.fn().mockResolvedValue({ data: { items: mockItems } });
    const localMapFn = vi.fn((item: { id: string; name: string }) => ({
      value: item.id,
      label: item.name,
    }));

    const { result } = renderHook(() =>
      useDynamicOptions({
        open: true,
        fetchFn,
        mapFn: localMapFn,
        translationNamespace: 'test',
        errorKey: 'error.loading',
      })
    );

    await waitFor(() => {
      expect(result.current).toEqual([
        { value: '1', label: 'Item 1' },
        { value: '2', label: 'Item 2' },
      ]);
    });

    expect(fetchFn).toHaveBeenCalled();
    // mapFn is called for each item - verify the result directly instead of call count
    // because React strict mode may cause multiple renders
    expect(localMapFn).toHaveBeenCalled();
  });

  it('shows error and returns empty array on fetch error', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ error: 'API Error' });

    const { result } = renderHook(() =>
      useDynamicOptions({
        open: true,
        fetchFn,
        mapFn: mockMapFn,
        translationNamespace: 'test',
        errorKey: 'error.loading',
      })
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('error.loading');
    });

    expect(result.current).toEqual([]);
  });

  it('handles response with undefined items', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ data: {} });

    const { result } = renderHook(() =>
      useDynamicOptions({
        open: true,
        fetchFn,
        mapFn: mockMapFn,
        translationNamespace: 'test',
        errorKey: 'error.loading',
      })
    );

    await waitFor(() => {
      expect(fetchFn).toHaveBeenCalled();
    });

    expect(result.current).toEqual([]);
    expect(mockShowError).not.toHaveBeenCalled();
  });

  it('handles response with undefined data', async () => {
    const fetchFn = vi.fn().mockResolvedValue({});

    const { result } = renderHook(() =>
      useDynamicOptions({
        open: true,
        fetchFn,
        mapFn: mockMapFn,
        translationNamespace: 'test',
        errorKey: 'error.loading',
      })
    );

    await waitFor(() => {
      expect(fetchFn).toHaveBeenCalled();
    });

    expect(result.current).toEqual([]);
    expect(mockShowError).not.toHaveBeenCalled();
  });
});
