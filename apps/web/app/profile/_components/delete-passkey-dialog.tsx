'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { WebAuthnCredential } from '@repo/api-client';

interface DeletePasskeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credential: WebAuthnCredential;
  onDelete: (id: string) => Promise<void>;
}

export function DeletePasskeyDialog({
  open,
  onOpenChange,
  credential,
  onDelete,
}: Readonly<DeletePasskeyDialogProps>) {
  const t = useTranslations('profile.passkeys');
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(credential.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-5 w-5" />
            {t('deleteTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteDescription', { name: credential.name || t('defaultName') })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            data-testid="confirm-delete-passkey"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('deleting')}
              </>
            ) : (
              t('delete')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
