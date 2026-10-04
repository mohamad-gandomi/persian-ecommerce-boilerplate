'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layers, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { ProductEditorHeader } from '@/components/admin/products/editor/product-editor-header';
import { ProductEditorTabsNav } from '@/components/admin/products/editor/product-editor-tabs-nav';
import { ProductOverviewTab } from '@/components/admin/products/editor/product-overview-tab';
import { ProductSpecificationsTab } from '@/components/admin/products/specifications/product-specifications-tab';
import { ProductPricingTab } from '@/components/admin/products/editor/product-pricing-tab';
import { ProductMediaTab } from '@/components/admin/products/editor/product-media-tab';
import { useNewProductEditor } from '@/components/admin/products/editor/use-new-product-editor';

export default function NewProductPage() {
  const {
    activeTab,
    setActiveTab,
    isMediaPickerOpen,
    setIsMediaPickerOpen,
    mediaPickerTarget,
    setMediaPickerTarget,
    formData,
    setFormData,
    generateSlug,
    handleSave,
    handleSelectMedia,
    createMutation,
  } = useNewProductEditor();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories-flat'],
    queryFn: () => api.getCategoriesFlat(),
  });

  const primaryImage = formData.images.find((img) => img.isPrimary) || formData.images[0];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
      <Header title="افزودن محصول جدید" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <ProductEditorHeader
          isNew={true}
          title={formData.name}
          sku={formData.sku}
          slug={formData.slug}
          status={formData.status}
          productType={formData.productType}
          isSaving={createMutation.isPending}
          onSave={handleSave}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir="rtl">
          <ProductEditorTabsNav
            specCount={formData.specifications.length}
            variantCount={0}
            imageCount={formData.images.length}
          />

          <TabsContent value="overview" className="space-y-6 m-0">
            <ProductOverviewTab
              name={formData.name}
              onNameChange={(val) => setFormData({ ...formData, name: val, slug: formData.slug || generateSlug(val) })}
              slug={formData.slug}
              onSlugChange={(val) => setFormData({ ...formData, slug: val })}
              onGenerateSlug={() => setFormData({ ...formData, slug: generateSlug(formData.name) })}
              sku={formData.sku}
              onSkuChange={(val) => setFormData({ ...formData, sku: val })}
              categoryId={formData.categoryId}
              onCategoryIdChange={(val) => setFormData({ ...formData, categoryId: val })}
              categories={categories}
              productType={formData.productType}
              onProductTypeChange={(val) => setFormData({ ...formData, productType: val })}
              status={formData.status}
              onStatusChange={(val) => setFormData({ ...formData, status: val })}
              shortDescription={formData.shortDescription}
              onShortDescriptionChange={(val) => setFormData({ ...formData, shortDescription: val })}
              description={formData.description}
              onDescriptionChange={(val) => setFormData({ ...formData, description: val })}
              featured={formData.featured}
              onFeaturedChange={(val) => setFormData({ ...formData, featured: val })}
              dimensions={formData.dimensions}
              onDimensionsChange={(val) => setFormData({ ...formData, dimensions: val })}
              weight={formData.weight}
              onWeightChange={(val) => setFormData({ ...formData, weight: val })}
              primaryImage={primaryImage}
              totalImagesCount={formData.images.length}
              onOpenCoverPicker={() => { setMediaPickerTarget('cover'); setIsMediaPickerOpen(true); }}
              onGoToMediaTab={() => setActiveTab('media')}
            />
          </TabsContent>

          <TabsContent value="specifications" className="space-y-6 m-0">
            <ProductSpecificationsTab
              specifications={formData.specifications}
              onChange={(specs) => setFormData({ ...formData, specifications: specs })}
              defaultDimensions={formData.dimensions}
              defaultWeight={formData.weight}
            />
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6 m-0">
            <ProductPricingTab
              basePrice={formData.basePrice}
              onBasePriceChange={(val) => setFormData({ ...formData, basePrice: val })}
              salePrice={formData.salePrice}
              onSalePriceChange={(val) => setFormData({ ...formData, salePrice: val })}
              stockQuantity={formData.stockQuantity}
              onStockQuantityChange={(val) => setFormData({ ...formData, stockQuantity: val })}
              manageStock={formData.manageStock}
              onManageStockChange={(val) => setFormData({ ...formData, manageStock: val })}
              rewardType={formData.rewardType}
              onRewardTypeChange={(val) => setFormData({ ...formData, rewardType: val })}
              referrerRewardValue={formData.referrerRewardValue}
              onReferrerRewardValueChange={(val) => setFormData({ ...formData, referrerRewardValue: val })}
              refereeRewardValue={formData.refereeRewardValue}
              onRefereeRewardValueChange={(val) => setFormData({ ...formData, refereeRewardValue: val })}
            />
          </TabsContent>

          <TabsContent value="variations" className="space-y-6 m-0">
            <Card className="p-8 text-center border-dashed font-sans" dir="rtl">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground text-base">
                  تعریف تنوع‌ها و ویژگی‌های متغیر
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  برای تعریف ویژگی‌ها (مانند رنگ، چوب، سایز) و ساخت تنوع‌های قیمتی مجزا، ابتدا مشخصات اولیه کالا را ذخیره کنید تا شناسه یکتای پایگاه داده به آن اختصاص یابد.
                </p>
                <Button
                  onClick={handleSave}
                  disabled={createMutation.isPending}
                  className="font-semibold text-xs h-9 gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره و ورود به بخش تنوع‌ها</span>
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6 m-0">
            <ProductMediaTab
              images={formData.images}
              onOpenMediaLibrary={() => { setMediaPickerTarget('gallery'); setIsMediaPickerOpen(true); }}
              onAddImageByUrl={(url, altText) => {
                const isFirst = formData.images.length === 0;
                setFormData({
                  ...formData,
                  images: [...formData.images, { url, altText: altText || formData.name, isPrimary: isFirst, displayOrder: formData.images.length }],
                });
              }}
              onSetPrimary={(idx) => {
                const updated = formData.images.map((img, i) => ({ ...img, isPrimary: i === idx }));
                setFormData({ ...formData, images: updated });
              }}
              onRemoveImage={(idx) => {
                const updated = formData.images.filter((_, i) => i !== idx);
                if (updated.length > 0 && !updated.some((img) => img.isPrimary)) updated[0].isPrimary = true;
                setFormData({ ...formData, images: updated });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleSelectMedia}
        title={mediaPickerTarget === 'cover' ? 'انتخاب تصویر شاخص کالا' : 'افزودن تصویر به گالری'}
      />
    </div>
  );
}
