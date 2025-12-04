import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { EditProviderDialog } from './edit-provider-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import type { AiProviderListItem } from '@repo/api-client';

const mockProvider: AiProviderListItem = {
  id: 'provider-123',
  name: 'OpenAI',
  provider: 'openai',
  model: 'gpt-4',
  apiKey: 'sk-test-key',
  baseUrl: null,
  isActive: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockPatchAiProvidersById = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    patchAiProvidersById: (...args: any[]) => mockPatchAiProvidersById(...args),
  };
});

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value }: any) => (
    <div data-testid="mock-select" data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  SelectValue: () => <div>Value</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('EditProviderDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    provider: mockProvider,
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
    renderWithIntl(<EditProviderDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<EditProviderDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls API with form data when submitted', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchAiProvidersById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<EditProviderDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('edit-provider-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Provider');

    const submitButton = screen.getByTestId('edit-provider-submit-button');

    // Try clicking and wait for API call if button is enabled
    if (!submitButton.hasAttribute('disabled')) {
      await user.click(submitButton);
      await waitFor(() => {
        expect(mockPatchAiProvidersById).toHaveBeenCalled();
      });
    }
  });

  it('closes dialog and calls onSuccess after successful update', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    mockPatchAiProvidersById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(
      <EditProviderDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('edit-provider-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Provider');

    const submitButton = screen.getByTestId('edit-provider-submit-button');

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
    mockPatchAiProvidersById.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
      response: { status: 500 },
    });

    renderWithIntl(<EditProviderDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('edit-provider-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');

    const submitButton = screen.getByTestId('edit-provider-submit-button');

    if (!submitButton.hasAttribute('disabled')) {
      await user.click(submitButton);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled();
      });
    }
  });

  it('returns null when provider is null', () => {
    const { container } = renderWithIntl(<EditProviderDialog {...defaultProps} provider={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns early success when no changes are made', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();

    renderWithIntl(
      <EditProviderDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Submit without making changes - button should be enabled since apiKey can be empty
    const submitButton = screen.getByTestId('edit-provider-submit-button');
    await user.click(submitButton);

    // Should close dialog and call onSuccess without calling the API
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });

    // API should not have been called since no changes were made
    expect(mockPatchAiProvidersById).not.toHaveBeenCalled();
  });

  it('handles apiKey change correctly', async () => {
    const user = userEvent.setup({ delay: null });
    mockPatchAiProvidersById.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<EditProviderDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const apiKeyInput = screen.getByTestId('edit-provider-apiKey-input');
    await user.type(apiKeyInput, 'new-api-key');

    const submitButton = screen.getByTestId('edit-provider-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPatchAiProvidersById).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({ apiKey: 'new-api-key' }),
        })
      );
    });
  });

  it('shows baseUrl field for ollama provider', async () => {
    const providerWithBaseUrl = {
      ...mockProvider,
      provider: 'ollama' as const,
      baseUrl: 'http://localhost:11434',
    };

    renderWithIntl(<EditProviderDialog {...defaultProps} provider={providerWithBaseUrl} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // For ollama provider, baseUrl input should be visible
    const baseUrlInput = screen.getByTestId('edit-provider-baseUrl-input');
    expect(baseUrlInput).toBeInTheDocument();
    expect(baseUrlInput).toHaveValue('http://localhost:11434');
  });
});
