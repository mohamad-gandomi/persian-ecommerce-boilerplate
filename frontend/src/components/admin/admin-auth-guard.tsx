'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAuth = () => {
      const user = api.getCurrentUser();
      if (!user || user.role !== 'ADMIN') {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();

    window.addEventListener('auth_changed', checkAuth);
    return () => {
      window.removeEventListener('auth_changed', checkAuth);
    };
  }, []);

  React.useEffect(() => {
    if (isAuthorized === false) {
      router.push('/login');
    }
  }, [isAuthorized, router]);

  if (isAuthorized === null || isAuthorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
