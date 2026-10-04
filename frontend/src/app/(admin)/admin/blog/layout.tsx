import * as React from 'react';
import { FeaturePageGuard } from '@/components/admin/feature-guard';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeaturePageGuard feature="blog" featureTitle="وبلاگ و مقالات">
      {children}
    </FeaturePageGuard>
  );
}
