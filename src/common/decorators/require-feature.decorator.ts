import { SetMetadata } from '@nestjs/common';

export const REQUIRE_FEATURE_KEY = 'require_feature';

export type FeatureKey =
  | 'blog'
  | 'wallet'
  | 'referral'
  | 'coupons'
  | 'shipping'
  | 'attributes'
  | 'flashDeals';

export const RequireFeature = (feature: FeatureKey) =>
  SetMetadata(REQUIRE_FEATURE_KEY, feature);
