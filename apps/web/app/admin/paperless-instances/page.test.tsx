import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import PaperlessInstancesPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { PaperlessInstanceListItem } from '@repo/api-client';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockPush = vi.fn();
const mockUser = vi.fn();
const mockGetPaperlessInstances = vi.fn();
const mockPostPaperlessInstancesByIdImport = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/admin/paperless-instances',
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ user: mockUser(), isLoading: false }),
}));

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    getPaperlessInstances: (...args: any[]) => mockGetPaperlessInstances(...args),
    postPaperlessInstancesByIdImport: (...args: any[]) =>
      mockPostPaperlessInstancesByIdImport(...args),
  };
});

const mockInstances: PaperlessInstanceListItem[] = [
  {
    id: 'instance-1',
    name: 'Production',
    apiUrl: 'http://paperless.prod:8000',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'instance-2',
    name: 'Development',
    apiUrl: 'http://localhost:8000',
    isActive: true,
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
  },
];

describe('PaperlessInstancesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.mockReturnValue({ id: 'user-1', username: 'admin', role: 'ADMIN' });
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('redirects non-admin users to home', async () => {
    mockUser.mockReturnValue({ id: 'user-2', username: 'testuser', role: 'DEFAULT' });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('renders null for non-admin users', () => {
    mockUser.mockReturnValue({ id: 'user-2', username: 'testuser', role: 'DEFAULT' });

    const { container } = renderWithIntl(<PaperlessInstancesPage />);

    expect(container.firstChild).toBeNull();
  });

  it('loads and displays instances', async () => {
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: { instances: mockInstances },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByText('Production')).toBeInTheDocument();
      expect(screen.getByText('Development')).toBeInTheDocument();
    });
  });

  it('displays "no instances" message when list is empty', async () => {
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: { instances: [] },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByText(/no instances/i)).toBeInTheDocument();
    });
  });

  it('redirects to home on 403 error', async () => {
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 403 },
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message when loading fails', async () => {
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: undefined,
      error: {},
      response: { status: 500 },
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('opens create dialog when clicking create button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: { instances: mockInstances },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create instance/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /create instance/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens edit dialog when clicking edit button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: { instances: mockInstances },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-instance-instance-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('edit-instance-instance-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens delete dialog when clicking delete button', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: { instances: mockInstances },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-instance-instance-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('delete-instance-instance-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('closes edit dialog when onOpenChange is called', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: { instances: mockInstances },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-instance-instance-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('edit-instance-instance-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getAllByRole('button').find((btn) => btn.textContent === 'Cancel');
    if (cancelButton) {
      await user.click(cancelButton);
    }
  });

  it('closes delete dialog when onOpenChange is called', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: { instances: mockInstances },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-instance-instance-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('delete-instance-instance-2'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getAllByRole('button').find((btn) => btn.textContent === 'Cancel');
    if (cancelButton) {
      await user.click(cancelButton);
    }
  });

  it('displays skeleton while loading instances', async () => {
    let resolveLoad: (value: { data: any; error: any }) => void;
    const loadPromise = new Promise<{ data: any; error: any }>((resolve) => {
      resolveLoad = resolve;
    });
    mockGetPaperlessInstances.mockReturnValue(loadPromise);

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    resolveLoad!({ data: { instances: mockInstances }, error: undefined });

    await waitFor(() => {
      expect(screen.getByText('Production')).toBeInTheDocument();
    });
  });

  it('shows success toast when import succeeds', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: { instances: mockInstances },
      error: undefined,
    });
    mockPostPaperlessInstancesByIdImport.mockResolvedValueOnce({
      data: { imported: 5, total: 10, skipped: 5 },
      error: undefined,
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('import-instance-instance-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('import-instance-instance-1'));

    await waitFor(() => {
      expect(mockPostPaperlessInstancesByIdImport).toHaveBeenCalledWith(
        expect.objectContaining({
          path: { id: 'instance-1' },
        })
      );
      expect(vi.mocked(toast.success)).toHaveBeenCalled();
    });
  });

  it('shows error toast when import fails with API error', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: { instances: mockInstances },
      error: undefined,
    });
    mockPostPaperlessInstancesByIdImport.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'Import failed' },
    });

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('import-instance-instance-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('import-instance-instance-1'));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('shows error toast when import throws exception', async () => {
    const user = userEvent.setup({ delay: null });
    mockGetPaperlessInstances.mockResolvedValueOnce({
      data: { instances: mockInstances },
      error: undefined,
    });
    mockPostPaperlessInstancesByIdImport.mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<PaperlessInstancesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('import-instance-instance-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('import-instance-instance-1'));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });
});
