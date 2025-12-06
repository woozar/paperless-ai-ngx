'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth-provider';
import { Header } from '@/components/header';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: Readonly<AppShellProps>) {
  const t = useTranslations('auth');
  const { isLoading } = useAuth();

  // Während Auth initialisiert: "Authenticating..." Box zeigen
  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
          <p className="text-muted-foreground text-lg">{t('authenticating')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background mx-auto flex min-h-screen max-w-7xl flex-col px-4 md:px-8">
      <Header />
      <main className="animate-in fade-in slide-in-from-bottom-4 container flex-1 py-4 duration-500 ease-out md:py-8">
        {children}
      </main>
    </div>
  );
}
