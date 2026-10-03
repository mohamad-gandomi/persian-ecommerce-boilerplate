'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, User as UserIcon, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';

interface BlogTableProps {
  posts: BlogPost[];
  onDelete: (post: BlogPost) => void;
}

export function BlogTable({
  posts,
  onDelete,
}: BlogTableProps) {
  const router = useRouter();

  return (
    <Card className="hidden md:block overflow-hidden font-sans" dir="rtl">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[380px] text-right">مقاله و عنوان</TableHead>
              <TableHead className="text-right">دسته‌بندی</TableHead>
              <TableHead className="text-right">نویسنده</TableHead>
              <TableHead className="text-right">وضعیت انتشار</TableHead>
              <TableHead className="text-right">تاریخ</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                onClick={() => router.push(`/admin/blog/${post.id}`)}
                className="cursor-pointer hover:bg-muted/50 transition-colors group"
              >
                {/* Article Info: Thumbnail + Title + Excerpt + Slug */}
                <TableCell className="text-right">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted border border-border/70 overflow-hidden shrink-0 flex items-center justify-center group-hover:border-primary/40 transition-colors relative">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-5 h-5 text-muted-foreground/50" />
                      )}
                    </div>

                    <div className="space-y-0.5 min-w-0 text-right">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {post.title}
                      </div>
                      {post.excerpt && (
                        <div className="text-xs text-muted-foreground truncate max-w-sm">
                          {post.excerpt}
                        </div>
                      )}
                      <div className="text-[11px] font-sans text-muted-foreground dir-ltr text-right">
                        /{post.slug}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="text-right">
                  {post.category?.name ? (
                    <Badge variant="wood" className="font-sans">{post.category.name}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground font-sans">عمومی</span>
                  )}
                </TableCell>

                {/* Author */}
                <TableCell className="text-xs text-muted-foreground text-right font-sans">
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>
                      {post.author
                        ? `${post.author.firstName} ${post.author.lastName}`
                        : 'تیم تحریریه'}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="text-right">
                  <Badge
                    variant={post.status === 'PUBLISHED' ? 'success' : 'secondary'}
                    className="text-xs font-sans"
                  >
                    {post.status === 'PUBLISHED' ? 'منتشرشده' : 'پیش‌نویس'}
                  </Badge>
                </TableCell>

                {/* Date */}
                <TableCell className="text-xs text-muted-foreground text-right font-sans">
                  {formatDate(post.publishedAt || post.createdAt)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-left">
                  <div className="flex items-center justify-end gap-1">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
