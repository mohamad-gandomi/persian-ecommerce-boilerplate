'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Package,
  Tag,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Order, Product, Coupon, FeaturesConfig } from '@/types';

export interface SearchActionItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: string;
  keywords?: string[];
  featureKey?: keyof FeaturesConfig;
}

export interface SearchResultsData {
  orders: Order[];
  products: Product[];
  coupons: Coupon[];
  actions: SearchActionItem[];
  totalCount: number;
}

interface DashboardSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchResults: SearchResultsData | null;
}

export function DashboardSearch({
  searchQuery,
  setSearchQuery,
  searchResults,
}: DashboardSearchProps) {
  return (
    <div className="space-y-3 font-sans" dir="rtl">
      {/* Search Input Bar with right-side search icon and left-side clear icon */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground">
          <Search className="w-4 h-4" />
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو در سفارش‌ها (کد رهگیری، نام مشتری)، محصولات، کوپن‌ها، پیامک، اعلان‌ها، کیف‌پول یا تنظیمات..."
          className="pr-10 pl-10 py-2.5 h-11 bg-card/70 border-border/70 rounded-xl text-xs sm:text-sm shadow-2xs focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/70 text-right"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground hover:text-foreground"
            aria-label="پاک کردن جستجو"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Instant Search Results Panel */}
      {searchResults && (
        <Card className="border-primary/40 shadow-md bg-card animate-in fade-in-50 duration-150">
          <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              <CardTitle className="text-xs font-bold text-foreground">
                نتایج جستجو ({searchResults.totalCount} مورد یافت شد)
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              بستن
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
            {searchResults.totalCount === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">
                هیچ موردی منطبق با «{searchQuery}» در سفارشات، محصولات، کدهای تخفیف، ماژول‌ها یا تنظیمات یافت نشد.
              </div>
            ) : (
              <>
                {searchResults.orders.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-muted-foreground px-1">
                      سفارش‌ها ({searchResults.orders.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.orders.map((ord) => (
                        <Link
                          key={ord.id}
                          href={`/orders/${ord.id}`}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-accent/60 transition-colors text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-sans font-bold text-primary shrink-0">
                              {ord.orderNumber}
                            </span>
                            <span className="text-foreground truncate">{ord.customerName}</span>
                            <span className="text-muted-foreground text-[11px] truncate hidden sm:inline">
                              {ord.customerEmail}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-bold text-foreground font-sans">
                              {formatCurrency(ord.totalAmount)}
                            </span>
                            <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.products.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-muted-foreground px-1">
                      محصولات ({searchResults.products.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.products.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.id}`}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-accent/60 transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Package className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="font-semibold text-foreground truncate">{p.name}</span>
                            {p.sku && (
                              <span className="font-sans text-[11px] text-muted-foreground shrink-0">
                                {p.sku}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-sans font-bold text-foreground">
                              {p.basePrice ? formatCurrency(p.basePrice) : 'دارای متغیر'}
                            </span>
                            <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.coupons.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-muted-foreground px-1">
                      کدهای تخفیف ({searchResults.coupons.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.coupons.map((c) => (
                        <Link
                          key={c.id}
                          href="/coupons"
                          className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-accent/60 transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Tag className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span className="font-sans font-bold text-primary shrink-0">{c.code}</span>
                            {c.description && (
                              <span className="text-muted-foreground truncate">{c.description}</span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground shrink-0 font-sans">
                            {c.discountType === 'PERCENTAGE'
                              ? `${c.discountValue}٪`
                              : formatCurrency(c.discountValue)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.actions.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-muted-foreground px-1">
                      دسترسی‌ها، تنظیمات و ماژول‌ها ({searchResults.actions.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.actions.map((act, i) => {
                        const Icon = act.icon;
                        return (
                          <Link
                            key={i}
                            href={act.href}
                            className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-accent/60 transition-colors text-xs group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                              </div>
                              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {act.title}
                              </span>
                              <span className="text-[10px] bg-muted/80 text-muted-foreground px-1.5 py-0.2 rounded font-sans shrink-0">
                                {act.category}
                              </span>
                              <span className="text-muted-foreground text-[11px] truncate hidden md:inline font-light">
                                {act.description}
                              </span>
                            </div>
                            <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground shrink-0 transition-transform group-hover:-translate-x-0.5" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
