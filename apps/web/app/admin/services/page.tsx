'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Key, Cpu, Bot, Layers } from 'lucide-react';
import {
  AiAccountsContent,
  AiModelsContent,
  AiBotsContent,
  PaperlessInstancesContent,
} from './_components';

const TABS = ['paperless', 'accounts', 'models', 'bots'] as const;
type TabValue = (typeof TABS)[number];

export default function ServicesPage() {
  const t = useTranslations('admin.services');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab');
  const activeTab: TabValue = TABS.includes(tabParam as TabValue)
    ? (tabParam as TabValue)
    : 'paperless';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`/admin/services?${params.toString()}`);
  };

  return (
    <AppShell>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Layers className="h-8 w-8" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('description')}</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="paperless" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              {tCommon('paperlessInstances')}
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              {tCommon('aiAccounts')}
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              {tCommon('aiModels')}
            </TabsTrigger>
            <TabsTrigger value="bots" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              {tCommon('aiBots')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paperless">
            <PaperlessInstancesContent />
          </TabsContent>

          <TabsContent value="accounts">
            <AiAccountsContent />
          </TabsContent>

          <TabsContent value="models">
            <AiModelsContent />
          </TabsContent>

          <TabsContent value="bots">
            <AiBotsContent />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
