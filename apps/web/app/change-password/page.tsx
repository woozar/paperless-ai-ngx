'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, KeyRound } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { ChangePasswordForm } from '@/app/profile/_components/change-password-form';

export default function ChangePasswordPage() {
  const t = useTranslations('auth.changePassword');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { updateUser } = useAuth();

  const handleSuccess = () => {
    updateUser({ mustChangePassword: false });
    router.push('/');
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex items-center gap-2">
              <FileText className="text-primary h-8 w-8" />
              <span className="text-2xl font-bold">{tCommon('appName')}</span>
            </div>
          </div>
          <div className="mb-2 flex justify-center">
            <KeyRound className="text-muted-foreground h-12 w-12" />
          </div>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm onSuccess={handleSuccess} translationPrefix="auth.changePassword" />
        </CardContent>
      </Card>
    </div>
  );
}
