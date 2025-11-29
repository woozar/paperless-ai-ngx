'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useErrorDisplay } from '@/hooks/use-error-display';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const tCommon = useTranslations('common');
  const { showApiError, showError } = useErrorDisplay('auth.login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showApiError(data);
        return;
      }

      // Use AuthContext to store auth state
      login(data.token, data.user);

      // Redirect based on mustChangePassword or original destination
      if (data.user.mustChangePassword) {
        router.push('/change-password');
      } else {
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
      }
    } catch {
      showError('generic');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Visual & Branding */}
      <div className="bg-primary relative hidden w-1/2 flex-col justify-between overflow-hidden p-16 text-white lg:flex">
        <div className="from-primary/50 absolute inset-0 z-0 bg-gradient-to-br to-black/20" />
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: 'url(/window.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="rounded-xl bg-white/10 p-2 backdrop-blur-sm">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={48}
              height={48}
              className="h-12 w-12 rounded-md shadow-lg"
            />
          </div>
          <span className="text-3xl font-bold tracking-tight">{tCommon('appName')}</span>
        </div>

        <div className="relative z-10 max-w-xl">
          <h2 className="mb-6 text-4xl leading-tight font-bold">Document Management Reimagined.</h2>
          <blockquote className="border-l-4 border-white/30 pl-6 text-xl leading-relaxed font-light italic">
            "Streamline your document management with the power of AI. Secure, efficient, and
            paperless."
          </blockquote>
        </div>

        <div className="relative z-10 text-sm font-medium tracking-wide opacity-70">
          &copy; {new Date().getFullYear()} Paperless AI ngx. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2 lg:p-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 flex justify-center lg:hidden">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.webp"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-sm"
                />
                <span className="text-2xl font-bold">{tCommon('appName')}</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground mt-2">{t('description')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t('username')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="username"
                autoFocus
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="h-11 w-full text-base" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('loggingIn')}
                </>
              ) : (
                t('submit')
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
