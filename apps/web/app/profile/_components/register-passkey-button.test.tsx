import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterPasskeyButton } from './register-passkey-button';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockPostAuthWebauthnRegisterOptions = vi.fn();
const mockPostAuthWebauthnRegisterVerify = vi.fn();

vi.mock('@repo/api-client', async () => {
  const actual = await vi.importActual('@repo/api-client');
  return {
    ...actual,
    postAuthWebauthnRegisterOptions: (...args: unknown[]) =>
      mockPostAuthWebauthnRegisterOptions(...args),
    postAuthWebauthnRegisterVerify: (...args: unknown[]) =>
      mockPostAuthWebauthnRegisterVerify(...args),
  };
});

const mockStartRegistration = vi.fn();
const mockBrowserSupportsWebAuthn = vi.fn();

vi.mock('@simplewebauthn/browser', () => ({
  startRegistration: (...args: unknown[]) => mockStartRegistration(...args),
  browserSupportsWebAuthn: () => mockBrowserSupportsWebAuthn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('RegisterPasskeyButton', () => {
  const defaultProps = {
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockBrowserSupportsWebAuthn.mockReturnValue(true);
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('renders the button when WebAuthn is supported', () => {
    renderWithIntl(<RegisterPasskeyButton {...defaultProps} />);
    expect(screen.getByTestId('register-passkey-button')).toBeInTheDocument();
    expect(screen.getByText('Add Passkey')).toBeInTheDocument();
  });

  it('does not render when WebAuthn is not supported', () => {
    mockBrowserSupportsWebAuthn.mockReturnValue(false);
    renderWithIntl(<RegisterPasskeyButton {...defaultProps} />);
    expect(screen.queryByTestId('register-passkey-button')).not.toBeInTheDocument();
  });

  it('successfully registers a passkey', async () => {
    const user = userEvent.setup({ delay: null });
    const onSuccess = vi.fn();

    mockPostAuthWebauthnRegisterOptions.mockResolvedValue({
      data: {
        options: { challenge: 'test-challenge', rp: { name: 'Test' } },
        challengeId: 'challenge-123',
      },
      error: undefined,
    });

    mockStartRegistration.mockResolvedValue({
      id: 'credential-id',
      rawId: 'raw-id',
      response: {
        attestationObject: 'attestation',
        clientDataJSON: 'clientData',
      },
      type: 'public-key',
    });

    mockPostAuthWebauthnRegisterVerify.mockResolvedValue({
      data: { success: true },
      error: undefined,
    });

    renderWithIntl(<RegisterPasskeyButton {...defaultProps} onSuccess={onSuccess} />);

    const button = screen.getByTestId('register-passkey-button');
    await user.click(button);

    await waitFor(() => {
      expect(mockPostAuthWebauthnRegisterOptions).toHaveBeenCalled();
      expect(mockStartRegistration).toHaveBeenCalledWith({
        optionsJSON: expect.objectContaining({ challenge: 'test-challenge' }),
      });
      expect(mockPostAuthWebauthnRegisterVerify).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            response: expect.any(Object),
            challengeId: 'challenge-123',
          },
        })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('shows loading state while registering', async () => {
    const user = userEvent.setup({ delay: null });

    mockPostAuthWebauthnRegisterOptions.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: { options: {}, challengeId: 'challenge-123' },
                error: undefined,
              }),
            100
          )
        )
    );

    renderWithIntl(<RegisterPasskeyButton {...defaultProps} />);

    const button = screen.getByTestId('register-passkey-button');
    await user.click(button);

    expect(screen.getByText('Registering...')).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('handles options API error', async () => {
    const user = userEvent.setup({ delay: null });

    mockPostAuthWebauthnRegisterOptions.mockResolvedValue({
      data: null,
      error: { message: 'Server error' },
    });

    renderWithIntl(<RegisterPasskeyButton {...defaultProps} />);

    const button = screen.getByTestId('register-passkey-button');
    await user.click(button);

    await waitFor(() => {
      expect(mockPostAuthWebauthnRegisterOptions).toHaveBeenCalled();
    });
  });

  it('handles verify API error', async () => {
    const user = userEvent.setup({ delay: null });

    mockPostAuthWebauthnRegisterOptions.mockResolvedValue({
      data: { options: {}, challengeId: 'challenge-123' },
      error: undefined,
    });

    mockStartRegistration.mockResolvedValue({
      id: 'credential-id',
      response: {},
    });

    mockPostAuthWebauthnRegisterVerify.mockResolvedValue({
      data: null,
      error: { message: 'Verification failed' },
    });

    renderWithIntl(<RegisterPasskeyButton {...defaultProps} />);

    const button = screen.getByTestId('register-passkey-button');
    await user.click(button);

    await waitFor(() => {
      expect(mockPostAuthWebauthnRegisterVerify).toHaveBeenCalled();
    });
  });

  it('handles user cancellation gracefully', async () => {
    const user = userEvent.setup({ delay: null });
    const onSuccess = vi.fn();

    mockPostAuthWebauthnRegisterOptions.mockResolvedValue({
      data: { options: {}, challengeId: 'challenge-123' },
      error: undefined,
    });

    const notAllowedError = new Error('User cancelled');
    notAllowedError.name = 'NotAllowedError';
    mockStartRegistration.mockRejectedValue(notAllowedError);

    renderWithIntl(<RegisterPasskeyButton {...defaultProps} onSuccess={onSuccess} />);

    const button = screen.getByTestId('register-passkey-button');
    await user.click(button);

    await waitFor(() => {
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
