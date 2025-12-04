'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { AppShell } from '@/components/app-shell';
import { AutoSettingsPage } from '@/components/auto-settings-page';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations('admin.settings');
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  // Redirect non-admins
  useEffect(() => {
    if (!isAuthLoading && user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, isAuthLoading, router]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        </div>
        <AutoSettingsPage />
      </div>
    </AppShell>
  );
}
