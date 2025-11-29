import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Settings, Sparkles, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/app-shell';

export default function Home() {
  const t = useTranslations();

  return (
    <AppShell>
      <div className="bg-muted/30 relative border-b py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('home.title')}</h1>
            <p className="text-muted-foreground text-lg">{t('home.description')}</p>
          </div>
        </div>
        <div className="from-primary/5 absolute inset-x-0 bottom-0 h-1 bg-linear-to-r via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="dark:to-background overflow-hidden border-0 bg-linear-to-br from-pink-50 to-white shadow-sm transition-all hover:shadow-md dark:from-pink-950/10">
            <CardHeader className="border-b border-pink-100 bg-pink-50/50 dark:border-pink-900/20 dark:bg-pink-900/10">
              <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-300">
                <Sparkles className="h-5 w-5" />
                {t('home.autoProcessing.title')}
              </CardTitle>
              <CardDescription className="text-pink-600/80 dark:text-pink-400/80">
                {t('home.autoProcessing.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm">{t('home.autoProcessing.content')}</p>
            </CardContent>
          </Card>

          <Card className="dark:to-background overflow-hidden border-0 bg-linear-to-br from-blue-50 to-white shadow-sm transition-all hover:shadow-md dark:from-blue-950/10">
            <CardHeader className="border-b border-blue-100 bg-blue-50/50 dark:border-blue-900/20 dark:bg-blue-900/10">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <FileText className="h-5 w-5" />
                {t('home.documentQueue.title')}
              </CardTitle>
              <CardDescription className="text-blue-600/80 dark:text-blue-400/80">
                {t('home.documentQueue.description', { count: 0 })}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm">{t('home.documentQueue.content')}</p>
            </CardContent>
          </Card>

          <Card className="dark:to-background overflow-hidden border-0 bg-linear-to-br from-indigo-50 to-white shadow-sm transition-all hover:shadow-md dark:from-indigo-950/10">
            <CardHeader className="border-b border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/20 dark:bg-indigo-900/10">
              <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <Settings className="h-5 w-5" />
                {t('home.configuration.title')}
              </CardTitle>
              <CardDescription className="text-indigo-600/80 dark:text-indigo-400/80">
                {t('home.configuration.setupRequired')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700" asChild>
                <a href="/setup" className="flex items-center justify-center gap-2">
                  {t('home.configuration.completeSetup')}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
