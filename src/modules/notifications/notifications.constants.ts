export const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

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
  sendMode?: 'pattern' | 'text'; // 'pattern': خدماتی سریع پترن, 'text': پیامک متنی خط اختصاصی
  userInApp: boolean;
  adminInApp: boolean;
  userSms: boolean;
  adminSms: boolean;

  // User-specific configuration
  userKavenegarTemplate?: string;
  userMelipayamakPatternCode?: string;
  userCustomText?: string;

  // Admin-specific configuration
  adminKavenegarTemplate?: string;
  adminMelipayamakPatternCode?: string;
  adminCustomText?: string;

  // Fallbacks for backward-compatibility
  kavenegarTemplate?: string;
  melipayamakPatternCode?: string;
  customText?: string;
  availablePlaceholders: string[];
}

export interface NotificationSettingsData {
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
    { key: 'surveyLink', label: 'لینک ثبت نظر و امتیاز به محصول', example: '/orders/SW-1025/review' },
  ],
  order_cancelled: [
    { key: 'orderNumber', label: 'شماره سفارش', example: 'SW-1025' },
    { key: 'customerName', label: 'نام خریدار', example: 'محمد رضایی' },
    { key: 'reason', label: 'علت لغو سفارش', example: 'درخواست مشتری' },
    { key: 'refundAmount', label: 'مبلغ استرداد شده به کیف پول', example: '۲,۴۵۰,۰۰۰ تومان' },
  ],
  wallet_credited: [
    { key: 'amount', label: 'مبلغ تراکنش (تومان)', example: '۱۰۰,۰۰۰' },
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

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsData = {
  sms: {
    enabled: true,
    activeProvider: 'kavenegar',
    adminAlertPhones: [],
    providers: {
      kavenegar: {
        apiKey: '',
        sender: '',
      },
      melipayamak: {
        username: '',
        password: '',
        sender: '',
      },
    },
  },
  events: {
    auth_otp: {
      key: 'auth_otp',
      title: 'کد تأیید ورود و احراز هویت پیامکی (OTP)',
      description: 'ارسال کد یکبارمصرف اعتبارسنجی ورود و ثبت‌نام سریع با شماره موبایل کاربر',
      category: 'auth',
      sendMode: 'pattern',
      userInApp: false,
      adminInApp: false,
      userSms: true,
      adminSms: false,
      userKavenegarTemplate: 'verify',
      userMelipayamakPatternCode: '',
      userCustomText: 'کد تایید ورود شما به فروشگاه: {code}',
      availablePlaceholders: ['code'],
    },
    order_created: {
      key: 'order_created',
      title: 'ثبت سفارش جدید',
      description: 'هنگامی که مشتری سفارش جدیدی در فروشگاه ثبت می‌کند',
      category: 'orders',
      sendMode: 'pattern',
      userInApp: true,
      adminInApp: true,
      userSms: true,
      adminSms: true,
      userKavenegarTemplate: 'order-created',
      userMelipayamakPatternCode: '',
      userCustomText: '{customerName} عزیز، سفارش شما با شماره {orderNumber} به مبلغ {totalAmount} تومان با موفقیت ثبت شد.',
      adminKavenegarTemplate: 'admin-order-alert',
      adminMelipayamakPatternCode: '',
      adminCustomText: 'مدیر گرامی، سفارش جدید با شماره {orderNumber} به مبلغ {totalAmount} تومان توسط {customerName} ثبت شد.',
      availablePlaceholders: ['orderNumber', 'customerName', 'totalAmount'],
    },
    order_processing: {
      key: 'order_processing',
      title: 'پردازش و آماده‌سازی سفارش',
      description: 'هنگامی که وضعیت سفارش به «در حال پردازش / آماده‌سازی» تغییر می‌کند',
      category: 'orders',
      sendMode: 'pattern',
      userInApp: true,
      adminInApp: false,
      userSms: true,
      adminSms: false,
      userKavenegarTemplate: 'order-processing',
      userMelipayamakPatternCode: '',
      userCustomText: '{customerName} عزیز، سفارش شما با شماره {orderNumber} وارد مرحله آماده‌سازی و بسته‌بندی شد.',
      adminCustomText: 'سفارش {orderNumber} برای خریدار {customerName} وارد مرحله پردازش و آماده‌سازی شد.',
      availablePlaceholders: ['orderNumber', 'customerName'],
    },
    order_shipped: {
      key: 'order_shipped',
      title: 'ارسال سفارش (تحویل به پست / باربری)',
      description: 'هنگامی که مرسوله تحویل شرکت پستی یا باربری داده می‌شود',
      category: 'orders',
      sendMode: 'pattern',
      userInApp: true,
      adminInApp: false,
      userSms: true,
      adminSms: false,
      userKavenegarTemplate: 'order-shipped',
      userMelipayamakPatternCode: '',
      userCustomText: '{customerName} عزیز، مرسوله سفارش {orderNumber} تحویل {carrier} شد. کد رهگیری: {trackingNumber}',
      adminCustomText: 'سفارش {orderNumber} تحویل {carrier} گردید. کد رهگیری ثبت‌شده: {trackingNumber}',
      availablePlaceholders: ['orderNumber', 'customerName', 'carrier', 'trackingNumber'],
    },
    order_delivered: {
      key: 'order_delivered',
      title: 'تحویل نهایی سفارش به مشتری',
      description: 'هنگامی که وضعیت سفارش به «تحویل داده شده» تغییر می‌کند',
      category: 'orders',
      sendMode: 'pattern',
      userInApp: true,
      adminInApp: false,
      userSms: true,
      adminSms: false,
      userKavenegarTemplate: 'order-delivered',
      userMelipayamakPatternCode: '',
      userCustomText: '{customerName} عزیز، سفارش شما با شماره {orderNumber} تحویل داده شد. از اعتماد شما سپاسگزاریم.',
      adminCustomText: 'سفارش {orderNumber} به خریدار {customerName} تحویل نهایی شد.',
      availablePlaceholders: ['orderNumber', 'customerName'],
    },
    order_cancelled: {
      key: 'order_cancelled',
      title: 'لغو یا مرجوعی سفارش',
      description: 'هنگامی که سفارش توسط مدیر یا مشتری لغو یا مرجوع می‌شود',
      category: 'orders',
      sendMode: 'pattern',
      userInApp: true,
      adminInApp: true,
      userSms: true,
      adminSms: true,
      userKavenegarTemplate: 'order-cancelled',
      userMelipayamakPatternCode: '',
      userCustomText: '{customerName} عزیز، سفارش {orderNumber} لغو شد ({reason}). در صورت کسر وجه، مبلغ به کیف پول شما استرداد گردید.',
      adminKavenegarTemplate: 'admin-cancel-alert',
      adminMelipayamakPatternCode: '',
      adminCustomText: 'هشدار مدیریت: سفارش {orderNumber} متعلق به {customerName} لغو گردید. علت: {reason}.',
      availablePlaceholders: ['orderNumber', 'customerName', 'reason'],
    },
    wallet_credited: {
      key: 'wallet_credited',
      title: 'شارژ و واریز به کیف پول',
      description: 'افزایش موجودی، استرداد وجه سفارش، پاداش رفرال یا کش‌بک خرید',
      category: 'wallet',
      sendMode: 'pattern',
      userInApp: true,
      adminInApp: false,
      userSms: true,
      adminSms: false,
      userKavenegarTemplate: 'wallet-credit',
      userMelipayamakPatternCode: '',
      userCustomText: 'مبلغ {amount} تومان به کیف پول شما واریز شد ({reason}). موجودی فعلی: {balance} تومان.',
      adminCustomText: 'افزایش موجودی کیف پول کاربر به مبلغ {amount} تومان ثبت شد. مانده جدید: {balance} تومان.',
      availablePlaceholders: ['amount', 'balance', 'reason'],
    },
    wallet_debited: {
      key: 'wallet_debited',
      title: 'برداشت یا پرداخت از کیف پول',
      description: 'هنگامی که برای خرید سفارش یا توسط ادمین از کیف پول کاربر کسر می‌شود',
      category: 'wallet',
      sendMode: 'text',
      userInApp: true,
      adminInApp: false,
      userSms: false,
      adminSms: false,
      userCustomText: 'مبلغ {amount} تومان بابت سفارش {orderNumber} از کیف پول شما کسر شد. مانده جدید: {balance} تومان.',
      adminCustomText: 'کسر مبلغ {amount} تومان از کیف پول کاربر برای سفارش {orderNumber} انجام شد.',
      availablePlaceholders: ['amount', 'balance', 'orderNumber'],
    },
    inventory_low_stock: {
      key: 'inventory_low_stock',
      title: 'هشدار کمبود موجودی محصول در انبار',
      description: 'هنگامی که موجودی انبار یک محصول به ۵ عدد یا کمتر می‌رسد',
      category: 'inventory',
      sendMode: 'pattern',
      userInApp: false,
      adminInApp: true,
      userSms: false,
      adminSms: true,
      adminKavenegarTemplate: 'inventory-alert',
      adminMelipayamakPatternCode: '',
      adminCustomText: 'هشدار انبارداری: موجودی کالای "{productName}" (کد: {sku}) به {stockQuantity} عدد رسید. لطفاً تأمین موجودی را بررسی فرمایید.',
      availablePlaceholders: ['productName', 'sku', 'stockQuantity', 'price', 'productUrl'],
    },
    inventory_out_of_stock: {
      key: 'inventory_out_of_stock',
      title: 'هشدار اتمام کامل موجودی محصول (ناموجود شدن)',
      description: 'هنگامی که موجودی کالایی در انبار صفر شده و غیرقابل سفارش می‌شود',
      category: 'inventory',
      sendMode: 'pattern',
      userInApp: false,
      adminInApp: true,
      userSms: false,
      adminSms: true,
      adminKavenegarTemplate: 'stock-out-alert',
      adminMelipayamakPatternCode: '',
      adminCustomText: 'هشدار انبارداری: کالای "{productName}" (کد: {sku}) کاملاً ناموجود شد و موجودی آن به صفر رسید.',
      availablePlaceholders: ['productName', 'sku', 'lastPrice', 'categoryName', 'updatedAt'],
    },
    blog_post_published: {
      key: 'blog_post_published',
      title: 'انتشار مقاله جدید در مجله',
      description: 'اعلان به کاربران درباره انتشار راهنما و مقاله دکوراسیون جدید',
      category: 'blog',
      sendMode: 'text',
      userInApp: true,
      adminInApp: false,
      userSms: false,
      adminSms: false,
      userCustomText: 'مقاله جدید "{postTitle}" در مجله آنلاین فروشگاه منتشر شد.',
      adminCustomText: 'مقاله جدید "{postTitle}" در دسته {categoryName} منتشر گردید.',
      availablePlaceholders: ['postTitle', 'categoryName', 'slug', 'authorName', 'readingTime'],
    },
    blog_comment_submitted: {
      key: 'blog_comment_submitted',
      title: 'ثبت دیدگاه جدید روی مقاله مجله',
      description: 'هنگامی که کاربری نظر یا پرسشی روی مقالات وبلاگ ثبت می‌کند',
      category: 'blog',
      sendMode: 'text',
      userInApp: false,
      adminInApp: true,
      userSms: false,
      adminSms: false,
      adminCustomText: 'دیدگاه جدیدی توسط {commenterName} روی مقاله "{postTitle}" ثبت شد: "{commentText}"',
      availablePlaceholders: ['postTitle', 'commenterName', 'commentText', 'postUrl'],
    },
  },
};
