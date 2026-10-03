'use client';

import * as React from 'react';
import { Folder, Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SubcategoryTreeRow } from './subcategory-tree-row';
import { Category } from '@/types';

interface CategoryTreeItemProps {
  root: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddSub: (parentId: string) => void;
}

export function CategoryTreeItem({
  root,
  onEdit,
  onDelete,
  onAddSub,
}: CategoryTreeItemProps) {
  const hasRootImage = Boolean(root.image);
  const childrenList = root.children || [];

  return (
    <Card className="border-border/80 shadow-xs hover:border-primary/40 transition-all duration-200 overflow-hidden font-sans" dir="rtl">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
            {hasRootImage ? (
              <div
                onClick={() => onEdit(root)}
                className="relative w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 shadow-2xs cursor-pointer group/thumb"
                title="ویرایش تصویر کاور"
              >
                <img
                  src={root.image!}
                  alt={root.name}
                  className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover/thumb:bg-black/0 transition-colors" />
              </div>
            ) : (
              <div
                onClick={() => onEdit(root)}
                className="w-12 h-12 rounded-xl bg-wood-100 dark:bg-wood-950/50 flex items-center justify-center text-wood-800 dark:text-wood-200 border border-wood-200/80 dark:border-wood-900/60 shrink-0 cursor-pointer shadow-2xs hover:bg-wood-200/60 transition-colors"
                title="افزودن تصویر کاور"
              >
                <Folder className="w-5 h-5" />
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

                <span className="text-xs text-muted-foreground font-sans dir-ltr">
                  /{root.slug}
                </span>
              </div>

              {root.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {root.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
            <Badge variant="outline" className="text-[11px] font-medium font-sans">
              {root._count?.products || 0} محصول
            </Badge>

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
              title={`افزودن زیردسته به ${root.name}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">زیردسته جدید</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(root)}
              title="ویرایش دسته‌بندی"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(root)}
              title="حذف دسته‌بندی"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {childrenList.length > 0 && (
          <div className="mt-4 pr-3 sm:pr-6 border-r-2 border-wood-300 dark:border-wood-800 space-y-2 mr-2 sm:mr-4">
            {childrenList.map((sub) => (
              <SubcategoryTreeRow
                key={sub.id}
                sub={sub}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
