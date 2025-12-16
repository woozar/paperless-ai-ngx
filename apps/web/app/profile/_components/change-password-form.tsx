'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/form-inputs/password-input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { useApi } from '@/lib/use-api';
import { postAuthChangePassword } from '@repo/api-client';

type ChangePasswordFormProps = {
  onSuccess?: () => void;
  translationPrefix?: string;
};

export function ChangePasswordForm({
  onSuccess,
  translationPrefix = 'profile.security.changePassword',
}: Readonly<ChangePasswordFormProps>) {
  const t = useTranslations(translationPrefix);
  const { showError } = useErrorDisplay(translationPrefix);
  const client = useApi();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      showError('mismatch');
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      showError('tooShort');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await postAuthChangePassword({
        client,
        body: { currentPassword, newPassword },
      });

      if (error) {
        showError('generic');
        return;
      }

      // Clear form and show success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(t('success'));

      // Call onSuccess callback if provided
      onSuccess?.();
    } catch {
      showError('generic');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
        <PasswordInput
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isLoading}
          required
          autoComplete="current-password"
          data-testid="current-password-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">{t('newPassword')}</Label>
        <PasswordInput
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          required
          autoComplete="new-password"
          showRules
          data-testid="new-password-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
          autoComplete="new-password"
          data-testid="confirm-password-input"
        />
      </div>

      <Button type="submit" disabled={isLoading} data-testid="change-password-submit">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('changing')}
          </>
        ) : (
          t('submit')
        )}
      </Button>
    </form>
  );
}
