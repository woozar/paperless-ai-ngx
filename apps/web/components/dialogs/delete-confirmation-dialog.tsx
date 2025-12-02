'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useErrorDisplay } from '@/hooks/use-error-display';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

type Entity = { id: string; name?: string; username?: string };

type DeleteConfirmationDialogProps<T extends Entity> = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: T | null;
  entityName: string;
  translationNamespace: string;
  successMessageKey: string;
  onDelete: (
    entity: T
  ) => Promise<{ error?: { message: string; params?: Record<string, string | number> } }>;
  onSuccess: () => void;
  warning?: string;
}>;

export function DeleteConfirmationDialog<T extends Entity>({
  open,
  onOpenChange,
  entity,
  entityName,
  translationNamespace,
  successMessageKey,
  onDelete,
  onSuccess,
  warning,
}: DeleteConfirmationDialogProps<T>) {
  const t = useTranslations(translationNamespace);
  const tCommon = useTranslations('common');
  const { showApiError, showSuccess, showError } = useErrorDisplay(translationNamespace);

  const [confirmName, setConfirmName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const displayName = entity?.name ?? entity?.username ?? '';

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setConfirmName('');
      setIsDeleting(false);
    }
  }, [open]);

  const handleSubmit = useCallback(async () => {
    // Assert: entity is always defined here - submit button is disabled when entity is null
    /* v8 ignore if -- @preserve */
    if (!entity) return;

    setIsDeleting(true);

    try {
      const response = await onDelete(entity);

      if (response.error) {
        showApiError(response.error);
      } else {
        showSuccess(successMessageKey);
        onOpenChange(false);
        onSuccess();
      }
    } catch {
      showError('deleteFailed');
    } finally {
      setIsDeleting(false);
    }
  }, [
    entity,
    onDelete,
    showApiError,
    showSuccess,
    showError,
    successMessageKey,
    onOpenChange,
    onSuccess,
  ]);

  const isConfirmationValid = useMemo(
    () => confirmName === displayName,
    [confirmName, displayName]
  );

  const isSubmitDisabled = useMemo(
    () => isDeleting || !isConfirmationValid,
    [isDeleting, isConfirmationValid]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(`delete${entityName}`)}</DialogTitle>
          <DialogDescription>{t('confirmDeleteDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {warning && (
            <div className="text-destructive text-sm" data-testid="delete-warning">
              {warning}
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm">{t('confirmDelete')}</p>
            <Input
              data-testid="confirm-name-input"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              disabled={isDeleting}
              placeholder={displayName}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            data-testid="cancel-delete-button"
          >
            {tCommon('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            data-testid="submit-delete-button"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tCommon('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
