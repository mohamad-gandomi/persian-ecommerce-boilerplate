'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { MediaItem } from '@/types';

export function useNewProductEditor() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState('overview');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = React.useState<'gallery' | 'cover'>('gallery');

  const [formData, setFormData] = React.useState({
    name: '',
    slug: '',
    sku: '',
    productType: 'SIMPLE' as 'SIMPLE' | 'VARIABLE',
    basePrice: '',
    salePrice: '',
    stockQuantity: 10,
    manageStock: true,
    description: '',
    shortDescription: '',
    dimensions: '',
    weight: '',
    featured: false,
    status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
    categoryId: '',
    images: [] as Array<{ url: string; altText?: string | null; isPrimary: boolean; displayOrder: number }>,
  });

  const generateSlug = (t: string) => t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createProduct(data),
    onSuccess: (newProduct) => {
      toast.success('محصول با موفقیت ایجاد شد');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (newProduct?.id) router.push(`/products/${newProduct.id}`);
      else router.push('/products');
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در ثبت محصول'),
  });

  const handleSave = () => {
    if (!formData.name.trim()) { toast.error('عنوان محصول الزامی است'); setActiveTab('overview'); return; }
    if (!formData.description.trim()) { toast.error('توضیحات محصول الزامی است'); setActiveTab('overview'); return; }
    if (!formData.basePrice || parseFloat(formData.basePrice) < 0) { toast.error('قیمت پایه کالا الزامی است'); setActiveTab('pricing'); return; }

    createMutation.mutate({
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      sku: formData.sku || undefined,
      productType: formData.productType,
      basePrice: parseFloat(formData.basePrice) || 0,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      stockQuantity: Number(formData.stockQuantity) || 0,
      manageStock: formData.manageStock,
      description: formData.description,
      shortDescription: formData.shortDescription || undefined,
      dimensions: formData.dimensions || undefined,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      featured: formData.featured,
      status: formData.status,
      categoryId: formData.categoryId || null,
      images: formData.images.length > 0 ? formData.images.map((img, i) => ({
        url: img.url,
        altText: img.altText || null,
        isPrimary: Boolean(img.isPrimary),
        displayOrder: img.displayOrder !== undefined ? img.displayOrder : i,
      })) : undefined,
    });
  };

  const handleSelectMedia = (media: MediaItem) => {
    if (mediaPickerTarget === 'gallery') {
      const isFirst = formData.images.length === 0;
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { url: media.url, altText: media.altText || prev.name, isPrimary: isFirst, displayOrder: prev.images.length }],
      }));
      toast.success('تصویر به گالری پیوست شد');
    } else {
      const existing = formData.images.findIndex((img) => img.url === media.url);
      if (existing !== -1) {
        setFormData((prev) => ({ ...prev, images: prev.images.map((img, i) => ({ ...img, isPrimary: i === existing })) }));
      } else {
        setFormData((prev) => ({
          ...prev,
          images: [{ url: media.url, altText: media.altText || prev.name, isPrimary: true, displayOrder: 0 }, ...prev.images.map((img) => ({ ...img, isPrimary: false }))],
        }));
      }
      toast.success('تصویر کاور اصلی تعیین گردید');
    }
  };

  return {
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
  };
}
