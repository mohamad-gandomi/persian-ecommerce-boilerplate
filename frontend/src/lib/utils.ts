import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '۰ تومان';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${new Intl.NumberFormat('fa-IR').format(num)} تومان`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('fa-IR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function formatPaymentMethod(method?: string): string {
  if (!method) return 'پرداخت آنلاین';
  const upper = method.toUpperCase();
  if (upper.includes('MELLAT')) return 'به‌پرداخت ملت (شاپرک)';
  if (upper.includes('ZARINPAL')) return 'زرین‌پال (شاپرک)';
  if (upper.includes('BANK_TRANSFER') || upper.includes('حواله')) return 'حواله مستقیم بانکی';
  return method;
}
