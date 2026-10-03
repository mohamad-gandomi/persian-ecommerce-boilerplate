'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { SpecificationRepeater, SpecificationItem } from './specification-repeater';
import { SpecificationPreview } from './specification-preview';

export type { SpecificationItem } from './specification-repeater';

interface ProductSpecificationsTabProps {
  specifications: SpecificationItem[];
  onChange: (specifications: SpecificationItem[]) => void;
  productName?: string;
  defaultDimensions?: string;
  defaultWeight?: string;
  onNavigateToOverview?: () => void;
}

export function ProductSpecificationsTab({
  specifications = [],
  onChange,
  defaultDimensions = '',
  defaultWeight = '',
}: ProductSpecificationsTabProps) {
  const handleAddRow = () => {
    onChange([...specifications, { label: '', value: '' }]);
  };

  const handleUpdateRow = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleDeleteRow = (index: number) => {
    onChange(specifications.filter((_, i) => i !== index));
    toast.info('ردیف مشخصات حذف شد');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...specifications];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === specifications.length - 1) return;
    const updated = [...specifications];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleSyncFromDefaultFields = () => {
    let updated = [...specifications];
    let synced = 0;
    if (defaultDimensions) {
      const idx = updated.findIndex((i) => /ابعاد|dimension/i.test(i.label));
      if (idx >= 0) updated[idx] = { ...updated[idx], value: defaultDimensions };
      else updated.unshift({ label: 'ابعاد دست‌ساز', value: defaultDimensions });
      synced++;
    }
    if (defaultWeight) {
      const formatted = `${defaultWeight} کیلوگرم`;
      const idx = updated.findIndex((i) => /وزن|weight/i.test(i.label));
      if (idx >= 0) updated[idx] = { ...updated[idx], value: formatted };
      else updated.push({ label: 'وزن خالص', value: formatted });
      synced++;
    }
    if (synced > 0) {
      onChange(updated);
      toast.success('ابعاد و وزن از زبانه مشخصات پایه بارگذاری شدند');
    } else {
      toast.info('هنوز ابعاد یا وزنی در زبانه مشخصات پایه وارد نشده است');
    }
  };

  const handleQuickInsert = (tag: string) => {
    let val = '';
    if (/ابعاد/i.test(tag) && defaultDimensions) val = defaultDimensions;
    else if (/وزن/i.test(tag) && defaultWeight) val = `${defaultWeight} کیلوگرم`;
    onChange([...specifications, { label: tag, value: val }]);
  };

  return (
    <div className="space-y-6 font-sans" dir="rtl">
      <SpecificationRepeater
        specifications={specifications}
        onAddRow={handleAddRow}
        onUpdateRow={handleUpdateRow}
        onDeleteRow={handleDeleteRow}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onSyncDefaultFields={handleSyncFromDefaultFields}
        onQuickInsert={handleQuickInsert}
        onClearAll={() => { onChange([]); toast.info('تمام مشخصات پاک شدند'); }}
        defaultDimensions={defaultDimensions}
        defaultWeight={defaultWeight}
      />

      <SpecificationPreview
        specifications={specifications}
        defaultDimensions={defaultDimensions}
        defaultWeight={defaultWeight}
      />
    </div>
  );
}
