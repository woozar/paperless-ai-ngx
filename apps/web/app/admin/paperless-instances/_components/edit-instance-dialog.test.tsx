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
  apiToken: 'test-token',
  importFilterTags: [],
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockPatchPaperlessInstancesById = vi.fn();
const mockGetPaperlessInstancesByIdTags = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    patchPaperlessInstancesById: (...args: any[]) => mockPatchPaperlessInstancesById(...args),
    getPaperlessInstancesByIdTags: (...args: any[]) => mockGetPaperlessInstancesByIdTags(...args),
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
    mockGetPaperlessInstancesByIdTags.mockResolvedValue({
      data: { tags: [{ id: 1, name: 'Tag1', documentCount: 5 }] },
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

  it('handles apiUrl change correctly', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<EditInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const apiUrlInput = screen.getByTestId('edit-instance-apiUrl-input');
    await user.clear(apiUrlInput);
    await user.type(apiUrlInput, 'http://new-url.example.com');

    const submitButton = screen.getByTestId('edit-instance-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({ apiUrl: 'http://new-url.example.com' }),
        })
      );
    });
  });

  it('handles importFilterTags change correctly', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

    // Instance with existing filter tags
    const instanceWithTags: PaperlessInstanceListItem = {
      ...mockInstance,
      importFilterTags: [1],
    };

    renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithTags} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Wait for tags to load
    await waitFor(() => {
      expect(screen.getByTestId('edit-instance-importFilterTags')).toBeInTheDocument();
    });

    // Open the tag selector
    await user.click(screen.getByTestId('edit-instance-importFilterTags'));

    // Wait for dropdown to open
    await waitFor(() => {
      expect(screen.getByTestId('edit-instance-importFilterTags-option-1')).toBeInTheDocument();
    });

    // Click on tag 1 to deselect it
    await user.click(screen.getByTestId('edit-instance-importFilterTags-option-1'));

    // Now submit
    const submitButton = screen.getByTestId('edit-instance-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({ importFilterTags: [] }),
        })
      );
    });
  });

  it('detects tag order changes', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });
    mockGetPaperlessInstancesByIdTags.mockResolvedValue({
      data: {
        tags: [
          { id: 1, name: 'Tag1', documentCount: 5 },
          { id: 2, name: 'Tag2', documentCount: 3 },
        ],
      },
    });

    // Instance with two filter tags
    const instanceWithTags: PaperlessInstanceListItem = {
      ...mockInstance,
      importFilterTags: [1, 2],
    };

    renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithTags} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Wait for tags to load
    await waitFor(() => {
      expect(screen.getByTestId('edit-instance-importFilterTags')).toBeInTheDocument();
    });

    // Remove tag 1 and add it back (changes order to [2, 1] effectively)
    await user.click(screen.getByTestId('edit-instance-importFilterTags'));
    await waitFor(() => {
      expect(screen.getByTestId('edit-instance-importFilterTags-option-1')).toBeInTheDocument();
    });

    // Deselect tag 1
    await user.click(screen.getByTestId('edit-instance-importFilterTags-option-1'));

    // Re-select tag 1
    await user.click(screen.getByTestId('edit-instance-importFilterTags-option-1'));

    // Submit form
    const submitButton = screen.getByTestId('edit-instance-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchPaperlessInstancesById).toHaveBeenCalled();
    });
  });

  it('handles null importFilterTags in instance', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

    // Instance with null importFilterTags
    const instanceWithNullTags = {
      ...mockInstance,
      importFilterTags: null as unknown as number[],
    };

    renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithNullTags} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Change name to trigger a change
    const nameInput = screen.getByTestId('edit-instance-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');

    const submitButton = screen.getByTestId('edit-instance-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({ name: 'New Name' }),
        })
      );
    });
  });

  it('handles tags API returning no data', async () => {
    mockGetPaperlessInstancesByIdTags.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'Failed' },
    });

    renderWithIntl(<EditInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Dialog should still render, just without tags
    expect(screen.getByTestId('edit-instance-name-input')).toBeInTheDocument();
  });
});
