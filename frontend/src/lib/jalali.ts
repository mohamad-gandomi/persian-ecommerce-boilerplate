import { toJalaali, toGregorian, jalaaliMonthLength, isLeapJalaaliYear } from 'jalaali-js';

export const PERSIAN_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const PERSIAN_WEEK_DAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
export const PERSIAN_WEEK_DAYS_FULL = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه',
];

/**
 * Converts English digits to Persian digits.
 */
export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = String(input);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Converts Persian/Arabic digits to English digits.
 */
export function toEnglishDigits(input: string | null | undefined): string {
  if (!input) return '';
  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  let res = String(input);
  for (let i = 0; i < 10; i++) {
    res = res.replace(persianDigits[i], String(i)).replace(arabicDigits[i], String(i));
  }
  return res;
}

/**
 * Converts a Gregorian date (Date or string) to Jalali object.
 */
export function toJalaliDate(date: Date | string | null | undefined) {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;

  return toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/**
 * Converts Jalali year, month, day to a Gregorian Date at 00:00:00 UTC.
 */
export function fromJalaliDate(jy: number, jm: number, jd: number): Date {
  const g = toGregorian(jy, jm, jd);
  return new Date(Date.UTC(g.gy, g.gm - 1, g.gd, 0, 0, 0));
}

/**
 * Formats a Gregorian date into a readable Jalali string.
 * Example: "۱۵ شهریور ۱۳۷۰" or "۱۳۷۰/۰۶/۱۵"
 */
export function formatJalali(
  date: Date | string | null | undefined,
  mode: 'long' | 'short' | 'monthYear' = 'long',
): string {
  if (!date) return '—';
  const j = toJalaliDate(date);
  if (!j) return '—';

  const mName = PERSIAN_MONTH_NAMES[j.jm - 1];

  if (mode === 'short') {
    const padMonth = String(j.jm).padStart(2, '0');
    const padDay = String(j.jd).padStart(2, '0');
    return toPersianDigits(`${j.jy}/${padMonth}/${padDay}`);
  }

  if (mode === 'monthYear') {
    return `${mName} ${toPersianDigits(j.jy)}`;
  }

  // long format: "۱۵ شهریور ۱۳۷۰"
  return `${toPersianDigits(j.jd)} ${mName} ${toPersianDigits(j.jy)}`;
}

/**
 * Validates an Iranian National ID (کد ملی).
 */
export function isValidIranianNationalId(code: string | null | undefined): boolean {
  if (!code) return false;
  const clean = toEnglishDigits(code).trim();

  if (!/^\d{10}$/.test(clean)) return false;
  if (/^(\d)\1{9}$/.test(clean)) return false;

  const check = parseInt(clean.charAt(9), 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }

  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
}

export { jalaaliMonthLength, isLeapJalaaliYear };
