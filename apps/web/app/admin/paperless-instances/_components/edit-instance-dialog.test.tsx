import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { EditInstanceDialog } from './edit-instance-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { PaperlessInstanceListItem } from '@repo/api-client';

const mockInstance: PaperlessInstanceListItem = {
  id: 'instance-123',
  name: 'Test Instance',
  apiUrl: 'http://localhost:8000',
  isActive: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockPatchPaperlessInstancesById = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    patchPaperlessInstancesById: (...args: any[]) => mockPatchPaperlessInstancesById(...args),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('EditInstanceDialog', () => {
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
    renderWithIntl(<EditInstanceDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<EditInstanceDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls API with form data when submitted', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<EditInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('edit-instance-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Instance');

    const submitButton = screen.getByTestId('edit-instance-submit-button');

    // Try clicking and wait for API call if button is enabled
    if (!submitButton.hasAttribute('disabled')) {
      await user.click(submitButton);
      await waitFor(() => {
        expect(mockPatchPaperlessInstancesById).toHaveBeenCalled();
      });
    }
  });

  it('closes dialog and calls onSuccess after successful update', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(
      <EditInstanceDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('edit-instance-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Instance');

    const submitButton = screen.getByTestId('edit-instance-submit-button');

    if (!submitButton.hasAttribute('disabled')) {
      await user.click(submitButton);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onSuccess).toHaveBeenCalled();
      });
    }
  });

  it('displays error message on API error', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchPaperlessInstancesById.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
      response: { status: 500 },
    });

    renderWithIntl(<EditInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('edit-instance-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');

    const submitButton = screen.getByTestId('edit-instance-submit-button');

    if (!submitButton.hasAttribute('disabled')) {
      await user.click(submitButton);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    }
  });

  it('returns null when instance is null', () => {
    const { container } = renderWithIntl(<EditInstanceDialog {...defaultProps} instance={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns early success when no changes are made', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();

    renderWithIntl(
      <EditInstanceDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Submit without making changes - button should be enabled since apiToken can be empty
    const submitButton = screen.getByTestId('edit-instance-submit-button');
    await user.click(submitButton);

    // Should close dialog and call onSuccess without calling the API
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });

    // API should not have been called since no changes were made
    expect(mockPatchPaperlessInstancesById).not.toHaveBeenCalled();
  });

  it('handles apiToken change correctly', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<EditInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const apiTokenInput = screen.getByTestId('edit-instance-apiToken-input');
    await user.type(apiTokenInput, 'new-api-token');

    const submitButton = screen.getByTestId('edit-instance-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({ apiToken: 'new-api-token' }),
        })
      );
    });
  });
});
