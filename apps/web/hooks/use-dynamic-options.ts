'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/lib/use-api';
import { useErrorDisplay } from '@/hooks/use-error-display';
import type { Client } from '@repo/api-client';

type SelectOption = { value: string; label: string };

type ApiResponse<T> = {
  data?: { items: T[] };
  error?: unknown;
};

type UseDynamicOptionsConfig<T> = {
  /** Whether the dialog is open */
  open: boolean;
  /** Function to fetch data from the API */
  fetchFn: (params: { client: Client }) => Promise<ApiResponse<T>>;
  /** Function to map API items to select options */
  mapFn: (item: T) => SelectOption;
  /** Translation namespace for error display */
  translationNamespace: string;
  /** Error key to show when loading fails */
  errorKey: string;
};

/**
 * Hook for loading dynamic select options when a dialog opens.
 * Reduces duplication across create/edit dialogs that need to load
 * related entities (e.g., AI Models loading AI Accounts).
 */
export function useDynamicOptions<T>({
  open,
  fetchFn,
  mapFn,
  translationNamespace,
  errorKey,
}: UseDynamicOptionsConfig<T>): SelectOption[] {
  const client = useApi();
  const { showError } = useErrorDisplay(translationNamespace);
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (open) {
      fetchFn({ client }).then((response) => {
        if (response.error) {
          showError(errorKey);
          setOptions([]);
        } else {
          setOptions((response.data?.items ?? []).map(mapFn));
        }
      });
    }
  }, [open, client, showError, fetchFn, mapFn, errorKey]);

  return options;
}
