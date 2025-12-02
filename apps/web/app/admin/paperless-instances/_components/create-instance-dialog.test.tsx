import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { CreateInstanceDialog } from './create-instance-dialog';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockPostPaperlessInstances = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    postPaperlessInstances: (...args: any[]) => mockPostPaperlessInstances(...args),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('CreateInstanceDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
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
    renderWithIntl(<CreateInstanceDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render dialog when open is false', () => {
    renderWithIntl(<CreateInstanceDialog {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls API with form data when submitted', async () => {
    mockPostPaperlessInstances.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(<CreateInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('create-instance-name-input');
    const apiUrlInput = screen.getByTestId('create-instance-apiUrl-input');
    const apiTokenInput = screen.getByTestId('create-instance-apiToken-input');

    fireEvent.change(nameInput, { target: { value: 'New Instance' } });
    fireEvent.change(apiUrlInput, { target: { value: 'http://localhost:8000' } });
    fireEvent.change(apiTokenInput, { target: { value: 'token123' } });

    const submitButton = screen.getByTestId('create-instance-submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPostPaperlessInstances).toHaveBeenCalledWith(
        expect.objectContaining({
          client: expect.any(Object),
          body: {
            name: 'New Instance',
            apiUrl: 'http://localhost:8000',
            apiToken: 'token123',
          },
        })
      );
    });
  });

  it('closes dialog and calls onSuccess after successful creation', async () => {
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    mockPostPaperlessInstances.mockResolvedValueOnce({ data: {}, error: undefined });

    renderWithIntl(
      <CreateInstanceDialog {...defaultProps} onOpenChange={onOpenChange} onSuccess={onSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('create-instance-name-input');
    const apiUrlInput = screen.getByTestId('create-instance-apiUrl-input');
    const apiTokenInput = screen.getByTestId('create-instance-apiToken-input');

    fireEvent.change(nameInput, { target: { value: 'New Instance' } });
    fireEvent.change(apiUrlInput, { target: { value: 'http://localhost:8000' } });
    fireEvent.change(apiTokenInput, { target: { value: 'token123' } });

    const submitButton = screen.getByTestId('create-instance-submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on API error', async () => {
    mockPostPaperlessInstances.mockResolvedValueOnce({
      data: undefined,
      error: { message: 'error.serverError' },
      response: { status: 500 },
    });

    renderWithIntl(<CreateInstanceDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('create-instance-name-input');
    const apiUrlInput = screen.getByTestId('create-instance-apiUrl-input');
    const apiTokenInput = screen.getByTestId('create-instance-apiToken-input');

    fireEvent.change(nameInput, { target: { value: 'New Instance' } });
    fireEvent.change(apiUrlInput, { target: { value: 'http://localhost:8000' } });
    fireEvent.change(apiTokenInput, { target: { value: 'token123' } });

    const submitButton = screen.getByTestId('create-instance-submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalled();
    });
  });
});
