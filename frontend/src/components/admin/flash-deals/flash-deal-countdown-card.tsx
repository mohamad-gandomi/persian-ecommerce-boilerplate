'use client';

import * as React from 'react';
import { Timer, Sparkles, Gift, Tag, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActiveFlashDeal } from '@/types';
import { toPersianDigits } from '@/lib/jalali';
import { formatCurrency } from '@/lib/utils';

interface FlashDealCountdownCardProps {
  deal: ActiveFlashDeal | null;
  onEditClick?: (dealId: string) => void;
}

export function FlashDealCountdownCard({ deal, onEditClick }: FlashDealCountdownCardProps) {
  const [secondsLeft, setSecondsLeft] = React.useState<number>(
    deal?.remainingSeconds || 0,
  );

  React.useEffect(() => {
    if (!deal) return;
    setSecondsLeft(deal.remainingSeconds || 0);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [deal]);

  if (!deal) {
    return (
      <Card className="border-dashed border-border bg-muted/20 font-sans shadow-2xs" dir="rtl">
        <CardContent className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Timer className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-foreground">در حال حاضر هیچ کمپین شگفت‌انگیز فعالی در حال برگزاری نیست.</p>
          <p className="text-[11px] text-muted-foreground">
            می‌توانید با کلیک روی دکمه «تعریف پیشنهاد شگفت‌انگیز جدید» یک تخفیف زمان‌دار با پاداش خرید ایجاد کنید.
          </p>
        </CardContent>
      </Card>
    );
  }

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const timerDisplay = toPersianDigits(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);

  return (
    <div className="space-y-4 font-sans" dir="rtl">
      {/* Main Banner Card (Mirrors User Screenshot 1) */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-l from-emerald-50/90 via-emerald-50/50 to-emerald-100/40 dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-emerald-900/20 p-5 sm:p-6 shadow-xs">
        {/* Subtle decorative circle */}
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full border-8 border-emerald-500/10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          {/* Right Column: Title, Slogan & Badge */}
          <div className="space-y-1.5 max-w-xl text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                {deal.badgeText || 'پیشنهادهای محدود امروز'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-emerald-100 tracking-tight">
              {deal.title}
            </h2>

            {deal.description && (
              <p className="text-xs sm:text-sm text-emerald-800/80 dark:text-emerald-300/80 font-medium">
                {deal.description}
              </p>
            )}
          </div>

          {/* Left Column: Countdown Timer Block */}
          <div className="flex items-center gap-4 sm:gap-6 self-start md:self-center bg-card/80 dark:bg-card/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 shadow-xs">
            <div className="text-right">
              <span className="text-[11px] font-medium text-muted-foreground block">
                زمان باقی‌مانده
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 font-sans tracking-wider">
                {timerDisplay}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Timer className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Product Previews Strip (Mirrors User Screenshot 2) */}
        {deal.items && deal.items.length > 0 && (
          <div className="mt-5 pt-4 border-t border-emerald-200/50 dark:border-emerald-800/30">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>محصولات در حال فروش در این جشنواره ({toPersianDigits(deal.items.length)} کالا)</span>
              </span>
              {onEditClick && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditClick(deal.id)}
                  className="text-xs h-7 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/60 dark:text-emerald-300 gap-1 font-sans"
                >
                  <span>مدیریت آیتم‌ها</span>
                  <ArrowLeft className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {deal.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl p-3 border border-border/80 shadow-2xs flex gap-3 items-center hover:border-emerald-500/50 transition-all group"
                >
                  <div className="w-16 h-16 rounded-lg bg-muted/60 border border-border/60 overflow-hidden shrink-0 relative flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Tag className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-muted-foreground truncate">
                        {item.categoryName}
                      </span>
                      {item.discountPercentage > 0 && (
                        <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.2 rounded font-sans">
                          {toPersianDigits(item.discountPercentage)}٪
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-foreground truncate block">
                      {item.productName}
                    </h4>

                    {item.cashbackAmount > 0 && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/50">
                        <Gift className="w-2.5 h-2.5" />
                        <span>پاداش خرید: + {formatCurrency(item.cashbackAmount)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-0.5 text-xs font-sans">
                      <span className="text-xs font-black text-foreground">
                        {formatCurrency(item.specialPrice)}
                      </span>
                      {item.originalPrice > item.specialPrice && (
                        <span className="text-[11px] text-muted-foreground line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
