'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AutoForm } from '@/components/form-inputs/auto-form';
import { TestAiProviderConnection } from '@/components/connection-tests/test-ai-provider-connection';
import { CreateAiAccountFormSchema } from '@/lib/api/schemas/ai-accounts-ui';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { ProviderLogo } from '@/components/provider-logo';

type AiAccountData = {
  id?: string;
  name: string;
  provider: string;
  apiKey: string;
  baseUrl?: string;
  tested: boolean;
};

type StepAiAccountProps = Readonly<{
  data: AiAccountData;
  onChange: (data: Partial<AiAccountData>) => void;
  onNext: (accountId: string) => void;
}>;

export function StepAiAccount({ data, onChange, onNext }: StepAiAccountProps) {
  const t = useTranslations('setup.ai');
  const tCommon = useTranslations('common');
  const { showApiError, showSuccess } = useErrorDisplay('setup.ai');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({
    name: data.name,
    provider: data.provider,
    apiKey: data.apiKey,
    baseUrl: data.baseUrl || '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const handleFormChange = useCallback(
    (newFormData: Record<string, string>, isValid: boolean) => {
      setFormData(newFormData);
      setIsFormValid(isValid);
      onChange({
        name: newFormData.name,
        provider: newFormData.provider,
        apiKey: newFormData.apiKey,
        baseUrl: newFormData.baseUrl,
      });
    },
    [onChange]
  );

  const handleNext = async () => {
    // v8 ignore next -- @preserve
    if (!isFormValid) return;

    // If account already exists (from resume logic), just proceed
    if (data.id) {
      onNext(data.id);
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/ai-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          provider: formData.provider,
          apiKey: formData.apiKey,
          baseUrl: formData.baseUrl || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        showApiError(result.error || { message: 'error.serverError' });
      } else {
        onChange({ id: result.id });
        showSuccess('accountCreated');
        onNext(result.id);
      }
    } catch {
      showApiError({ message: 'error.serverError' });
    } finally {
      setIsCreating(false);
    }
  };

  const renderOptionIcon = useCallback(
    (_fieldName: string, value: string) => <ProviderLogo provider={value} size={20} />,
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">{t('title')}</h3>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </div>

      <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
        <AlertDescription className="text-yellow-700 dark:text-yellow-300">
          {t('costWarning')}
        </AlertDescription>
      </Alert>

      <AutoForm
        schema={CreateAiAccountFormSchema}
        translationNamespace="admin.aiAccounts"
        testIdPrefix="setup-ai-account"
        initialData={{
          name: data.name,
          provider: data.provider as 'openai' | 'anthropic' | 'ollama' | 'google' | 'custom',
          apiKey: data.apiKey,
          baseUrl: data.baseUrl,
        }}
        disabled={!!data.id || isCreating}
        onChange={handleFormChange}
        renderOptionIcon={renderOptionIcon}
        asDiv
      />

      {/* v8 ignore next 11 -- @preserve */}
      {data.id ? (
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleNext}
            disabled={!isFormValid || isCreating}
            data-testid="setup-ai-account-next-button"
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tCommon('next')}
          </Button>
        </div>
      ) : (
        <TestAiProviderConnection
          provider={formData.provider || 'openai'}
          apiKey={formData.apiKey || ''}
          baseUrl={formData.baseUrl}
          onTestResult={(success) => onChange({ tested: success })}
        >
          {({ testButton }) => (
            <div className="flex items-center justify-end gap-3 pt-2">
              {testButton}
              <Button
                onClick={handleNext}
                disabled={!isFormValid || isCreating}
                data-testid="setup-ai-account-next-button"
              >
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {tCommon('next')}
              </Button>
            </div>
          )}
        </TestAiProviderConnection>
      )}
    </div>
  );
}
