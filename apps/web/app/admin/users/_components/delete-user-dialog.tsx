'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import type { UserListItem } from '@repo/api-client';
import { deleteUsersById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';

type DeleteUserDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserListItem | null;
  onSuccess: () => void;
}>;

export function DeleteUserDialog({ open, onOpenChange, user, onSuccess }: DeleteUserDialogProps) {
  const client = useApi();
  const t = useTranslations('admin.users');
  const tCommon = useTranslations('common');
  const { showApiError, showSuccess, showError } = useErrorDisplay('admin.users');

  const [confirmUsername, setConfirmUsername] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset state when dialog closes or user changes
  useEffect(() => {
    if (!open) {
      setConfirmUsername('');
      setIsDeleting(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    // Assert: user is always defined here - submit button is disabled when user is null (see isSubmitDisabled)
    /* v8 ignore if -- @preserve */
    if (!user) return;

    setIsDeleting(true);

    try {
      const response = await deleteUsersById({
        client,
        path: { id: user.id },
      });

      if (response.error) {
        showApiError(response.error);
      } else {
        showSuccess('userDeleted');
        onOpenChange(false);
        onSuccess();
      }
    } catch {
      showError('deleteFailed');
    } finally {
      setIsDeleting(false);
    }
  };

  const isConfirmationValid = confirmUsername === user?.username;
  const isSubmitDisabled = isDeleting || !isConfirmationValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('deleteUser')}</DialogTitle>
          <DialogDescription>{t('confirmDeleteDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm">
            {t('confirmDelete')} <strong>{user?.username}</strong>
          </p>
          <Input
            data-testid="delete-confirm-input"
            value={confirmUsername}
            onChange={(e) => setConfirmUsername(e.target.value)}
            placeholder={user?.username}
            disabled={isDeleting}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            {tCommon('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            data-testid="delete-user-submit"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tCommon('loading')}
              </>
            ) : (
              tCommon('delete')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
