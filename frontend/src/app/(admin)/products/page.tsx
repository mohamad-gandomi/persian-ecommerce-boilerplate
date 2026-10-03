'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Package } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { ProductsKpis } from '@/components/admin/products/products-kpis';
import { ProductsToolbar } from '@/components/admin/products/products-toolbar';
import { ProductsTable } from '@/components/admin/products/products-table';
import { ProductsMobileList } from '@/components/admin/products/products-mobile-list';
import { ProductDeleteModal } from '@/components/admin/products/product-delete-modal';

export default function ProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<'ALL' | 'SIMPLE' | 'VARIABLE'>('ALL');
  const [deleteProduct, setDeleteProduct] = React.useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => {
      toast.success('محصول با موفقیت حذف شد');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteProduct(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'خطا در حذف محصول');
    },
  });

  const stats = React.useMemo(() => {
    let variableCount = 0;
    let simpleCount = 0;
    let publishedCount = 0;

    products.forEach((p) => {
      if (p.productType === 'VARIABLE') variableCount++;
      else simpleCount++;
      if (p.status === 'PUBLISHED') publishedCount++;
    });

    return {
      total: products.length,
      variable: variableCount,
      simple: simpleCount,
      published: publishedCount,
    };
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(s) ||
        (p.sku && p.sku.toLowerCase().includes(s));
      const matchesType = selectedType === 'ALL' ? true : p.productType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [products, searchTerm, selectedType]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
      <Header title="مدیریت محصولات" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <ProductsKpis
          total={stats.total}
          variable={stats.variable}
          simple={stats.simple}
          published={stats.published}
        />

        <ProductsToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onSelectedTypeChange={setSelectedType}
          onAddProduct={() => router.push('/products/new')}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground font-sans">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">در حال بارگذاری فهرست محصولات...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl bg-card border-dashed font-sans">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground text-base mb-1">
              محصولی یافت نشد
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-4">
              {searchTerm || selectedType !== 'ALL'
                ? 'هیچ محصولی با این فیلتر یا واژه جستجو همخوانی ندارد.'
                : 'هنوز هیچ محصولی ثبت نکرده‌اید. برای ثبت اولین محصول دکمه زیر را فشار دهید.'}
            </p>
            <Button
              onClick={() => router.push('/products/new')}
              className="gap-2 font-semibold font-sans"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن اولین محصول</span>
            </Button>
          </div>
        ) : (
          <>
            <ProductsTable
              products={filteredProducts}
              onDelete={(p) => setDeleteProduct(p)}
            />
            <ProductsMobileList
              products={filteredProducts}
              onDelete={(p) => setDeleteProduct(p)}
            />
          </>
        )}
      </div>

      <ProductDeleteModal
        product={deleteProduct}
        isOpen={Boolean(deleteProduct)}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleteProduct(null)}
        onConfirm={(p) => deleteMutation.mutate(p.id)}
      />
    </div>
  );
}
