'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Product, MediaItem } from '@/types';
import { SpecificationItem } from '@/components/admin/products/specifications/product-specifications-tab';

export function useProductEditor(productId: string, product?: Product) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedAttrIds, setSelectedAttrIds] = React.useState<string[]>([]);

  const [formData, setFormData] = React.useState({
    name: '',
    slug: '',
    sku: '',
    productType: 'SIMPLE' as 'SIMPLE' | 'VARIABLE',
    basePrice: '',
    salePrice: '',
    stockQuantity: 0,
    manageStock: true,
    description: '',
    shortDescription: '',
    dimensions: '',
    weight: '',
    featured: false,
    status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
    categoryId: '',
    images: [] as Array<{ url: string; altText?: string | null; isPrimary: boolean; displayOrder: number }>,
    specifications: [] as SpecificationItem[],
  });

  const generateSlug = (t: string) =>
    t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  React.useEffect(() => {
    if (!product) return;
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      sku: product.sku || '',
      productType: product.productType || 'SIMPLE',
      basePrice: product.basePrice ? String(product.basePrice) : '',
      salePrice: product.salePrice ? String(product.salePrice) : '',
      stockQuantity: product.stockQuantity || 0,
      manageStock: product.manageStock ?? true,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      dimensions: product.dimensions || '',
      weight: product.weight ? String(product.weight) : '',
      featured: product.featured || false,
      status: product.status || 'PUBLISHED',
      categoryId: product.categoryId || '',
      images: (product.images || []).map((img, i) => ({
        url: img.url,
        altText: img.altText || '',
        isPrimary: Boolean(img.isPrimary),
        displayOrder: img.displayOrder !== undefined ? img.displayOrder : i,
      })),
      specifications: (product.specifications as SpecificationItem[]) || [],
    });
    if (product.attributes) {
      setSelectedAttrIds(product.attributes.map((a: any) => a.attributeId || a.id));
    }
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateProduct(productId, data),
    onSuccess: () => {
      toast.success('محصول با موفقیت به‌روزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در ویرایش محصول'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteProduct(productId),
    onSuccess: () => {
      toast.success('محصول با موفقیت حذف شد');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/products');
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف محصول'),
  });

  const saveAttrMutation = useMutation({
    mutationFn: (ids: string[]) => api.updateProduct(productId, { attributes: ids.map((id) => ({ attributeId: id, isVariation: true })) }),
    onSuccess: () => { toast.success('ویژگی‌های متغیر اثر به‌روزرسانی شدند'); queryClient.invalidateQueries({ queryKey: ['product', productId] }); },
    onError: (err: Error) => toast.error(err.message || 'خطا در ذخیره ویژگی‌ها'),
  });

  const addVarMutation = useMutation({
    mutationFn: (data: any) => api.addVariant(productId, data),
    onSuccess: () => { toast.success('تنوع جدید ایجاد شد'); queryClient.invalidateQueries({ queryKey: ['product', productId] }); },
    onError: (err: Error) => toast.error(err.message || 'خطا در ایجاد تنوع'),
  });

  const updateVarMutation = useMutation({
    mutationFn: ({ variantId, data }: { variantId: string; data: any }) => api.updateVariant(variantId, data),
    onSuccess: () => { toast.success('تنوع به‌روزرسانی شد'); queryClient.invalidateQueries({ queryKey: ['product', productId] }); },
    onError: (err: Error) => toast.error(err.message || 'خطا در ویرایش تنوع'),
  });

  const deleteVarMutation = useMutation({
    mutationFn: (variantId: string) => api.deleteVariant(variantId),
    onSuccess: () => { toast.success('تنوع حذف شد'); queryClient.invalidateQueries({ queryKey: ['product', productId] }); },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف تنوع'),
  });

  const handleSave = () => {
    updateMutation.mutate({
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      sku: formData.sku || null,
      productType: formData.productType,
      basePrice: parseFloat(formData.basePrice) || 0,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      stockQuantity: Number(formData.stockQuantity) || 0,
      manageStock: formData.manageStock,
      description: formData.description,
      shortDescription: formData.shortDescription || null,
      dimensions: formData.dimensions || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      featured: formData.featured,
      status: formData.status,
      categoryId: formData.categoryId || null,
      images: formData.images.map((img, i) => ({
        url: img.url,
        altText: img.altText || null,
        isPrimary: Boolean(img.isPrimary),
        displayOrder: img.displayOrder !== undefined ? img.displayOrder : i,
      })),
      specifications: (formData.specifications || []).map((s) => ({ label: s.label, value: s.value })),
    });
  };

  const handleSelectMedia = (media: MediaItem, target: 'gallery' | 'cover') => {
    if (target === 'gallery') {
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
      toast.success('تصویر شاخص تعیین شد');
    }
  };

  const onAddImageByUrl = (url: string, altText: string) => {
    const isFirst = formData.images.length === 0;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url, altText: altText || prev.name, isPrimary: isFirst, displayOrder: prev.images.length }],
    }));
  };

  const onSetPrimaryImage = (idx: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.map((img, i) => ({ ...img, isPrimary: i === idx })) }));
  };

  const onRemoveImage = (idx: number) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== idx);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) updated[0].isPrimary = true;
      return { ...prev, images: updated };
    });
  };

  const onToggleAttribute = (id: string) => {
    setSelectedAttrIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return {
    formData, setFormData, selectedAttrIds, setSelectedAttrIds, generateSlug, handleSave,
    handleSelectMedia, onAddImageByUrl, onSetPrimaryImage, onRemoveImage, onToggleAttribute,
    updateMutation, deleteMutation, saveAttrMutation, addVarMutation, updateVarMutation, deleteVarMutation,
  };
}
