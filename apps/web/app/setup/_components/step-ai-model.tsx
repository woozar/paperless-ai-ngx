'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutoForm } from '@/components/form-inputs/auto-form';
import { SetupAiModelFormSchema } from '@/lib/api/schemas/ai-models-ui';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { TestAiModelConnection } from '@/components/connection-tests/test-ai-model-connection';

type AiModelData = {
  id?: string;
  name: string;
  modelIdentifier: string;
  inputTokenPrice: string;
  outputTokenPrice: string;
};

type StepAiModelProps = Readonly<{
  data: AiModelData;
  aiAccountId: string;
  onChange: (data: Partial<AiModelData>) => void;
  onBack: () => void;
  onNext: (modelId: string) => void;
}>;

export function StepAiModel({ data, aiAccountId, onChange, onBack, onNext }: StepAiModelProps) {
  const t = useTranslations('setup.model');
  const tCommon = useTranslations('common');
  const { showApiError, showSuccess } = useErrorDisplay('setup.model');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({
    name: data.name,
    modelIdentifier: data.modelIdentifier,
    inputTokenPrice: data.inputTokenPrice,
    outputTokenPrice: data.outputTokenPrice,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const handleFormChange = useCallback(
    (newFormData: Record<string, string>, isValid: boolean) => {
      setFormData(newFormData);
      setIsFormValid(isValid);
      onChange({
        name: newFormData.name,
        modelIdentifier: newFormData.modelIdentifier,
        inputTokenPrice: newFormData.inputTokenPrice,
        outputTokenPrice: newFormData.outputTokenPrice,
      });
    },
    [onChange]
  );

  const handleNext = async () => {
    // v8 ignore next -- @preserve
    if (!isFormValid) return;

    // If model already exists (from resume logic), just proceed
    if (data.id) {
      onNext(data.id);
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/ai-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          modelIdentifier: formData.modelIdentifier,
          aiAccountId: aiAccountId,
          inputTokenPrice: formData.inputTokenPrice
            ? Number.parseFloat(formData.inputTokenPrice.replace(',', '.'))
            : null,
          outputTokenPrice: formData.outputTokenPrice
            ? Number.parseFloat(formData.outputTokenPrice.replace(',', '.'))
            : null,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        showApiError(result.error || { message: 'error.serverError' });
      } else {
        onChange({ id: result.id });
        showSuccess('modelCreated');
        onNext(result.id);
      }
    } catch {
      showApiError({ message: 'error.serverError' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">{t('title')}</h3>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </div>

      <AutoForm
        schema={SetupAiModelFormSchema}
        translationNamespace="admin.aiModels"
        testIdPrefix="setup-ai-model"
        initialData={{
          name: data.name,
          modelIdentifier: data.modelIdentifier,
          inputTokenPrice: data.inputTokenPrice ? Number.parseFloat(data.inputTokenPrice) : null,
          outputTokenPrice: data.outputTokenPrice ? Number.parseFloat(data.outputTokenPrice) : null,
        }}
        disabled={!!data.id || isCreating}
        onChange={handleFormChange}
        asDiv
      />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isCreating}
          data-testid="setup-ai-model-back-button"
        >
          {tCommon('back')}
        </Button>
        <div className="flex gap-2">
          {!data.id && (
            <TestAiModelConnection
              aiAccountId={aiAccountId}
              modelIdentifier={formData.modelIdentifier || ''}
            />
          )}
          <Button
            onClick={handleNext}
            disabled={!isFormValid || isCreating}
            data-testid="setup-ai-model-next-button"
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tCommon('next')}
          </Button>
        </div>
      </div>
    </div>
  );
}
