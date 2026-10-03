import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function KpiCard({ title, value, subtitle, icon: Icon, iconColor }: KpiCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 h-full flex flex-col justify-between">
      <CardContent className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground tracking-wide">
              {title}
            </p>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {value}
            </div>
          </div>
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center bg-muted/70 border border-border/60 shrink-0',
              iconColor || 'text-primary',
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        {subtitle && (
          <div className="mt-auto pt-2.5">
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
