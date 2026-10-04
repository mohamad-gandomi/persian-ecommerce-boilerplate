'use client';

import * as React from 'react';
import { Wallet as WalletIcon, History, PlusCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Wallet } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface WalletsMobileListProps {
  wallets: Wallet[];
  onAdjust: (wallet: Wallet) => void;
  onViewHistory: (wallet: Wallet) => void;
  onToggleStatus?: (wallet: Wallet, isActive: boolean) => void;
}

export function WalletsMobileList({
  wallets,
  onAdjust,
  onViewHistory,
  onToggleStatus,
}: WalletsMobileListProps) {
  if (wallets.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 md:hidden font-sans" dir="rtl">
      {wallets.map((wallet) => {
        const user = wallet.user;
        const initial = user?.firstName ? user.firstName.charAt(0) : 'ک';

        return (
          <div
            key={wallet.id}
            className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3.5 text-right font-sans hover:border-primary/40 transition-colors"
          >
            {/* Top row: User Info & Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0 border border-primary/20">
                  {initial}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 className="font-bold text-sm text-foreground truncate">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate dir-ltr text-right font-sans">
                    {user?.email}
                  </p>
                  {user?.phone && (
                    <p className="text-[11px] text-muted-foreground dir-ltr text-right font-sans">
                      {user.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <Badge
                  variant={wallet.isActive ? 'default' : 'secondary'}
                  className={`text-[10px] font-sans ${
                    wallet.isActive
                      ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {wallet.isActive ? 'فعال' : 'مسدود'}
                </Badge>
                {onToggleStatus && (
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-muted-foreground font-sans">
                      {wallet.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                    <Switch
                      checked={wallet.isActive}
                      onCheckedChange={(checked) => onToggleStatus(wallet, checked)}
                      aria-label="تغییر وضعیت کیف پول"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Middle row: Balance Card */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] text-muted-foreground">موجودی کیف پول</span>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                  {formatCurrency(wallet.balance)}
                </div>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-[11px] text-muted-foreground">واحد پول</span>
                <div className="text-xs font-semibold text-foreground font-sans">
                  تومان (IRT)
                </div>
              </div>
            </div>

            {/* Bottom row: Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAdjust(wallet)}
                className="text-xs font-semibold h-9 gap-1.5 border-border/80 shadow-2xs font-sans"
              >
                <PlusCircle className="w-3.5 h-3.5 text-primary" />
                <span>شارژ / کسر موجودی</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewHistory(wallet)}
                className="text-xs font-semibold h-9 gap-1.5 border-border/80 shadow-2xs font-sans"
              >
                <History className="w-3.5 h-3.5 text-blue-600" />
                <span>ریزتراکنش‌ها</span>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
