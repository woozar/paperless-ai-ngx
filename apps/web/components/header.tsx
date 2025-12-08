'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { LayoutDashboard, Users, Database, Cpu, Bot, Settings, LogOut, Menu } from 'lucide-react';
import { GithubIcon } from '@/components/icons/github';
import { version } from '@/lib/version';

export function Header() {
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = useMemo(
    () => [
      {
        // Items visible to all authenticated users
        items: [
          {
            href: '/',
            label: t('dashboard'),
            icon: LayoutDashboard,
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
      // Admin-only items
      ...(user?.role === 'ADMIN'
        ? [
            {
              items: [
                {
                  href: '/admin/users',
                  label: t('users'),
                  icon: Users,
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

  // Flatten navigation for the top bar
  const allNavItems = navigation.flatMap((group) => group.items);

  return (
    <header className="bg-background/95 border-border/40 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="flex h-16 items-center justify-between">
        {/* Left: Logo and Desktop Nav */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pr-4">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-md shadow-sm grayscale-[0.3]"
            />
            <span className="text-foreground/90 text-base font-semibold tracking-tight">
              {t('appName')}
            </span>
          </div>

          {/* Desktop Navigation - Clean Text Links */}
          <nav className="hidden items-center gap-6 md:flex">
            {allNavItems.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'hover:text-primary text-sm font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: User Profile & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Desktop Profile */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="https://github.com/woozar/paperless-ai-ngx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title={`v${version}`}
            >
              <GithubIcon className="h-4 w-4" />
            </Link>
            <div className="bg-border h-4 w-px" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm leading-none font-medium">{user?.username}</span>
              </div>
              <div className="bg-muted text-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
                {user?.username?.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
              onClick={logout}
              title={tAuth('logout')}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0" aria-describedby={undefined}>
              <SheetTitle className="sr-only">{t('navigation')}</SheetTitle>
              <div className="border-border flex h-16 items-center gap-3 border-b px-6">
                <Image
                  src="/logo.webp"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-md"
                />
                <span className="text-lg font-bold">{t('appName')}</span>
              </div>
              <div className="flex h-[calc(100vh-4rem)] flex-col justify-between p-6">
                <nav className="flex flex-col gap-4">
                  {allNavItems.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'hover:text-primary text-sm font-medium transition-colors',
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="space-y-4">
                  <div className="border-border flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                        {user?.username?.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col text-xs">
                        <span className="font-medium">{user?.username}</span>
                        <span className="text-muted-foreground uppercase">
                          {user?.role?.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={logout}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
