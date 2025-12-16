'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { WebAuthnCredential } from '@repo/api-client';

interface RenamePasskeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credential: WebAuthnCredential;
  onRename: (id: string, name: string) => Promise<void>;
}

export function RenamePasskeyDialog({
  open,
  onOpenChange,
  credential,
  onRename,
}: Readonly<RenamePasskeyDialogProps>) {
  const t = useTranslations('profile.passkeys');
  const [name, setName] = useState(credential.name || '');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName(credential.name || '');
    }
  }, [open, credential.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onRename(credential.id, name);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('renameTitle')}</DialogTitle>
          <DialogDescription className="sr-only">{t('renameDescription')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="passkey-name" className="block">
                {t('nameLabel')}
              </Label>
              <Input
                id="passkey-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                data-testid="passkey-name-input"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} data-testid="save-passkey-name">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('saving')}
                </>
              ) : (
                t('save')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
