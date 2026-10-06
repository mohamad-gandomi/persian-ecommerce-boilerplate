export type Role = 'ADMIN' | 'CUSTOMER';
export type ProductType = 'SIMPLE' | 'VARIABLE';
export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  nationalId?: string | null;
  birthDate?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  addresses?: Address[];
  _count?: {
    addresses?: number;
    blogPosts?: number;
  };
}

export interface Address {
  id: string;
  userId: string;
  title: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  displayOrder: number;
  _count?: {
    products?: number;
    children?: number;
  };
}

export interface AttributeValue {
  id: string;
  attributeId: string;
  name: string;
  value: string;
  colorHex?: string | null;
  image?: string | null;
  attribute?: Attribute;
}

export interface Attribute {
  id: string;
  name: string;
  slug: string;
  displayType?: 'COLOR' | 'IMAGE' | 'TEXT' | string;
  values?: AttributeValue[];
  _count?: {
    productAttributes?: number;
  };
}

export interface VariantAttributeValue {
  id: string;
  variantId: string;
  attributeValueId: string;
  attributeValue: AttributeValue;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: string | number;
  salePrice?: string | number | null;
  stockQuantity: number;
  image?: string | null;
  weight?: string | number | null;
  dimensions?: string | null;
  isActive: boolean;
  attributeValues?: VariantAttributeValue[];
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductAttribute {
  id: string;
  productId: string;
  attributeId: string;
  isVariation: boolean;
  attribute: Attribute;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  productType: ProductType;
  description: string;
  shortDescription?: string | null;
  basePrice: string | number;
  salePrice?: string | number | null;
  stockQuantity: number;
  manageStock: boolean;
  dimensions?: string | null;
  weight?: string | number | null;
  specifications?: Array<{ label: string; value: string }> | null;
  featured: boolean;
  status: ProductStatus;
  categoryId?: string | null;
  category?: Category | null;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
  rewardType?: 'INHERIT' | 'FIXED' | 'PERCENTAGE' | 'DISABLED';
  referrerRewardValue?: number | string | null;
  refereeRewardValue?: number | string | null;
  _count?: {
    variants?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  parent?: BlogCategory | null;
  children?: BlogCategory[];
  displayOrder?: number;
  _count?: {
    posts?: number;
    children?: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  status: PostStatus;
  authorId: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  categoryId?: string | null;
  category?: BlogCategory | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ----------------------------------------------------
// Orders, Shipping & Payment Types
// ----------------------------------------------------

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type TransactionStatus =
  | 'INITIATED'
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'REFUNDED';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number | string;
  minOrderAmount?: number | string | null;
  maxDiscountAmount?: number | string | null;
  startDate?: string | null;
  endDate?: string | null;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders?: number;
  };
}

export interface ValidatedCoupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  variantId?: string | null;
  productName: string;
  productSku?: string | null;
  variantName?: string | null;
  productImage?: string | null;
  unitPrice: number | string;
  quantity: number;
  totalPrice: number | string;
  selectedAttributes?: Record<string, string> | null;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    productType: ProductType;
  } | null;
  variant?: {
    id: string;
    sku: string;
  } | null;
}

export interface OrderTimeline {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
}

export interface OrderTransaction {
  id: string;
  orderId: string;
  gateway: string;
  transactionId?: string | null;
  status: TransactionStatus;
  amount: number | string;
  currency: string;
  cardPan?: string | null;
  trackingCode?: string | null;
  errorMessage?: string | null;
  gatewayResponse?: any;
  createdAt: string;
}

export interface OrderAddress {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  user?: User | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  transactionId?: string | null;
  paidAt?: string | null;
  subtotal: number | string;
  discountAmount: number | string;
  shippingAmount: number | string;
  taxAmount: number | string;
  totalAmount: number | string;
  walletAmountPaid?: number | string;
  cashAmountPaid?: number | string;
  currency: string;
  couponId?: string | null;
  coupon?: Coupon | null;
  couponCode?: string | null;
  referralId?: string | null;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress | null;
  shippingMethod?: string | null;
  shippingCarrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  customerNotes?: string | null;
  internalNotes?: string | null;
  items: OrderItem[];
  timeline: OrderTimeline[];
  transactions?: OrderTransaction[];
  _count?: {
    items?: number;
    transactions?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingCount: number;
  processingCount: number;
  shippedCount: number;
  deliveredCount: number;
  cancelledCount: number;
  recentOrders: Order[];
}

export interface ShippingMethodOption {
  id: string;
  name: string;
  type?: string;
  carrier: string;
  price: number;
  currency: string;
  estimatedDays: string;
  description: string;
  isDefault?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  supportsTracking: boolean;
}

export interface PaymentGatewayOption {
  id: string;
  name: string;
  type: 'IRANIAN_SHAPARAK' | 'INTERNATIONAL_CARD' | 'OFFLINE';
  description: string;
  currencies: string[];
  logo?: string;
  isActive: boolean;
}

// ----------------------------------------------------
// Wallet & Financial Types
// ----------------------------------------------------

export type WalletTransactionType =
  | 'DEPOSIT'
  | 'ORDER_PAYMENT'
  | 'ORDER_PARTIAL_PAYMENT'
  | 'REFUND'
  | 'REFERRAL_REWARD'
  | 'CASHBACK'
  | 'ADMIN_ADJUSTMENT';

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  type: WalletTransactionType;
  description?: string | null;
  referenceId?: string | null;
  createdAt: string;
  wallet?: {
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string | null;
    };
  };
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isActive: boolean;
  transactionsCount?: number;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    role: Role;
  };
  createdAt: string;
  updatedAt: string;
  expiryConfig?: {
    enabled: boolean;
    days: number;
    expiresAt?: string | null;
    daysRemaining?: number | null;
  };
}

// ----------------------------------------------------
// Referral & Rewards Types
// ----------------------------------------------------

export interface ReferralSettings {
  enabled: boolean;
  enableGlobalReward?: boolean;
  defaultRewardType: 'FIXED' | 'PERCENTAGE';
  defaultReferrerValue: number;
  defaultRefereeValue: number;
  minOrderAmount: number;
  releaseOnStatus: string;
  cookieDays: number;
  walletExpiryEnabled?: boolean;
  walletExpiryDays?: number;
}

export interface ReferralCodeInfo {
  code: string;
  clickCount: number;
  successfulReferrals: number;
  totalEarned: number;
  isActive: boolean;
  referralLink: string;
  invitedUsers?: Array<{
    id: string;
    refereeName: string;
    status: string;
    rewardEarned: number;
    joinedAt: string;
  }>;
}

export interface ReferralItem {
  id: string;
  referralCodeId: string;
  referrerId: string;
  refereeId: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  rewardAmountReferrer?: number;
  rewardAmountReferee?: number;
  rewardedAt?: string | null;
  createdAt: string;
  referralCode?: {
    code: string;
  };
  referrer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
  };
  referee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
  };
  orders?: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number | string;
    status: string;
  }>;
}

export interface FeaturesConfig {
  blog: boolean;
  wallet: boolean;
  referral: boolean;
  coupons: boolean;
  attributes: boolean;
  flashDeals: boolean;
  notifications: boolean;
}

export interface FlashDealItem {
  id: string;
  dealId: string;
  productId: string;
  discountType: DiscountType;
  discountValue: number;
  specialPrice: number;
  cashbackAmount?: number | null;
  referrerReward?: number | null;
  stockLimit?: number | null;
  soldCount: number;
  product?: Product;
}

export interface FlashDeal {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  badgeText?: string | null;
  bannerImage?: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  defaultCashback?: number | null;
  defaultReferrerReward?: number | null;
  isCurrentlyActive?: boolean;
  isUpcoming?: boolean;
  isExpired?: boolean;
  remainingSeconds?: number;
  itemsCount?: number;
  items?: FlashDealItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ActiveFlashDealItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  categoryName: string;
  imageUrl?: string | null;
  originalPrice: number;
  specialPrice: number;
  discountPercentage: number;
  cashbackAmount: number;
  referrerReward?: number | null;
  stockLimit?: number | null;
  soldCount: number;
  isAvailable: boolean;
}

export interface ActiveFlashDeal {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  badgeText: string;
  bannerImage?: string | null;
  startDate: string;
  endDate: string;
  remainingSeconds: number;
  items: ActiveFlashDealItem[];
}



