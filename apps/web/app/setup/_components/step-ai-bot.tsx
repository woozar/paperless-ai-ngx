'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutoForm } from '@/components/form-inputs/auto-form';
import { SetupAiBotFormSchema } from '@/lib/api/schemas/ai-bots-ui';
import { useErrorDisplay } from '@/hooks/use-error-display';

type AiBotData = {
  id?: string;
  name: string;
  systemPrompt: string;
  responseLanguage: string;
  documentMode: string;
  pdfMaxSizeMb: string;
};

type StepAiBotProps = Readonly<{
  data: AiBotData;
  aiModelId: string;
  onChange: (data: Partial<AiBotData>) => void;
  onBack: () => void;
  onNext: (botId: string) => void;
}>;

export function StepAiBot({ data, aiModelId, onChange, onBack, onNext }: StepAiBotProps) {
  const t = useTranslations('setup.bot');
  const tCommon = useTranslations('common');
  const { showApiError, showSuccess } = useErrorDisplay('setup.bot');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({
    name: data.name,
    systemPrompt: data.systemPrompt,
    responseLanguage: data.responseLanguage,
    documentMode: data.documentMode,
    pdfMaxSizeMb: data.pdfMaxSizeMb,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const handleFormChange = useCallback(
    (newFormData: Record<string, string>, isValid: boolean) => {
      setFormData(newFormData);
      setIsFormValid(isValid);
      onChange({
        name: newFormData.name,
        systemPrompt: newFormData.systemPrompt,
        responseLanguage: newFormData.responseLanguage,
        documentMode: newFormData.documentMode,
        pdfMaxSizeMb: newFormData.pdfMaxSizeMb,
      });
    },
    [onChange]
  );

  const handleNext = async () => {
    // v8 ignore next -- @preserve
    if (!isFormValid) return;

    // If bot already exists (from resume logic), just proceed
    if (data.id) {
      onNext(data.id);
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/ai-bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          aiModelId: aiModelId,
          systemPrompt: formData.systemPrompt,
          responseLanguage: formData.responseLanguage,
          documentMode: formData.documentMode,
          pdfMaxSizeMb: formData.pdfMaxSizeMb ? Number.parseInt(formData.pdfMaxSizeMb, 10) : null,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        showApiError(result.error || { message: 'error.serverError' });
      } else {
        onChange({ id: result.id });
        showSuccess('botCreated');
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
        schema={SetupAiBotFormSchema}
        translationNamespace="admin.aiBots"
        testIdPrefix="setup-ai-bot"
        initialData={{
          name: data.name,
          systemPrompt: data.systemPrompt,
          responseLanguage: data.responseLanguage as 'DOCUMENT' | 'GERMAN' | 'ENGLISH',
          documentMode: data.documentMode as 'text' | 'pdf',
          pdfMaxSizeMb: data.pdfMaxSizeMb ? Number.parseInt(data.pdfMaxSizeMb, 10) : null,
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
          data-testid="setup-ai-bot-back-button"
        >
          {tCommon('back')}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid || isCreating}
          data-testid="setup-ai-bot-next-button"
        >
          {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {tCommon('next')}
        </Button>
      </div>
    </div>
  );
}
