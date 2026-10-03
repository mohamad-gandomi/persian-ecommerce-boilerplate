'use client';

import * as React from 'react';
import { CornerDownLeft, Tag, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types';

interface SubcategoryTreeRowProps {
  sub: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function SubcategoryTreeRow({
  sub,
  onEdit,
  onDelete,
}: SubcategoryTreeRowProps) {
  const hasSubImage = Boolean(sub.image);

  return (
    <div className="flex md:flex-row xs:flex-row xs:items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors border border-border/40 font-sans">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <CornerDownLeft className="w-3.5 h-3.5 text-wood-600 dark:text-wood-400 shrink-0" />

        {hasSubImage ? (
          <div
            onClick={() => onEdit(sub)}
            className="w-7 h-7 rounded-md overflow-hidden border border-border shrink-0 shadow-2xs cursor-pointer group/subthumb"
            title="ویرایش تصویر زیردسته"
          >
            <img
              src={sub.image!}
              alt={sub.name}
              className="w-full h-full object-cover group-hover/subthumb:scale-115 transition-transform"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-6 h-6 rounded bg-wood-100/80 dark:bg-wood-950/40 flex items-center justify-center text-wood-700 dark:text-wood-300 shrink-0 text-[10px]">
            <Tag className="w-3 h-3" />
          </div>
        )}

        <div className="min-w-0 flex-1 text-right">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onEdit(sub)}
              className="text-xs font-semibold text-foreground hover:text-primary transition-colors text-right flex items-center gap-1 group/subname"
            >
              <span className="truncate">{sub.name}</span>
              <Pencil className="w-3 h-3 opacity-0 group-hover/subname:opacity-100 text-muted-foreground transition-opacity" />
            </button>
            <span className="text-[10px] text-muted-foreground truncate font-sans dir-ltr">
              /{sub.slug}
            </span>
          </div>
          {sub.description && (
            <p className="text-[11px] text-muted-foreground truncate">
              {sub.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-end xs:self-center shrink-0">
        <Badge variant="secondary" className="text-[10px] h-5 font-sans">
          {sub._count?.products || 0} محصول
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(sub)}
          title="ویرایش زیردسته"
        >
          <Pencil className="w-3 h-3" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(sub)}
          title="حذف زیردسته"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
