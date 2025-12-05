'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Database, Cpu, Bot, Settings, LogOut } from 'lucide-react';
import { GithubIcon } from '@/components/icons/github';
import { version } from '@/lib/version';

export function Sidebar() {
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = useMemo(
    () => [
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
                {
                  href: '/admin/settings',
                  label: t('settings'),
                  icon: Settings,
                },
              ],
            },
          ]
        : []),
    ],
    [user?.role, t]
  );

  return (
    <aside className="bg-sidebar/90 text-sidebar-foreground border-sidebar-border fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r shadow-xl backdrop-blur-xl md:flex">
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
                      ? 'from-sidebar-accent to-sidebar-accent/50 text-sidebar-primary bg-linear-to-r font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground font-medium hover:translate-x-1'
                  )}
                  asChild
                >
                  <Link href={link.href}>
                    {isActive && (
                      <div className="bg-sidebar-primary absolute top-0 bottom-0 left-0 w-1 shadow-[0_0_8px_currentColor]" />
                    )}
                    <Icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive
                          ? 'text-sidebar-primary'
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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
              {user?.username?.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col truncate text-sm">
              <span className="truncate leading-tight font-medium">{user?.username}</span>
              <span className="text-muted-foreground truncate text-[10px] uppercase">
                {user?.role?.toLowerCase()}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7 shrink-0 transition-colors"
            onClick={logout}
            title={tAuth('logout')}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-muted-foreground mt-3 flex items-center justify-between text-[10px]">
          <Link
            href="https://github.com/woozar/paperless-ai-ngx"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <GithubIcon className="h-3 w-3" />
            <span>GitHub</span>
          </Link>
          <span>v{version}</span>
        </div>
      </div>
    </aside>
  );
}
