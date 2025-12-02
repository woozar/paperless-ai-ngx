import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockEntity = {
  id: 'entity-123',
  name: 'Test Entity',
};

const mockOnDelete = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('DeleteConfirmationDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    entity: mockEntity,
    entityName: 'Provider',
    translationNamespace: 'admin.aiProviders',
    successMessageKey: 'providerDeleted',
    onDelete: mockOnDelete,
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dialog when open is true', async () => {
    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows entity name as placeholder', async () => {
    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    expect(input).toHaveAttribute('placeholder', 'Test Entity');
  });

  it('disables submit button when confirmation name does not match', async () => {
    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('submit-delete-button');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when confirmation name matches', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    await user.type(input, 'Test Entity');

    const submitButton = screen.getByTestId('submit-delete-button');
    expect(submitButton).not.toBeDisabled();
  });

  it('calls onDelete and onSuccess after confirmation', async () => {
    const user = userEvent.setup({ delay: null });
    const onSuccess = vi.fn();
    mockOnDelete.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    await user.type(input, 'Test Entity');

    const submitButton = screen.getByTestId('submit-delete-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockEntity);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('displays error toast on API error', async () => {
    const user = userEvent.setup({ delay: null });
    mockOnDelete.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
      response: { status: 500 },
    });

    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    await user.type(input, 'Test Entity');

    const submitButton = screen.getByTestId('submit-delete-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });

  it('displays error toast on exception', async () => {
    const user = userEvent.setup({ delay: null });
    mockOnDelete.mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    await user.type(input, 'Test Entity');

    const submitButton = screen.getByTestId('submit-delete-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Failed to delete provider');
    });
  });

  it('shows loading state while deleting', async () => {
    const user = userEvent.setup({ delay: null });
    let resolveDelete: (value: { data?: any; error?: any }) => void;
    const deletePromise = new Promise<{ data?: any; error?: any }>((resolve) => {
      resolveDelete = resolve;
    });
    mockOnDelete.mockReturnValue(deletePromise);

    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    await user.type(input, 'Test Entity');

    const submitButton = screen.getByTestId('submit-delete-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    resolveDelete!({ data: {}, error: undefined });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('disables inputs while deleting', async () => {
    const user = userEvent.setup({ delay: null });
    let resolveDelete: (value: { data?: any; error?: any }) => void;
    const deletePromise = new Promise<{ data?: any; error?: any }>((resolve) => {
      resolveDelete = resolve;
    });
    mockOnDelete.mockReturnValue(deletePromise);

    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    await user.type(input, 'Test Entity');

    const submitButton = screen.getByTestId('submit-delete-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(input).toBeDisabled();
    });

    resolveDelete!({ data: {}, error: undefined });

    // Wait for the component to process the resolved promise
    await waitFor(() => {
      expect(input).not.toBeDisabled();
    });
  });

  it('calls onOpenChange with false when cancel button is clicked', async () => {
    const onOpenChange = vi.fn();
    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} onOpenChange={onOpenChange} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getByTestId('cancel-delete-button');
    await userEvent.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('resets form when dialog closes', async () => {
    const user = userEvent.setup({ delay: null });
    const { rerender } = renderWithIntl(<DeleteConfirmationDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    await user.type(input, 'Test');

    rerender(<DeleteConfirmationDialog {...defaultProps} open={false} />);
    rerender(<DeleteConfirmationDialog {...defaultProps} open={true} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const newInput = screen.getByTestId('confirm-name-input');
    expect(newInput).toHaveValue('');
  });

  it('supports entities with username property', async () => {
    const userEntity = {
      id: 'user-123',
      username: 'testuser',
    };

    renderWithIntl(
      <DeleteConfirmationDialog
        {...defaultProps}
        entity={userEntity}
        entityName="User"
        translationNamespace="admin.users"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByTestId('confirm-name-input');
    expect(input).toHaveAttribute('placeholder', 'testuser');
  });

  it('displays warning message when provided', async () => {
    const warningText = 'This will delete 5 processed documents and 3 queue entries.';
    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} warning={warningText} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const warningElement = screen.getByTestId('delete-warning');
    expect(warningElement).toBeInTheDocument();
    expect(warningElement).toHaveTextContent(warningText);
  });

  it('does not display warning element when warning is undefined', async () => {
    renderWithIntl(<DeleteConfirmationDialog {...defaultProps} warning={undefined} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('delete-warning')).not.toBeInTheDocument();
  });
});
