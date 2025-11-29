import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useErrorDisplay } from './use-error-display';
import { toast } from 'sonner';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

const messages = {
  error: {
    serverError: 'An internal server error occurred',
    notFound: 'Not found',
  },
  admin: {
    users: {
      userCreated: 'User created successfully',
      userUpdated: 'User updated successfully',
      error: {
        loadFailed: 'Failed to load users',
      },
    },
  },
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    {children}
  </NextIntlClientProvider>
);

describe('useErrorDisplay', () => {
  describe('with namespace', () => {
    it('showApiError uses global namespace for API errors', () => {
      const { result } = renderHook(() => useErrorDisplay('admin.users'), { wrapper });

      result.current.showApiError({ message: 'error.serverError' });

      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('An internal server error occurred');
    });

    it('showApiError handles params correctly', () => {
      const { result } = renderHook(() => useErrorDisplay('admin.users'), { wrapper });

      result.current.showApiError({
        message: 'error.serverError',
        params: { code: 500 },
      });

      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });

    it('showSuccess uses scoped namespace', () => {
      const { result } = renderHook(() => useErrorDisplay('admin.users'), { wrapper });

      result.current.showSuccess('userCreated');

      expect(vi.mocked(toast.success)).toHaveBeenCalledWith('User created successfully');
    });

    it('showError uses scoped namespace and adds error prefix', () => {
      const { result } = renderHook(() => useErrorDisplay('admin.users'), { wrapper });

      result.current.showError('loadFailed');

      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to load users');
    });

    it('showInfo uses scoped namespace', () => {
      const { result } = renderHook(() => useErrorDisplay('admin.users'), { wrapper });

      result.current.showInfo('userUpdated');

      expect(vi.mocked(toast.info)).toHaveBeenCalledWith('User updated successfully');
    });
  });

  describe('without namespace', () => {
    it('showApiError uses global namespace', () => {
      const { result } = renderHook(() => useErrorDisplay(), { wrapper });

      result.current.showApiError({ message: 'error.notFound' });

      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Not found');
    });

    it('showSuccess uses global namespace', () => {
      const { result } = renderHook(() => useErrorDisplay(), { wrapper });

      result.current.showSuccess('error.notFound');

      expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Not found');
    });

    it('showError uses global namespace', () => {
      const { result } = renderHook(() => useErrorDisplay(), { wrapper });

      result.current.showError('error.serverError');

      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('An internal server error occurred');
    });
  });
});
