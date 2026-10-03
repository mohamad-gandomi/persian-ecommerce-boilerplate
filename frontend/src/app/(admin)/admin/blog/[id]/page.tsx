'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { BlogPost, BlogCategory, PostStatus, MediaItem } from '@/types';
import { Header } from '@/components/admin/header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { BlogDeleteModal } from '@/components/admin/blog/blog-delete-modal';
import { BlogEditorHeader } from '@/components/admin/blog/editor/blog-editor-header';
import { BlogContentFields } from '@/components/admin/blog/editor/blog-content-fields';
import { BlogSidebarFields } from '@/components/admin/blog/editor/blog-sidebar-fields';
import { BlogSeoTab } from '@/components/admin/blog/editor/blog-seo-tab';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const postId = params.id as string;

  const [activeTab, setActiveTab] = React.useState('content');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [content, setContent] = React.useState('');
  const [featuredImage, setFeaturedImage] = React.useState('');
  const [status, setStatus] = React.useState<PostStatus>('PUBLISHED');
  const [categoryId, setCategoryId] = React.useState('');

  const generateSlug = (t: string) => t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['blog-post', postId],
    queryFn: () => api.getBlogPost(postId),
  });

  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ['blog-categories'],
    queryFn: () => api.getBlogCategories(),
  });

  React.useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setSlug(post.slug || '');
      setExcerpt(post.excerpt || '');
      setContent(post.content || '');
      setFeaturedImage(post.featuredImage || '');
      setStatus(post.status || 'PUBLISHED');
      setCategoryId(post.categoryId || '');
    }
  }, [post]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateBlogPost(postId, data),
    onSuccess: () => {
      toast.success('مقاله با موفقیت به‌روزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post', postId] });
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در ویرایش مقاله'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteBlogPost(postId),
    onSuccess: () => {
      toast.success('مقاله با موفقیت حذف شد');
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      router.push('/admin/blog');
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف مقاله'),
  });

  const handleSave = () => {
    if (!title.trim()) return toast.error('عنوان مقاله الزامی است');
    if (!content.trim()) return toast.error('متن اصلی مقاله الزامی است');
    updateMutation.mutate({
      title: title.trim(),
      slug: slug.trim() || generateSlug(title.trim()),
      excerpt: excerpt.trim() || undefined,
      content,
      featuredImage: featuredImage.trim() || null,
      status,
      categoryId: categoryId || null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
        <Header title="ویرایش مقاله" />
        <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
      <Header title={`ویرایش: ${post?.title || 'مقاله'}`} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <BlogEditorHeader
          isNew={false}
          title={title}
          slug={slug}
          status={status}
          isSaving={updateMutation.isPending}
          onSave={handleSave}
          onDelete={() => setIsDeleteDialogOpen(true)}
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
                  onTitleChange={setTitle}
                  slug={slug}
                  onSlugChange={setSlug}
                  onResetSlug={() => setSlug(generateSlug(title))}
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

      <BlogDeleteModal
        post={post || null}
        isOpen={isDeleteDialogOpen}
        isPending={deleteMutation.isPending}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
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
