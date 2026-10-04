'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Wallet as WalletIcon,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  History,
  X,
  CreditCard,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Wallet, WalletTransaction, WalletTransactionType } from '@/types';
import { WalletsMobileList } from '@/components/admin/wallets/wallets-mobile-list';
import { FeaturePageGuard } from '@/components/admin/feature-guard';

export default function WalletsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedWallet, setSelectedWallet] = React.useState<Wallet | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = React.useState(false);
  const [adjustType, setAdjustType] = React.useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustAmount, setAdjustAmount] = React.useState('');
  const [adjustNote, setAdjustNote] = React.useState('');

  const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false);
  const [historyWallet, setHistoryWallet] = React.useState<Wallet | null>(null);

  // 1. Fetch Wallets List
  const { data, isLoading } = useQuery({
    queryKey: ['admin-wallets', searchTerm],
    queryFn: () => api.getAdminWallets(searchTerm),
  });

  const wallets = data?.wallets || [];
  const stats = data?.stats || { totalSystemBalance: 0, totalWalletsCount: 0 };

  // 2. Fetch Transactions for Selected Wallet in Drawer
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['wallet-history', historyWallet?.id],
    queryFn: () => api.getAdminWalletTransactions(historyWallet?.id),
    enabled: !!historyWallet?.id,
  });

  // 3. Toggle Wallet Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      return api.adminToggleWalletStatus(userId, isActive);
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.isActive
          ? 'کیف پول با موفقیت فعال شد'
          : 'کیف پول با موفقیت مسدود و غیرفعال شد'
      );
      queryClient.invalidateQueries({ queryKey: ['admin-wallets'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'خطا در تغییر وضعیت کیف پول');
    },
  });

  // 4. Adjust Balance Mutation
  const adjustMutation = useMutation({
    mutationFn: async () => {
      if (!selectedWallet?.userId) throw new Error('کاربر نامعتبر است');
      const amountVal = parseFloat(adjustAmount.replace(/,/g, ''));
      if (isNaN(amountVal) || amountVal <= 0) {
        throw new Error('مبلغ وارد شده معتبر نیست');
      }
      if (!adjustNote.trim()) {
        throw new Error('لطفاً دلیل تغییر موجودی را وارد کنید');
      }
      const finalAmount = adjustType === 'CREDIT' ? amountVal : -amountVal;

      return api.adminAdjustWalletBalance(selectedWallet.userId, {
        amount: finalAmount,
        description: adjustNote,
      });
    },
    onSuccess: () => {
      toast.success('موجودی کیف پول با موفقیت به‌روزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['admin-wallets'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-history'] });
      setIsAdjustModalOpen(false);
      setAdjustAmount('');
      setAdjustNote('');
      setSelectedWallet(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'خطا در تغییر موجودی');
    },
  });

  const getTransactionBadge = (type: WalletTransactionType) => {
    switch (type) {
      case 'DEPOSIT':
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">شارژ آنلاین</Badge>;
      case 'ORDER_PAYMENT':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">پرداخت سفارش</Badge>;
      case 'ORDER_PARTIAL_PAYMENT':
        return <Badge variant="secondary" className="bg-sky-500/10 text-sky-600 border-sky-500/20">پرداخت ترکیبی</Badge>;
      case 'REFUND':
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">استرداد وجه</Badge>;
      case 'REFERRAL_REWARD':
        return <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-500/20">پاداش معرف</Badge>;
      case 'CASHBACK':
        return <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20">پاداش خرید</Badge>;
      case 'ADMIN_ADJUSTMENT':
        return <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">اصلاح ادمین</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <FeaturePageGuard feature="wallet" featureTitle="کیف‌پول‌ها">
      <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
        <Header title="مدیریت کیف پول‌ها" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 font-sans" dir="rtl">
          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5 text-right">
                <p className="text-xs font-medium text-muted-foreground">کل موجودی در گردش</p>
                <p className="text-xl font-bold text-foreground font-sans">
                  {formatCurrency(stats.totalSystemBalance)}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <WalletIcon className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5 text-right">
                <p className="text-xs font-medium text-muted-foreground">کیف‌پول‌های کاربران</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 font-sans">
                  {stats.activeWalletsCount ?? stats.totalWalletsCount} فعال <span className="text-xs font-normal text-muted-foreground">از {stats.totalWalletsCount}</span>
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5 text-right">
                <p className="text-xs font-medium text-muted-foreground">کل تراکنش‌های دفترکل</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                  {(stats.totalTransactionsCount ?? 0).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">تراکنش</span>
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-sans" dir="rtl">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-4.5 h-4.5 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="جستجو بر اساس نام، ایمیل یا شماره موبایل..."
              className="pr-10 pl-9 bg-card h-11 sm:h-10 text-right font-sans text-sm sm:text-xs w-full rounded-xl border-border/80 shadow-2xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-wallets'] })}
            className="h-10 text-xs font-semibold gap-2 border-border/80 shadow-2xs font-sans"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>به‌روزرسانی لیست</span>
          </Button>
        </div>

        {/* Mobile View: Cards List */}
        <WalletsMobileList
          wallets={wallets}
          onAdjust={(w) => {
            setSelectedWallet(w);
            setIsAdjustModalOpen(true);
          }}
          onViewHistory={(w) => {
            setHistoryWallet(w);
            setIsHistoryModalOpen(true);
          }}
          onToggleStatus={(w, isActive) => {
            if (!w.userId) return;
            toggleStatusMutation.mutate({ userId: w.userId, isActive });
          }}
        />

        {/* Desktop View: Table */}
        <Card className="hidden md:block border-border/70 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">مشتری</TableHead>
                  <TableHead className="text-right">شماره تماس / ایمیل</TableHead>
                  <TableHead className="text-left font-sans">موجودی فعلی</TableHead>
                  <TableHead className="text-center">تعداد تراکنش‌ها</TableHead>
                  <TableHead className="text-center">وضعیت والت</TableHead>
                  <TableHead className="text-left pl-4">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                      در حال بارگذاری کیف‌پول‌ها...
                    </TableCell>
                  </TableRow>
                ) : wallets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                      هیچ کیف پولی با مشخصات وارد شده یافت نشد.
                    </TableCell>
                  </TableRow>
                ) : (
                  wallets.map((w) => (
                    <TableRow key={w.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-semibold text-xs text-foreground">
                        {w.user ? `${w.user.firstName} ${w.user.lastName}` : 'کاربر نامشخص'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-sans">
                        {w.user?.phone || w.user?.email || '—'}
                      </TableCell>
                      <TableCell className="text-left font-sans font-bold text-sm text-foreground">
                        {formatCurrency(w.balance)}
                      </TableCell>
                      <TableCell className="text-center text-xs font-sans">
                        <Badge variant="outline" className="font-sans text-[11px]">
                          {w.transactionsCount || 0} تراکنش
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          <Switch
                            checked={w.isActive}
                            disabled={toggleStatusMutation.isPending}
                            onCheckedChange={(checked) => {
                              if (!w.userId) return;
                              toggleStatusMutation.mutate({ userId: w.userId, isActive: checked });
                            }}
                            aria-label="تغییر وضعیت فعال بودن کیف پول"
                          />
                          <Badge
                            variant="secondary"
                            className={`text-[11px] font-sans ${
                              w.isActive
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {w.isActive ? 'فعال' : 'مسدود'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-left pl-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedWallet(w);
                              setIsAdjustModalOpen(true);
                            }}
                            className="h-8 text-xs gap-1 text-primary hover:text-primary"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>تغییر موجودی</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setHistoryWallet(w);
                              setIsHistoryModalOpen(true);
                            }}
                            className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
                          >
                            <History className="w-3.5 h-3.5" />
                            <span>ریزتراکنش‌ها</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Modal 1: Adjust Balance Dialog */}
      <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
        <DialogContent className="sm:max-w-md font-sans" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>تغییر دستی موجودی کیف پول</span>
            </DialogTitle>
          </DialogHeader>

          {selectedWallet && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/70 space-y-1">
                <div className="text-muted-foreground">نام مشتری: <strong className="text-foreground">{selectedWallet.user?.firstName} {selectedWallet.user?.lastName}</strong></div>
                <div className="text-muted-foreground">موجودی فعلی: <strong className="text-primary font-sans">{formatCurrency(selectedWallet.balance)}</strong></div>
              </div>

              {/* Adjust Type Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">نوع عملیات:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('CREDIT')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      adjustType === 'CREDIT'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600'
                        : 'border-border/70 text-muted-foreground hover:bg-accent/40'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>افزایش موجودی (واریز)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('DEBIT')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      adjustType === 'DEBIT'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-600'
                        : 'border-border/70 text-muted-foreground hover:bg-accent/40'
                    }`}
                  >
                    <MinusCircle className="w-4 h-4" />
                    <span>کاهش موجودی (برداشت)</span>
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">مبلغ تغییر (تومان):</label>
                <Input
                  type="number"
                  placeholder="مثلاً ۵۰,۰۰۰"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="font-sans text-xs text-left"
                  dir="ltr"
                />
              </div>

              {/* Reason description */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">علت و توضیح عملیات (ثبت در دفتر کل):</label>
                <Input
                  type="text"
                  placeholder="مثلاً: هدیه سال نو، پاداش وفاداری، اصلاحیه خرید..."
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row items-center justify-end gap-3 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdjustModalOpen(false)}
              className="text-xs h-9 px-4"
            >
              انصراف
            </Button>
            <Button
              size="sm"
              onClick={() => adjustMutation.mutate()}
              disabled={adjustMutation.isPending || !adjustAmount || !adjustNote}
              className="text-xs h-9 px-4"
            >
              {adjustMutation.isPending ? 'در حال ثبت...' : 'تأیید و اعمال تغییر موجودی'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Transaction Ledger History Dialog */}
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl max-h-[88vh] flex flex-col p-4 sm:p-6 font-sans overflow-hidden" dir="rtl">
          {/* Header & Customer Summary */}
          <DialogHeader className="space-y-3 pb-3 border-b border-border/60">
            <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-foreground">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <History className="w-4 h-4" />
              </div>
              <span>ریزتراکنش‌ها و گردش مالی حساب کیف پول</span>
            </DialogTitle>

            {historyWallet && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/70 text-right">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20 shrink-0">
                    {historyWallet.user?.firstName ? historyWallet.user.firstName.charAt(0) : 'ک'}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-bold text-xs sm:text-sm text-foreground truncate">
                      {historyWallet.user ? `${historyWallet.user.firstName} ${historyWallet.user.lastName}` : 'کاربر نامشخص'}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate font-sans dir-ltr text-right">
                      {historyWallet.user?.phone || historyWallet.user?.email || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between sm:justify-center border-t sm:border-t-0 sm:border-r border-border/60 pt-2 sm:pt-0 sm:pr-3">
                  <span className="text-[11px] text-muted-foreground">موجودی فعلی والت</span>
                  <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                    {formatCurrency(historyWallet.balance)}
                  </span>
                </div>

                <div className="flex sm:flex-col justify-between sm:justify-center items-end sm:items-start border-t sm:border-t-0 sm:border-r border-border/60 pt-2 sm:pt-0 sm:pr-3">
                  <span className="text-[11px] text-muted-foreground">وضعیت کیف پول</span>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-sans ${
                      historyWallet.isActive
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {historyWallet.isActive ? 'کیف پول فعال' : 'مسدود شده'}
                  </Badge>
                </div>
              </div>
            )}
          </DialogHeader>

          {/* Body: Scrollable list of transactions */}
          <div className="flex-1 overflow-y-auto min-h-0 py-2 space-y-3">
            {historyLoading ? (
              <div className="text-center py-12 text-muted-foreground text-xs">
                در حال بارگذاری تراکنش‌ها از پایگاه داده...
              </div>
            ) : !historyData?.transactions || historyData.transactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs space-y-2">
                <History className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                <p>هنوز تراکنشی برای این کیف پول ثبت نشده است.</p>
              </div>
            ) : (
              <>
                {/* Mobile View: Cards */}
                <div className="grid grid-cols-1 gap-2.5 md:hidden">
                  {historyData.transactions.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2.5 text-right font-sans"
                    >
                      <div className="flex items-center justify-between gap-2">
                        {getTransactionBadge(t.type)}
                        <span className="text-[11px] text-muted-foreground font-sans dir-ltr">
                          {formatDateTime(t.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-2">
                        <div className="text-xs font-semibold text-foreground leading-snug">
                          {t.description || 'تراکنش کیف پول'}
                        </div>
                        <div className={`font-sans font-bold text-sm shrink-0 whitespace-nowrap ${t.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {t.amount > 0 ? `+${formatCurrency(t.amount)}` : formatCurrency(t.amount)}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground font-sans">
                        <span>موجودی پس از تراکنش:</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(t.balanceAfter)}
                        </span>
                      </div>

                      {t.referenceId && (
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                          <span>مرجع:</span>
                          <span className="truncate max-w-[200px]">{t.referenceId}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto border border-border/70 rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="text-right">نوع تراکنش</TableHead>
                        <TableHead className="text-right min-w-[200px]">شرح و علت تراکنش</TableHead>
                        <TableHead className="text-right">کد مرجع</TableHead>
                        <TableHead className="text-left font-sans">مبلغ تراکنش</TableHead>
                        <TableHead className="text-left font-sans">موجودی نهایی</TableHead>
                        <TableHead className="text-left font-sans whitespace-nowrap">تاریخ و زمان</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyData.transactions.map((t) => (
                        <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="py-3">{getTransactionBadge(t.type)}</TableCell>
                          <TableCell className="py-3 text-xs text-foreground font-medium">
                            {t.description || '—'}
                          </TableCell>
                          <TableCell className="py-3 font-mono text-[11px] text-muted-foreground">
                            {t.referenceId ? t.referenceId.slice(0, 14) : '—'}
                          </TableCell>
                          <TableCell className={`py-3 text-left font-sans font-bold text-xs whitespace-nowrap ${t.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {t.amount > 0 ? `+${formatCurrency(t.amount)}` : formatCurrency(t.amount)}
                          </TableCell>
                          <TableCell className="py-3 text-left font-sans text-xs text-muted-foreground whitespace-nowrap">
                            {formatCurrency(t.balanceAfter)}
                          </TableCell>
                          <TableCell className="py-3 text-left font-sans text-[11px] text-muted-foreground whitespace-nowrap">
                            {formatDateTime(t.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="flex flex-row items-center justify-between border-t border-border/60 pt-3 mt-1">
            <span className="text-xs text-muted-foreground font-sans">
              تعداد تراکنش‌های ثبت‌شده: {historyData?.total ?? historyData?.transactions?.length ?? 0} مورد
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHistoryModalOpen(false)}
              className="text-xs h-9 px-4"
            >
              بستن پنجره
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </FeaturePageGuard>
  );
}
