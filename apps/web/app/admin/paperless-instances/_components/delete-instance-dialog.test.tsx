import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteInstanceDialog } from './delete-instance-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { PaperlessInstanceListItem } from '@repo/api-client';

const mockInstance: PaperlessInstanceListItem = {
  id: 'instance-123',
  name: 'Test Instance',
  apiUrl: 'http://localhost:8000',
  apiToken: 'mock-api-token',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockDeletePaperlessInstancesById = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    deletePaperlessInstancesById: (...args: any[]) => mockDeletePaperlessInstancesById(...args),
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
});
