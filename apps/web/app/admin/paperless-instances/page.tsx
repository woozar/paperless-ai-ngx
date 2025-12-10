'use client';

import { useTranslations } from 'next-intl';
import { Database } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PaperlessInstancesContent } from '../services/_components/paperless-instances-content';

export default function PaperlessInstancesPage() {
  const t = useTranslations('admin.paperlessInstances');

  return (
    <AppShell>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Database className="h-8 w-8" />
            {t('title')}
          </h1>
        </div>
        <PaperlessInstancesContent />
      </div>
    </AppShell>
  );
}
