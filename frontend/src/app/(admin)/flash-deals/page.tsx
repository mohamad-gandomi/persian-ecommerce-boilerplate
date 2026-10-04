'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { FeaturePageGuard } from '@/components/admin/feature-guard';
import { FlashDeal } from '@/types';
import { FlashDealsToolbar } from '@/components/admin/flash-deals/flash-deals-toolbar';
import { FlashDealsTable } from '@/components/admin/flash-deals/flash-deals-table';
import { FlashDealsMobileList } from '@/components/admin/flash-deals/flash-deals-mobile-list';
import { FlashDealFormModal } from '@/components/admin/flash-deals/flash-deal-form-modal';
import { FlashDealDeleteModal } from '@/components/admin/flash-deals/flash-deal-delete-modal';
import { FlashDealsKpis } from '@/components/admin/flash-deals/flash-deals-kpis';

export default function FlashDealsPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = React.useState<
    'all' | 'active' | 'upcoming' | 'expired'
  >('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [editingDeal, setEditingDeal] = React.useState<FlashDeal | null>(null);
  const [deletingDeal, setDeletingDeal] = React.useState<FlashDeal | null>(null);
  const [isLoadingDealDetails, setIsLoadingDealDetails] = React.useState(false);

  // Fetch all deals with current status filter
  const { data: deals = [], isLoading } = useQuery<FlashDeal[]>({
    queryKey: ['flash-deals', selectedStatus],
    queryFn: () => api.getFlashDeals(selectedStatus),
  });

  // Calculate statistics for KPI cards
  const stats = React.useMemo(() => {
    const now = new Date();
    let active = 0;
    let upcoming = 0;
    let expired = 0;

    deals.forEach((d) => {
      const start = new Date(d.startDate);
      const end = new Date(d.endDate);
      if (d.isActive && now >= start && now <= end) {
        active++;
      } else if (now < start) {
        upcoming++;
      } else if (now > end) {
        expired++;
      }
    });

    return {
      total: deals.length,
      active,
      upcoming,
      expired,
    };
  }, [deals]);

  // Filter deals by search term
  const filteredDeals = React.useMemo(() => {
    if (!searchTerm.trim()) return deals;
    const term = searchTerm.toLowerCase().trim();
    return deals.filter(
      (d) =>
        d.title.toLowerCase().includes(term) ||
        d.description?.toLowerCase().includes(term) ||
        d.badgeText?.toLowerCase().includes(term),
    );
  }, [deals, searchTerm]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['flash-deals'] });
    queryClient.invalidateQueries({ queryKey: ['active-flash-deal'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createFlashDeal(data),
    onSuccess: (newDeal) => {
      toast.success(`جشنواره «${newDeal.title}» با موفقیت تعریف شد`);
      invalidate();
      setIsFormModalOpen(false);
      setEditingDeal(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'خطا در تعریف جشنواره شگفت‌انگیز');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateFlashDeal(id, data),
    onSuccess: (updated) => {
      toast.success(`جشنواره «${updated.title}» با موفقیت به‌روزرسانی شد`);
      invalidate();
      setIsFormModalOpen(false);
      setEditingDeal(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'خطا در ویرایش جشنواره شگفت‌انگیز');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteFlashDeal(id),
    onSuccess: () => {
      toast.success('جشنواره شگفت‌انگیز با موفقیت حذف شد');
      invalidate();
      setDeletingDeal(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'خطا در حذف جشنواره شگفت‌انگیز');
    },
  });

  const handleToggleActive = (deal: FlashDeal) => {
    updateMutation.mutate({
      id: deal.id,
      data: { isActive: !deal.isActive },
    });
  };

  const handleEdit = async (deal: FlashDeal) => {
    try {
      setIsLoadingDealDetails(true);
      // Fetch full fresh deal with items and relations
      const fullDeal = await api.getFlashDeal(deal.id);
      setEditingDeal(fullDeal);
      setIsFormModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch full deal items, falling back to cached deal', err);
      setEditingDeal(deal);
      setIsFormModalOpen(true);
    } finally {
      setIsLoadingDealDetails(false);
    }
  };

  return (
    <FeaturePageGuard feature="flashDeals">
      <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
        <Header title="مدیریت فروش‌های شگفت‌انگیز" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* KPI Stat Cards (Matching Products Page) */}
          <FlashDealsKpis
            total={stats.total}
            active={stats.active}
            upcoming={stats.upcoming}
            expired={stats.expired}
          />

          {isLoadingDealDetails && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border/80 px-3 py-1.5 rounded-lg shadow-2xs w-fit">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>در حال دریافت اطلاعات اقلام کمپین...</span>
            </div>
          )}

          {/* Standardized Search & Filter Toolbar */}
          <FlashDealsToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedStatus={selectedStatus}
            onSelectedStatusChange={setSelectedStatus}
            totalCount={filteredDeals.length}
            onAddDeal={() => {
              setEditingDeal(null);
              setIsFormModalOpen(true);
            }}
          />

          {/* Table & Mobile List */}
          <FlashDealsTable
            deals={filteredDeals}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={(d) => setDeletingDeal(d)}
            onToggleActive={handleToggleActive}
          />

          <FlashDealsMobileList
            deals={filteredDeals}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={(d) => setDeletingDeal(d)}
            onToggleActive={handleToggleActive}
          />
        </main>

        {/* Create/Edit Modal */}
        <FlashDealFormModal
          deal={editingDeal}
          isOpen={isFormModalOpen}
          onOpenChange={(open) => {
            setIsFormModalOpen(open);
            if (!open) setEditingDeal(null);
          }}
          onSubmit={(payload) => {
            if (editingDeal) {
              updateMutation.mutate({ id: editingDeal.id, data: payload });
            } else {
              createMutation.mutate(payload);
            }
          }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />

        {/* Delete Confirmation Modal */}
        <FlashDealDeleteModal
          deal={deletingDeal}
          isOpen={!!deletingDeal}
          onOpenChange={(open) => !open && setDeletingDeal(null)}
          onConfirm={(id) => deleteMutation.mutate(id)}
          isPending={deleteMutation.isPending}
        />
      </div>
    </FeaturePageGuard>
  );
}
