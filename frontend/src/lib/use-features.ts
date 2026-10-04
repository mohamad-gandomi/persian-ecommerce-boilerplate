'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import { FeaturesConfig } from '@/types';

export const DEFAULT_FEATURES: FeaturesConfig = {
  blog: true,
  wallet: true,
  referral: true,
  coupons: true,
  attributes: true,
};

export function useFeatures() {
  const { data, isLoading } = useQuery<FeaturesConfig>({
    queryKey: ['system-features'],
    queryFn: () => api.getFeatures(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  const features: FeaturesConfig = data || DEFAULT_FEATURES;

  const isEnabled = (key: keyof FeaturesConfig): boolean => {
    return features[key] ?? true;
  };

  return {
    features,
    isLoading,
    isEnabled,
  };
}
