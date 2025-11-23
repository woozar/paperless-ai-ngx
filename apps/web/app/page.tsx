import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Settings, Sparkles } from 'lucide-react';

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">{t('common.appName')}</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              {t('common.dashboard')}
            </Button>
            <Button variant="ghost" size="sm">
              {t('common.documents')}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t('home.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('home.description')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {t('home.autoProcessing.title')}
              </CardTitle>
              <CardDescription>{t('home.autoProcessing.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('home.autoProcessing.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t('home.documentQueue.title')}
              </CardTitle>
              <CardDescription>
                {t('home.documentQueue.description', { count: 0 })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('home.documentQueue.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                {t('home.configuration.title')}
              </CardTitle>
              <CardDescription>{t('home.configuration.setupRequired')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href="/setup">{t('home.configuration.completeSetup')}</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
