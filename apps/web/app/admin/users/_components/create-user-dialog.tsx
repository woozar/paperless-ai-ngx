'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { useErrorDisplay } from '@/hooks/use-error-display';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@repo/api-client';
import { postUsers } from '@repo/api-client';
import { useApi } from '@/lib/use-api';
import { validatePassword } from '@/lib/utilities/password-validation';

type CreateUserDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}>;

export function CreateUserDialog({ open, onOpenChange, onSuccess }: CreateUserDialogProps) {
  const client = useApi();
  const t = useTranslations('admin.users');
  const tCommon = useTranslations('common');
  const { showApiError, showSuccess, showError } = useErrorDisplay('admin.users');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('DEFAULT');
  const [isCreating, setIsCreating] = useState(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setUsername('');
      setPassword('');
      setRole('DEFAULT');
    }
  }, [open]);

  const handleSubmit = async () => {
    setIsCreating(true);

    try {
      const response = await postUsers({
        client,
        body: { username, password, role },
      });

      if (response.error) {
        showApiError(response.error);
      } else {
        showSuccess('userCreated');
        onOpenChange(false);
        onSuccess();
      }
    } catch {
      showError('createFailed');
    } finally {
      setIsCreating(false);
    }
  };

  const passwordValidation = validatePassword(password);
  const isSubmitDisabled = isCreating || !username || !password || !passwordValidation.isValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('createUser')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="create-username">{t('username')}</Label>
            <Input
              id="create-username"
              data-testid="create-username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isCreating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-password">{t('password')}</Label>
            <PasswordInput
              id="create-password"
              data-testid="create-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isCreating}
              showRules
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-role">{t('role')}</Label>
            <Select
              value={role}
              onValueChange={(value: UserRole) => setRole(value)}
              disabled={isCreating}
            >
              <SelectTrigger id="create-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">{t('default')}</SelectItem>
                <SelectItem value="ADMIN">{t('admin')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            {tCommon('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            data-testid="create-user-submit"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tCommon('loading')}
              </>
            ) : (
              t('createUser')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
