import {
  ApiResponse,
  Product,
  Category,
  Attribute,
  BlogPost,
  BlogCategory,
  User,
  Address,
  MediaItem,
  Order,
  OrderStats,
  Coupon,
  ValidatedCoupon,
  OrderTransaction,
  ShippingMethodOption,
  PaymentGatewayOption,
  Wallet,
  WalletTransaction,
  ReferralSettings,
  ReferralCodeInfo,
  ReferralItem,
  FeaturesConfig,
  FlashDeal,
  FlashDealItem,
  ActiveFlashDeal,
} from '@/types';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface UploadMediaOptions {
  altText?: string;
  convertToWebp?: boolean;
  quality?: number;
  maxWidth?: number;
}

export interface MediaSettings {
  convertToWebp: boolean;
  qualityPreset: number;
  maxWidthOption: number;
  showOptimizationOptions?: boolean;
}

export interface NotificationItem {
  id: string;
  userId?: string | null;
  role?: 'ADMIN' | 'CUSTOMER' | null;
  title: string;
  message: string;
  type: 'ORDER' | 'WALLET' | 'INVENTORY' | 'BLOG' | 'SYSTEM' | 'REFERRAL' | 'AUTH';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  link?: string | null;
  isRead: boolean;
  readAt?: string | null;
  metadata?: any;
  createdAt: string;
}

export interface EventPlaceholder {
  key: string;
  label: string;
  example: string;
}

export interface NotificationEventConfig {
  key: string;
  title: string;
  description: string;
  category: 'orders' | 'wallet' | 'inventory' | 'blog' | 'auth';
  sendMode?: 'pattern' | 'text';
  userInApp: boolean;
  adminInApp: boolean;
  userSms: boolean;
  adminSms: boolean;

  // User message & templates
  userKavenegarTemplate?: string;
  userMelipayamakPatternCode?: string;
  userCustomText?: string;

  // Admin message & templates
  adminKavenegarTemplate?: string;
  adminMelipayamakPatternCode?: string;
  adminCustomText?: string;

  // Backward-compatible fallbacks
  kavenegarTemplate?: string;
  melipayamakPatternCode?: string;
  customText?: string;
  availablePlaceholders: string[];
}

export const EVENT_PLACEHOLDERS: Record<string, EventPlaceholder[]> = {
  auth_otp: [
    { key: 'code', label: 'کد تایید یکبار مصرف', example: '۴۹۲۱' },
  ],
  order_created: [
    { key: 'orderNumber', label: 'شماره سفارش', example: 'SW-1025' },
    { key: 'customerName', label: 'نام و نام خانوادگی خریدار', example: 'محمد رضایی' },
    { key: 'customerPhone', label: 'شماره موبایل خریدار', example: '09121112233' },
    { key: 'totalAmount', label: 'مبلغ کل سفارش (تومان)', example: '۲,۴۵۰,۰۰۰' },
    { key: 'itemsCount', label: 'تعداد اقلام سفارش', example: '۳ قلم' },
    { key: 'shippingMethod', label: 'روش ارسال انتخابی', example: 'پست پیشتاز' },
    { key: 'paymentMethod', label: 'روش پرداخت', example: 'درگاه آنلاین' },
    { key: 'orderLink', label: 'لینک مشاهده سفارش', example: '/profile/orders/SW-1025' },
  ],
  order_processing: [
    { key: 'orderNumber', label: 'شماره سفارش', example: 'SW-1025' },
    { key: 'customerName', label: 'نام خریدار', example: 'محمد رضایی' },
    { key: 'itemsCount', label: 'تعداد اقلام سفارش', example: '۲ قلم' },
    { key: 'estimatedDays', label: 'تخمین زمان آماده‌سازی', example: '۲ روز کاری' },
  ],
  order_shipped: [
    { key: 'orderNumber', label: 'شماره سفارش', example: 'SW-1025' },
    { key: 'customerName', label: 'نام خریدار', example: 'محمد رضایی' },
    { key: 'carrier', label: 'شرکت پستی / باربری', example: 'تیپاکس' },
    { key: 'trackingNumber', label: 'کد رهگیری مرسوله', example: '24891002341' },
    { key: 'trackingUrl', label: 'لینک سامانه رهگیری مرسوله', example: 'https://tracking.post.ir' },
  ],
  order_delivered: [
    { key: 'orderNumber', label: 'شماره سفارش', example: 'SW-1025' },
    { key: 'customerName', label: 'نام خریدار', example: 'محمد رضایی' },
    { key: 'deliveryDate', label: 'تاریخ تحویل سفارش', example: '۱۴۰۵/۰۷/۱۵' },
    { key: 'surveyLink', label: 'لینک نظرسنجی و رضایت خریدار', example: '/orders/SW-1025/review' },
  ],
  order_cancelled: [
    { key: 'orderNumber', label: 'شماره سفارش', example: 'SW-1025' },
    { key: 'customerName', label: 'نام خریدار', example: 'محمد رضایی' },
    { key: 'reason', label: 'علت لغو سفارش', example: 'درخواست مشتری' },
    { key: 'refundAmount', label: 'مبلغ استرداد شده به کیف پول', example: '۲,۴۵۰,۰۰۰ تومان' },
  ],
  wallet_credited: [
    { key: 'amount', label: 'مبلغ واریزی (تومان)', example: '۱۰۰,۰۰۰' },
    { key: 'balance', label: 'مانده موجودی جدید (تومان)', example: '۵۵۰,۰۰۰' },
    { key: 'reason', label: 'شرح / بابت واریز', example: 'پاداش دعوت دوستان' },
    { key: 'transactionId', label: 'شناسه پیگیری تراکنش', example: 'TRX-84910' },
    { key: 'date', label: 'تاریخ تراکنش', example: '۱۴۰۵/۰۷/۱۵' },
  ],
  wallet_debited: [
    { key: 'amount', label: 'مبلغ کسر شده (تومان)', example: '۲۵۰,۰۰۰' },
    { key: 'balance', label: 'مانده موجودی جدید (تومان)', example: '۳۰۰,۰۰۰' },
    { key: 'orderNumber', label: 'شماره سفارش مرتبط', example: 'SW-1025' },
    { key: 'transactionId', label: 'شناسه پیگیری تراکنش', example: 'TRX-84911' },
    { key: 'date', label: 'تاریخ تراکنش', example: '۱۴۰۵/۰۷/۱۵' },
  ],
  wallet_expired: [
    { key: 'amount', label: 'مبلغ منقضی‌شده (تومان)', example: '۱۵۰,۰۰۰' },
    { key: 'days', label: 'تعداد روزهای عدم فعالیت', example: '۹۰' },
    { key: 'lastDepositDate', label: 'تاریخ آخرین واریزی', example: '۱۴۰۵/۰۴/۱۵' },
    { key: 'customerName', label: 'نام خریدار / کاربر', example: 'محمد رضایی' },
  ],
  inventory_low_stock: [
    { key: 'productName', label: 'نام محصول', example: 'صندلی ناهارخوری چوبی راش' },
    { key: 'sku', label: 'کد انبارداری (SKU)', example: 'CHAIR-BEECH-01' },
    { key: 'stockQuantity', label: 'موجودی باقی‌مانده در انبار', example: '۳' },
    { key: 'price', label: 'قیمت محصول (تومان)', example: '۱,۸۵۰,۰۰۰' },
    { key: 'productUrl', label: 'لینک محصول در سایت', example: '/products/chair-beech-01' },
  ],
  inventory_out_of_stock: [
    { key: 'productName', label: 'نام محصول ناموجود', example: 'میز کار مدرن بلوطی' },
    { key: 'sku', label: 'کد انبارداری (SKU)', example: 'DESK-OAK-02' },
    { key: 'lastPrice', label: 'آخرین قیمت کالا (تومان)', example: '۴,۲۰۰,۰۰۰' },
    { key: 'categoryName', label: 'دسته‌بندی محصول', example: 'میز و مبلمان اداری' },
    { key: 'updatedAt', label: 'زمان اتمام موجودی', example: '۱۴۰۵/۰۷/۱۵' },
  ],
  blog_post_published: [
    { key: 'postTitle', label: 'عنوان مقاله مجله', example: 'راهنمای چیدمان دکوراسیون مینیمال' },
    { key: 'categoryName', label: 'نام دسته مقاله', example: 'دکوراسیون داخلی' },
    { key: 'slug', label: 'نامک / لینک مقاله', example: 'minimalist-interior-guide' },
    { key: 'authorName', label: 'نویسنده مقاله', example: 'تحریریه فروشگاه' },
    { key: 'readingTime', label: 'مدت زمان مطالعه', example: '۵ دقیقه' },
  ],
  blog_comment_submitted: [
    { key: 'postTitle', label: 'عنوان مقاله', example: 'راهنمای چیدمان دکوراسیون مینیمال' },
    { key: 'commenterName', label: 'نام نظردهنده', example: 'سارا احمدی' },
    { key: 'commentText', label: 'متن دیدگاه / نظر', example: 'مقاله بسیار کاربردی و زیبایی بود' },
    { key: 'postUrl', label: 'لینک مقاله', example: '/blog/minimalist-interior-guide' },
  ],
};

export interface NotificationSettings {
  sms: {
    enabled: boolean;
    activeProvider: 'kavenegar' | 'melipayamak' | 'mock';
    adminAlertPhones: string[];
    providers: {
      kavenegar: {
        apiKey: string;
        sender: string;
      };
      melipayamak: {
        username: string;
        password: string;
        sender: string;
      };
    };
  };
  events: Record<string, NotificationEventConfig>;
}


function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  // Handle 401 Unauthorized: clear invalid auth
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
      window.dispatchEvent(new Event('auth_changed'));
    }
  }

  if (!response.ok) {
    let errorMsg = `API Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.message) {
        errorMsg = Array.isArray(errJson.message) ? errJson.message.join(', ') : errJson.message;
      }
    } catch {
      // no-op
    }
    throw new Error(errorMsg);
  }

  const json: ApiResponse<T> = await response.json();
  return json.data;
}

export const api = {
  // Products
  getProducts: (params?: {
    categorySlug?: string;
    categoryId?: string;
    search?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.categorySlug) query.append('categorySlug', params.categorySlug);
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.minPrice !== undefined && params.minPrice !== null) query.append('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined && params.maxPrice !== null) query.append('maxPrice', String(params.maxPrice));
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    const qs = query.toString();
    return fetcher<Product[]>(qs ? `/products?${qs}` : '/products');
  },

  getProduct: (idOrSlug: string) => fetcher<Product>(`/products/${idOrSlug}`),
  getProductBySlug: (slug: string) => fetcher<Product>(`/products/${slug}`),

  createProduct: (data: any) =>
    fetcher<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: any) =>
    fetcher<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    fetcher<Product>(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Variations
  addVariant: (productId: string, data: any) =>
    fetcher<any>(`/products/${productId}/variants`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateVariant: (variantId: string, data: any) =>
    fetcher<any>(`/products/variants/${variantId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteVariant: (variantId: string) =>
    fetcher<any>(`/products/variants/${variantId}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategoriesTree: () => fetcher<Category[]>('/categories/tree'),
  getCategoriesFlat: () => fetcher<Category[]>('/categories'),
  createCategory: (data: any) =>
    fetcher<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: any) =>
    fetcher<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: string) =>
    fetcher<Category>(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // Attributes & Swatches
  getAttributes: () => fetcher<Attribute[]>('/attributes'),
  createAttribute: (data: { name: string; slug?: string; displayType?: string }) =>
    fetcher<Attribute>('/attributes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAttribute: (id: string, data: { name?: string; slug?: string; displayType?: string }) =>
    fetcher<Attribute>(`/attributes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteAttribute: (id: string) =>
    fetcher<any>(`/attributes/${id}`, {
      method: 'DELETE',
    }),
  addAttributeValue: (
    attributeId: string,
    data: { name: string; value?: string; colorHex?: string; image?: string },
  ) =>
    fetcher<any>(`/attributes/${attributeId}/values`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAttributeValue: (
    valueId: string,
    data: { name?: string; value?: string; colorHex?: string; image?: string },
  ) =>
    fetcher<any>(`/attributes/values/${valueId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteAttributeValue: (valueId: string) =>
    fetcher<any>(`/attributes/values/${valueId}`, {
      method: 'DELETE',
    }),

  // Blog
  getBlogPosts: (params?: { search?: string; status?: string; categoryId?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    const qs = query.toString();
    return fetcher<BlogPost[]>(qs ? `/blog/admin/posts?${qs}` : '/blog/admin/posts');
  },
  getPublicBlogPosts: (params?: { search?: string; categorySlug?: string; limit?: number; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.categorySlug) query.append('categorySlug', params.categorySlug);
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.page) query.append('page', String(params.page));
    const qs = query.toString();
    return fetcher<BlogPost[]>(qs ? `/blog/posts?${qs}` : '/blog/posts');
  },
  getBlogPost: (idOrSlug: string) => fetcher<BlogPost>(`/blog/posts/${idOrSlug}`),
  getBlogCategoriesTree: () => fetcher<BlogCategory[]>('/blog/categories/tree'),
  getBlogCategories: () => fetcher<BlogCategory[]>('/blog/categories'),
  createBlogCategory: (data: {
    name: string;
    slug?: string;
    description?: string;
    image?: string | null;
    parentId?: string | null;
    displayOrder?: number;
  }) =>
    fetcher<BlogCategory>('/blog/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateBlogCategory: (
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string | null;
      parentId?: string | null;
      displayOrder?: number;
    },
  ) =>
    fetcher<BlogCategory>(`/blog/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteBlogCategory: (id: string) =>
    fetcher<any>(`/blog/categories/${id}`, {
      method: 'DELETE',
    }),
  createBlogPost: (data: any) =>
    fetcher<BlogPost>('/blog/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateBlogPost: (id: string, data: any) =>
    fetcher<BlogPost>(`/blog/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteBlogPost: (id: string) =>
    fetcher<any>(`/blog/posts/${id}`, {
      method: 'DELETE',
    }),

  // Users
  getUsers: () => fetcher<User[]>('/users'),
  getUser: (id: string) => fetcher<User>(`/users/${id}`),
  createUser: (data: any) =>
    fetcher<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateUser: (id: string, data: any) =>
    fetcher<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteUser: (id: string) =>
    fetcher<any>(`/users/${id}`, {
      method: 'DELETE',
    }),
  addUserAddress: (userId: string, data: any) =>
    fetcher<Address>(`/users/${userId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateUserAddress: (userId: string, addressId: string, data: any) =>
    fetcher<Address>(`/users/${userId}/addresses/${addressId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteUserAddress: (userId: string, addressId: string) =>
    fetcher<any>(`/users/${userId}/addresses/${addressId}`, {
      method: 'DELETE',
    }),

  // Customer Self-Service Addresses
  getMyAddresses: () => fetcher<Address[]>('/users/addresses'),
  addMyAddress: (data: Partial<Address>) =>
    fetcher<Address>('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMyAddress: (addressId: string, data: Partial<Address>) =>
    fetcher<Address>(`/users/addresses/${addressId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteMyAddress: (addressId: string) =>
    fetcher<any>(`/users/addresses/${addressId}`, {
      method: 'DELETE',
    }),

  // Media & Assets
  getMedia: (search?: string) =>
    fetcher<MediaItem[]>(search ? `/upload?search=${encodeURIComponent(search)}` : '/upload'),

  getStorageStats: () =>
    fetcher<{ totalAssets: number; catalogSize: number; diskSize: number; localFilesCount: number }>('/upload/stats'),

  uploadMedia: async (
    file: File,
    options?: string | UploadMediaOptions,
    isRetry = false
  ): Promise<MediaItem> => {
    const opts: UploadMediaOptions =
      typeof options === 'string' ? { altText: options } : options || {};

    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    if (opts.altText) {
      formData.append('altText', opts.altText);
    }
    if (opts.convertToWebp !== undefined) {
      formData.append('convertToWebp', String(opts.convertToWebp));
    }
    if (opts.quality !== undefined) {
      formData.append('quality', String(opts.quality));
    }
    if (opts.maxWidth !== undefined) {
      formData.append('maxWidth', String(opts.maxWidth));
    }

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
        window.dispatchEvent(new Event('auth_changed'));
      }
    }

    if (!response.ok) {
      let errMessage = 'Failed to upload media';
      try {
        const errJson = await response.json();
        if (errJson?.message) {
          errMessage = Array.isArray(errJson.message) ? errJson.message.join(', ') : errJson.message;
        }
      } catch {
        // no-op
      }
      throw new Error(errMessage);
    }

    const result = await response.json();
    return result.data || result;
  },

  updateMedia: (id: string, data: { altText?: string; caption?: string }) =>
    fetcher<MediaItem>(`/upload/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteMedia: (id: string) =>
    fetcher<{ success: boolean; id: string }>(`/upload/${id}`, {
      method: 'DELETE',
    }),

  // Authentication Helpers
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid email or password');
    }
    const data = await res.json();
    if (data?.data?.accessToken) {
      localStorage.setItem('auth_token', data.data.accessToken);
      if (data?.data?.user) {
        localStorage.setItem('auth_user', JSON.stringify(data.data.user));
        if (typeof document !== 'undefined') {
          const role = data.data.user.role || 'CUSTOMER';
          document.cookie = `auth_role=${role}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `auth_token=${data.data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        }
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth_changed'));
      }
    }
    return data.data;
  },

  register: async (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'خطا در ثبت‌نام حساب کاربری');
    }
    const resData = await res.json();
    if (resData?.data?.accessToken) {
      localStorage.setItem('auth_token', resData.data.accessToken);
      if (resData?.data?.user) {
        localStorage.setItem('auth_user', JSON.stringify(resData.data.user));
        if (typeof document !== 'undefined') {
          const role = resData.data.user.role || 'CUSTOMER';
          document.cookie = `auth_role=${role}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `auth_token=${resData.data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        }
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth_changed'));
      }
    }
    return resData.data;
  },

  forgotPassword: async (email: string) => {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'خطا در ارسال درخواست بازنشانی رمز عبور');
    }
    const resData = await res.json();
    return resData.data || resData;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'خطا در بازنشانی رمز عبور');
    }
    const resData = await res.json();
    return resData.data || resData;
  },

  sendOtp: async (phone: string) => {
    const res = await fetch(`${API_BASE}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to send verification code');
    }
    const data = await res.json();
    return data.data as {
      success: boolean;
      message: string;
      phone: string;
      expiresIn: number;
      devCode?: string;
    };
  },

  verifyOtp: async (phone: string, code: string) => {
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid verification code');
    }
    const data = await res.json();
    if (data?.data?.accessToken) {
      localStorage.setItem('auth_token', data.data.accessToken);
      if (data?.data?.user) {
        localStorage.setItem('auth_user', JSON.stringify(data.data.user));
        if (typeof document !== 'undefined') {
          const role = data.data.user.role || 'CUSTOMER';
          document.cookie = `auth_role=${role}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `auth_token=${data.data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        }
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth_changed'));
      }
    }
    return data.data as {
      user: User;
      accessToken: string;
      isNewUser: boolean;
    };
  },

  getProfile: () => fetcher<User>('/auth/me'),

  updateProfile: async (data: { firstName?: string; lastName?: string; email?: string }) => {
    const updated = await fetcher<User>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (updated && typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(updated));
      if (typeof document !== 'undefined' && updated.role) {
        document.cookie = `auth_role=${updated.role}; path=/; max-age=604800; SameSite=Lax`;
      }
      window.dispatchEvent(new Event('auth_changed'));
    }
    return updated;
  },

  sendPhoneChangeOtp: (newPhone: string) =>
    fetcher<{
      success: boolean;
      message: string;
      phone: string;
      expiresIn: number;
      devCode?: string;
    }>('/auth/phone/send-otp', {
      method: 'POST',
      body: JSON.stringify({ newPhone }),
    }),

  verifyPhoneChange: async (newPhone: string, code: string) => {
    const res = await fetcher<{
      success: boolean;
      message: string;
      user: User;
    }>('/auth/phone/verify-change', {
      method: 'POST',
      body: JSON.stringify({ newPhone, code }),
    });
    if (res?.user && typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(res.user));
      if (typeof document !== 'undefined' && res.user.role) {
        document.cookie = `auth_role=${res.user.role}; path=/; max-age=604800; SameSite=Lax`;
      }
      window.dispatchEvent(new Event('auth_changed'));
    }
    return res;
  },

  getMyOrders: () => fetcher<Order[]>('/orders/my-orders'),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
      window.dispatchEvent(new Event('auth_changed'));
      window.location.href = '/login';
    }
  },

  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('auth_user');
    if (!raw) return null;
    try {
      const user = JSON.parse(raw) as User;
      if (typeof document !== 'undefined' && user?.role) {
        if (!document.cookie.includes('auth_role=')) {
          document.cookie = `auth_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        }
      }
      return user;
    } catch {
      return null;
    }
  },

  // System Settings
  getSetting: <T = any>(key: string) => fetcher<T>(`/settings/${key}`),
  getAllSettings: () => fetcher<Record<string, any>>('/settings'),
  updateSetting: <T = any>(key: string, value: any) =>
    fetcher<T>(`/settings/${key}`, {
      method: 'PATCH',
      body: JSON.stringify(value),
    }),

  // Orders Management
  getOrders: (params?: { status?: string; paymentStatus?: string; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.paymentStatus && params.paymentStatus !== 'ALL') query.append('paymentStatus', params.paymentStatus);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    return fetcher<Order[]>(
      `/orders${query.toString() ? `?${query.toString()}` : ''}`
    );
  },

  getOrder: (id: string) => fetcher<Order>(`/orders/${id}`),

  getOrderStats: () => fetcher<OrderStats>('/orders/stats'),

  createOrder: (data: any) =>
    fetcher<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateOrderStatus: (id: string, status: string, note?: string) =>
    fetcher<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    }),

  updateOrder: (id: string, data: any) =>
    fetcher<Order>(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteOrder: (id: string) =>
    fetcher<Order>(`/orders/${id}`, {
      method: 'DELETE',
    }),

  // Coupons
  getCoupons: () => fetcher<Coupon[]>('/coupons'),

  getCoupon: (id: string) => fetcher<Coupon>(`/coupons/${id}`),

  createCoupon: (data: any) =>
    fetcher<Coupon>('/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCoupon: (id: string, data: any) =>
    fetcher<Coupon>(`/coupons/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteCoupon: (id: string) =>
    fetcher<Coupon>(`/coupons/${id}`, {
      method: 'DELETE',
    }),

  validateCoupon: (code: string, cartSubtotal: number) =>
    fetcher<{
      valid: boolean;
      coupon?: ValidatedCoupon;
      cartSubtotal: number;
      discountAmount: number;
      discountedTotal: number;
      message?: string;
    }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartSubtotal }),
    }),

  // Shipping Methods
  getShippingMethods: () => fetcher<ShippingMethodOption[]>('/shipping/methods'),
  getAdminShippingMethods: () => fetcher<ShippingMethodOption[]>('/shipping/admin'),
  createShippingMethod: (data: Partial<ShippingMethodOption>) =>
    fetcher<ShippingMethodOption>('/shipping', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateShippingMethod: (id: string, data: Partial<ShippingMethodOption>) =>
    fetcher<ShippingMethodOption>(`/shipping/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteShippingMethod: (id: string) =>
    fetcher<{ success: boolean }>(`/shipping/${id}`, {
      method: 'DELETE',
    }),

  // Payments & Multi-Gateway
  getPaymentGateways: () => fetcher<PaymentGatewayOption[]>('/payments/gateways'),

  initiatePayment: (data: { orderId: string; gateway: string; callbackUrl?: string }) =>
    fetcher<{
      success: boolean;
      gateway: string;
      transactionId: string;
      paymentUrl: string;
      isOffline?: boolean;
    }>('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getOrderTransactions: (orderId: string) =>
    fetcher<OrderTransaction[]>(`/payments/transactions/${orderId}`),

  // ----------------------------------------------------
  // Wallet API
  // ----------------------------------------------------
  getMyWallet: () =>
    fetcher<{ walletId: string; balance: number; currency: string; isActive: boolean }>('/wallet/me'),

  getMyWalletTransactions: (limit = 50, offset = 0) =>
    fetcher<{ transactions: WalletTransaction[]; total: number; walletBalance: number }>(
      `/wallet/me/transactions?limit=${limit}&offset=${offset}`,
    ),

  getAdminWallets: (search?: string, limit = 20, offset = 0) => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search) params.append('search', search);
    return fetcher<{
      wallets: Wallet[];
      total: number;
      stats: {
        totalSystemBalance: number;
        totalWalletsCount: number;
        activeWalletsCount?: number;
        totalTransactionsCount?: number;
      };
    }>(`/wallet/admin/list?${params.toString()}`);
  },

  getAdminWalletTransactions: (walletId?: string, limit = 30, offset = 0) => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (walletId) params.append('walletId', walletId);
    return fetcher<{ transactions: WalletTransaction[]; total: number }>(
      `/wallet/admin/transactions?${params.toString()}`,
    );
  },

  adminAdjustWalletBalance: (userId: string, data: { amount: number; description: string }) =>
    fetcher<{ success: boolean; balance: number; transaction: WalletTransaction }>(
      `/wallet/admin/${userId}/adjust`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    ),

  adminToggleWalletStatus: (userId: string, isActive: boolean) =>
    fetcher<Wallet>(`/wallet/admin/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),

  triggerWalletExpiryCheck: () =>
    fetcher<{
      success: boolean;
      expiredWalletsCount: number;
      totalExpiredAmount: number;
      details: Array<{ walletId: string; userId: string; expiredAmount: number }>;
    }>('/wallet/admin/expire-check', {
      method: 'POST',
    }),

  // ----------------------------------------------------
  // Referral & Rewards API
  // ----------------------------------------------------
  getMyReferralInfo: () =>
    fetcher<ReferralCodeInfo>('/referrals/me'),

  customizeReferralCode: (code: string) =>
    fetcher<{ success: boolean; code: string; referralLink: string }>('/referrals/me/customize', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  trackReferralClick: (code: string) =>
    fetcher<{ valid: boolean; code?: string }>(`/referrals/track/${code}`),

  validateReferralCode: (code: string) =>
    fetcher<{ valid: boolean; code: string; referrerName: string }>(`/referrals/validate/${code}`),

  bindReferralCode: (code: string) =>
    fetcher<{ id: string; referrerId: string; refereeId: string }>('/referrals/bind', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  getAdminReferrals: (search?: string, status?: string, limit = 20, offset = 0) => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search) params.append('search', search);
    if (status && status !== 'ALL') params.append('status', status);
    return fetcher<{
      referrals: ReferralItem[];
      total: number;
      stats: {
        totalCodes: number;
        totalClicks: number;
        totalSuccessfulReferrals: number;
        totalRewardsPaid: number;
      };
    }>(`/referrals/admin/list?${params.toString()}`);
  },

  getAdminReferralSettings: () =>
    fetcher<ReferralSettings>('/referrals/admin/settings'),

  updateAdminReferralSettings: (data: Partial<ReferralSettings>) =>
    fetcher<ReferralSettings>('/referrals/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Flash Deals & Special Offers
  getFlashDeals: (status?: 'all' | 'active' | 'upcoming' | 'expired') => {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return fetcher<FlashDeal[]>(`/flash-deals${query}`);
  },

  getFlashDeal: (id: string) => fetcher<FlashDeal>(`/flash-deals/${id}`),

  getActiveFlashDeal: () => fetcher<ActiveFlashDeal | null>('/flash-deals/active'),

  createFlashDeal: (data: any) =>
    fetcher<FlashDeal>('/flash-deals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateFlashDeal: (id: string, data: any) =>
    fetcher<FlashDeal>(`/flash-deals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteFlashDeal: (id: string) =>
    fetcher<any>(`/flash-deals/${id}`, {
      method: 'DELETE',
    }),

  addFlashDealItem: (dealId: string, data: any) =>
    fetcher<FlashDealItem>(`/flash-deals/${dealId}/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  removeFlashDealItem: (dealId: string, productId: string) =>
    fetcher<any>(`/flash-deals/${dealId}/items/${productId}`, {
      method: 'DELETE',
    }),

  getFeatures: () =>
    fetcher<FeaturesConfig>('/settings/features'),

  // Notifications
  getAdminNotifications: (params?: { page?: number; limit?: number; unreadOnly?: boolean; type?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.unreadOnly) searchParams.append('unreadOnly', 'true');
    if (params?.type && params.type !== 'ALL') searchParams.append('type', params.type);
    if (params?.search) searchParams.append('search', params.search);
    const qs = searchParams.toString();
    return fetcher<{ data: NotificationItem[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
      `/notifications/admin${qs ? `?${qs}` : ''}`,
    );
  },

  getAdminUnreadCount: () =>
    fetcher<number>('/notifications/admin/unread-count'),

  markNotificationAsRead: (id: string) =>
    fetcher<NotificationItem>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),

  markAllAdminNotificationsAsRead: () =>
    fetcher<any>('/notifications/admin/read-all', {
      method: 'PATCH',
    }),

  deleteNotification: (id: string) =>
    fetcher<any>(`/notifications/${id}`, {
      method: 'DELETE',
    }),

  getNotificationSettings: () =>
    fetcher<NotificationSettings>('/notifications/settings'),

  updateNotificationSettings: (data: Partial<NotificationSettings>) =>
    fetcher<NotificationSettings>('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  testSmsConnection: (data: { providerId: string; phone: string; credentials?: any }) =>
    fetcher<{ success: boolean; messageId?: string; isDev?: boolean; message?: string }>('/notifications/test-sms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

