'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // 30 seconds
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  React.useEffect(() => {
    // Synchronize auth_role cookie with client auth session
    try {
      const raw = localStorage.getItem('auth_user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.role) {
          document.cookie = `auth_role=${u.role}; path=/; max-age=604800; SameSite=Lax`;
          return;
        }
      }
      document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
    } catch {
      // no-op
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        richColors
        position="top-right"
        dir="rtl"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-ravi), Ravi, sans-serif',
            direction: 'rtl',
            textAlign: 'right',
          },
          className: 'font-sans font-ravi',
        }}
      />
    </QueryClientProvider>
  );
}
