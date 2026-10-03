'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sliders, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Category, MediaItem } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { CategoriesKpis } from '@/components/admin/categories/categories-kpis';
import { CategoriesToolbar } from '@/components/admin/categories/categories-toolbar';
import { CategoryTreeItem } from '@/components/admin/categories/category-tree-item';
import { CategoryFormModal } from '@/components/admin/categories/category-form-modal';
import { CategoryDeleteModal } from '@/components/admin/categories/category-delete-modal';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [deleteConfirmCat, setDeleteConfirmCat] = React.useState<Category | null>(null);
  const [catDialog, setCatDialog] = React.useState<{
    isOpen: boolean;
    mode: 'CREATE' | 'EDIT';
    category?: Category;
    initialParentId?: string;
  }>({ isOpen: false, mode: 'CREATE' });

  const { data: tree = [], isLoading } = useQuery({
    queryKey: ['categories-tree'],
    queryFn: () => api.getCategoriesTree(),
  });

  const { data: flatCategories = [] } = useQuery({
    queryKey: ['categories-flat'],
    queryFn: () => api.getCategoriesFlat(),
  });

  const stats = React.useMemo(() => {
    let subs = 0, withImage = 0;
    flatCategories.forEach((c) => {
      if (c.parentId) subs++;
      if (c.image) withImage++;
    });
    return { total: flatCategories.length, roots: tree.length, subs, withImage };
  }, [tree, flatCategories]);

  const filteredTree = React.useMemo(() => {
    if (!search.trim()) return tree;
    const q = search.toLowerCase();
    return tree
      .map((root) => {
        const rootMatches = root.name.toLowerCase().includes(q) || root.slug.toLowerCase().includes(q) || (root.description && root.description.toLowerCase().includes(q));
        const matchedChildren = (root.children || []).filter((child) =>
          child.name.toLowerCase().includes(q) || child.slug.toLowerCase().includes(q) || (child.description && child.description.toLowerCase().includes(q))
        );
        if (rootMatches || matchedChildren.length > 0) return { ...root, children: matchedChildren };
        return null;
      })
      .filter(Boolean) as Category[];
  }, [tree, search]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['categories-tree'] });
    queryClient.invalidateQueries({ queryKey: ['categories-flat'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createCategory(data),
    onSuccess: (cat) => {
      toast.success(`دسته‌بندی «${cat.name}» با موفقیت ایجاد شد`);
      invalidate();
      setCatDialog((prev) => ({ ...prev, isOpen: false }));
      setSelectedImage('');
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در ایجاد دسته‌بندی'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateCategory(id, data),
    onSuccess: (cat) => {
      toast.success(`دسته‌بندی «${cat.name}» بروزرسانی شد`);
      invalidate();
      setCatDialog((prev) => ({ ...prev, isOpen: false }));
      setSelectedImage('');
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در بروزرسانی دسته‌بندی'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      toast.success('دسته‌بندی با موفقیت حذف گردید');
      invalidate();
      setDeleteConfirmCat(null);
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف دسته‌بندی'),
  });

  return (
    <div className="space-y-8 pb-16 font-sans" dir="rtl">
      <Header title="مدیریت دسته‌بندی‌ها و مجموعه‌ها" />
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <CategoriesToolbar search={search} onSearchChange={setSearch} onOpenCreate={() => { setSelectedImage(''); setCatDialog({ isOpen: true, mode: 'CREATE' }); }} />
        <CategoriesKpis {...stats} />
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center text-xs text-muted-foreground font-sans">در حال بارگذاری ساختار درختی دسته‌بندی‌ها...</div>
          ) : filteredTree.length === 0 ? (
            <Card className="py-16 text-center border-dashed font-sans">
              <CardContent className="space-y-3 max-w-sm mx-auto">
                <Sliders className="w-10 h-10 text-muted-foreground opacity-40 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">دسته‌بندی‌ای یافت نشد</h3>
                  <p className="text-xs text-muted-foreground">{search ? 'موردی مطابق با جستجوی شما یافت نشد.' : 'اولین دسته‌بندی کاتالوگ فروشگاه را ایجاد کنید.'}</p>
                </div>
                {search ? (
                  <Button variant="outline" size="sm" onClick={() => setSearch('')} className="text-xs font-sans">پاک کردن جستجو</Button>
                ) : (
                  <Button size="sm" onClick={() => { setSelectedImage(''); setCatDialog({ isOpen: true, mode: 'CREATE' }); }} className="text-xs gap-1.5 font-sans">
                    <Plus className="w-3.5 h-3.5" />
                    ایجاد اولین دسته‌بندی
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredTree.map((root) => (
              <CategoryTreeItem
                key={root.id}
                root={root}
                onEdit={(c) => { setSelectedImage(c.image || ''); setCatDialog({ isOpen: true, mode: 'EDIT', category: c }); }}
                onDelete={(c) => setDeleteConfirmCat(c)}
                onAddSub={(parentId) => { setSelectedImage(''); setCatDialog({ isOpen: true, mode: 'CREATE', initialParentId: parentId }); }}
              />
            ))
          )}
        </div>
      </div>

      <CategoryFormModal
        isOpen={catDialog.isOpen}
        mode={catDialog.mode}
        category={catDialog.category}
        initialParentId={catDialog.initialParentId}
        flatCategories={flatCategories}
        isPending={createMutation.isPending || updateMutation.isPending}
        selectedImageUrl={selectedImage}
        onClearImage={() => setSelectedImage('')}
        onOpenMediaPicker={() => setIsMediaPickerOpen(true)}
        onClose={() => setCatDialog((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={(payload) => catDialog.mode === 'CREATE' ? createMutation.mutate(payload) : catDialog.category && updateMutation.mutate({ id: catDialog.category.id, data: payload })}
      />

      <CategoryDeleteModal
        isOpen={Boolean(deleteConfirmCat)}
        category={deleteConfirmCat}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleteConfirmCat(null)}
        onConfirm={(cat) => deleteMutation.mutate(cat.id)}
      />

      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={(media: MediaItem) => { setSelectedImage(media.url); setIsMediaPickerOpen(false); }}
        title="انتخاب تصویر کاور دسته‌بندی"
        description="تصویر شاخص باکیفیت را برای نمایش در کارت‌های دسته‌بندی انتخاب کنید."
      />
    </div>
  );
}
