'use client';

import { useTranslations } from 'next-intl';
import { Key } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { AiAccountsContent } from '../services/_components/ai-accounts-content';

export default function AiAccountsPage() {
  const t = useTranslations('admin.aiAccounts');

  return (
    <AppShell>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Key className="h-8 w-8" />
            {t('title')}
          </h1>
        </div>
        <AiAccountsContent />
      </div>
    </AppShell>
  );
}
