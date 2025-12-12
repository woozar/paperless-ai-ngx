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
import { TagMultiselect, type TagOption } from '@/components/ui/tag-multiselect';
import { useApi } from '@/lib/use-api';
import { useErrorDisplay } from '@/hooks/use-error-display';
import {
  patchPaperlessInstancesById,
  getPaperlessInstancesByIdTags,
  type PaperlessInstanceListItem,
} from '@repo/api-client';

type EditInstanceDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance: Omit<PaperlessInstanceListItem, 'apiToken'> | null;
  onSuccess: () => void;
}>;

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

  // Reset form when dialog opens/closes or instance changes
  useEffect(() => {
    if (open && instance) {
      setName(instance.name);
      setApiUrl(instance.apiUrl);
      setApiToken('');
      setImportFilterTags(instance.importFilterTags ?? []);

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
    } else {
      setName('');
      setApiUrl('');
      setApiToken('');
      setImportFilterTags([]);
      setAvailableTags([]);
    }
  }, [open, instance, client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // v8 ignore next -- @preserve (form not rendered when instance is null, see line 134)
    if (!instance) return;

    setIsSubmitting(true);

    try {
      // Build changes object - only include changed fields
      const changes: Record<string, unknown> = {};

      if (name !== instance.name) changes.name = name;
      if (apiUrl !== instance.apiUrl) changes.apiUrl = apiUrl;
      if (apiToken !== '') changes.apiToken = apiToken;

      // Compare importFilterTags arrays
      const originalTags = instance.importFilterTags ?? [];
      const tagsChanged =
        importFilterTags.length !== originalTags.length ||
        importFilterTags.some((tag, i) => tag !== originalTags[i]);
      if (tagsChanged) changes.importFilterTags = importFilterTags;

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

  const isFormValid = name.trim().length > 0 && apiUrl.trim().length > 0 && !isSubmitting;

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

          <div className="space-y-4 py-4">
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
