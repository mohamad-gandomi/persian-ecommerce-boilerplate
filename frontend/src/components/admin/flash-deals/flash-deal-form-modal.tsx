'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Loader2,
  Plus,
  Trash2,
  Gift,
  Tag,
  Clock,
  Sparkles,
  ShoppingBag,
  Search,
  X,
  Share2,
  Check,
  Percent,
  Image as ImageIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PersianDatePicker } from '@/components/ui/persian-date-picker';
import { PersianTimePicker } from '@/components/ui/persian-time-picker';
import { api } from '@/lib/api';
import { FlashDeal, Product, DiscountType } from '@/types';
import { toPersianDigits } from '@/lib/jalali';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface FormItem {
  productId: string;
  productName: string;
  basePrice: number;
  imageUrl?: string | null;
  discountType: DiscountType;
  discountValue: number;
  specialPrice: number;
  cashbackAmount: number;
  referrerReward: number;
}

interface FlashDealFormModalProps {
  deal: FlashDeal | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: any) => void;
  isPending: boolean;
}

const EMPTY_PRODUCTS: Product[] = [];

export function FlashDealFormModal({
  deal,
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
}: FlashDealFormModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [badgeText, setBadgeText] = React.useState('فروش ویژه');
  const [defaultCashback, setDefaultCashback] = React.useState('12000');
  const [defaultReferrerReward, setDefaultReferrerReward] = React.useState('15000');
  const [isActive, setIsActive] = React.useState(true);

  // Date and Time states
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [startTime, setStartTime] = React.useState('00:00');
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [endTime, setEndTime] = React.useState('23:59');

  // Items in deal
  const [items, setItems] = React.useState<FormItem[]>([]);

  // Product Search State for Combobox
  const [productSearch, setProductSearch] = React.useState('');
  const [isProductPickerOpen, setIsProductPickerOpen] = React.useState(false);
  const pickerRef = React.useRef<HTMLDivElement>(null);

  // Fetch all available products
  const { data: allProducts = EMPTY_PRODUCTS } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
    enabled: isOpen,
  });

  // Populate data when opening modal or changing deal
  React.useEffect(() => {
    if (!isOpen) return;

    if (deal) {
      setTitle(deal.title || '');
      setDescription(deal.description || '');
      setBadgeText(deal.badgeText || 'فروش ویژه');
      setDefaultCashback(
        deal.defaultCashback !== null && deal.defaultCashback !== undefined
          ? String(deal.defaultCashback)
          : '0',
      );
      setDefaultReferrerReward(
        deal.defaultReferrerReward !== null && deal.defaultReferrerReward !== undefined
          ? String(deal.defaultReferrerReward)
          : '0',
      );
      setIsActive(deal.isActive ?? true);

      const s = new Date(deal.startDate);
      const e = new Date(deal.endDate);
      setStartDate(s);
      setEndDate(e);

      const pad = (n: number) => String(n).padStart(2, '0');
      setStartTime(`${pad(s.getHours())}:${pad(s.getMinutes())}`);
      setEndTime(`${pad(e.getHours())}:${pad(e.getMinutes())}`);

      if (deal.items && Array.isArray(deal.items) && deal.items.length > 0) {
        setItems(
          deal.items.map((i) => {
            const prod = i.product || allProducts.find((p) => p.id === i.productId);
            const primaryImg =
              prod?.images?.find((img) => img.isPrimary)?.url ||
              prod?.images?.[0]?.url ||
              null;
            return {
              productId: i.productId,
              productName: prod?.name || (i as any).productName || 'کالای انتخابی',
              basePrice: Number(prod?.basePrice || i.specialPrice),
              imageUrl: primaryImg,
              discountType: i.discountType || 'PERCENTAGE',
              discountValue: Number(i.discountValue),
              specialPrice: Number(i.specialPrice),
              cashbackAmount: i.cashbackAmount ? Number(i.cashbackAmount) : 0,
              referrerReward: i.referrerReward ? Number(i.referrerReward) : 0,
            };
          }),
        );
      } else {
        setItems([]);
      }
    } else {
      // Default new deal: starts now, ends in 24 hours
      setTitle('تخفیف شگفت‌انگیز');
      setDescription('تا پایان زمان، فرصت خرید با پاداش بیشتر داری.');
      setBadgeText('فروش ویژه');
      setDefaultCashback('12000');
      setDefaultReferrerReward('15000');
      setIsActive(true);

      const now = new Date();
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      setStartDate(now);
      setEndDate(tomorrow);
      setStartTime('00:00');
      setEndTime('23:59');
      setItems([]);
    }
    setProductSearch('');
    setIsProductPickerOpen(false);
  }, [deal, isOpen]);

  // Enrich item names or images if allProducts loads after deal.items
  React.useEffect(() => {
    if (!isOpen || allProducts.length === 0) return;
    setItems((currentItems) => {
      let changed = false;
      const enriched = currentItems.map((item) => {
        if (item.productName === 'کالای انتخابی' || !item.imageUrl) {
          const prod = allProducts.find((p) => p.id === item.productId);
          if (prod) {
            changed = true;
            const primaryImg =
              prod.images?.find((img) => img.isPrimary)?.url ||
              prod.images?.[0]?.url ||
              null;
            return {
              ...item,
              productName: item.productName === 'کالای انتخابی' ? prod.name : item.productName,
              basePrice: item.basePrice || Number(prod.basePrice),
              imageUrl: item.imageUrl || primaryImg,
            };
          }
        }
        return item;
      });
      return changed ? enriched : currentItems;
    });
  }, [allProducts, isOpen]);

  // Close picker on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsProductPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered products for searchable combobox
  const filteredProducts = React.useMemo(() => {
    const existingIds = new Set(items.map((i) => i.productId));
    const term = productSearch.toLowerCase().trim();

    return allProducts
      .filter((p) => !existingIds.has(p.id))
      .filter((p) => {
        if (!term) return true;
        return (
          p.name.toLowerCase().includes(term) ||
          p.sku?.toLowerCase().includes(term) ||
          p.category?.name?.toLowerCase().includes(term)
        );
      });
  }, [allProducts, items, productSearch]);

  const handleSelectProduct = (prod: Product) => {
    const basePrice = Number(prod.basePrice);
    const defaultPct = 12;
    const specialPrice = Math.round(basePrice * (1 - defaultPct / 100));
    const cb = parseInt(defaultCashback, 10) || 0;
    const refRew = parseInt(defaultReferrerReward, 10) || 0;

    const primaryImg =
      prod.images?.find((img) => img.isPrimary)?.url ||
      prod.images?.[0]?.url ||
      null;

    setItems((prev) => [
      ...prev,
      {
        productId: prod.id,
        productName: prod.name,
        basePrice,
        imageUrl: primaryImg,
        discountType: 'PERCENTAGE',
        discountValue: defaultPct,
        specialPrice,
        cashbackAmount: cb,
        referrerReward: refRew,
      },
    ]);

    setProductSearch('');
    setIsProductPickerOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemDiscountChange = (index: number, newDiscount: number) => {
    setItems((prev) => {
      const copy = [...prev];
      const item = { ...copy[index] };
      item.discountValue = newDiscount;
      if (item.discountType === 'PERCENTAGE') {
        item.specialPrice = Math.max(
          0,
          Math.round(item.basePrice * (1 - newDiscount / 100)),
        );
      } else {
        item.specialPrice = Math.max(0, Math.round(item.basePrice - newDiscount));
      }
      copy[index] = item;
      return copy;
    });
  };

  const handleItemSpecialPriceChange = (index: number, newSpecialPrice: number) => {
    setItems((prev) => {
      const copy = [...prev];
      const item = { ...copy[index] };
      item.specialPrice = newSpecialPrice;
      if (item.basePrice > 0 && item.discountType === 'PERCENTAGE') {
        item.discountValue = Math.max(
          0,
          Math.round(((item.basePrice - newSpecialPrice) / item.basePrice) * 100),
        );
      }
      copy[index] = item;
      return copy;
    });
  };

  const handleItemCashbackChange = (index: number, newCashback: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], cashbackAmount: newCashback };
      return copy;
    });
  };

  const handleItemReferrerRewardChange = (index: number, newReward: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], referrerReward: newReward };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('عنوان جشنواره الزامی است');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('تاریخ شروع و پایان الزامی است');
      return;
    }

    const [startH, startM] = startTime.split(':').map((n) => parseInt(n, 10) || 0);
    const [endH, endM] = endTime.split(':').map((n) => parseInt(n, 10) || 0);

    const start = new Date(startDate);
    start.setHours(startH, startM, 0, 0);

    const end = new Date(endDate);
    end.setHours(endH, endM, 59, 999);

    if (end <= start) {
      toast.error('تاریخ و ساعت پایان باید بعد از زمان شروع باشد');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      badgeText: badgeText.trim() || undefined,
      defaultCashback: defaultCashback ? parseFloat(defaultCashback) : 0,
      defaultReferrerReward: defaultReferrerReward ? parseFloat(defaultReferrerReward) : 0,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      isActive,
      items: items.map((i) => ({
        productId: i.productId,
        discountType: i.discountType,
        discountValue: i.discountValue,
        specialPrice: i.specialPrice,
        cashbackAmount: i.cashbackAmount,
        referrerReward: i.referrerReward,
      })),
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl font-sans max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>{deal ? 'ویرایش فروش شگفت‌انگیز' : 'تعریف پیشنهاد شگفت‌انگیز جدید'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Campaign Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-foreground">عنوان کمپین *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: تخفیف شگفت‌انگیز"
                required
                className="h-9 text-xs text-right font-sans"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-foreground">متن برچسب بالای عنوان</label>
              <Input
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="مثلاً: پیشنهادهای محدود امروز"
                className="h-9 text-xs text-right font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-foreground">شعار و متن انگیزشی (توضیحات)</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثلاً: تا پایان زمان، فرصت خرید با پاداش بیشتر داری."
              className="h-9 text-xs text-right font-sans"
            />
          </div>

          {/* Timing Section with Persian Date Pickers */}
          <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-3">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span>زمان‌بندی و تایمر جشنواره (شمسی)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date & Time */}
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-medium text-muted-foreground">تاریخ و ساعت آغاز</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <PersianDatePicker
                      value={startDate}
                      onChange={setStartDate}
                      placeholder="تاریخ شروع..."
                      startYear={1402}
                      endYear={1415}
                    />
                  </div>
                  <PersianTimePicker
                    value={startTime}
                    onChange={setStartTime}
                    placeholder="ساعت شروع..."
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-medium text-muted-foreground">تاریخ و ساعت پایان (انقضای تایمر)</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <PersianDatePicker
                      value={endDate}
                      onChange={setEndDate}
                      minDate={startDate || undefined}
                      placeholder="تاریخ پایان..."
                      startYear={1402}
                      endYear={1415}
                    />
                  </div>
                  <PersianTimePicker
                    value={endTime}
                    onChange={setEndTime}
                    placeholder="ساعت پایان..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Default Cashback & Referrer Reward & Active */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            {/* Default Cashback */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-emerald-600" />
                <span>پاداش خرید پیش‌فرض (تومان)</span>
              </label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={defaultCashback}
                onChange={(e) => setDefaultCashback(e.target.value)}
                placeholder="مثلاً ۱۲۰۰۰"
                className="h-9 text-xs font-sans text-left dir-ltr"
              />
            </div>

            {/* Default Referrer Reward */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>پاداش معرف پیش‌فرض (تومان)</span>
              </label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={defaultReferrerReward}
                onChange={(e) => setDefaultReferrerReward(e.target.value)}
                placeholder="مثلاً ۱۵۰۰۰"
                className="h-9 text-xs font-sans text-left dir-ltr"
              />
            </div>

            {/* Campaign Active Switch */}
            <div className="pb-2">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span>کمپین بلافاصله فعال باشد</span>
              </label>
            </div>
          </div>

          {/* Products & Pricing Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span>محصولات منتخب این پیشنهاد ({toPersianDigits(items.length)} کالا)</span>
              </label>
            </div>

            {/* Searchable Product Combobox / Picker */}
            <div ref={pickerRef} className="relative">
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  value={productSearch}
                  onFocus={() => setIsProductPickerOpen(true)}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setIsProductPickerOpen(true);
                  }}
                  placeholder="جستجو و انتخاب کالا بر اساس نام، شناسه (SKU) یا دسته‌بندی..."
                  className="pr-9 pl-8 h-10 text-xs text-right font-sans rounded-lg border-border/80 bg-background"
                />
                {productSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setProductSearch('');
                      setIsProductPickerOpen(false);
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdown Results Box */}
              {isProductPickerOpen && (
                <div className="absolute z-50 top-full mt-1.5 right-0 left-0 bg-card border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto p-1.5 space-y-1 font-sans">
                  {filteredProducts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      {productSearch ? 'کالایی با این مشخصات یافت نشد' : 'همه کالاهای موجود به کمپین اضافه شده‌اند'}
                    </div>
                  ) : (
                    filteredProducts.slice(0, 30).map((prod) => {
                      const primaryImg =
                        prod.images?.find((img) => img.isPrimary)?.url ||
                        prod.images?.[0]?.url ||
                        null;
                      return (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-10 rounded-md bg-muted border border-border/60 overflow-hidden shrink-0 flex items-center justify-center">
                              {primaryImg ? (
                                <img
                                  src={primaryImg}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-muted-foreground/60" />
                              )}
                            </div>
                            <div className="text-right min-w-0">
                              <p className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                                {prod.name}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                <span>{prod.category?.name || 'عمومی'}</span>
                                {prod.sku && <span className="dir-ltr font-sans">({prod.sku})</span>}
                                <span>•</span>
                                <span className="font-medium text-foreground font-sans">
                                  {formatCurrency(prod.basePrice)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectProduct(prod);
                            }}
                            className="h-7 px-2.5 text-xs gap-1 font-sans text-primary hover:bg-primary/10 border-primary/30 shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                            <span>افزودن</span>
                          </Button>
                        </div>
                      );
                    })
                  )}
                  {filteredProducts.length > 30 && (
                    <div className="p-2 text-center text-[11px] text-muted-foreground border-t border-border/40">
                      نمایش ۳۰ کالای اول از مجموع {toPersianDigits(filteredProducts.length)} کالا — برای دقت بیشتر جستجو کنید.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Items List */}
            {items.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl font-sans space-y-1">
                <p className="font-medium text-foreground">هنوز کالایی به این پیشنهاد شگفت‌انگیز اضافه نشده است.</p>
                <p>از کادر جستجوی بالا، نام یا کد کالای مورد نظر را جستجو کرده و روی «افزودن» بزنید.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-0.5">
                {items.map((item, idx) => (
                  <div
                    key={item.productId}
                    className="p-3 bg-card border border-border/80 rounded-xl space-y-2.5 shadow-2xs font-sans"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-muted/60 border border-border/60 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Tag className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-foreground block truncate">
                            {item.productName}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-sans">
                            قیمت اصلی: {formatCurrency(item.basePrice)}
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(idx)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                        title="حذف از پیشنهاد"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {/* Inputs Row: Discount %, Special Price, Buyer Cashback, Referrer Reward */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-border/40 text-right">
                      {/* Discount % */}
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <div className="flex items-center gap-1.5 h-5 text-[11px] font-semibold text-muted-foreground truncate">
                          <Percent className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>تخفیف (٪)</span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          max="99"
                          value={item.discountValue}
                          onChange={(e) =>
                            handleItemDiscountChange(idx, parseFloat(e.target.value) || 0)
                          }
                          className="h-9 text-xs font-sans text-center dir-ltr"
                        />
                      </div>

                      {/* Special Price */}
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <div className="flex items-center gap-1.5 h-5 text-[11px] font-semibold text-muted-foreground truncate">
                          <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>قیمت شگفت‌انگیز (تومان)</span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={item.specialPrice}
                          onChange={(e) =>
                            handleItemSpecialPriceChange(idx, parseFloat(e.target.value) || 0)
                          }
                          className="h-9 text-xs font-sans text-left dir-ltr font-semibold text-emerald-700 dark:text-emerald-400"
                        />
                      </div>

                      {/* Buyer Cashback */}
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <div className="flex items-center gap-1.5 h-5 text-[11px] font-semibold text-muted-foreground truncate">
                          <Gift className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>پاداش خریدار (تومان)</span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          step="1000"
                          value={item.cashbackAmount}
                          onChange={(e) =>
                            handleItemCashbackChange(idx, parseFloat(e.target.value) || 0)
                          }
                          className="h-9 text-xs font-sans text-left dir-ltr"
                        />
                      </div>

                      {/* Referrer Reward */}
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <div className="flex items-center gap-1.5 h-5 text-[11px] font-semibold text-muted-foreground truncate">
                          <Share2 className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span>پاداش معرف (تومان)</span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          step="1000"
                          value={item.referrerReward}
                          onChange={(e) =>
                            handleItemReferrerRewardChange(idx, parseFloat(e.target.value) || 0)
                          }
                          className="h-9 text-xs font-sans text-left dir-ltr"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 flex-row-reverse justify-start gap-2.5 sm:gap-3">
            <Button type="submit" disabled={isPending} className="h-9 text-xs font-sans font-semibold">
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : deal ? (
                'ذخیره تغییرات جشنواره'
              ) : (
                'ثبت پیشنهاد شگفت‌انگیز'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 text-xs font-sans"
            >
              انصراف
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
