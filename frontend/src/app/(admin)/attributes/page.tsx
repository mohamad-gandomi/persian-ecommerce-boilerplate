'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sliders } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Attribute, AttributeValue, MediaItem } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { AttributesKpis } from '@/components/admin/attributes/attributes-kpis';
import { AttributesToolbar } from '@/components/admin/attributes/attributes-toolbar';
import { AttributeCard } from '@/components/admin/attributes/attribute-card';
import { AttributeFormModal } from '@/components/admin/attributes/attribute-form-modal';
import { AttributeTermModal } from '@/components/admin/attributes/attribute-term-modal';
import { AttributeDeleteModal } from '@/components/admin/attributes/attribute-delete-modal';
import { AttributeTermDeleteModal } from '@/components/admin/attributes/attribute-term-delete-modal';
import { FeaturePageGuard } from '@/components/admin/feature-guard';

export default function AttributesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<'ALL' | 'COLOR' | 'IMAGE' | 'TEXT'>('ALL');
  const [attrDialog, setAttrDialog] = React.useState<{ isOpen: boolean; mode: 'CREATE' | 'EDIT'; attribute?: Attribute }>({ isOpen: false, mode: 'CREATE' });
  const [termDialog, setTermDialog] = React.useState<{ isOpen: boolean; mode: 'CREATE' | 'EDIT'; attribute: Attribute | null; term?: AttributeValue }>({ isOpen: false, mode: 'CREATE', attribute: null });
  const [selectedTermImage, setSelectedTermImage] = React.useState('');
  const [deleteConfirmAttr, setDeleteConfirmAttr] = React.useState<Attribute | null>(null);
  const [deleteConfirmTerm, setDeleteConfirmTerm] = React.useState<{ termId: string; termName: string; attributeName: string } | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  const { data: attributes = [], isLoading } = useQuery({
    queryKey: ['attributes'],
    queryFn: () => api.getAttributes(),
  });

  const stats = React.useMemo(() => {
    let colorCount = 0, imageCount = 0, textCount = 0;
    attributes.forEach((attr) => {
      attr.values?.forEach((val) => {
        if (val.image) imageCount++;
        else if (val.colorHex) colorCount++;
        else textCount++;
      });
    });
    return { totalAttributes: attributes.length, colorCount, imageCount, textCount };
  }, [attributes]);

  const filteredAttributes = React.useMemo(() => {
    return attributes.filter((attr) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || attr.name.toLowerCase().includes(q) || attr.slug.toLowerCase().includes(q) || attr.values?.some((v) => v.name.toLowerCase().includes(q));
      const matchesType = typeFilter === 'ALL' || (attr.displayType || 'TEXT').toUpperCase() === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [attributes, search, typeFilter]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['attributes'] });

  const createAttrMutation = useMutation({
    mutationFn: (data: any) => api.createAttribute(data),
    onSuccess: () => { toast.success('ویژگی با موفقیت ایجاد شد'); invalidate(); setAttrDialog({ isOpen: false, mode: 'CREATE' }); },
    onError: (err: Error) => toast.error(err.message || 'خطا در ایجاد ویژگی'),
  });

  const updateAttrMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateAttribute(id, data),
    onSuccess: () => { toast.success('ویژگی بروزرسانی شد'); invalidate(); setAttrDialog({ isOpen: false, mode: 'CREATE' }); },
    onError: (err: Error) => toast.error(err.message || 'خطا در بروزرسانی ویژگی'),
  });

  const deleteAttrMutation = useMutation({
    mutationFn: (id: string) => api.deleteAttribute(id),
    onSuccess: () => { toast.success('ویژگی و گزینه‌های آن حذف شدند'); invalidate(); setDeleteConfirmAttr(null); },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف ویژگی'),
  });

  const addValueMutation = useMutation({
    mutationFn: ({ attributeId, data }: { attributeId: string; data: any }) => api.addAttributeValue(attributeId, data),
    onSuccess: () => { toast.success('گزینه با موفقیت افزوده شد'); invalidate(); setTermDialog({ isOpen: false, mode: 'CREATE', attribute: null }); setSelectedTermImage(''); },
    onError: (err: Error) => toast.error(err.message || 'خطا در افزودن گزینه'),
  });

  const updateValueMutation = useMutation({
    mutationFn: ({ valueId, data }: { valueId: string; data: any }) => api.updateAttributeValue(valueId, data),
    onSuccess: () => { toast.success('گزینه بروزرسانی شد'); invalidate(); setTermDialog({ isOpen: false, mode: 'CREATE', attribute: null }); setSelectedTermImage(''); },
    onError: (err: Error) => toast.error(err.message || 'خطا در بروزرسانی گزینه'),
  });

  const deleteValueMutation = useMutation({
    mutationFn: (id: string) => api.deleteAttributeValue(id),
    onSuccess: () => { toast.success('گزینه با موفقیت حذف شد'); invalidate(); setDeleteConfirmTerm(null); },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف گزینه'),
  });

  const handleOpenAddTerm = (attr: Attribute) => {
    setSelectedTermImage('');
    setTermDialog({ isOpen: true, mode: 'CREATE', attribute: attr });
  };

  const handleOpenEditTerm = (attr: Attribute, term: AttributeValue) => {
    setSelectedTermImage(term.image || '');
    setTermDialog({ isOpen: true, mode: 'EDIT', attribute: attr, term });
  };

  return (
    <FeaturePageGuard feature="attributes" featureTitle="ویژگی‌ها و مشخصات">
      <div className="space-y-8 pb-16 font-sans" dir="rtl">
        <Header title="مدیریت ویژگی‌ها و مشخصات" />
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <AttributesToolbar search={search} onSearchChange={setSearch} typeFilter={typeFilter} onTypeFilterChange={setTypeFilter} onOpenCreateAttr={() => setAttrDialog({ isOpen: true, mode: 'CREATE' })} />
        <AttributesKpis {...stats} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {isLoading ? (
            <div className="col-span-2 py-20 text-center text-xs text-muted-foreground font-sans">در حال بارگذاری مشخصات و ویژگی‌ها...</div>
          ) : filteredAttributes.length === 0 ? (
            <Card className="col-span-2 py-16 text-center border-dashed font-sans">
              <CardContent className="space-y-3 max-w-sm mx-auto">
                <Sliders className="w-10 h-10 text-muted-foreground opacity-40 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">ویژگی‌ای یافت نشد</h3>
                  <p className="text-xs text-muted-foreground">{search || typeFilter !== 'ALL' ? 'موردی مطابق با فیلتر شما یافت نشد.' : 'اولین ویژگی کاتالوگ فروشگاه را ایجاد کنید.'}</p>
                </div>
                {search && <Button variant="outline" size="sm" onClick={() => setSearch('')} className="text-xs font-sans">پاک کردن فیلتر</Button>}
              </CardContent>
            </Card>
          ) : (
            filteredAttributes.map((attr) => (
              <AttributeCard
                key={attr.id}
                attribute={attr}
                onEditAttribute={(a) => setAttrDialog({ isOpen: true, mode: 'EDIT', attribute: a })}
                onDeleteAttribute={(a) => setDeleteConfirmAttr(a)}
                onAddTerm={handleOpenAddTerm}
                onEditTerm={handleOpenEditTerm}
                onDeleteTerm={(a, t) => setDeleteConfirmTerm({ termId: t.id, termName: t.name, attributeName: a.name })}
              />
            ))
          )}
        </div>
      </div>

      <AttributeFormModal
        isOpen={attrDialog.isOpen}
        mode={attrDialog.mode}
        attribute={attrDialog.attribute}
        isPending={createAttrMutation.isPending || updateAttrMutation.isPending}
        onClose={() => setAttrDialog((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={(payload) => attrDialog.mode === 'CREATE' ? createAttrMutation.mutate(payload) : attrDialog.attribute && updateAttrMutation.mutate({ id: attrDialog.attribute.id, data: payload })}
      />

      <AttributeTermModal
        isOpen={termDialog.isOpen}
        mode={termDialog.mode}
        attribute={termDialog.attribute}
        term={termDialog.term}
        isPending={addValueMutation.isPending || updateValueMutation.isPending}
        selectedImageUrl={selectedTermImage}
        onClearImage={() => setSelectedTermImage('')}
        onOpenMediaPicker={() => setIsMediaPickerOpen(true)}
        onClose={() => setTermDialog((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={(payload) => {
          if (!termDialog.attribute) return;
          termDialog.mode === 'CREATE' ? addValueMutation.mutate({ attributeId: termDialog.attribute.id, data: payload }) : termDialog.term && updateValueMutation.mutate({ valueId: termDialog.term.id, data: payload });
        }}
      />

      <AttributeDeleteModal
        isOpen={Boolean(deleteConfirmAttr)}
        attribute={deleteConfirmAttr}
        isPending={deleteAttrMutation.isPending}
        onClose={() => setDeleteConfirmAttr(null)}
        onConfirm={(a) => deleteAttrMutation.mutate(a.id)}
      />

      <AttributeTermDeleteModal
        isOpen={Boolean(deleteConfirmTerm)}
        target={deleteConfirmTerm}
        isPending={deleteValueMutation.isPending}
        onClose={() => setDeleteConfirmTerm(null)}
        onConfirm={(id) => deleteValueMutation.mutate(id)}
      />

      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={(m: MediaItem) => { setSelectedTermImage(m.url); setIsMediaPickerOpen(false); }}
        title="انتخاب تصویر یا طرح نمونه"
        description="تصویر واضحی از طرح، الگو یا نمونه را برای این گزینه انتخاب کنید."
      />
    </div>
    </FeaturePageGuard>
  );
}
