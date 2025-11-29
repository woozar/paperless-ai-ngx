import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

/**
 * Custom toast hook that handles translation namespaces intelligently.
 *
 * API errors always use the global namespace (error keys from backend).
 * Success and local error messages use the provided namespace.
 *
 * @param namespace - Optional namespace for scoped translations (e.g., 'admin.users')
 *
 * @example
 * ```tsx
 * const { showApiError, showSuccess } = useAppToast('admin.users');
 *
 * // API error - uses global namespace
 * if (response.error) {
 *   showApiError(response.error);
 * }
 *
 * // Success message - uses 'admin.users' namespace
 * showSuccess('userCreated');
 * ```
 */
export function useErrorDisplay(namespace?: string) {
  const tGlobal = useTranslations();
  const tScoped = useTranslations(namespace);

  /**
   * Shows an error toast from an API error response.
   * Always uses the global namespace for translation.
   */
  const showApiError = (error: { message: string; params?: Parameters<typeof tGlobal>[1] }) => {
    toast.error(tGlobal(error.message, error.params));
  };

  /**
   * Shows a success toast message.
   * Uses the scoped namespace if provided, otherwise global.
   */
  const showSuccess = (key: string, params?: Parameters<typeof tGlobal>[1]) => {
    const translator = namespace ? tScoped : tGlobal;
    toast.success(translator(key, params));
  };

  /**
   * Shows an error toast message.
   * Uses the scoped namespace if provided, otherwise global.
   * Automatically prefixes with 'error.' when a namespace is provided.
   */
  const showError = (key: string, params?: Parameters<typeof tGlobal>[1]) => {
    const translator = namespace ? tScoped : tGlobal;
    const errorKey = namespace ? `error.${key}` : key;
    toast.error(translator(errorKey, params));
  };

  /**
   * Shows an info toast message.
   * Uses the scoped namespace if provided, otherwise global.
   */
  const showInfo = (key: string, params?: Parameters<typeof tGlobal>[1]) => {
    const translator = namespace ? tScoped : tGlobal;
    toast.info(translator(key, params));
  };

  return {
    showApiError,
    showSuccess,
    showError,
    showInfo,
  };
}
