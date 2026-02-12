'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { useSetupStatus } from '@/hooks/use-setup-status';
import { SetupWizard } from './_components/setup-wizard';

export default function SetupPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { setupNeeded, isLoading: statusLoading } = useSetupStatus();

  useEffect(() => {
    // Redirect non-admins to home
    if (!authLoading && user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Show loading while checking status
  if (authLoading || statusLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect if setup already complete
  if (!setupNeeded) {
    router.push('/');
    return null;
  }

  return <SetupWizard />;
}
