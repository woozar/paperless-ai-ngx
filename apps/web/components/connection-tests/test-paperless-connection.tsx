'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AiActionButton } from '@/components/form-inputs/ai-action-button';

type TestPaperlessConnectionProps = Readonly<{
  apiUrl: string;
  apiToken: string;
  onTestResult?: (success: boolean, error?: string) => void;
  children?: (props: { testButton: ReactNode }) => ReactNode;
}>;

export function TestPaperlessConnection({
  apiUrl,
  apiToken,
  onTestResult,
  children,
}: TestPaperlessConnectionProps) {
  const t = useTranslations('setup.paperless');
  const [testing, setTesting] = useState(false);

  const isFormValid = apiUrl.trim().length > 0 && apiToken.trim().length > 0;

  const handleTest = async () => {
    // v8 ignore next -- @preserve
    if (!isFormValid) return;

    setTesting(true);

    try {
      const response = await fetch('/api/test-paperless-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ apiUrl, apiToken }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t('connectionSuccess'));
        onTestResult?.(true);
      } else {
        const errorMessage = data.error?.message || 'connectionError';
        toast.error(t(errorMessage));
        onTestResult?.(false, errorMessage);
      }
    } catch {
      toast.error(t('connectionError'));
      onTestResult?.(false, 'connectionError');
    } finally {
      setTesting(false);
    }
  };

  const testButton = (
    <AiActionButton
      onClick={handleTest}
      disabled={!isFormValid || testing}
      data-testid="test-paperless-connection-button"
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
