'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductVariantAttributesSelector } from './product-variant-attributes-selector';
import { Attribute, ProductVariant } from '@/types';

interface ProductVariantModalProps {
  isOpen: boolean;
  mode: 'ADD' | 'EDIT';
  variant?: ProductVariant | null;
  productAttributes: Attribute[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: {
    sku: string;
    price: string;
    salePrice?: string;
    stockQuantity: number;
    dimensions?: string;
    weight?: string;
    isActive: boolean;
    attributeValueIds?: string[];
  }) => void;
}

export function ProductVariantModal({
  isOpen,
  mode,
  variant,
  productAttributes,
  isPending,
  onClose,
  onSubmit,
}: ProductVariantModalProps) {
  const [sku, setSku] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [salePrice, setSalePrice] = React.useState('');
  const [stockQuantity, setStockQuantity] = React.useState(10);
  const [dimensions, setDimensions] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);
  const [selectedValues, setSelectedValues] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (variant && mode === 'EDIT') {
      setSku(variant.sku || '');
      setPrice(variant.price ? String(variant.price) : '');
      setSalePrice(variant.salePrice ? String(variant.salePrice) : '');
      setStockQuantity(variant.stockQuantity || 0);
      setDimensions(variant.dimensions || '');
      setWeight(variant.weight ? String(variant.weight) : '');
      setIsActive(variant.isActive);
    } else {
      setSku(''); setPrice(''); setSalePrice(''); setStockQuantity(10);
      setDimensions(''); setWeight(''); setIsActive(true);
      const initial: Record<string, string> = {};
      productAttributes.forEach((attr) => {
        if (attr.values && attr.values.length > 0) initial[attr.id] = attr.values[0].id;
      });
      setSelectedValues(initial);
    }
  }, [variant, mode, productAttributes, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      sku,
      price,
      salePrice: salePrice || undefined,
      stockQuantity: Number(stockQuantity) || 0,
      dimensions: dimensions || undefined,
      weight: weight || undefined,
      isActive,
      attributeValueIds: mode === 'ADD' ? Object.values(selectedValues).filter(Boolean) : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-y-auto font-sans text-right" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle>
            {mode === 'ADD' ? 'افزودن تنوع جدید به کاتالوگ' : `ویرایش تنوع: ${variant?.sku}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {mode === 'ADD' && (
            <ProductVariantAttributesSelector
              productAttributes={productAttributes}
              selectedValues={selectedValues}
              onChange={(attrId, valId) => setSelectedValues({ ...selectedValues, [attrId]: valId })}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">شناسه تنوع (SKU) *</label>
              <Input
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SW-VAR-001"
                className="font-sans dir-ltr text-xs text-left"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">موجودی انبار (تعداد) *</label>
              <Input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value, 10) || 0)}
                className="font-sans text-xs text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">قیمت تنوع (تومان) *</label>
              <Input
                type="number"
                required
                step="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="۱۵۰۰۰۰۰۰"
                className="font-sans dir-ltr text-xs text-left"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-emerald-700">قیمت حراجی (اختیاری)</label>
              <Input
                type="number"
                step="1000"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="۱۲۵۰۰۰۰۰"
                className="font-sans dir-ltr text-xs text-left"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">ابعاد اختصاصی (اختیاری)</label>
              <Input
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="۲۲۰×۹۰×۷۵ سانتی‌متر"
                className="font-sans text-xs text-right"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">وزن اختصاصی (کیلوگرم)</label>
              <Input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="۴۸.۵"
                className="font-sans text-xs text-center"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium font-sans">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border w-4 h-4 text-primary"
              />
              <span>تنوع فعال و قابل سفارش در فروشگاه باشد</span>
            </label>
          </div>

          <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="font-sans">
              انصراف
            </Button>
            <Button type="submit" size="sm" disabled={isPending} className="font-semibold font-sans">
              {isPending ? 'در حال ثبت...' : mode === 'ADD' ? 'افزودن تنوع' : 'ذخیره تغییرات'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
