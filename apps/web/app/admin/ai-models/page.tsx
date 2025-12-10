'use client';

import { useTranslations } from 'next-intl';
import { Cpu } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { AiModelsContent } from '../services/_components/ai-models-content';

export default function AiModelsPage() {
  const t = useTranslations('admin.aiModels');

  return (
    <AppShell>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Cpu className="h-8 w-8" />
            {t('title')}
          </h1>
        </div>
        <AiModelsContent />
      </div>
    </AppShell>
  );
}
