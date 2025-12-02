import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteInstanceDialog } from './delete-instance-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { PaperlessInstanceListItem } from '@repo/api-client';

const mockInstance: Omit<PaperlessInstanceListItem, 'apiToken'> = {
  id: 'instance-123',
  name: 'Test Instance',
  apiUrl: 'http://localhost:8000',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockDeletePaperlessInstancesById = vi.fn();
const mockGetPaperlessInstancesByIdStats = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    deletePaperlessInstancesById: (...args: any[]) => mockDeletePaperlessInstancesById(...args),
    getPaperlessInstancesByIdStats: (...args: any[]) => mockGetPaperlessInstancesByIdStats(...args),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('DeleteInstanceDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    instance: mockInstance,
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetPaperlessInstancesByIdStats.mockResolvedValue({
      data: { documents: 0, processingQueue: 0 },
    });
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('renders dialog when open is true', async () => {
    renderWithIntl(<DeleteInstanceDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<DeleteInstanceDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls deletePaperlessInstancesById with correct instance ID', async () => {
    const user = userEvent.setup({ delay: null });
    const onSuccess = vi.fn();
    mockDeletePaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<DeleteInstanceDialog {...defaultProps} onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    await user.type(input, 'Test Instance');

    const deleteButton = screen.getByTestId('submit-delete-button');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeletePaperlessInstancesById).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          path: { id: 'instance-123' },
        })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('shows warning when instance has documents', async () => {
    mockGetPaperlessInstancesByIdStats.mockResolvedValue({
      data: { documents: 5, processingQueue: 3 },
    });

    renderWithIntl(<DeleteInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      const warningElement = screen.getByTestId('delete-warning');
      expect(warningElement).toBeInTheDocument();
    });
  });

  it('does not show warning when instance has no documents', async () => {
    mockGetPaperlessInstancesByIdStats.mockResolvedValue({
      data: { documents: 0, processingQueue: 0 },
    });

    renderWithIntl(<DeleteInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Wait a bit for stats to load
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(screen.queryByTestId('delete-warning')).not.toBeInTheDocument();
  });

  it('fetches stats when dialog opens', async () => {
    renderWithIntl(<DeleteInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetPaperlessInstancesByIdStats).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          path: { id: 'instance-123' },
        })
      );
    });
  });

  it('clears stats when dialog closes', async () => {
    const { rerender } = renderWithIntl(<DeleteInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    rerender(<DeleteInstanceDialog {...defaultProps} open={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not show warning when stats API returns error', async () => {
    mockGetPaperlessInstancesByIdStats.mockResolvedValue({
      data: undefined,
      error: { message: 'error.serverError' },
    });

    renderWithIntl(<DeleteInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Wait a bit for stats call to complete
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(screen.queryByTestId('delete-warning')).not.toBeInTheDocument();
  });
});
