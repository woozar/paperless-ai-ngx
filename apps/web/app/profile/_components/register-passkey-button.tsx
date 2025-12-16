'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  startRegistration,
  browserSupportsWebAuthn,
  type PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/browser';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { useApi } from '@/lib/use-api';
import { postAuthWebauthnRegisterOptions, postAuthWebauthnRegisterVerify } from '@repo/api-client';

interface RegisterPasskeyButtonProps {
  onSuccess?: () => void;
}

export function RegisterPasskeyButton({ onSuccess }: Readonly<RegisterPasskeyButtonProps>) {
  const t = useTranslations('profile.passkeys');
  const { showError } = useErrorDisplay('profile.passkeys');
  const client = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported] = useState(() => browserSupportsWebAuthn());

  const handleRegister = async () => {
    // v8 ignore next 4 -- @preserve
    if (!isSupported) {
      showError('notSupported');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Get registration options from server
      const { data: optionsData, error: optionsError } = await postAuthWebauthnRegisterOptions({
        client,
        body: {},
      });

      if (optionsError || !optionsData) {
        throw new Error('Failed to get registration options');
      }

      // Step 2: Start registration with WebAuthn
      const registrationResponse = await startRegistration({
        optionsJSON: optionsData.options as PublicKeyCredentialCreationOptionsJSON,
      });

      // Step 3: Verify with server
      const { error: verifyError } = await postAuthWebauthnRegisterVerify({
        client,
        body: {
          response: registrationResponse,
          challengeId: optionsData.challengeId,
        },
      });

      if (verifyError) {
        throw new Error('Registration failed');
      }

      toast.success(t('registered'));
      onSuccess?.();
    } catch (error) {
      // Handle user cancellation gracefully
      if (error instanceof Error && error.name === 'NotAllowedError') {
        // User cancelled - don't show error
        return;
      }
      showError('registerFailed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button onClick={handleRegister} disabled={isLoading} data-testid="register-passkey-button">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('registering')}
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          {t('add')}
        </>
      )}
    </Button>
  );
}
