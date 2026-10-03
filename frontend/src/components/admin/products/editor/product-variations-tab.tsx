'use client';

import * as React from 'react';
import { Layers, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Attribute, ProductVariant } from '@/types';
import { ProductVariationsAttributes } from '../variations/product-variations-attributes';
import { ProductVariationsList } from '../variations/product-variations-list';
import { ProductVariantModal } from '../variations/product-variant-modal';

interface ProductVariationsTabProps {
  productType: 'SIMPLE' | 'VARIABLE';
  onConvertToVariable: () => void;
  globalAttributes: Attribute[];
  selectedAttributeIds: string[];
  onToggleAttribute: (id: string) => void;
  onSaveAttributes: () => void;
  isSavingAttributes: boolean;
  variants: ProductVariant[];
  productAttributes: Attribute[];
  minVariantPrice: number;
  maxVariantPrice: number;
  totalVariantStock: number;
  onAddVariantSubmit: (data: any) => void;
  onUpdateVariantSubmit: (variantId: string, data: any) => void;
  onDeleteVariant: (variantId: string) => void;
  isAddingVariant: boolean;
  isUpdatingVariant: boolean;
}

export function ProductVariationsTab({
  productType,
  onConvertToVariable,
  globalAttributes,
  selectedAttributeIds,
  onToggleAttribute,
  onSaveAttributes,
  isSavingAttributes,
  variants,
  productAttributes,
  minVariantPrice,
  maxVariantPrice,
  totalVariantStock,
  onAddVariantSubmit,
  onUpdateVariantSubmit,
  onDeleteVariant,
  isAddingVariant,
  isUpdatingVariant,
}: ProductVariationsTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingVariant, setEditingVariant] = React.useState<ProductVariant | null>(null);

  if (productType !== 'VARIABLE') {
    return (
      <Card className="text-center py-12 px-6 font-sans" dir="rtl">
        <CardContent className="space-y-4 max-w-md mx-auto text-right">
          <div className="w-12 h-12 rounded-full bg-wood-100 text-wood-800 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-center">
            <h3 className="font-bold text-foreground text-base">محصول ساده و تک‌گزینه</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              این کالا در حال حاضر به عنوان محصول ساده بدون تنوع تنظیم شده است. برای فعال‌سازی ویژگی‌ها و متغیرهایی مانند رنگ، سایز یا مشخصات متغیر، دکمه زیر را فشار دهید.
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Button className="text-xs font-semibold font-sans" onClick={onConvertToVariable}>
              تبدیل به محصول متغیر
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 font-sans" dir="rtl">
      <ProductVariationsAttributes
        globalAttributes={globalAttributes}
        selectedAttributeIds={selectedAttributeIds}
        onToggleAttribute={onToggleAttribute}
        onSave={onSaveAttributes}
        isSaving={isSavingAttributes}
      />

      {selectedAttributeIds.length === 0 ? (
        <Card className="text-center py-10 px-6 border-dashed font-sans">
          <CardContent className="space-y-2 max-w-sm mx-auto text-muted-foreground text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-amber-500 opacity-80" />
            <h4 className="font-semibold text-sm text-foreground">هیچ ویژگی‌ای انتخاب نشده است</h4>
            <p className="text-xs leading-relaxed">
              حداقل یک ویژگی را در بالا علامت بزنید و روی <strong>«ذخیره ویژگی‌های اثر»</strong> کلیک کنید تا ماتریس تنوع‌ها فعال گردد.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ProductVariationsList
          variants={variants}
          productAttributes={productAttributes}
          minVariantPrice={minVariantPrice}
          maxVariantPrice={maxVariantPrice}
          totalVariantStock={totalVariantStock}
          onAddVariant={() => setIsAddModalOpen(true)}
          onEditVariant={(v) => setEditingVariant(v)}
          onDeleteVariant={(v) => onDeleteVariant(v.id)}
          onToggleActive={(variantId, current) => onUpdateVariantSubmit(variantId, { isActive: !current })}
        />
      )}

      {/* Add Variant Modal */}
      <ProductVariantModal
        isOpen={isAddModalOpen}
        mode="ADD"
        productAttributes={productAttributes}
        isPending={isAddingVariant}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data) => {
          onAddVariantSubmit(data);
          setIsAddModalOpen(false);
        }}
      />

      {/* Edit Variant Modal */}
      <ProductVariantModal
        isOpen={Boolean(editingVariant)}
        mode="EDIT"
        variant={editingVariant}
        productAttributes={productAttributes}
        isPending={isUpdatingVariant}
        onClose={() => setEditingVariant(null)}
        onSubmit={(data) => {
          if (editingVariant) onUpdateVariantSubmit(editingVariant.id, data);
          setEditingVariant(null);
        }}
      />
    </div>
  );
}
