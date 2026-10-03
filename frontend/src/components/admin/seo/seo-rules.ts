import { SeoCheckItem, ComputeSeoRulesParams } from './seo-types';

export type { SeoCheckItem, ComputeSeoRulesParams };

export function computeSeoRules({
  title,
  slug,
  excerpt,
  content,
  featuredImage,
  categoryId,
  categoryName,
}: ComputeSeoRulesParams): SeoCheckItem[] {
  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const excerptLength = (excerpt || '').trim().length;
  const titleLength = (title || '').trim().length;
  const headingMatches = content ? content.match(/^#{2,3}\s+.+$/gm) : null;
  const headingCount = headingMatches ? headingMatches.length : 0;
  const hasListFormatting = content ? /^(\s*[-*]|\s*\d+\.)\s+.+$/m.test(content) : false;
  const hasEmphasisFormatting = content ? /\*\*[^*]+\*\*/.test(content) || /^>\s+.+$/m.test(content) || /\[.+\]\(.+\)/.test(content) : false;

  let hasDirectAnswer = excerptLength >= 50;
  if (!hasDirectAnswer && content) {
    const firstPara = content.trim().split(/\n\n+/)[0] || '';
    hasDirectAnswer = firstPara.trim().split(/\s+/).filter(Boolean).length >= 15;
  }

  const cleanSlug = (slug || '').trim().toLowerCase();
  const isSlugValid = cleanSlug.length >= 3 && cleanSlug.length <= 55 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug);

  return [
    {
      id: 'title-length',
      category: 'google',
      categoryLabel: 'نتایج گوگل',
      title: 'طول عنوان مقاله (نمایش در نتایج گوگل)',
      passed: titleLength >= 35 && titleLength <= 65,
      scoreWeight: 10,
      currentValue: `${titleLength} نویسه`,
      targetRequirement: '۳۵ تا ۶۵ نویسه',
      recommendation: titleLength === 0
        ? 'عنوان جذابی بین ۳۵ تا ۶۵ نویسه وارد کنید تا بدون بریده شدن در نتایج گوگل، بیشترین کلیک را جذب کند.'
        : titleLength < 35
        ? `عنوان کوتاه است (${titleLength} نویسه). عبارات کلیدی بیشتری اضافه کنید تا به حداقل ۳۵ نویسه برسد.`
        : titleLength > 65
        ? `عنوان طولانی است (${titleLength} نویسه). در نتایج جستجوی موبایل بریده خواهد شد.`
        : 'طول عنوان ایده‌آل است و به طور کامل در نتایج موبایل و دسکتاپ نمایش داده می‌شود.',
      importance: 'critical',
    },
    {
      id: 'clean-slug',
      category: 'google',
      categoryLabel: 'ایندکس گوگل',
      title: 'نامک آدرس (URL Slug) استاندارد',
      passed: isSlugValid,
      scoreWeight: 10,
      currentValue: slug ? `/${slug}` : 'فاقد نامک',
      targetRequirement: 'حروف کوچک انگلیسی، ۳ تا ۵۵ نویسه با خط تیره',
      recommendation: !slug
        ? 'یک نامک آدرس کوتاه و معنادار وارد کنید یا دکمه تولید مجدد را فشار دهید.'
        : !isSlugValid
        ? 'نامک باید فقط شامل حروف انگلیسی کوچک، ارقام و خط تیره (-) باشد و بین ۳ تا ۵۵ نویسه باشد.'
        : 'ساختار نامک کاملاً استاندارد، تمیز و سئوپسند است.',
      importance: 'critical',
    },
    {
      id: 'meta-excerpt',
      category: 'google',
      categoryLabel: 'نتایج گوگل',
      title: 'طول خلاصه و متای توضیحات',
      passed: excerptLength >= 110 && excerptLength <= 160,
      scoreWeight: 10,
      currentValue: `${excerptLength} نویسه`,
      targetRequirement: '۱۱۰ تا ۱۶۰ نویسه',
      recommendation: excerptLength === 0
        ? 'یک خلاصه‌ی جذاب در ۱ تا ۲ جمله (۱۱۰ تا ۱۶۰ نویسه) بنویسید که پیام اصلی مقاله را بیان کند.'
        : excerptLength < 110
        ? `خلاصه کوتاه است (${excerptLength} نویسه). به ۱۱۰ نویسه برسانید تا اسنیپت کاملی در گوگل تشکیل شود.`
        : excerptLength > 160
        ? `خلاصه طولانی است (${excerptLength} نویسه) و بخش انتهایی آن با سه نقطه در گوگل بریده خواهد شد.`
        : 'طول خلاصه عالی است و بهترین پیش‌نمایش را در نتایج گوگل و شبکه‌های اجتماعی ارائه می‌دهد.',
      importance: 'critical',
    },
    {
      id: 'featured-image',
      category: 'google',
      categoryLabel: 'گوگل دیسکاور',
      title: 'تصویر شاخص و کاور مقاله',
      passed: !!featuredImage && featuredImage.trim().length > 0,
      scoreWeight: 10,
      currentValue: featuredImage ? 'تصویر کاور انتخاب شده' : 'فاقد تصویر شاخص',
      targetRequirement: 'تصویر باکیفیت (پیشنهادی: ۱۲۰۰×۶۳۰ پیکسل)',
      recommendation: featuredImage
        ? 'تصویر شاخص متصل است. این مقاله امکان حضور در کارت‌های شبکه‌های اجتماعی و گوگل دیسکاور را دارد.'
        : 'یک تصویر باکیفیت از کتابخانه رسانه انتخاب کنید. مقالات دارای تصویر ۹۴٪ تعامل بیشتری جذب می‌کنند.',
      importance: 'recommended',
    },
    {
      id: 'topic-category',
      category: 'google',
      categoryLabel: 'ساختار سایت',
      title: 'انتساب به دسته‌بندی موضوعی',
      passed: !!categoryId && categoryId.trim().length > 0,
      scoreWeight: 10,
      currentValue: categoryName || (categoryId ? 'دسته منتسب شده' : 'عمومی (فاقد دسته)'),
      targetRequirement: 'تعیین دسته‌بندی تخصصی',
      recommendation: categoryId
        ? 'دسته‌بندی متصل است! این کار باعث ایجاد خوشه‌های محتوایی و قدرت سئوی داخلی می‌شود.'
        : 'این مقاله را به یک دسته‌بندی موضوعی مرتبط منتسب کنید.',
      importance: 'recommended',
    },
    {
      id: 'heading-hierarchy',
      category: 'structure',
      categoryLabel: 'عمق محتوا',
      title: 'تیترهای فرعی و بخش‌بندی (H2 / H3)',
      passed: headingCount >= 2,
      scoreWeight: 10,
      currentValue: `${headingCount} تیتر فرعی`,
      targetRequirement: 'حداقل ۲ تیتر با علامت ##',
      recommendation: headingCount >= 2
        ? `ساختاردهی مناسب! ${headingCount} تیتر فرعی باعث اسکن سریع متن و شانس حضور در Featured Snippet می‌شود.`
        : 'حداقل ۲ تیتر فرعی (با استفاده از ## نام بخش) اضافه کنید تا خوانایی و درک گوگل بالا برود.',
      importance: 'critical',
    },
    {
      id: 'word-count',
      category: 'structure',
      categoryLabel: 'عمق محتوا',
      title: 'تعداد کلمات و غنای محتوا',
      passed: wordCount >= 300,
      scoreWeight: 10,
      currentValue: `${wordCount} کلمه`,
      targetRequirement: 'حداقل ۳۰۰ کلمه (۶۰۰+ کلمه برای راهنماهای جامع)',
      recommendation: wordCount >= 600
        ? `محتوای جامع و عمیق (${wordCount} کلمه). شانس بسیار بالا برای رتبه‌گیری در عبارات کلیدی مهم.`
        : wordCount >= 300
        ? `حجم محتوا قابل قبول است (${wordCount} کلمه). افزودن جزییات بیشتر به ۶۰۰ کلمه شانس رتبه اول را افزایش می‌دهد.`
        : `محتوا کوتاه است (${wordCount} کلمه). گوگل به مقالات با حداقل ۳۰۰ کلمه محتوای مفید پاداش می‌دهد.`,
      importance: 'critical',
    },
    {
      id: 'geo-direct-answer',
      category: 'geo',
      categoryLabel: 'موتورهای هوش مصنوعی',
      title: 'پاسخ مستقیم در آغاز متن (الگوی هرم وارونه)',
      passed: hasDirectAnswer,
      scoreWeight: 10,
      currentValue: hasDirectAnswer ? 'پاسخ مستقیم شناسایی شد' : 'مقدمه‌چینی طولانی',
      targetRequirement: 'پاسخ کوتاه و شفاف به پرسش کاربر در ۲-۳ جمله اول',
      recommendation: hasDirectAnswer
        ? 'پاسخ صریح و مستقیم در ابتدای متن وجود دارد. موتورهای هوش مصنوعی (ChatGPT, Gemini, Perplexity) این بخش‌ها را برای پاسخ مستقیم استخراج می‌کنند.'
        : 'پاسخ اصلی کاربر را بلافاصله در خلاصه یا پاراگراف اول بیاورید و از مقدمه‌چینی‌های زائد بپرهیزید.',
      importance: 'recommended',
    },
    {
      id: 'geo-structured-lists',
      category: 'geo',
      categoryLabel: 'موتورهای هوش مصنوعی',
      title: 'لیست‌های گام‌به‌گام و نشانه‌دار',
      passed: hasListFormatting,
      scoreWeight: 10,
      currentValue: hasListFormatting ? 'لیست ساختاریافته شناسایی شد' : 'فاقد لیست ساختاریافته',
      targetRequirement: 'حداقل یک لیست نشانه‌دار (- ) یا شماره‌دار (1. )',
      recommendation: hasListFormatting
        ? 'لیست‌های ساختاریافته تشخیص داده شدند! مدل‌های هوش مصنوعی لیست‌ها را مستقیماً به عنوان پاسخ جمع‌بندی نقل می‌کنند.'
        : 'یک لیست نشانه‌دار (با علامت -) یا مراحل شماره‌دار اضافه کنید تا درک ماشینی و نقل قول هوش مصنوعی تقویت شود.',
      importance: 'recommended',
    },
    {
      id: 'geo-entity-emphasis',
      category: 'geo',
      categoryLabel: 'موتورهای هوش مصنوعی',
      title: 'برجسته‌سازی اصطلاحات و موجودیت‌ها',
      passed: hasEmphasisFormatting,
      scoreWeight: 10,
      currentValue: hasEmphasisFormatting ? 'قالب‌بندی تأکیدی شناسایی شد' : 'فاقد تأکید یا لینک',
      targetRequirement: 'متن پررنگ (**اصطلاح**)، نقل‌قول (> ) یا پیوند',
      recommendation: hasEmphasisFormatting
        ? 'تأکید بر واژه‌های کلیدی وجود دارد! بولد کردن عبارات مهم به هوش مصنوعی در درک ساختار گراف دانش کمک می‌کند.'
        : 'با استفاده از **متن برجسته** اصطلاحات، ویژگی‌ها یا مفاهیم کلیدی را مشخص کنید و لینک‌های داخلی بگذارید.',
      importance: 'bonus',
    },
  ];
}
