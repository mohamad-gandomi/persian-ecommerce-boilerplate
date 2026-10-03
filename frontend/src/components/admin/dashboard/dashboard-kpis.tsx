'use client';

import * as React from 'react';
import Link from 'next/link';
import { CreditCard, ShoppingBag, Package, Tag } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { formatCurrency } from '@/lib/utils';
import { Product, Coupon } from '@/types';

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
  couponsLoading: boolean;
  activeCoupons: Coupon[];
  totalCouponsCount: number;
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
  couponsLoading,
  activeCoupons,
  totalCouponsCount,
}: DashboardKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 font-sans items-stretch" dir="rtl">
      <Link href="/orders" className="block group h-full">
        <KpiCard
          title="فروش ناخالص کل"
          value={statsLoading ? '...' : formatCurrency(totalRevenue)}
          subtitle={`${totalOrders} سفارش موفق · میانگین ${formatCurrency(averageOrderValue)}`}
          icon={CreditCard}
          iconColor="text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform"
        />
      </Link>

      <Link href="/orders" className="block group h-full">
        <KpiCard
          title="سفارش‌های در جریان"
          value={statsLoading ? '...' : ordersToFulfill}
          subtitle={`${pendingCount} در انتظار بررسی · ${processingCount} در حال پردازش`}
          icon={ShoppingBag}
          iconColor="text-amber-700 dark:text-amber-400 group-hover:scale-105 transition-transform"
        />
      </Link>

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

      <Link href="/coupons" className="block group h-full">
        <KpiCard
          title="کدهای تخفیف فعال"
          value={couponsLoading ? '...' : activeCoupons.length}
          subtitle={`${totalCouponsCount} کوپن تعریف‌شده در سیستم`}
          icon={Tag}
          iconColor="text-purple-700 dark:text-purple-400 group-hover:scale-105 transition-transform"
        />
      </Link>
    </div>
  );
}
