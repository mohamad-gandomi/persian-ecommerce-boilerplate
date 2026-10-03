'use client';

import * as React from 'react';
import { Pencil, Plus, Trash2, Tag, Palette, Image as ImageIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Attribute, AttributeValue } from '@/types';
import { cn } from '@/lib/utils';

interface AttributeCardProps {
  attribute: Attribute;
  onEditAttribute: (attr: Attribute) => void;
  onDeleteAttribute: (attr: Attribute) => void;
  onAddTerm: (attr: Attribute) => void;
  onEditTerm: (attr: Attribute, term: AttributeValue) => void;
  onDeleteTerm: (attr: Attribute, term: AttributeValue) => void;
}

export function AttributeCard({
  attribute,
  onEditAttribute,
  onDeleteAttribute,
  onAddTerm,
  onEditTerm,
  onDeleteTerm,
}: AttributeCardProps) {
  const displayType = (attribute.displayType || 'TEXT').toUpperCase();

  return (
    <Card className="shadow-xs border-border/80 flex flex-col justify-between hover:border-primary/40 transition-all duration-200 font-sans" dir="rtl">
      <div>
        <CardHeader className="flex flex-row items-start justify-between pb-3 space-y-0 text-right">
          <div className="space-y-1.5 flex-1 pl-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onEditAttribute(attribute)}
                className="text-base font-bold text-foreground hover:text-primary transition-colors text-right flex items-center gap-1.5 group/title"
                title="ویرایش ویژگی"
              >
                <span>{attribute.name}</span>
                <Pencil className="w-3.5 h-3.5 opacity-0 group-hover/title:opacity-100 text-muted-foreground transition-opacity" />
              </button>

              {displayType === 'IMAGE' ? (
                <Badge variant="outline" className="text-[10px] gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium font-sans">
                  <ImageIcon className="w-3 h-3" />
                  پارچه / تصویر
                </Badge>
              ) : displayType === 'COLOR' ? (
                <Badge variant="outline" className="text-[10px] gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 font-medium font-sans">
                  <Palette className="w-3 h-3" />
                  کالیته رنگ
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] gap-1 bg-muted text-muted-foreground border-border font-medium font-sans">
                  <Tag className="w-3 h-3" />
                  مشخصات متنی
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground font-sans dir-ltr text-right">
              نامک: <span className="text-foreground/80">{attribute.slug}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => onEditAttribute(attribute)}
              title="ویرایش مشخصات ویژگی"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 gap-1 font-semibold font-sans"
              onClick={() => onAddTerm(attribute)}
            >
              <Plus className="w-3.5 h-3.5" />
              گزینه جدید
            </Button>

            <button
              type="button"
              onClick={() => onDeleteAttribute(attribute)}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              title="حذف ویژگی"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-2 pb-4 space-y-3 text-right">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
            <span>گزینه‌های تنظیم‌شده ({attribute.values?.length || 0})</span>
            <span className="text-[10px] font-normal text-muted-foreground">
              (جهت ویرایش روی گزینه کلیک نمایید)
            </span>
          </div>

          {attribute.values && attribute.values.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-0.5">
              {attribute.values.map((val) => {
                const hasImage = Boolean(val.image);
                const hasColor = Boolean(val.colorHex);

                return (
                  <div
                    key={val.id}
                    onClick={() => onEditTerm(attribute, val)}
                    className={cn(
                      'group relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium shadow-2xs cursor-pointer select-none',
                      hasImage
                        ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/70 hover:shadow-xs'
                        : hasColor
                        ? 'border-border/80 bg-card/80 hover:border-primary/60 hover:shadow-xs'
                        : 'border-border bg-muted/40 hover:bg-muted hover:border-primary/50 hover:shadow-xs',
                    )}
                    title={`ویرایش «${val.name}»`}
                  >
                    {hasImage && (
                      <div className="relative w-6 h-6 rounded-md overflow-hidden ring-1 ring-black/10 shrink-0 shadow-2xs">
                        <img
                          src={val.image!}
                          alt={val.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    )}

                    {!hasImage && hasColor && (
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-2xs transition-transform group-hover:scale-110"
                        style={{ backgroundColor: val.colorHex! }}
                      />
                    )}

                    <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                      {val.name}
                    </span>

                    {!hasImage && hasColor && (
                      <span className="text-[10px] text-muted-foreground font-sans dir-ltr">
                        {val.colorHex}
                      </span>
                    )}

                    <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-70 transition-opacity mr-0.5" />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTerm(attribute, val);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity mr-1 p-0.5 rounded hover:bg-destructive/10"
                      title="حذف گزینه"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 border border-dashed rounded-lg text-center bg-muted/20">
              <p className="text-xs text-muted-foreground">
                هنوز گزینه‌ای تعریف نشده است.{' '}
                <span
                  onClick={() => onAddTerm(attribute)}
                  className="text-primary underline cursor-pointer font-medium"
                >
                  افزودن گزینه
                </span>{' '}
                را بزنید.
              </p>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
