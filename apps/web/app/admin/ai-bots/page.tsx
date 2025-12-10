'use client';

import { useTranslations } from 'next-intl';
import { Bot } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { AiBotsContent } from '../services/_components/ai-bots-content';

export default function AiBotsPage() {
  const t = useTranslations('admin.aiBots');

  return (
    <AppShell>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Bot className="h-8 w-8" />
            {t('title')}
          </h1>
        </div>
        <AiBotsContent />
      </div>
    </AppShell>
  );
}
