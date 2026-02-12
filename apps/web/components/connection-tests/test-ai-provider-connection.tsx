'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AiActionButton } from '@/components/form-inputs/ai-action-button';

type TestAiProviderConnectionProps = Readonly<{
  provider: string;
  apiKey: string;
  baseUrl?: string;
  onTestResult?: (success: boolean, error?: string) => void;
  children?: (props: { testButton: ReactNode }) => ReactNode;
}>;

export function TestAiProviderConnection({
  provider,
  apiKey,
  baseUrl,
  onTestResult,
  children,
}: TestAiProviderConnectionProps) {
  const t = useTranslations('setup.ai');
  const [testing, setTesting] = useState(false);

  const isFormValid =
    provider.trim().length > 0 &&
    apiKey.trim().length > 0 &&
    (provider !== 'ollama' && provider !== 'custom' ? true : baseUrl && baseUrl.trim().length > 0);

  const handleTest = async () => {
    // v8 ignore next -- @preserve
    if (!isFormValid) return;

    setTesting(true);

    try {
      const response = await fetch('/api/test-ai-provider-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ provider, apiKey, baseUrl }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t('connectionSuccess'));
        onTestResult?.(true);
      } else {
        const errorKey = data.error?.message || 'connectionError';
        const params = data.error?.params;

        // Use more specific error message if params are available
        if (params?.status) {
          toast.error(t('connectionErrorWithStatus', { status: params.status }));
        } else if (params?.error) {
          toast.error(t('connectionErrorWithDetails', { error: params.error }));
        } else {
          toast.error(t(errorKey));
        }
        onTestResult?.(false, errorKey);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(t('connectionErrorWithDetails', { error: errorMessage }));
      onTestResult?.(false, 'connectionError');
    } finally {
      setTesting(false);
    }
  };

  const testButton = (
    <AiActionButton
      onClick={handleTest}
      disabled={!isFormValid || testing}
      data-testid="test-ai-provider-connection-button"
    >
      {testing && <Loader2 className="h-4 w-4 animate-spin" />}
      {t('testConnection')}
    </AiActionButton>
  );

  // If children is provided, use render prop pattern for custom layout
  if (children) {
    return <>{children({ testButton })}</>;
  }

  // Default layout
  return testButton;
}
