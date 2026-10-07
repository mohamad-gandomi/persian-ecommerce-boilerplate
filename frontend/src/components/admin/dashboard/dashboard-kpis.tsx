'use client';

import * as React from 'react';
import Link from 'next/link';
import { CreditCard, ShoppingBag, Package, Tag, Wallet, Bell, Zap, Users } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { formatCurrency } from '@/lib/utils';
import { useFeatures } from '@/lib/use-features';
import { Product, Coupon, ActiveFlashDeal } from '@/types';

interface DashboardKpisProps {
  statsLoading: boolean;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  ordersToFulfill: number;
  pendingCount: number;
  processingCount: number;
  productsLoading: boolean;
  lowStockProducts: Product[];
  outOfStockCount: number;
  couponsLoading?: boolean;
  activeCoupons?: Coupon[];
  totalCouponsCount?: number;
  walletStats?: { totalWalletsCount: number; totalSystemBalance: number };
  walletLoading?: boolean;
  unreadNotificationsCount?: number;
  activeFlashDeal?: ActiveFlashDeal | null;
  totalUsersCount?: number;
}

export function DashboardKpis({
  statsLoading,
  totalRevenue,
  totalOrders,
  averageOrderValue,
  ordersToFulfill,
  pendingCount,
  processingCount,
  productsLoading,
  lowStockProducts,
  outOfStockCount,
  couponsLoading = false,
  activeCoupons = [],
  totalCouponsCount = 0,
  walletStats,
  walletLoading = false,
  unreadNotificationsCount = 0,
  activeFlashDeal,
  totalUsersCount = 0,
}: DashboardKpisProps) {
  const { isEnabled } = useFeatures();

  // Dynamic 4th card based on active custom modules
  const renderFourthKpi = () => {
    if (isEnabled('coupons')) {
      return (
        <Link href="/coupons" className="block group h-full">
          <KpiCard
            title="کدهای تخفیف فعال"
            value={couponsLoading ? '...' : activeCoupons.length}
            subtitle={`${totalCouponsCount} کوپن تعریف‌شده در سیستم`}
            icon={Tag}
            iconColor="text-purple-700 dark:text-purple-400 group-hover:scale-105 transition-transform"
          />
        </Link>
      );
    }

    if (isEnabled('wallet')) {
      return (
        <Link href="/wallets" className="block group h-full">
          <KpiCard
            title="موجودی کیف‌پول‌ها"
            value={walletLoading ? '...' : formatCurrency(walletStats?.totalSystemBalance || 0)}
            subtitle={`${walletStats?.totalWalletsCount || 0} کیف‌پول کاربران در سامانه`}
            icon={Wallet}
            iconColor="text-blue-700 dark:text-blue-400 group-hover:scale-105 transition-transform"
          />
        </Link>
      );
    }

    if (isEnabled('notifications')) {
      return (
        <Link href="/notifications" className="block group h-full">
          <KpiCard
            title="مرکز اعلان‌های سامانه"
            value={unreadNotificationsCount > 0 ? `${unreadNotificationsCount} جدید` : 'به‌روز'}
            subtitle={unreadNotificationsCount > 0 ? 'اعلان‌های نیازمند توجه مدیریت' : 'تمامی اعلان‌ها خوانده شده‌اند'}
            icon={Bell}
            iconColor="text-rose-700 dark:text-rose-400 group-hover:scale-105 transition-transform"
          />
        </Link>
      );
    }

    if (isEnabled('flashDeals')) {
      return (
        <Link href="/flash-deals" className="block group h-full">
          <KpiCard
            title="فروش شگفت‌انگیز"
            value={activeFlashDeal ? 'کمپین فعال' : 'غیرفعال'}
            subtitle={activeFlashDeal ? activeFlashDeal.title : 'بدون جشنواره تخفیف زمان‌دار'}
            icon={Zap}
            iconColor="text-amber-700 dark:text-amber-400 group-hover:scale-105 transition-transform"
          />
        </Link>
      );
    }

    return (
      <Link href="/users" className="block group h-full">
        <KpiCard
          title="کاربران و مشتریان"
          value={totalUsersCount > 0 ? totalUsersCount : 'مدیریت کاربران'}
          subtitle="حساب‌های مشتریان و دسترسی‌های مدیریت"
          icon={Users}
          iconColor="text-indigo-700 dark:text-indigo-400 group-hover:scale-105 transition-transform"
        />
      </Link>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 font-sans items-stretch" dir="rtl">
      {/* KPI 1: Gross Sales */}
      <Link href="/orders" className="block group h-full">
        <KpiCard
          title="فروش ناخالص کل"
          value={statsLoading ? '...' : formatCurrency(totalRevenue)}
          subtitle={`${totalOrders} سفارش موفق · میانگین ${formatCurrency(averageOrderValue)}`}
          icon={CreditCard}
          iconColor="text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform"
        />
      </Link>

      {/* KPI 2: Active Orders */}
      <Link href="/orders" className="block group h-full">
        <KpiCard
          title="سفارش‌های در جریان"
          value={statsLoading ? '...' : ordersToFulfill}
          subtitle={`${pendingCount} در انتظار بررسی · ${processingCount} در حال پردازش`}
          icon={ShoppingBag}
          iconColor="text-amber-700 dark:text-amber-400 group-hover:scale-105 transition-transform"
        />
      </Link>

      {/* KPI 3: Inventory Stock Status */}
      <Link href="/products" className="block group h-full">
        <KpiCard
          title="وضعیت موجودی انبار"
          value={productsLoading ? '...' : lowStockProducts.length > 0 ? `${lowStockProducts.length} کالای رو به اتمام` : 'مطلوب و پایدار'}
          subtitle={
            lowStockProducts.length > 0
              ? `${outOfStockCount} کالا ناموجود · ${lowStockProducts.length - outOfStockCount} وضعیت بحرانی`
              : 'تمام محصولات دارای موجودی کافی هستند'
          }
          icon={Package}
          iconColor={
            lowStockProducts.length > 0
              ? 'text-red-700 dark:text-red-400 group-hover:scale-105 transition-transform'
              : 'text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform'
          }
        />
      </Link>

      {/* KPI 4: Dynamic based on enabled custom modules */}
      {renderFourthKpi()}
    </div>
  );
}
