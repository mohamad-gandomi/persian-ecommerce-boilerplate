export interface SeoCheckItem {
  id: string;
  category: 'google' | 'structure' | 'geo';
  categoryLabel: string;
  title: string;
  passed: boolean;
  scoreWeight: number;
  currentValue: string;
  targetRequirement: string;
  recommendation: string;
  importance: 'critical' | 'recommended' | 'bonus';
}

export interface ComputeSeoRulesParams {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
}
