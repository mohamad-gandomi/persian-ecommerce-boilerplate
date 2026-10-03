/**
 * محاسبه زمان تقریبی مطالعه برحسب دقیقه برای متن‌های فارسی و مقالات.
 */
export function calculateReadingTime(content?: string | null): string {
  if (!content) return '۱ دقیقه مطالعه';
  const cleanText = content.replace(/<\/?[^>]+(>|$)/g, '').replace(/[#*`_~\[\]]/g, '');
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  const farsiMinutes = new Intl.NumberFormat('fa-IR').format(minutes);
  return `${farsiMinutes} دقیقه مطالعه`;
}

/**
 * تبدیل تاریخ میلادی به تقویم شمسی هجری خورشیدی برای بخش مقالات و ژورنال استودیو.
 */
export function formatBlogDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}
