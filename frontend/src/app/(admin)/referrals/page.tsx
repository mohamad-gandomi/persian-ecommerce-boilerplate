'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Gift,
  Share2,
  MousePointerClick,
  Users,
  Search,
  RefreshCw,
  Sliders,
  X,
  ShoppingBag,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ReferralItem } from '@/types';
import { ReferralsMobileList } from '@/components/admin/referrals/referrals-mobile-list';

export default function ReferralsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'ALL' | 'COMPLETED' | 'PENDING' | 'CANCELLED'>('ALL');

  // 1. Fetch Referrals List & Stats
  const { data: referralsData, isLoading: referralsLoading } = useQuery({
    queryKey: ['admin-referrals', searchTerm, selectedStatus],
    queryFn: () => api.getAdminReferrals(searchTerm, selectedStatus),
  });

  const referrals = referralsData?.referrals || [];
  const stats = referralsData?.stats || {
    totalCodes: 0,
    totalClicks: 0,
    totalSuccessfulReferrals: 0,
    totalRewardsPaid: 0,
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
      <Header title="سیستم معرف و پاداش وفاداری" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans" dir="rtl">
          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5 text-right">
                <p className="text-xs font-medium text-muted-foreground">کدهای فعال معرف</p>
                <p className="text-xl font-bold text-foreground font-sans">
                  {stats.totalCodes.toLocaleString()}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5 text-right">
                <p className="text-xs font-medium text-muted-foreground">کلیک‌های دعوت</p>
                <p className="text-xl font-bold text-sky-600 dark:text-sky-400 font-sans">
                  {stats.totalClicks.toLocaleString()}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/30 flex items-center justify-center">
                <MousePointerClick className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5 text-right">
                <p className="text-xs font-medium text-muted-foreground">معرفی‌های موفق</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                  {stats.totalSuccessfulReferrals.toLocaleString()}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5 text-right">
                <p className="text-xs font-medium text-muted-foreground">کل پاداش‌های پرداختی</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400 font-sans">
                  {formatCurrency(stats.totalRewardsPaid)}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/30 flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Toolbar - Products style */}
        <div className="flex flex-col gap-3 font-sans" dir="rtl">
          {/* Top row: Search input & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="w-4.5 h-4.5 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                placeholder="جستجو در کدها، نام یا شماره تماس معرف و خریدار..."
                className="pr-10 pl-9 bg-card h-11 sm:h-10 text-right font-sans text-sm sm:text-xs w-full rounded-xl border-border/80 shadow-2xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-referrals'] })}
                className="h-10 text-xs font-semibold gap-2 border-border/80 shadow-2xs font-sans"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>به‌روزرسانی</span>
              </Button>

              <Link href="/settings">
                <Button
                  variant="outline"
                  className="h-10 text-xs font-semibold gap-2 border-border/80 shadow-2xs font-sans text-primary hover:text-primary hover:bg-primary/10"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>تنظیمات قوانین پاداش</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Pills - Exactly like ProductsToolbar */}
          <div className="flex items-center rounded-xl border border-border/60 bg-muted/60 p-1 text-xs shrink-0 self-start overflow-x-auto max-w-full">
            {[
              { label: 'همه معرفی‌ها', val: 'ALL' },
              { label: 'تکمیل‌شده (موفق)', val: 'COMPLETED' },
              { label: 'در انتظار تکمیل', val: 'PENDING' },
              { label: 'لغوشده', val: 'CANCELLED' },
            ].map((tab) => (
              <button
                key={tab.val}
                type="button"
                onClick={() => setSelectedStatus(tab.val as any)}
                className={`h-8 px-3 rounded-lg font-medium transition-colors flex items-center justify-center font-sans whitespace-nowrap ${
                  selectedStatus === tab.val
                    ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile View: Cards List */}
        <ReferralsMobileList referrals={referrals} />

        {/* Desktop View: Table */}
        <Card className="hidden md:block border-border/70 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">کد معرف</TableHead>
                  <TableHead className="text-right">معرف (کاربر ارجاع‌دهنده)</TableHead>
                  <TableHead className="text-right">معرفی‌شده (خریدار جدید)</TableHead>
                  <TableHead className="text-right">سفارش متصل</TableHead>
                  <TableHead className="text-center">وضعیت معرفی</TableHead>
                  <TableHead className="text-left font-sans">پاداش معرف</TableHead>
                  <TableHead className="text-left font-sans">پاداش خریدار</TableHead>
                  <TableHead className="text-left font-sans whitespace-nowrap">تاریخ ثبت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                      در حال بارگذاری اطلاعات معرفی‌ها...
                    </TableCell>
                  </TableRow>
                ) : referrals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                      هیچ معرفی با فیلترهای انتخابی یافت نشد.
                    </TableCell>
                  </TableRow>
                ) : (
                  referrals.map((r) => {
                    const primaryOrder = r.orders && r.orders.length > 0 ? r.orders[0] : null;

                    return (
                      <TableRow key={r.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="font-mono font-bold text-xs text-primary">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                            {r.referralCode?.code || '—'}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="font-semibold text-foreground">
                            {r.referrer ? `${r.referrer.firstName} ${r.referrer.lastName}` : '—'}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-sans dir-ltr text-right">
                            {r.referrer?.phone || r.referrer?.email || '—'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="font-semibold text-foreground">
                            {r.referee ? `${r.referee.firstName} ${r.referee.lastName}` : '—'}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-sans dir-ltr text-right">
                            {r.referee?.phone || r.referee?.email || '—'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {primaryOrder ? (
                            <div className="space-y-0.5">
                              <div className="font-mono font-bold text-foreground text-xs dir-ltr text-right">
                                {primaryOrder.orderNumber}
                              </div>
                              <div className="text-[11px] text-muted-foreground font-sans">
                                {formatCurrency(primaryOrder.totalAmount)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-[11px]">بدون سفارش</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {r.status === 'COMPLETED' ? (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[11px]">
                              پاداش واریز شد
                            </Badge>
                          ) : r.status === 'PENDING' ? (
                            <Badge variant="outline" className="text-amber-600 border-amber-300 text-[11px]">
                              در انتظار سفارش
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[11px]">لغو شده</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-left font-sans font-bold text-xs text-purple-600 dark:text-purple-400">
                          {r.rewardAmountReferrer ? formatCurrency(r.rewardAmountReferrer) : '—'}
                        </TableCell>
                        <TableCell className="text-left font-sans font-bold text-xs text-emerald-600 dark:text-emerald-400">
                          {r.rewardAmountReferee ? formatCurrency(r.rewardAmountReferee) : '—'}
                        </TableCell>
                        <TableCell className="text-left font-sans text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(r.createdAt).toLocaleDateString('fa-IR')}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
