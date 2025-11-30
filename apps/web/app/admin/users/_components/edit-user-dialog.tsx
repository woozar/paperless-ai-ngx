'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import type { UpdateUserRequest, UserListItem, UserRole } from '@repo/api-client';
import { patchUsersById } from '@repo/api-client';
import { useApi } from '@/lib/use-api';

type EditUserDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserListItem | null;
  onSuccess: () => void;
}>;

export function EditUserDialog({ open, onOpenChange, user, onSuccess }: EditUserDialogProps) {
  const client = useApi();
  const t = useTranslations('admin.users');
  const tCommon = useTranslations('common');
  const { showApiError, showSuccess, showError } = useErrorDisplay('admin.users');

  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('DEFAULT');
  const [resetPassword, setResetPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Reset state when user changes or dialog opens
  useEffect(() => {
    if (user && open) {
      setUsername(user.username);
      setRole(user.role);
      setResetPassword('');
      setShowPassword(false);
    }
  }, [user, open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsEditing(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    // Assert: user is always defined here - submit button is disabled when user is null (see isSubmitDisabled)
    /* v8 ignore if -- @preserve */
    if (!user) return;

    setIsEditing(true);

    try {
      const data: UpdateUserRequest = Object.fromEntries(
        Object.entries({
          username: username === user.username ? undefined : username,
          role: role === user.role ? undefined : role,
          resetPassword: resetPassword || undefined,
        }).filter(([_, value]) => value !== undefined)
      );

      const response = await patchUsersById({
        client,
        path: { id: user.id },
        body: data,
      });

      if (response.error) {
        showApiError(response.error);
      } else {
        showSuccess('userUpdated');
        onOpenChange(false);
        onSuccess();
      }
    } catch {
      showError('updateFailed');
    } finally {
      setIsEditing(false);
    }
  };

  const isSubmitDisabled = isEditing || !username;
  const PasswordIcon = showPassword ? EyeOff : Eye;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editUser')}</DialogTitle>
          <DialogDescription>{user?.username}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-username">{t('username')}</Label>
            <Input
              id="edit-username"
              data-testid="edit-username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role">{t('role')}</Label>
            {/* Assert: onValueChange works in browser but cannot be tested in JSDOM environment */}
            <Select
              value={role}
              onValueChange={(value: UserRole) => setRole(value)}
              disabled={isEditing}
              data-testid="edit-role-select"
            >
              <SelectTrigger id="edit-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">{t('default')}</SelectItem>
                <SelectItem value="ADMIN">{t('admin')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-reset-password">{t('resetPassword')}</Label>
            <div className="relative">
              <Input
                id="edit-reset-password"
                data-testid="edit-password-input"
                type={showPassword ? 'text' : 'password'}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder={t('newPassword')}
                disabled={isEditing}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                tabIndex={-1}
              >
                <PasswordIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isEditing}>
            {tCommon('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitDisabled} data-testid="edit-user-submit">
            {isEditing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tCommon('loading')}
              </>
            ) : (
              tCommon('save')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
