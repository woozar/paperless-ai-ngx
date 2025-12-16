'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { ChangePasswordForm } from './change-password-form';
import { PasskeyList } from './passkey-list';

export function SecuritySettings() {
  const t = useTranslations('profile');

  return (
    <div className="space-y-8">
      {/* Password Change Section */}
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Left column: Title and description */}
        <div className="space-y-1">
          <h3 className="text-base font-medium">{t('security.changePassword.title')}</h3>
          <p className="text-muted-foreground text-sm">
            {t('security.changePassword.description')}
          </p>
        </div>

        {/* Right column: Change password form */}
        <Card className="bg-gray-100 p-6 dark:bg-gray-800/50">
          <CardContent className="p-0">
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>

      {/* Passkeys Section */}
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Left column: Title and description */}
        <div className="space-y-1">
          <h3 className="text-base font-medium">{t('passkeys.title')}</h3>
          <p className="text-muted-foreground text-sm">{t('passkeys.description')}</p>
        </div>

        {/* Right column: Passkey list */}
        <Card className="bg-gray-100 p-6 dark:bg-gray-800/50">
          <CardContent className="p-0">
            <PasskeyList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
