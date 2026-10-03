'use client';

import * as React from 'react';
import { Category } from '@/types';
import { ProductBasicFields } from './product-basic-fields';
import { ProductPhysicalFields } from './product-physical-fields';

interface ProductOverviewTabProps {
  name: string;
  onNameChange: (val: string) => void;
  slug: string;
  onSlugChange: (val: string) => void;
  onGenerateSlug: () => void;
  sku: string;
  onSkuChange: (val: string) => void;
  categoryId: string;
  onCategoryIdChange: (val: string) => void;
  categories: Category[];
  productType: 'SIMPLE' | 'VARIABLE';
  onProductTypeChange: (val: 'SIMPLE' | 'VARIABLE') => void;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  onStatusChange: (val: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED') => void;
  shortDescription: string;
  onShortDescriptionChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  featured: boolean;
  onFeaturedChange: (val: boolean) => void;
  dimensions: string;
  onDimensionsChange: (val: string) => void;
  weight: string;
  onWeightChange: (val: string) => void;
  primaryImage?: { url: string; altText?: string | null };
  totalImagesCount: number;
  onOpenCoverPicker: () => void;
  onGoToMediaTab: () => void;
}

export function ProductOverviewTab({
  name,
  onNameChange,
  slug,
  onSlugChange,
  onGenerateSlug,
  sku,
  onSkuChange,
  categoryId,
  onCategoryIdChange,
  categories,
  productType,
  onProductTypeChange,
  status,
  onStatusChange,
  shortDescription,
  onShortDescriptionChange,
  description,
  onDescriptionChange,
  featured,
  onFeaturedChange,
  dimensions,
  onDimensionsChange,
  weight,
  onWeightChange,
  primaryImage,
  totalImagesCount,
  onOpenCoverPicker,
  onGoToMediaTab,
}: ProductOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-right" dir="rtl">
      <div className="lg:col-span-2 space-y-6">
        <ProductBasicFields
          name={name}
          onNameChange={onNameChange}
          slug={slug}
          onSlugChange={onSlugChange}
          onGenerateSlug={onGenerateSlug}
          sku={sku}
          onSkuChange={onSkuChange}
          categoryId={categoryId}
          onCategoryIdChange={onCategoryIdChange}
          categories={categories}
          productType={productType}
          onProductTypeChange={onProductTypeChange}
          status={status}
          onStatusChange={onStatusChange}
          shortDescription={shortDescription}
          onShortDescriptionChange={onShortDescriptionChange}
          description={description}
          onDescriptionChange={onDescriptionChange}
          featured={featured}
          onFeaturedChange={onFeaturedChange}
        />
      </div>

      <div className="space-y-6">
        <ProductPhysicalFields
          dimensions={dimensions}
          onDimensionsChange={onDimensionsChange}
          weight={weight}
          onWeightChange={onWeightChange}
          primaryImage={primaryImage}
          totalImagesCount={totalImagesCount}
          onOpenCoverPicker={onOpenCoverPicker}
          onGoToMediaTab={onGoToMediaTab}
        />
      </div>
    </div>
  );
}
