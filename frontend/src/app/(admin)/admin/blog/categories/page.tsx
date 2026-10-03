'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sliders, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { BlogCategory } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BlogCategoriesToolbar } from '@/components/admin/blog/categories/blog-categories-toolbar';
import { BlogCategoriesKpis } from '@/components/admin/blog/categories/blog-categories-kpis';
import { BlogCategoryTreeItem } from '@/components/admin/blog/categories/blog-category-tree-item';
import { BlogCategoryFormModal } from '@/components/admin/blog/categories/blog-category-form-modal';
import { BlogCategoryDeleteModal } from '@/components/admin/blog/categories/blog-category-delete-modal';

export default function BlogCategoriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [catDialog, setCatDialog] = React.useState<{
    isOpen: boolean;
    mode: 'CREATE' | 'EDIT';
    category?: BlogCategory;
    defaultParentId?: string;
  }>({ isOpen: false, mode: 'CREATE' });
  const [deleteConfirmCat, setDeleteConfirmCat] = React.useState<BlogCategory | null>(null);

  const { data: tree = [], isLoading } = useQuery({
    queryKey: ['blog-categories-tree'],
    queryFn: () => api.getBlogCategoriesTree(),
  });

  const { data: flatCategories = [] } = useQuery({
    queryKey: ['blog-categories-flat'],
    queryFn: () => api.getBlogCategories(),
  });

  const stats = React.useMemo(() => {
    let subs = 0;
    let withImage = 0;
    flatCategories.forEach((c) => {
      if (c.parentId) subs++;
      if (c.image) withImage++;
    });
    return {
      total: flatCategories.length,
      roots: tree.length,
      subs,
      withImage,
    };
  }, [tree, flatCategories]);

  const filteredTree = React.useMemo(() => {
    if (!search.trim()) return tree;
    const q = search.toLowerCase().trim();
    return tree
      .map((root) => {
        const rootMatches =
          root.name.toLowerCase().includes(q) ||
          root.slug.toLowerCase().includes(q) ||
          (root.description && root.description.toLowerCase().includes(q));
        const matchedChildren = (root.children || []).filter(
          (child) =>
            child.name.toLowerCase().includes(q) ||
            child.slug.toLowerCase().includes(q) ||
            (child.description && child.description.toLowerCase().includes(q)),
        );
        if (rootMatches || matchedChildren.length > 0) {
          return { ...root, children: matchedChildren };
        }
        return null;
      })
      .filter(Boolean) as BlogCategory[];
  }, [tree, search]);

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createBlogCategory(data),
    onSuccess: (cat) => {
      toast.success(`دسته‌بندی «${cat.name}» با موفقیت افزوده شد`);
      queryClient.invalidateQueries({ queryKey: ['blog-categories-tree'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories-flat'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      setCatDialog({ isOpen: false, mode: 'CREATE' });
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در ایجاد دسته‌بندی'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateBlogCategory(id, data),
    onSuccess: (cat) => {
      toast.success(`دسته‌بندی «${cat.name}» به‌روزرسانی شد`);
      queryClient.invalidateQueries({ queryKey: ['blog-categories-tree'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories-flat'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      setCatDialog({ isOpen: false, mode: 'CREATE' });
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در ویرایش دسته‌بندی'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteBlogCategory(id),
    onSuccess: () => {
      toast.success('دسته‌بندی با موفقیت حذف گردید');
      queryClient.invalidateQueries({ queryKey: ['blog-categories-tree'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories-flat'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      setDeleteConfirmCat(null);
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف دسته‌بندی'),
  });

  const handleFormSubmit = (payload: any) => {
    if (catDialog.mode === 'CREATE') {
      createMutation.mutate(payload);
    } else if (catDialog.category) {
      updateMutation.mutate({ id: catDialog.category.id, data: payload });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
      <Header
        title="دسته‌بندی موضوعی مقالات"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <BlogCategoriesToolbar
          search={search}
          onSearchChange={setSearch}
          onAddCategory={() => setCatDialog({ isOpen: true, mode: 'CREATE' })}
        />

        <BlogCategoriesKpis
          total={stats.total}
          roots={stats.roots}
          subs={stats.subs}
          withImage={stats.withImage}
        />

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center text-xs text-muted-foreground font-sans">
              در حال بارگذاری ساختار درختی دسته‌بندی‌ها...
            </div>
          ) : filteredTree.length === 0 ? (
            <Card className="py-16 text-center border-dashed font-sans">
              <CardContent className="space-y-3 max-w-sm mx-auto">
                <Sliders className="w-10 h-10 text-muted-foreground opacity-40 mx-auto" />
                <h3 className="text-sm font-semibold text-foreground">دسته‌بندی‌ای یافت نشد</h3>
                <p className="text-xs text-muted-foreground">
                  {search ? 'هیچ دسته‌ای با این عنوان یافت نشد.' : 'اولین دسته موضوعی وبلاگ را ثبت کنید.'}
                </p>
                <Button size="sm" onClick={() => setCatDialog({ isOpen: true, mode: 'CREATE' })} className="text-xs gap-1.5 font-sans">
                  <Plus className="w-3.5 h-3.5" />
                  ایجاد اولین دسته‌بندی
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTree.map((root) => (
              <BlogCategoryTreeItem
                key={root.id}
                root={root}
                onEdit={(cat) => setCatDialog({ isOpen: true, mode: 'EDIT', category: cat })}
                onDelete={(cat) => setDeleteConfirmCat(cat)}
                onAddSub={(parentId) => setCatDialog({ isOpen: true, mode: 'CREATE', defaultParentId: parentId })}
              />
            ))
          )}
        </div>
      </div>

      <BlogCategoryFormModal
        isOpen={catDialog.isOpen}
        mode={catDialog.mode}
        category={catDialog.category}
        categories={flatCategories}
        isPending={createMutation.isPending || updateMutation.isPending}
        onClose={() => setCatDialog((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleFormSubmit}
      />

      <BlogCategoryDeleteModal
        category={deleteConfirmCat}
        isOpen={Boolean(deleteConfirmCat)}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleteConfirmCat(null)}
        onConfirm={(cat) => deleteMutation.mutate(cat.id)}
      />
    </div>
  );
}
