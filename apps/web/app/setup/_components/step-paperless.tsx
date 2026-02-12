'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TestPaperlessConnection } from '@/components/connection-tests/test-paperless-connection';
import { useErrorDisplay } from '@/hooks/use-error-display';

type PaperlessData = {
  name: string;
  apiUrl: string;
  apiToken: string;
  tested: boolean;
  autoProcessEnabled: boolean;
  scanCronExpression: string;
};

type StepPaperlessProps = Readonly<{
  data: PaperlessData;
  aiBotId: string;
  onChange: (data: Partial<PaperlessData>) => void;
  onBack: () => void;
  onComplete: () => void;
}>;

// Scan interval options for user-friendly selection
const SCAN_INTERVAL_OPTIONS = [
  { value: '0 * * * *', labelKey: 'scanIntervalHourly' },
  { value: '0 */6 * * *', labelKey: 'scanInterval6Hours' },
  { value: '0 0 * * *', labelKey: 'scanIntervalDaily' },
] as const;

export function StepPaperless({ data, aiBotId, onChange, onBack, onComplete }: StepPaperlessProps) {
  const t = useTranslations('setup.paperless');
  const tAdmin = useTranslations('admin.paperlessInstances');
  const tCommon = useTranslations('common');
  const { showApiError, showSuccess } = useErrorDisplay('setup');
  const [isCreating, setIsCreating] = useState(false);

  const isFormValid =
    data.name.trim().length > 0 && data.apiUrl.trim().length > 0 && data.apiToken.trim().length > 0;

  const handleFinish = async () => {
    // v8 ignore next -- @preserve
    if (!isFormValid) return;

    setIsCreating(true);

    try {
      const response = await fetch('/api/paperless-instances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          name: data.name,
          apiUrl: data.apiUrl,
          apiToken: data.apiToken,
          autoProcessEnabled: data.autoProcessEnabled,
          scanCronExpression: data.autoProcessEnabled ? data.scanCronExpression : undefined,
          defaultAiBotId: data.autoProcessEnabled ? aiBotId : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        showApiError(result.error || { message: 'error.serverError' });
      } else {
        showSuccess('setupComplete');
        onComplete();
      }
    } catch (error) {
      console.error('Failed to create Paperless instance:', error);
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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="paperless-name">{t('name')}</Label>
          <Input
            id="paperless-name"
            data-testid="setup-paperless-name-input"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={t('namePlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paperless-url">{t('url')}</Label>
          <Input
            id="paperless-url"
            data-testid="setup-paperless-url-input"
            type="url"
            value={data.apiUrl}
            onChange={(e) => onChange({ apiUrl: e.target.value })}
            placeholder={t('urlPlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paperless-token">{t('token')}</Label>
          <Input
            id="paperless-token"
            data-testid="setup-paperless-token-input"
            type="password"
            value={data.apiToken}
            onChange={(e) => onChange({ apiToken: e.target.value })}
            placeholder={t('tokenPlaceholder')}
          />
        </div>

        {/* Auto-Processing Settings */}
        <div className="border-muted-foreground/20 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="paperless-autoProcess">{tAdmin('autoProcessing.enabled')}</Label>
              <p className="text-muted-foreground text-xs">
                {tAdmin('autoProcessing.enabledDescription')}
              </p>
            </div>
            <Switch
              id="paperless-autoProcess"
              checked={data.autoProcessEnabled}
              onCheckedChange={(checked) => onChange({ autoProcessEnabled: checked })}
              data-testid="setup-paperless-autoProcessEnabled-switch"
            />
          </div>

          {data.autoProcessEnabled && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="paperless-scanInterval">{t('autoProcessing.scanInterval')}</Label>
              <Select
                value={data.scanCronExpression}
                onValueChange={(value) => onChange({ scanCronExpression: value })}
              >
                <SelectTrigger
                  id="paperless-scanInterval"
                  data-testid="setup-paperless-scanInterval-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCAN_INTERVAL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                {t('autoProcessing.scanIntervalDescription')}
              </p>
            </div>
          )}
        </div>

        <TestPaperlessConnection
          apiUrl={data.apiUrl}
          apiToken={data.apiToken}
          onTestResult={(success) => onChange({ tested: success })}
        >
          {({ testButton }) => (
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={isCreating}
                data-testid="setup-paperless-back-button"
              >
                {tCommon('back')}
              </Button>
              <div className="flex gap-2">
                {testButton}
                <Button
                  onClick={handleFinish}
                  disabled={!isFormValid || isCreating}
                  data-testid="setup-paperless-finish-button"
                >
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {tCommon('finish')}
                </Button>
              </div>
            </div>
          )}
        </TestPaperlessConnection>
      </div>
    </div>
  );
}
