'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { BlogCategory, PostStatus, MediaItem } from '@/types';
import { Header } from '@/components/admin/header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { BlogEditorHeader } from '@/components/admin/blog/editor/blog-editor-header';
import { BlogContentFields } from '@/components/admin/blog/editor/blog-content-fields';
import { BlogSidebarFields } from '@/components/admin/blog/editor/blog-sidebar-fields';
import { BlogSeoTab } from '@/components/admin/blog/editor/blog-seo-tab';

export default function NewBlogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState('content');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [isCustomSlug, setIsCustomSlug] = React.useState(false);
  const [excerpt, setExcerpt] = React.useState('');
  const [content, setContent] = React.useState('');
  const [featuredImage, setFeaturedImage] = React.useState('');
  const [status, setStatus] = React.useState<PostStatus>('PUBLISHED');
  const [categoryId, setCategoryId] = React.useState('');

  const generateSlug = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ['blog-categories'],
    queryFn: () => api.getBlogCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createBlogPost(data),
    onSuccess: (newPost) => {
      toast.success(status === 'PUBLISHED' ? 'مقاله با موفقیت منتشر شد' : 'پیش‌نویس ذخیره شد');
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      if (newPost?.id) {
        router.push(`/admin/blog/${newPost.id}`);
      } else {
        router.push('/admin/blog');
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || 'خطا در ثبت مقاله');
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('عنوان مقاله الزامی است');
      return;
    }
    if (!content.trim()) {
      toast.error('متن اصلی مقاله الزامی است');
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      slug: slug.trim() || generateSlug(title.trim()) || undefined,
      excerpt: excerpt.trim() || undefined,
      content,
      featuredImage: featuredImage.trim() || null,
      status,
      categoryId: categoryId || null,
    });
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isCustomSlug) setSlug(generateSlug(val));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
      <Header title="نگارش مقاله جدید" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <BlogEditorHeader
          isNew={true}
          title={title}
          slug={slug}
          status={status}
          isSaving={createMutation.isPending}
          onSave={handleSave}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/80 p-1 rounded-xl">
            <TabsTrigger value="content" className="gap-2 text-xs font-semibold rounded-lg font-sans">
              <BookOpen className="w-3.5 h-3.5" />
              <span>محتوا و رسانه</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-2 text-xs font-semibold rounded-lg font-sans">
              <Sparkles className="w-3.5 h-3.5" />
              <span>انتشار و سئو</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <BlogContentFields
                  title={title}
                  onTitleChange={handleTitleChange}
                  slug={slug}
                  onSlugChange={(val) => { setIsCustomSlug(true); setSlug(generateSlug(val)); }}
                  onResetSlug={() => { setIsCustomSlug(false); setSlug(generateSlug(title)); }}
                  excerpt={excerpt}
                  onExcerptChange={setExcerpt}
                  content={content}
                  onContentChange={setContent}
                />
              </div>

              <div className="space-y-6">
                <BlogSidebarFields
                  featuredImage={featuredImage}
                  onFeaturedImageChange={setFeaturedImage}
                  onOpenMediaPicker={() => setIsMediaPickerOpen(true)}
                  categoryId={categoryId}
                  onCategoryIdChange={setCategoryId}
                  categories={categories}
                  status={status}
                  onStatusChange={setStatus}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <BlogSeoTab
              title={title}
              slug={slug}
              excerpt={excerpt}
              content={content}
              featuredImage={featuredImage}
              categoryId={categoryId}
              categories={categories}
            />
          </TabsContent>
        </Tabs>
      </div>

      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={(media: MediaItem) => {
          setFeaturedImage(media.url);
          setIsMediaPickerOpen(false);
          toast.success('تصویر کاور انتخاب شد');
        }}
        title="انتخاب تصویر کاور مقاله"
      />
    </div>
  );
}
