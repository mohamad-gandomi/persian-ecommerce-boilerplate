'use client';

import * as React from 'react';
import Link from 'next/link';
import { Folder, CornerDownLeft, Tag, Pencil, Trash2, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogCategory } from '@/types';

interface BlogCategoryTreeItemProps {
  root: BlogCategory;
  onEdit: (category: BlogCategory) => void;
  onDelete: (category: BlogCategory) => void;
  onAddSub: (parentId: string) => void;
}

export function BlogCategoryTreeItem({
  root,
  onEdit,
  onDelete,
  onAddSub,
}: BlogCategoryTreeItemProps) {
  const hasRootImage = Boolean(root.image);
  const childrenList = root.children || [];

  return (
    <Card className="border-border/80 shadow-xs hover:border-primary/40 transition-all font-sans" dir="rtl">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
            {hasRootImage ? (
              <div
                onClick={() => onEdit(root)}
                className="relative w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 shadow-2xs cursor-pointer group/thumb"
                title="ویرایش تصویر دسته‌بندی"
              >
                <img
                  src={root.image!}
                  alt={root.name}
                  className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                />
              </div>
            ) : (
              <div
                onClick={() => onEdit(root)}
                className="w-12 h-12 rounded-xl bg-wood-100 dark:bg-wood-950/50 flex items-center justify-center text-wood-800 dark:text-wood-200 border border-wood-200/80 shrink-0 cursor-pointer shadow-2xs"
                title="افزودن تصویر کاور"
              >
                <Folder className="w-5 h-5 text-wood-700 dark:text-wood-300" />
              </div>
            )}

            <div className="space-y-1 min-w-0 flex-1 text-right">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => onEdit(root)}
                  className="font-bold text-base text-foreground hover:text-primary transition-colors text-right flex items-center gap-1.5 group/name"
                >
                  <span>{root.name}</span>
                  <Pencil className="w-3.5 h-3.5 opacity-0 group-hover/name:opacity-100 text-muted-foreground transition-opacity" />
                </button>
                <span className="text-xs text-muted-foreground font-sans dir-ltr">/{root.slug}</span>
                {root.displayOrder !== undefined && root.displayOrder > 0 && (
                  <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    ترتیب: {root.displayOrder}
                  </span>
                )}
              </div>
              {root.description ? (
                <p className="text-xs text-muted-foreground line-clamp-1">{root.description}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground/60 italic">بدون توضیح</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
            <Link href={`/admin/blog?categoryId=${root.id}`}>
              <Badge variant="outline" className="text-[11px] font-medium gap-1 hover:bg-muted/60 font-sans">
                <span>{root._count?.posts || 0} مقاله</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </Badge>
            </Link>
            {childrenList.length > 0 && (
              <Badge variant="secondary" className="text-[11px] font-medium hidden sm:inline-flex font-sans">
                {childrenList.length} زیردسته
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1 font-medium font-sans"
              onClick={() => onAddSub(root.id)}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">زیردسته جدید</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(root)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(root)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {childrenList.length > 0 && (
          <div className="mt-4 pr-3 sm:pr-6 border-r-2 border-wood-300 dark:border-wood-800 space-y-2 mr-2 sm:mr-4">
            {childrenList.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors border border-border/40"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <CornerDownLeft className="w-3.5 h-3.5 text-wood-600 dark:text-wood-400 shrink-0" />
                  {sub.image ? (
                    <div
                      onClick={() => onEdit(sub)}
                      className="w-7 h-7 rounded-md overflow-hidden border border-border shrink-0 shadow-2xs cursor-pointer"
                    >
                      <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded bg-wood-100 dark:bg-wood-950/40 flex items-center justify-center text-wood-700 dark:text-wood-300 shrink-0 text-[10px]">
                      <Tag className="w-3 h-3" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1 text-right">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => onEdit(sub)}
                        className="text-xs font-semibold text-foreground hover:text-primary transition-colors text-right flex items-center gap-1"
                      >
                        <span className="truncate">{sub.name}</span>
                        <Pencil className="w-3 h-3 opacity-0 hover:opacity-100 text-muted-foreground" />
                      </button>
                      <span className="text-[10px] text-muted-foreground truncate font-sans dir-ltr">
                        /{sub.slug}
                      </span>
                    </div>
                    {sub.description && (
                      <p className="text-[11px] text-muted-foreground truncate">{sub.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end xs:self-center shrink-0">
                  <Link href={`/admin/blog?categoryId=${sub.id}`}>
                    <Badge variant="secondary" className="text-[10px] h-5 gap-1 hover:bg-muted/80 font-sans">
                      <span>{sub._count?.posts || 0} مقاله</span>
                      <ExternalLink className="w-2 h-2 opacity-60" />
                    </Badge>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(sub)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(sub)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
