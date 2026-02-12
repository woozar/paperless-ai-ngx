'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AiActionButton } from '@/components/form-inputs/ai-action-button';

type TestAiModelConnectionProps = Readonly<{
  aiAccountId: string;
  modelIdentifier: string;
  onTestResult?: (success: boolean, error?: string) => void;
  children?: (props: { testButton: ReactNode }) => ReactNode;
}>;

export function TestAiModelConnection({
  aiAccountId,
  modelIdentifier,
  onTestResult,
  children,
}: TestAiModelConnectionProps) {
  const t = useTranslations('setup.model');
  const [testing, setTesting] = useState(false);

  const isFormValid = aiAccountId.trim().length > 0 && modelIdentifier.trim().length > 0;

  const handleTest = async () => {
    // v8 ignore next -- @preserve
    if (!isFormValid) return;

    setTesting(true);

    try {
      const response = await fetch('/api/test-ai-model-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ aiAccountId, modelIdentifier }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t('connectionSuccess'));
        onTestResult?.(true);
      } else {
        const errorKey = data.error?.message || 'connectionError';
        const params = data.error?.params;

        if (params?.error) {
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
      data-testid="test-ai-model-connection-button"
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
