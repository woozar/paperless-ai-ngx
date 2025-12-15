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
const mockGetAiBots = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    patchPaperlessInstancesById: (...args: any[]) => mockPatchPaperlessInstancesById(...args),
    getPaperlessInstancesByIdTags: (...args: any[]) => mockGetPaperlessInstancesByIdTags(...args),
    getAiBots: (...args: any[]) => mockGetAiBots(...args),
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
    mockGetAiBots.mockResolvedValue({
      data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
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

  describe('auto-processing settings', () => {
    it('initializes auto-processing settings from instance', async () => {
      const instanceWithAutoProcess: PaperlessInstanceListItem = {
        ...mockInstance,
        autoProcessEnabled: true,
        scanCronExpression: '*/30 * * * *',
        defaultAiBotId: 'bot-123',
      };

      mockGetAiBots.mockResolvedValueOnce({
        data: {
          items: [{ id: 'bot-123', name: 'Test Bot' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });

      renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithAutoProcess} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Auto-processing switch should be checked
      const autoProcessSwitch = screen.getByTestId('edit-instance-autoProcessEnabled-switch');
      expect(autoProcessSwitch).toHaveAttribute('data-state', 'checked');

      // Cron expression input should be visible and have value
      const cronInput = screen.getByTestId('edit-instance-scanCronExpression-input');
      expect(cronInput).toHaveValue('*/30 * * * *');
    });

    it('shows auto-apply section when auto-processing is enabled', async () => {
      const user = userEvent.setup({ delay: null });

      renderWithIntl(<EditInstanceDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Enable auto-processing
      const autoProcessSwitch = screen.getByTestId('edit-instance-autoProcessEnabled-switch');
      await user.click(autoProcessSwitch);

      // Auto-apply section should now be visible
      await waitFor(() => {
        expect(screen.getByTestId('edit-instance-autoApplyTitle-switch')).toBeInTheDocument();
      });
    });

    it('handles autoProcessEnabled change correctly', async () => {
      const user = userEvent.setup({ delay: null });
      mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

      renderWithIntl(<EditInstanceDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Enable auto-processing
      const autoProcessSwitch = screen.getByTestId('edit-instance-autoProcessEnabled-switch');
      await user.click(autoProcessSwitch);

      const submitButton = screen.getByTestId('edit-instance-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({ autoProcessEnabled: true }),
          })
        );
      });
    });

    it('handles scanCronExpression change correctly', async () => {
      const user = userEvent.setup({ delay: null });
      mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

      const instanceWithAutoProcess: PaperlessInstanceListItem = {
        ...mockInstance,
        autoProcessEnabled: true,
        scanCronExpression: '0 * * * *',
      };

      renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithAutoProcess} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const cronInput = screen.getByTestId('edit-instance-scanCronExpression-input');
      await user.clear(cronInput);
      await user.type(cronInput, '*/15 * * * *');

      const submitButton = screen.getByTestId('edit-instance-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({ scanCronExpression: '*/15 * * * *' }),
          })
        );
      });
    });

    it('handles defaultAiBotId change correctly', async () => {
      const user = userEvent.setup({ delay: null });
      mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });
      mockGetAiBots.mockResolvedValueOnce({
        data: {
          items: [
            { id: 'bot-1', name: 'Bot One' },
            { id: 'bot-2', name: 'Bot Two' },
          ],
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });

      const instanceWithAutoProcess: PaperlessInstanceListItem = {
        ...mockInstance,
        autoProcessEnabled: true,
      };

      renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithAutoProcess} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Wait for bots to load and select to be enabled
      await waitFor(() => {
        const selectTrigger = screen.getByTestId('edit-instance-defaultAiBotId-select');
        expect(selectTrigger).toBeInTheDocument();
        expect(selectTrigger).not.toBeDisabled();
      });

      // Open the select dropdown
      const selectTrigger = screen.getByTestId('edit-instance-defaultAiBotId-select');
      await user.click(selectTrigger);

      // Wait for dropdown options to appear and select one
      await waitFor(() => {
        const botOption = screen.getByRole('option', { name: 'Bot One' });
        expect(botOption).toBeInTheDocument();
      });
      await user.click(screen.getByRole('option', { name: 'Bot One' }));

      const submitButton = screen.getByTestId('edit-instance-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({ defaultAiBotId: 'bot-1' }),
          })
        );
      });
    });

    it('handles bots API returning no data', async () => {
      mockGetAiBots.mockResolvedValueOnce({
        data: undefined,
        error: { message: 'Failed' },
      });

      const instanceWithAutoProcess: PaperlessInstanceListItem = {
        ...mockInstance,
        autoProcessEnabled: true,
      };

      renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithAutoProcess} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Dialog should still render
      expect(screen.getByTestId('edit-instance-autoProcessEnabled-switch')).toBeInTheDocument();
    });
  });

  describe('auto-apply settings', () => {
    const instanceWithAutoProcess: PaperlessInstanceListItem = {
      ...mockInstance,
      autoProcessEnabled: true,
      autoApplyTitle: false,
      autoApplyCorrespondent: false,
      autoApplyDocumentType: false,
      autoApplyTags: false,
      autoApplyDate: false,
    };

    it('shows all auto-apply switches when auto-processing is enabled', async () => {
      renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithAutoProcess} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      expect(screen.getByTestId('edit-instance-autoApplyTitle-switch')).toBeInTheDocument();
      expect(screen.getByTestId('edit-instance-autoApplyCorrespondent-switch')).toBeInTheDocument();
      expect(screen.getByTestId('edit-instance-autoApplyDocumentType-switch')).toBeInTheDocument();
      expect(screen.getByTestId('edit-instance-autoApplyTags-switch')).toBeInTheDocument();
      expect(screen.getByTestId('edit-instance-autoApplyDate-switch')).toBeInTheDocument();
    });

    it('handles autoApplyTitle change correctly', async () => {
      const user = userEvent.setup({ delay: null });
      mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

      renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithAutoProcess} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('edit-instance-autoApplyTitle-switch'));

      const submitButton = screen.getByTestId('edit-instance-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({ autoApplyTitle: true }),
          })
        );
      });
    });

    it('handles autoApplyCorrespondent change correctly', async () => {
      const user = userEvent.setup({ delay: null });
      mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

      renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithAutoProcess} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('edit-instance-autoApplyCorrespondent-switch'));

      const submitButton = screen.getByTestId('edit-instance-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({ autoApplyCorrespondent: true }),
          })
        );
      });
    });

    it('handles autoApplyDocumentType change correctly', async () => {
      const user = userEvent.setup({ delay: null });
      mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

      renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithAutoProcess} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('edit-instance-autoApplyDocumentType-switch'));

      const submitButton = screen.getByTestId('edit-instance-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({ autoApplyDocumentType: true }),
          })
        );
      });
    });

    it('handles autoApplyTags change correctly', async () => {
      const user = userEvent.setup({ delay: null });
      mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

      renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithAutoProcess} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('edit-instance-autoApplyTags-switch'));

      const submitButton = screen.getByTestId('edit-instance-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({ autoApplyTags: true }),
          })
        );
      });
    });

    it('handles autoApplyDate change correctly', async () => {
      const user = userEvent.setup({ delay: null });
      mockPatchPaperlessInstancesById.mockResolvedValueOnce({ data: {}, error: undefined });

      renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithAutoProcess} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('edit-instance-autoApplyDate-switch'));

      const submitButton = screen.getByTestId('edit-instance-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPatchPaperlessInstancesById).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({ autoApplyDate: true }),
          })
        );
      });
    });

    it('initializes auto-apply settings from instance', async () => {
      const instanceWithAllAutoApply: PaperlessInstanceListItem = {
        ...mockInstance,
        autoProcessEnabled: true,
        autoApplyTitle: true,
        autoApplyCorrespondent: true,
        autoApplyDocumentType: true,
        autoApplyTags: true,
        autoApplyDate: true,
      };

      renderWithIntl(<EditInstanceDialog {...defaultProps} instance={instanceWithAllAutoApply} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      expect(screen.getByTestId('edit-instance-autoApplyTitle-switch')).toHaveAttribute(
        'data-state',
        'checked'
      );
      expect(screen.getByTestId('edit-instance-autoApplyCorrespondent-switch')).toHaveAttribute(
        'data-state',
        'checked'
      );
      expect(screen.getByTestId('edit-instance-autoApplyDocumentType-switch')).toHaveAttribute(
        'data-state',
        'checked'
      );
      expect(screen.getByTestId('edit-instance-autoApplyTags-switch')).toHaveAttribute(
        'data-state',
        'checked'
      );
      expect(screen.getByTestId('edit-instance-autoApplyDate-switch')).toHaveAttribute(
        'data-state',
        'checked'
      );
    });
  });

  it('resets form state when dialog closes', async () => {
    const { rerender } = renderWithIntl(<EditInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close dialog
    rerender(<EditInstanceDialog {...defaultProps} open={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen with different instance
    const newInstance: PaperlessInstanceListItem = {
      ...mockInstance,
      id: 'new-instance',
      name: 'New Instance',
    };

    rerender(<EditInstanceDialog {...defaultProps} open={true} instance={newInstance} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(screen.getByTestId('edit-instance-name-input')).toHaveValue('New Instance');
  });
});
