'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { BlogPost, BlogCategory } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { BlogToolbar } from '@/components/admin/blog/blog-toolbar';
import { BlogKpis } from '@/components/admin/blog/blog-kpis';
import { BlogTable } from '@/components/admin/blog/blog-table';
import { BlogMobileList } from '@/components/admin/blog/blog-mobile-list';
import { BlogDeleteModal } from '@/components/admin/blog/blog-delete-modal';

export default function BlogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [deletePost, setDeletePost] = React.useState<BlogPost | null>(null);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blog-posts'],
    queryFn: () => api.getBlogPosts(),
  });

  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ['blog-categories'],
    queryFn: () => api.getBlogCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteBlogPost(id),
    onSuccess: () => {
      toast.success('مقاله با موفقیت حذف شد');
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setDeletePost(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'خطا در حذف مقاله');
    },
  });

  const stats = React.useMemo(() => {
    let publishedCount = 0;
    let draftCount = 0;
    posts.forEach((p) => {
      if (p.status === 'PUBLISHED') publishedCount++;
      else draftCount++;
    });
    return {
      total: posts.length,
      published: publishedCount,
      draft: draftCount,
      categories: categories.length,
    };
  }, [posts, categories]);

  const filteredPosts = React.useMemo(() => {
    return posts.filter((p) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(searchLower) ||
        p.slug.toLowerCase().includes(searchLower) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(searchLower));

      const matchesStatus =
        statusFilter === 'ALL' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, searchTerm, statusFilter]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
      <Header
        title="وبلاگ و مقالات آموزشی"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <BlogToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onWriteArticle={() => router.push('/admin/blog/new')}
        />

        <BlogKpis
          total={stats.total}
          published={stats.published}
          draft={stats.draft}
          categories={stats.categories}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-sans">در حال دریافت فهرست مقالات...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl bg-card border-dashed">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground text-base mb-1 font-sans">
              هیچ مقاله‌ای یافت نشد
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-4 font-sans">
              {searchTerm || statusFilter !== 'ALL'
                ? 'هیچ مقاله‌ای با این فیلتر یا واژه جستجو همخوانی ندارد.'
                : 'هنوز هیچ مقاله‌ای ثبت نکرده‌اید. با فشردن دکمه زیر اولین مقاله وبلاگ فروشگاه را بنویسید.'}
            </p>
            <Button
              onClick={() => router.push('/admin/blog/new')}
              className="gap-2 font-sans font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>نوشتن مقاله جدید</span>
            </Button>
          </div>
        ) : (
          <>
            <BlogTable
              posts={filteredPosts}
              onDelete={(post) => setDeletePost(post)}
            />
            <BlogMobileList
              posts={filteredPosts}
              onDelete={(post) => setDeletePost(post)}
            />
          </>
        )}
      </div>

      <BlogDeleteModal
        post={deletePost}
        isOpen={Boolean(deletePost)}
        isPending={deleteMutation.isPending}
        onClose={() => setDeletePost(null)}
        onConfirm={(post) => deleteMutation.mutate(post.id)}
      />
    </div>
  );
}
