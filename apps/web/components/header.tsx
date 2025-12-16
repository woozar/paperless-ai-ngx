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
import { LayoutDashboard, Users, Settings, LogOut, Menu, Layers, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GithubIcon } from '@/components/icons/github';
import { version } from '@/lib/version';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function Header() {
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = useMemo<NavItem[]>(
    () => [
      {
        href: '/',
        label: t('dashboard'),
        icon: LayoutDashboard,
      },
      {
        href: '/admin/services',
        label: t('services'),
        icon: Layers,
      },
      // Admin-only items
      ...(user?.role === 'ADMIN'
        ? [
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
          ]
        : []),
    ],
    [user?.role, t]
  );

  // Check if services page or any sub-tab is active
  const isServicesActive =
    pathname === '/admin/services' || pathname.startsWith('/admin/services/');

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

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navigation.map((link) => {
              const isActive =
                link.href === '/admin/services' ? isServicesActive : pathname === link.href;
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 px-2">
                  <div className="flex flex-col items-end">
                    <span className="text-sm leading-none font-medium">{user?.username}</span>
                  </div>
                  <div className="bg-muted text-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
                    {user?.username?.substring(0, 2).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex cursor-pointer items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {tAuth('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                  {navigation.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                      link.href === '/admin/services' ? isServicesActive : pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors',
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="space-y-4">
                  <div className="border-border border-t pt-4">
                    <div className="mb-4 flex items-center justify-between">
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
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="hover:text-primary text-muted-foreground flex items-center gap-2 text-sm font-medium transition-colors"
                      >
                        <User className="h-4 w-4" />
                        {t('profile')}
                      </Link>
                      <Button
                        variant="ghost"
                        className="hover:bg-destructive/10 hover:text-destructive justify-start gap-2 px-0"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4" />
                        {tAuth('logout')}
                      </Button>
                    </div>
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
