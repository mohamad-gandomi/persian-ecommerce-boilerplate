'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Product, Attribute, MediaItem } from '@/types';
import { Header } from '@/components/admin/header';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { ProductEditorHeader } from '@/components/admin/products/editor/product-editor-header';
import { ProductEditorTabsNav } from '@/components/admin/products/editor/product-editor-tabs-nav';
import { ProductOverviewTab } from '@/components/admin/products/editor/product-overview-tab';
import { ProductSpecificationsTab } from '@/components/admin/products/specifications/product-specifications-tab';
import { ProductPricingTab } from '@/components/admin/products/editor/product-pricing-tab';
import { ProductVariationsTab } from '@/components/admin/products/editor/product-variations-tab';
import { ProductMediaTab } from '@/components/admin/products/editor/product-media-tab';
import { ProductDeleteModal } from '@/components/admin/products/product-delete-modal';
import { useProductEditor } from '@/components/admin/products/editor/use-product-editor';
import { useFeatures } from '@/lib/use-features';

export default function ProductDetailPage() {
  const { isEnabled } = useFeatures();
  const params = useParams();
  const productId = params.id as string;
  const [activeTab, setActiveTab] = React.useState('overview');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = React.useState<'gallery' | 'cover'>('gallery');

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => api.getProduct(productId),
  });

  const { data: categories = [] } = useQuery({ queryKey: ['categories-flat'], queryFn: () => api.getCategoriesFlat() });
  const { data: globalAttributes = [] } = useQuery<Attribute[]>({ queryKey: ['attributes'], queryFn: () => api.getAttributes() });

  const {
    formData, setFormData, selectedAttrIds, generateSlug, handleSave, handleSelectMedia,
    onAddImageByUrl, onSetPrimaryImage, onRemoveImage, onToggleAttribute,
    updateMutation, deleteMutation, saveAttrMutation, addVarMutation, updateVarMutation, deleteVarMutation,
  } = useProductEditor(productId, product);

  const variants = product?.variants || [];
  const variantPrices = variants.map((v) => Number(v.salePrice || v.price)).filter((p) => !isNaN(p) && p > 0);
  const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : parseFloat(formData.basePrice) || 0;
  const maxPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : parseFloat(formData.basePrice) || 0;
  const totalStock = variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
  const productAttributes = globalAttributes.filter((a) => selectedAttrIds.includes(a.id));
  const primaryImage = formData.images.find((img) => img.isPrimary) || formData.images[0];

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
        <Header title="ویرایش محصول" />
        <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
      <Header title={`ویرایش: ${product?.name || 'محصول'}`} />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <ProductEditorHeader
          isNew={false}
          title={formData.name}
          sku={formData.sku}
          slug={formData.slug}
          status={formData.status}
          productType={formData.productType}
          isSaving={updateMutation.isPending}
          onSave={handleSave}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir="rtl">
          <ProductEditorTabsNav
            specCount={formData.specifications.length}
            variantCount={variants.length}
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
            <ProductVariationsTab
              productType={formData.productType}
              onConvertToVariable={() => { setFormData({ ...formData, productType: 'VARIABLE' }); toast.info('نوع محصول به متغیر تغییر یافت'); }}
              globalAttributes={globalAttributes}
              selectedAttributeIds={selectedAttrIds}
              onToggleAttribute={onToggleAttribute}
              onSaveAttributes={() => saveAttrMutation.mutate(selectedAttrIds)}
              isSavingAttributes={saveAttrMutation.isPending}
              variants={variants}
              productAttributes={productAttributes}
              minVariantPrice={minPrice}
              maxVariantPrice={maxPrice}
              totalVariantStock={totalStock}
              onAddVariantSubmit={(d) => addVarMutation.mutate(d)}
              onUpdateVariantSubmit={(vId, d) => updateVarMutation.mutate({ variantId: vId, data: d })}
              onDeleteVariant={(vId) => deleteVarMutation.mutate(vId)}
              isAddingVariant={addVarMutation.isPending}
              isUpdatingVariant={updateVarMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="media" className="space-y-6 m-0">
            <ProductMediaTab
              images={formData.images}
              onOpenMediaLibrary={() => { setMediaPickerTarget('gallery'); setIsMediaPickerOpen(true); }}
              onAddImageByUrl={onAddImageByUrl}
              onSetPrimary={onSetPrimaryImage}
              onRemoveImage={onRemoveImage}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ProductDeleteModal
        product={product || null}
        isOpen={isDeleteDialogOpen}
        isPending={deleteMutation.isPending}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />

      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={(media: MediaItem) => {
          handleSelectMedia(media, mediaPickerTarget);
          setIsMediaPickerOpen(false);
        }}
        title={mediaPickerTarget === 'cover' ? 'انتخاب تصویر شاخص کالا' : 'افزودن تصویر به گالری'}
      />
    </div>
  );
}
