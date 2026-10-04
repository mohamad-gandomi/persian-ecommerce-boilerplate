'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFeatures } from '@/lib/use-features';
import { FeaturesConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface FeatureGuardProps {
  feature: keyof FeaturesConfig;
  featureTitle?: string;
  children: React.ReactNode;
}

export function FeaturePageGuard({ feature, featureTitle, children }: FeatureGuardProps) {
  const router = useRouter();
  const { isEnabled, isLoading } = useFeatures();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isEnabled(feature)) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 text-center bg-card rounded-2xl border border-border shadow-xs">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">
          قابلیت «{featureTitle || feature}» غیرفعال است
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          این ماژول در فایل پیکربندی سرور (.env) برای این فروشگاه غیرفعال شده است. در صورت نیاز می‌توانید آن را در متغیرهای سرور فعال فرمایید.
        </p>
        <Button onClick={() => router.push('/admin')} variant="outline" className="gap-2">
          <span>بازگشت به پیشخوان مدیریت</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
