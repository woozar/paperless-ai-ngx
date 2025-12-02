'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, LogOut, Database, Cpu, Bot } from 'lucide-react';

import { version } from '@/lib/version';

export function Sidebar() {
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    {
      group: t('dashboard'), // You might want to change this key if 'dashboard' is just "Dashboard" and not a group name like "Main"
      items: [
        {
          href: '/',
          label: t('dashboard'),
          icon: LayoutDashboard,
        },
      ],
    },
    ...(user?.role === 'ADMIN'
      ? [
          {
            group: t('admin'),
            items: [
              {
                href: '/admin/users',
                label: t('users'),
                icon: Users,
              },
              {
                href: '/admin/paperless-instances',
                label: t('paperlessInstances'),
                icon: Database,
              },
              {
                href: '/admin/ai-providers',
                label: t('aiProviders'),
                icon: Cpu,
              },
              {
                href: '/admin/ai-bots',
                label: t('aiBots'),
                icon: Bot,
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <aside className="bg-sidebar text-sidebar-foreground sticky top-0 z-50 flex hidden h-screen w-64 flex-col border-r shadow-xl md:flex">
      <div className="border-sidebar-border flex items-center gap-3 border-b p-6">
        <Image
          src="/logo.webp"
          alt="Logo"
          width={32}
          height={32}
          className="h-8 w-8 rounded-md shadow-sm"
        />
        <span className="text-lg leading-none font-bold tracking-tight">{t('appName')}</span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {navigation.map((group) => (
          <div key={group.group} className="space-y-2">
            {group.group && (
              <h3 className="text-muted-foreground mb-2 px-4 text-xs font-semibold tracking-wider uppercase opacity-70">
                {group.group}
              </h3>
            )}

            {group.items.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Button
                  key={link.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'relative w-full justify-start gap-3 overflow-hidden transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-primary translate-x-1 font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground font-medium hover:translate-x-1'
                  )}
                  asChild
                >
                  <Link href={link.href}>
                    {isActive && <div className="bg-primary absolute top-0 bottom-0 left-0 w-1" />}
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {link.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-sidebar-border bg-sidebar/50 border-t p-4 backdrop-blur-sm">
        <div className="hover:bg-sidebar-accent/50 flex items-center justify-between gap-2 rounded-lg p-2 px-2 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="from-primary to-primary/60 text-primary-foreground border-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-gradient-to-br shadow-sm">
              <span className="text-xs font-bold">
                {user?.username?.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col truncate text-sm">
              <span className="truncate leading-tight font-semibold">{user?.username}</span>
              <span className="text-muted-foreground truncate text-[10px] font-medium tracking-wider uppercase">
                {user?.role?.toLowerCase()}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0 rounded-full transition-colors"
            onClick={logout}
            title={tAuth('logout')}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-sidebar-border -mx-4 my-3 border-t" />

        <div className="text-muted-foreground flex items-center justify-between px-2 text-[10px] opacity-60 transition-opacity hover:opacity-100">
          <span>v{version}</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </aside>
  );
}
