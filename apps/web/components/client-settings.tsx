'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const THEME_OPTIONS = ['light', 'dark', 'system'] as const;
type ThemeOption = (typeof THEME_OPTIONS)[number];

export function ClientSettings() {
  const t = useTranslations('admin.settings');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Card className="bg-gray-100 p-6 dark:bg-gray-800/50">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-64" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      {/* Left column: Title and description */}
      <div className="space-y-1">
        <h3 className="text-base font-medium">{t('appearance.theme.title')}</h3>
        <p className="text-muted-foreground text-sm">{t('appearance.theme.description')}</p>
      </div>

      {/* Right column: Theme selector */}
      <Card className="bg-gray-100 p-6 dark:bg-gray-800/50">
        <CardContent className="space-y-6 p-0">
          <div className="space-y-4">
            <Label className="block">{t('appearance.theme.mode.title')}</Label>
            <Select value={theme} onValueChange={(value: ThemeOption) => setTheme(value)}>
              <SelectTrigger data-testid="setting-appearance.theme.mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {THEME_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`appearance.theme.mode.values.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-sm">
              {t('appearance.theme.mode.description')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
