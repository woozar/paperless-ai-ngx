'use client';

import { useTranslations } from 'next-intl';
import { User } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeSettings } from './_components/theme-settings';
import { SecuritySettings } from './_components/security-settings';

export default function ProfilePage() {
  const t = useTranslations('profile');

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList>
              <TabsTrigger value="appearance">{t('appearance.title')}</TabsTrigger>
              <TabsTrigger value="security">{t('security.title')}</TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-8">
              <ThemeSettings />
            </TabsContent>

            <TabsContent value="security" className="space-y-8">
              <SecuritySettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  );
}
