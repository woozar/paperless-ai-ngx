'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  startAuthentication,
  browserSupportsWebAuthn,
  type PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';
import { Key, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  postAuthWebauthnAuthenticateOptions,
  postAuthWebauthnAuthenticateVerify,
  type LoginResponse,
} from '@repo/api-client';
import { createPublicClient } from '@/lib/use-api';

interface PasskeyLoginButtonProps {
  onSuccess: (token: string, user: LoginResponse['user']) => void;
  onError?: (message: string) => void;
}

export function PasskeyLoginButton({ onSuccess, onError }: Readonly<PasskeyLoginButtonProps>) {
  const t = useTranslations('auth.login');
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported] = useState(() => browserSupportsWebAuthn());
  const client = useMemo(() => createPublicClient(), []);

  const handlePasskeyLogin = async () => {
    // v8 ignore next 4 -- @preserve
    if (!isSupported) {
      onError?.('passkeyNotSupported');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Get authentication options from server
      const { data: optionsData, error: optionsError } = await postAuthWebauthnAuthenticateOptions({
        client,
        body: {},
      });

      if (optionsError || !optionsData) {
        throw new Error('Failed to get authentication options');
      }

      // Step 2: Start authentication with WebAuthn
      const authenticationResponse = await startAuthentication({
        optionsJSON: optionsData.options as PublicKeyCredentialRequestOptionsJSON,
      });

      // Step 3: Verify with server
      const { data: verifyData, error: verifyError } = await postAuthWebauthnAuthenticateVerify({
        client,
        body: {
          response: authenticationResponse,
          challengeId: optionsData.challengeId,
        },
      });

      if (verifyError || !verifyData) {
        onError?.('passkeyFailed');
        return;
      }

      onSuccess(verifyData.token, verifyData.user);
    } catch (error) {
      // Handle user cancellation gracefully
      if (error instanceof Error && error.name === 'NotAllowedError') {
        // User cancelled - don't show error
        setIsLoading(false);
        return;
      }
      onError?.('passkeyFailed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full text-base"
      onClick={handlePasskeyLogin}
      disabled={isLoading}
      data-testid="passkey-login-button"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('passkeyLoading')}
        </>
      ) : (
        <>
          <Key className="mr-2 h-4 w-4" />
          {t('passkey')}
        </>
      )}
    </Button>
  );
}
