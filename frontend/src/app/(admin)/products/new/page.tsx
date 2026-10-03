'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Info, DollarSign, Image as ImageIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { ProductEditorHeader } from '@/components/admin/products/editor/product-editor-header';
import { ProductOverviewTab } from '@/components/admin/products/editor/product-overview-tab';
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
          <div className="w-full overflow-x-auto pb-1 no-scrollbar" dir="rtl">
            <TabsList className="inline-flex sm:flex w-max sm:w-full items-center justify-start gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-muted/80 rounded-xl border border-border" dir="rtl">
              <TabsTrigger value="overview" className="gap-2 py-2 px-3 sm:px-3.5 text-xs font-semibold rounded-lg font-sans shrink-0 whitespace-nowrap">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>مشخصات پایه</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="gap-2 py-2 px-3 sm:px-3.5 text-xs font-semibold rounded-lg font-sans shrink-0 whitespace-nowrap">
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>قیمت‌گذاری و انبار</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="gap-2 py-2 px-3 sm:px-3.5 text-xs font-semibold rounded-lg font-sans shrink-0 whitespace-nowrap">
                <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                <span>گالری تصاویر ({formData.images.length})</span>
              </TabsTrigger>
            </TabsList>
          </div>

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
            />
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
