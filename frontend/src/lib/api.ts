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
        }
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth_changed'));
      }
    }
    return data.data;
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
      window.dispatchEvent(new Event('auth_changed'));
      window.location.href = '/auth/otp';
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
};
