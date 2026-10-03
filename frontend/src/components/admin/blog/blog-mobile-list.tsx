'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';

interface BlogMobileListProps {
  posts: BlogPost[];
  onDelete: (post: BlogPost) => void;
}

export function BlogMobileList({
  posts,
  onDelete,
}: BlogMobileListProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-3 md:hidden font-sans" dir="rtl">
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => router.push(`/admin/blog/${post.id}`)}
          className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-primary/50 transition-all cursor-pointer space-y-3 text-right"
        >
          {/* Card Header: Featured Image/Icon + Title + Category */}
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-lg bg-muted border border-border/70 overflow-hidden shrink-0 flex items-center justify-center relative">
              {post.featuredImage ? (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="w-6 h-6 text-muted-foreground/50" />
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {post.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-sans">
                <span>{post.category?.name || 'عمومی'}</span>
                <span>•</span>
                <span className="truncate dir-ltr font-sans">/{post.slug}</span>
              </div>
            </div>
          </div>

          {/* Card Middle: Excerpt Preview */}
          {post.excerpt && (
            <p className="text-xs text-muted-foreground line-clamp-2 pt-1 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Card Footer: Status & Actions */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    post.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                />
                <span className="font-medium text-foreground">
                  {post.status === 'PUBLISHED' ? 'منتشرشده' : 'پیش‌نویس'}
                </span>
              </div>
              <span>•</span>
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/admin/blog/${post.id}`);
                }}
                title="ویرایش مقاله"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(post);
                }}
                title="حذف مقاله"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
