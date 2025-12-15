'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { TagMultiselect, type TagOption } from '@/components/ui/tag-multiselect';
import { useApi } from '@/lib/use-api';
import { useErrorDisplay } from '@/hooks/use-error-display';
import {
  patchPaperlessInstancesById,
  getPaperlessInstancesByIdTags,
  getAiBots,
  type PaperlessInstanceListItem,
  type AiBotListItem,
} from '@repo/api-client';

type EditInstanceDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance: Omit<PaperlessInstanceListItem, 'apiToken'> | null;
  onSuccess: () => void;
}>;

type FormState = {
  name: string;
  apiUrl: string;
  apiToken: string;
  importFilterTags: number[];
  autoProcessEnabled: boolean;
  scanCronExpression: string;
  defaultAiBotId: string | null;
  autoApplyTitle: boolean;
  autoApplyCorrespondent: boolean;
  autoApplyDocumentType: boolean;
  autoApplyTags: boolean;
  autoApplyDate: boolean;
};

type InstanceFields = Omit<PaperlessInstanceListItem, 'apiToken'>;

function buildChanges(formState: FormState, instance: InstanceFields): Record<string, unknown> {
  const changes: Record<string, unknown> = {};

  // Simple field comparisons (fields that exist on instance)
  type ComparableField = Exclude<keyof FormState, 'apiToken' | 'importFilterTags'>;
  const simpleFields: Array<{ key: ComparableField; defaultValue?: unknown }> = [
    { key: 'name' },
    { key: 'apiUrl' },
    { key: 'autoProcessEnabled', defaultValue: false },
    { key: 'scanCronExpression', defaultValue: '0 * * * *' },
    { key: 'defaultAiBotId', defaultValue: null },
    { key: 'autoApplyTitle', defaultValue: false },
    { key: 'autoApplyCorrespondent', defaultValue: false },
    { key: 'autoApplyDocumentType', defaultValue: false },
    { key: 'autoApplyTags', defaultValue: false },
    { key: 'autoApplyDate', defaultValue: false },
  ];

  for (const { key, defaultValue } of simpleFields) {
    const formValue = formState[key];
    const instanceValue = instance[key] ?? defaultValue;
    if (formValue !== instanceValue) {
      changes[key] = formValue;
    }
  }

  // API token: only include if not empty (not on instance type)
  if (formState.apiToken !== '') {
    changes.apiToken = formState.apiToken;
  }

  // Compare importFilterTags arrays
  const originalTags = instance.importFilterTags ?? [];
  const tagsChanged =
    formState.importFilterTags.length !== originalTags.length ||
    formState.importFilterTags.some((tag, i) => tag !== originalTags[i]);
  if (tagsChanged) {
    changes.importFilterTags = formState.importFilterTags;
  }

  return changes;
}

export function EditInstanceDialog({
  open,
  onOpenChange,
  instance,
  onSuccess,
}: EditInstanceDialogProps) {
  const t = useTranslations('admin.paperlessInstances');
  const tCommon = useTranslations('common');
  const client = useApi();
  const { showApiError, showSuccess } = useErrorDisplay('admin.paperlessInstances');

  const [name, setName] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [importFilterTags, setImportFilterTags] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<TagOption[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-processing settings
  const [autoProcessEnabled, setAutoProcessEnabled] = useState(false);
  const [scanCronExpression, setScanCronExpression] = useState('0 * * * *');
  const [defaultAiBotId, setDefaultAiBotId] = useState<string | null>(null);
  const [availableBots, setAvailableBots] = useState<AiBotListItem[]>([]);
  const [isLoadingBots, setIsLoadingBots] = useState(false);

  // Auto-apply settings
  const [autoApplyTitle, setAutoApplyTitle] = useState(false);
  const [autoApplyCorrespondent, setAutoApplyCorrespondent] = useState(false);
  const [autoApplyDocumentType, setAutoApplyDocumentType] = useState(false);
  const [autoApplyTags, setAutoApplyTags] = useState(false);
  const [autoApplyDate, setAutoApplyDate] = useState(false);

  // Reset form when dialog opens/closes or instance changes
  useEffect(() => {
    if (open && instance) {
      setName(instance.name);
      setApiUrl(instance.apiUrl);
      setApiToken('');
      setImportFilterTags(instance.importFilterTags ?? []);

      // Auto-processing settings
      setAutoProcessEnabled(instance.autoProcessEnabled ?? false);
      setScanCronExpression(instance.scanCronExpression ?? '0 * * * *');
      setDefaultAiBotId(instance.defaultAiBotId ?? null);

      // Auto-apply settings
      setAutoApplyTitle(instance.autoApplyTitle ?? false);
      setAutoApplyCorrespondent(instance.autoApplyCorrespondent ?? false);
      setAutoApplyDocumentType(instance.autoApplyDocumentType ?? false);
      setAutoApplyTags(instance.autoApplyTags ?? false);
      setAutoApplyDate(instance.autoApplyDate ?? false);

      // Load available tags
      setIsLoadingTags(true);
      getPaperlessInstancesByIdTags({
        client,
        path: { id: instance.id },
      })
        .then((response) => {
          if (response.data) {
            setAvailableTags(response.data.tags);
          }
        })
        .finally(() => {
          setIsLoadingTags(false);
        });

      // Load available AI bots
      setIsLoadingBots(true);
      getAiBots({ client })
        .then((response) => {
          if (response.data) {
            setAvailableBots(response.data.items);
          }
        })
        .finally(() => {
          setIsLoadingBots(false);
        });
    } else {
      setName('');
      setApiUrl('');
      setApiToken('');
      setImportFilterTags([]);
      setAvailableTags([]);
      setAutoProcessEnabled(false);
      setScanCronExpression('0 * * * *');
      setDefaultAiBotId(null);
      setAvailableBots([]);
      setAutoApplyTitle(false);
      setAutoApplyCorrespondent(false);
      setAutoApplyDocumentType(false);
      setAutoApplyTags(false);
      setAutoApplyDate(false);
    }
  }, [open, instance, client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // v8 ignore next -- @preserve (form not rendered when instance is null, see line 134)
    if (!instance) return;

    setIsSubmitting(true);

    try {
      const formState: FormState = {
        name,
        apiUrl,
        apiToken,
        importFilterTags,
        autoProcessEnabled,
        scanCronExpression,
        defaultAiBotId,
        autoApplyTitle,
        autoApplyCorrespondent,
        autoApplyDocumentType,
        autoApplyTags,
        autoApplyDate,
      };

      const changes = buildChanges(formState, instance);

      // If no changes, just close with success
      if (Object.keys(changes).length === 0) {
        onOpenChange(false);
        onSuccess();
        return;
      }

      const response = await patchPaperlessInstancesById({
        client,
        path: { id: instance.id },
        body: changes,
      });

      if (response.error) {
        showApiError(response.error);
      } else {
        showSuccess('instanceUpdated');
        onOpenChange(false);
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate cron expression (basic: 5-6 space-separated parts)
  const isValidCron = (cron: string) => {
    const parts = cron.trim().split(/\s+/);
    return parts.length >= 5 && parts.length <= 6;
  };

  const isFormValid =
    name.trim().length > 0 &&
    apiUrl.trim().length > 0 &&
    isValidCron(scanCronExpression) &&
    !isSubmitting;

  // v8 ignore next -- @preserve
  const preventInteractOutside = (e: Event) => e.preventDefault();

  if (!instance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} onInteractOutside={preventInteractOutside}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('editInstance')}</DialogTitle>
            <DialogDescription>{instance.name}</DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4">
            {/* Basic Settings */}
            <div className="space-y-2">
              <Label htmlFor="edit-instance-name" className="block">
                {t('name')}
              </Label>
              <Input
                id="edit-instance-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                data-testid="edit-instance-name-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-instance-apiUrl" className="block">
                {t('apiUrl')}
              </Label>
              <Input
                id="edit-instance-apiUrl"
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                disabled={isSubmitting}
                data-testid="edit-instance-apiUrl-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-instance-apiToken" className="block">
                {t('apiToken')}
              </Label>
              <Input
                id="edit-instance-apiToken"
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder={t('apiTokenPlaceholder')}
                disabled={isSubmitting}
                data-testid="edit-instance-apiToken-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-instance-importFilterTags" className="block">
                {t('importFilter')}
              </Label>
              <TagMultiselect
                options={availableTags}
                selected={importFilterTags}
                onChange={setImportFilterTags}
                placeholder={t('selectTags')}
                emptyMessage={t('noTagsFound')}
                disabled={isSubmitting}
                isLoading={isLoadingTags}
                testId="edit-instance-importFilterTags"
              />
              <p className="text-muted-foreground text-xs">{t('importFilterDescription')}</p>
            </div>

            {/* Auto-Processing Section */}
            <div className="border-muted-foreground/20 border-t pt-4">
              <h3 className="mb-3 text-sm font-medium">{t('autoProcessing.title')}</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="edit-instance-autoProcessEnabled">
                      {t('autoProcessing.enabled')}
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      {t('autoProcessing.enabledDescription')}
                    </p>
                  </div>
                  <Switch
                    id="edit-instance-autoProcessEnabled"
                    checked={autoProcessEnabled}
                    onCheckedChange={setAutoProcessEnabled}
                    disabled={isSubmitting}
                    data-testid="edit-instance-autoProcessEnabled-switch"
                  />
                </div>

                {autoProcessEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-instance-scanCronExpression" className="block">
                        {t('autoProcessing.scanInterval')}
                      </Label>
                      <Input
                        id="edit-instance-scanCronExpression"
                        value={scanCronExpression}
                        onChange={(e) => setScanCronExpression(e.target.value)}
                        placeholder="0 * * * *"
                        disabled={isSubmitting}
                        data-testid="edit-instance-scanCronExpression-input"
                      />
                      <p className="text-muted-foreground text-xs">
                        {t('autoProcessing.scanIntervalDescription')}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-instance-defaultAiBotId" className="block">
                        {t('autoProcessing.defaultAiBot')}
                      </Label>
                      <Select
                        value={defaultAiBotId ?? ''}
                        onValueChange={setDefaultAiBotId}
                        disabled={isSubmitting || isLoadingBots}
                      >
                        <SelectTrigger
                          id="edit-instance-defaultAiBotId"
                          data-testid="edit-instance-defaultAiBotId-select"
                        >
                          <SelectValue placeholder={t('autoProcessing.selectAiBot')} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableBots.map((bot) => (
                            <SelectItem key={bot.id} value={bot.id}>
                              {bot.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-muted-foreground text-xs">
                        {t('autoProcessing.defaultAiBotDescription')}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Auto-Apply Section */}
            {autoProcessEnabled && (
              <div className="border-muted-foreground/20 border-t pt-4">
                <h3 className="mb-3 text-sm font-medium">{t('autoApply.title')}</h3>
                <p className="text-muted-foreground mb-3 text-xs">{t('autoApply.description')}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-instance-autoApplyTitle">
                      {t('autoApply.title_field')}
                    </Label>
                    <Switch
                      id="edit-instance-autoApplyTitle"
                      checked={autoApplyTitle}
                      onCheckedChange={setAutoApplyTitle}
                      disabled={isSubmitting}
                      data-testid="edit-instance-autoApplyTitle-switch"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-instance-autoApplyCorrespondent">
                      {t('autoApply.correspondent')}
                    </Label>
                    <Switch
                      id="edit-instance-autoApplyCorrespondent"
                      checked={autoApplyCorrespondent}
                      onCheckedChange={setAutoApplyCorrespondent}
                      disabled={isSubmitting}
                      data-testid="edit-instance-autoApplyCorrespondent-switch"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-instance-autoApplyDocumentType">
                      {t('autoApply.documentType')}
                    </Label>
                    <Switch
                      id="edit-instance-autoApplyDocumentType"
                      checked={autoApplyDocumentType}
                      onCheckedChange={setAutoApplyDocumentType}
                      disabled={isSubmitting}
                      data-testid="edit-instance-autoApplyDocumentType-switch"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-instance-autoApplyTags">{t('autoApply.tags')}</Label>
                    <Switch
                      id="edit-instance-autoApplyTags"
                      checked={autoApplyTags}
                      onCheckedChange={setAutoApplyTags}
                      disabled={isSubmitting}
                      data-testid="edit-instance-autoApplyTags-switch"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-instance-autoApplyDate">{t('autoApply.date')}</Label>
                    <Switch
                      id="edit-instance-autoApplyDate"
                      checked={autoApplyDate}
                      onCheckedChange={setAutoApplyDate}
                      disabled={isSubmitting}
                      data-testid="edit-instance-autoApplyDate-switch"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              data-testid="edit-instance-cancel-button"
            >
              {tCommon('cancel')}
            </Button>
            <Button type="submit" disabled={!isFormValid} data-testid="edit-instance-submit-button">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tCommon('loading')}
                </>
              ) : (
                tCommon('save')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
