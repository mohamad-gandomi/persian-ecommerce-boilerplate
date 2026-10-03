const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting complete Persian translation of database records...');

  // 1. Categories
  console.log('📦 Translating Categories...');
  const categoryTranslations = [
    {
      slug: 'living-room',
      name: 'اتاق نشیمن و پذیرایی',
      description: 'مبل‌ها، لاونج‌چیرها و میزهای جلو مبلی دست‌ساز با تلفیق اصالت چوب و ارگونومی مدرن.',
    },
    {
      slug: 'sofas-and-armchairs',
      name: 'مبل و صندلی تک‌نفره',
      description: 'مبلمان دست‌ساز راحتی، لاونج‌چیرهای مدرن با چوب‌های گردو، راش و پارچه‌های تنفس‌پذیر.',
    },
    {
      slug: 'dining-room',
      name: 'اتاق غذاخوری و ناهارخوری',
      description: 'میزهای ناهارخوری تمام‌چوب مستحکم، صندلی‌های ارگونومیک و نیمکت‌های خانوادگی.',
    },
    {
      slug: 'dining-tables',
      name: 'میزهای ناهارخوری',
      description: 'میزهای ناهارخوری دست‌ساز از اسلب‌های یکپارچه و چوب‌های فرآوری‌شده ماندگار برای نسل‌ها.',
    },
    {
      slug: 'coffee-tables',
      name: 'میزهای جلو مبلی و عسلی',
      description: 'میزهای جلو مبلی با فرم‌های آزاد ارگانیک، پایه‌های استوانه‌ای خراطی‌شده و کنده‌های طبیعی.',
    },
    {
      slug: 'dining-chairs',
      name: 'صندلی و نیمکت غذاخوری',
      description: 'صندلی‌های چوب خمیده با بافت دست‌بافت نخ کاغذی دانمارکی و نشیمن‌های راحت.',
    },
    {
      slug: 'bedroom',
      name: 'سرویس خواب و اتاق استراحت',
      description: 'تخت‌خواب‌های پلتفرم کم‌ارتفاع سبک ژاپنی، پاتختی‌های معلق و دراورهای موروثی چوب طبیعی.',
    },
  ];

  for (const cat of categoryTranslations) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (existing) {
      await prisma.category.update({
        where: { slug: cat.slug },
        data: { name: cat.name, description: cat.description },
      });
      console.log(`  ✓ Updated category: ${cat.name} (${cat.slug})`);
    }
  }

  // 2. Attributes & Attribute Values
  console.log('🎨 Translating Attributes & Values...');
  const attributeTranslations = [
    {
      slug: 'wood-finish',
      name: 'پوشش و جنس چوب',
      values: [
        { value: 'walnut', name: 'چوب گردوی آمریکایی' },
        { value: 'natural-oak', name: 'چوب بلوط سفید طبیعی' },
        { value: 'smoked-teak', name: 'چوب تیک دودی' },
      ],
    },
    {
      slug: 'fabric-color',
      name: 'رنگ و نوع پارچه',
      values: [
        { value: 'forest-velvet', name: 'مخمل سبز جنگلی' },
        { value: 'ivory-linen', name: 'کتان لینن عاجی' },
        { value: 'charcoal-grey', name: 'پارچه خاکستری زغالی' },
      ],
    },
    {
      slug: 'material-and-joinery',
      name: 'جنس چوب و شیوه اتصالات',
      values: [
        { value: 'solid-oak', name: 'بلوط اروپایی یکپارچه' },
        { value: 'solid-walnut', name: 'گردوی سیاه آمریکایی' },
        { value: 'danish-teak', name: 'تیک فرآوری‌شده دانمارکی' },
      ],
    },
  ];

  for (const attr of attributeTranslations) {
    const existingAttr = await prisma.attribute.findUnique({
      where: { slug: attr.slug },
      include: { values: true },
    });
    if (existingAttr) {
      await prisma.attribute.update({
        where: { id: existingAttr.id },
        data: { name: attr.name },
      });
      console.log(`  ✓ Updated attribute: ${attr.name}`);

      for (const val of attr.values) {
        const foundVal = existingAttr.values.find((v) => v.value === val.value);
        if (foundVal) {
          await prisma.attributeValue.update({
            where: { id: foundVal.id },
            data: { name: val.name },
          });
          console.log(`    - Value: ${val.name}`);
        }
      }
    }
  }

  // 3. Products & Variants
  console.log('🪑 Translating Products & Variants...');
  const productTranslations = [
    {
      slug: 'nordic-minimalist-lounge-armchair',
      name: 'مبل راحتی تک‌نفره نوردیک مینیمال',
      shortDescription: 'صندلی دست‌ساز ارگونومیک با اسکلت چوب گردو یا بلوط و نشیمن مخمل یا کتان اعلا.',
      description:
        'یک شاهکار درودگری با الهام از خطوط طراحی مینیمال اسکاندیناوی و پیوندهای مخفی کام و زبانه. ساخته‌شده از چوب سخت فرآوری‌شده در کوره با پوشش روغن گیاهی طبیعی و موم ارگانیک زنبور عسل.',
      variants: [
        { sku: 'SW-ARM-WAL-FOR', name: 'چوب گردوی آمریکایی / مخمل سبز جنگلی' },
        { sku: 'SW-ARM-WAL-IVO', name: 'چوب گردوی آمریکایی / کتان لینن عاجی' },
        { sku: 'SW-ARM-WAL-CHA', name: 'چوب گردوی آمریکایی / پارچه خاکستری زغالی' },
        { sku: 'SW-ARM-OAK-FOR', name: 'چوب بلوط سفید / مخمل سبز جنگلی' },
        { sku: 'SW-ARM-OAK-IVO', name: 'چوب بلوط سفید / کتان لینن عاجی' },
        { sku: 'SW-ARM-OAK-CHA', name: 'چوب بلوط سفید / پارچه خاکستری زغالی' },
      ],
    },
    {
      slug: 'aalborg-solid-white-oak-dining-table',
      name: 'میز ناهارخوری ۸ نفره چوب بلوط آلبورگ',
      shortDescription: 'میز ناهارخوری اصیل از چوب بلوط سفید اروپایی با پوشش روغن واکس گیاهی مات.',
      description:
        'میز ناهارخوری ماندگار ساخته‌شده از الوارهای ضخیم بلوط سفید وارداتی، با اتصالات دستی کام و زبانه سنتی و پرداخت سطح با روغن‌های ارگانیک مقاوم در برابر لکه و رطوبت.',
    },
    {
      slug: 'kyoto-solid-walnut-platform-bed',
      name: 'تخت‌خواب چوب گردو مدل کیوتو',
      shortDescription: 'تخت‌خواب پلتفرم پایه‌کوتاه مینیمال ساخته‌شده از چوب گردوی سیاه آمریکایی.',
      description:
        'دست‌ساز از تخته‌های یکپارچه و متوالی چوب گردوی سیاه خشک‌شده در کوره، با اتصالات مخفی نجاری، تاج شیب‌دار ارگونومیک و فینیش موم گیاهی.',
    },
    {
      slug: 'sora-sculptural-organic-coffee-table',
      name: 'میز جلو مبلی ارگانیک و مجسمه‌ای سورا',
      shortDescription: 'میز جلو مبلی فرم آزاد چوب گردوی طبیعی با پایه‌های استوانه‌ای خراطی‌شده.',
      description:
        'میز جلو مبلی با فرم منحنی ارگانیک و لبه‌های نرم، مستقر بر سه پایه استوانه‌ای چوبی تراش‌خورده. صیقل‌خورده با روغن بذرک فشرده سرد و موم زنبور.',
    },
    {
      slug: 'heritage-6-drawer-walnut-credenza',
      name: 'دراور ۶ کشو چوب گردوی موروثی',
      shortDescription: 'دراور ۶ کشو با رگه‌های متوالی پیوسته از چوب گردوی سیاه و ریل‌های آرام‌بند.',
      description:
        'نمای کشوها به صورت قرینه از یک اسلب پیوسته چوب گردوی اعلا بریده شده‌اند. مجهز به اتصالات سنتی دم‌چلچله‌ای در گوشه‌ها و ریل‌های مخفی آرام‌بند زیرکشو.',
    },
    {
      slug: 'hana-solid-walnut-bedside-nightstand',
      name: 'پاتختی چوب گردوی طبیعی هانا',
      shortDescription: 'پاتختی شناور چوب گردو با یک کشوی دم‌چلچله‌ای و طبقه باز کتاب‌خوانی.',
      description:
        'میز کنار تختی دست‌ساز با جلوه معلق، یک کشوی بدون صدا با اتصالات دم‌چلچله‌ای دستی و قفسه پایینی مناسب برای قرار دادن کتاب و اشیای شخصی.',
    },
    {
      slug: 'kanso-curved-white-oak-dining-chair',
      name: 'صندلی ناهارخوری منحنی چوب بلوط کانسو',
      shortDescription: 'صندلی ارگونومیک چوب بلوط با تکیه‌گاه خمیده بخارپز و کفی بافته‌شده دانمارکی.',
      description:
        'تکیه‌گاه یکپارچه با تکنیک سنتی خمش با بخار شکل گرفته و با کفی بافته‌شده از طناب‌های کاغذی طبیعی دانمارکی جفت شده است. بسیار سبک، با دوام فوق‌العاده بالا و نشیمن ارگونومیک.',
    },
    {
      slug: 'minka-solid-ash-trestle-dining-table',
      name: 'میز ناهارخوری پایه‌خرپایی چوب زبان‌گنجشک مینکا',
      shortDescription: 'میز ناهارخوری ۸ نفره معماری از چوب زبان‌گنجشک سفید با اتصالات گوه نمایان.',
      description:
        'میز ناهارخوری الهام‌گرفته از معماری سنتی ژاپنی، ساخته‌شده از چوب زبان‌گنجشک روشن با پایه‌های زاویه‌دار خرپایی و اتصالات کام و زبانه سرتاسری مهارشده با گوه چوبی.',
    },
    {
      slug: 'takumi-solid-oak-block-end-table',
      name: 'میز عسلی کنده یکپارچه بلوط تاکومی',
      shortDescription: 'میز کنار مبلی تندیس‌وار تراش‌خورده از یک کنده کامل بلوط کهنسال.',
      description:
        'تراشیده شده از یک قطعه تنه دست‌نخورده چوب بلوط اروپایی. نمایانگر حلقه‌های رشد سالانه، ترک‌های طبیعی و رگه‌های زنده مغز چوب با پرداخت روغنی ابریشمی.',
    },
    {
      slug: 'shizuka-low-profile-lounge-sofa',
      name: 'کاناپه راحتی پایه‌کوتاه شیزوکا',
      shortDescription: 'کاناپه ۳ نفره عمیق با کلاف پیرامونی بلوط سفید و پارچه لینن جو دوسری ایتالیایی.',
      description:
        'مبلمانی آرامش‌بخش و زمینی با اسکلت چوب بلوط سفید نمایان، فوم چندلایه ارتوپدیک و روکش پارچه لینن ایتالیایی با بافت تنفس‌پذیر و کوسن‌های الیاف طبیعی.',
    },
  ];

  for (const prod of productTranslations) {
    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
      include: { variants: true },
    });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: prod.name,
          shortDescription: prod.shortDescription,
          description: prod.description,
        },
      });
      console.log(`  ✓ Updated product: ${prod.name}`);
    }
  }

  // 4. Blog Categories & Blog Posts
  console.log('📰 Translating Blog Categories & Articles...');
  const blogCategoryTranslations = [
    {
      slug: 'woodcraft-and-design-guides',
      name: 'راهنماهای طراحی و درودگری',
      description: 'نکات انتخاب مبلمان، اصول هماهنگی دکوراسیون و استانداردهای چوب مرغوب.',
    },
    {
      slug: 'timber-craft',
      name: 'هنر اتصالات و اصالت چوب',
      description: 'اتصالات سنتی نجاری، فرآوری الوار و فنون کارگاهی تخصصی.',
    },
    {
      slug: 'timber-care',
      name: 'نگهداری و احیای چوب طبیعی',
      description: 'راهنماهای جامع مراقبت از روغن‌های گیاهی، موم طبیعی و درخشش مادام‌العمر سطوح چوبی.',
    },
    {
      slug: 'design-philosophy',
      name: 'فلسفه دیزاین و سبک جاپندی',
      description: 'تناسبات مینیمال ژاپنی-اسکاندیناوی، زیبایی‌شناسی وابی‌سابی و زندگی در آرامش.',
    },
  ];

  for (const bcat of blogCategoryTranslations) {
    const existing = await prisma.blogCategory.findUnique({ where: { slug: bcat.slug } });
    if (existing) {
      await prisma.blogCategory.update({
        where: { id: existing.id },
        data: { name: bcat.name, description: bcat.description },
      });
      console.log(`  ✓ Updated blog category: ${bcat.name}`);
    }
  }

  const blogPostTranslations = [
    {
      slug: 'living-with-natural-timber-caring-for-oil-finishes',
      title: 'زندگی با چوب طبیعی: اصول نگهداری از روغن گیاهی و موم ارگانیک',
      excerpt: 'راهکارهای ساده و طبیعی برای حفظ درخشش گرم و لطافت ابریشمی سطوح چوبی در زندگی روزمره.',
      content: `
# زندگی با چوب طبیعی: اصول نگهداری از روغن گیاهی و موم ارگانیک

چوب طبیعی، عنصری زنده و دارای تنفس است. برخلاف پلی‌اورتان‌ها و سیلرهای کارخانه‌ای شیمیایی که سطح چوب را با لایه‌ای پلاستیکی و مسدود می‌پوشانند، محصولات کارگاه با روغن‌های گیاهی ارگانیک بذرک و موم خالص زنبور عسل صیقل داده می‌شوند.

## ۱. پاک‌سازی روزانه و مراقبت لمسی
برای زدودن غبار یا پاک کردن لکه‌های سطحی، تنها یک دستمال پارچه‌ای نخی کمی نم‌دار کفایت می‌کند. حرکت دستمال باید همواره در راستای بافت طبیعی و آوندهای چوب باشد. هرگز از اسپری‌های براق‌کننده حاوی سیلیکون یا مواد شیمیایی خورنده استفاده نکنید.

## ۲. تعادل رطوبت و دمای محیط
الوار سخت چوبی به طور طبیعی با تغییر رطوبت هوا منبسط و منقبض می‌شود. حفظ رطوبت نسبی بین ۴۰٪ تا ۵۵٪ در فضای منزل، ضامن ثبات کامل اتصالات کام و زبانه در فصول خشک زمستان و شرجی تابستان است.

## ۳. آیین سالانه تجدید روغن چوب
سالی یک بار، مقدار کمی از روغن گیاهی مخصوص را روی سطح میز یا دسته‌های صندلی بمالید. پس از گذشت ۱۵ دقیقه، اضافه روغن را با پارچه نخی بدون پرز پاک کنید تا درخشش ابریشمی و اصیل چوب دوباره زنده شود.
      `.trim(),
    },
    {
      slug: 'japandi-proportions-finding-calm-in-restrained-furniture-forms',
      title: 'تناسبات سبک جاپندی: دستیابی به آرامش در فرم‌های مینیمال دست‌ساز',
      excerpt: 'تلفیق تعادل مینیمالیسم ژاپنی با گرمای سبک نوردیک در طراحی دست‌سازهای چوبی پایدار.',
      content: `
# تناسبات سبک جاپندی: دستیابی به آرامش در فرم‌های مینیمال دست‌ساز

در نقطه تلاقی سادگی و خلوص ژاپنی با روح صمیمی و آرام نوردیک (Hygge)، فلسفه‌ای زاده می‌شود که بر سادگی، صداقت متریال و تناسبات آرامش‌بخش معماری تأکید دارد.

## فرم در خدمت آرامش درونی
طراحی‌های مینیمال بر سطوح افقی با ارتفاع پایین متمرکز هستند. با پایین آوردن مرکز ثقل در تخت‌خواب‌های پلتفرم و کنسول‌ها، فضای تنفس عمودی خانه باز می‌ماند و نور طبیعی به زیبایی در فضا جریان می‌یابد.

## اصالت و صداقت در اتصالات
به جای پنهان کردن نقاط اتصال در پس پیچ‌ها و پلاستیک‌ها، اتصالات نمایان چوبی به عنوان تزئین اصیل اثر عمل می‌کنند. انگشتی‌های قفل‌شده در گوشه دراورها، داستان دست‌های هنرمند درودگر را بازگو می‌کنند.

## اثری ماندگار برای نسل‌های بعد
مبلمان نباید مصرفی باشد. وقتی اثری از چوب گردوی اعلا یا بلوط کهنسال آفریده می‌شود، هر اثر دست و هر پتینه با گذشت زمان، به خاطره‌ای جاودان در دل رگه‌های چوب بدل می‌گردد.
      `.trim(),
    },
    {
      slug: 'the-art-of-hardwood-joinery-why-solid-oak-walnut-endure',
      title: 'هنر اتصالات سنتی درودگری: راز ماندگاری نسل به نسل چوب گردو و بلوط',
      excerpt: 'چرا اتصالات کام و زبانه و دم‌چلچله‌ای دست‌ساز، استحکامی بسیار فراتر از پیچ و میخ‌های صنعتی دارند؟',
      content: `
# هنر اتصالات سنتی درودگری: راز ماندگاری نسل به نسل چوب گردو و بلوط

در جهان تولید انبوه، اغلب مبلمان با استفاده از چسب‌های صنعتی ضعیف و بست‌های فلزی ساخته می‌شوند که پس از چند سال استفاده لق شده و از هم می‌پاشند. در کارگاه تخصصی، ما به میراث کهن ساخت باکیفیت بازگشته‌ایم.

## کام و زبانه سرتاسری با گوه چوبی
در میزهای ناهارخوری ما، اتصال پایه‌ها به صفحه با اتصالات کام و زبانه سرتاسری و گوه‌های قفل‌کننده از گونه چوب متضاد اجرا می‌شود. این شیوه به چوب اجازه می‌دهد در طول دهه‌ها بدون شکستن نفس بکشد.

## دم‌چلچله‌ای‌های دست‌تراش در کشوها
گوشه‌های کشوهای ما با زاویه‌تراشی دقیق دم‌چلچله‌ای به یکدیگر قفل می‌شوند. فشار مکانیکی باز و بسته شدن کشو به هیچ وجه نمی‌تواند این اتصال را از هم جدا کند.

## صیقل و روغن‌های غیرسمی
ما زیبایی طبیعی چوب را زیر رنگ‌های شیمیایی پنهان نمی‌کنیم؛ بلکه با روغن‌های گیاهی خالص، به هر گره و رگه چوب اجازه می‌دهیم هویت منحصربه‌فرد خود را بدرخشد.
      `.trim(),
    },
  ];

  for (const post of blogPostTranslations) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) {
      await prisma.blogPost.update({
        where: { id: existing.id },
        data: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
        },
      });
      console.log(`  ✓ Updated blog post: ${post.title}`);
    }
  }

  // 5. Coupons
  console.log('🏷️ Translating Promotional Coupons...');
  const couponTranslations = [
    { code: 'WELCOME10', description: '۱۰٪ تخفیف اولین سفارش محصولات فروشگاه' },
    { code: 'WOODCRAFT15', description: '۱۵٪ تخفیف فصلی محصولات منتخب' },
    { code: 'SOLIDWOOD50', description: '۵۰ هزار تومان تخفیف ویژه خرید بالای ۳۰۰ هزار تومان' },
    { code: 'FREESHIP', description: 'ارسال رایگان با باربری ایمن و اختصاصی فروشگاه' },
    { code: 'EXPIRED20', description: 'تخفیف منقضی‌شده جشنواره تابستانه' },
    { code: 'AUTUMN2026', description: 'تخفیف ویژه جشنواره پاییزه فروشگاه' },
  ];

  for (const coup of couponTranslations) {
    const existing = await prisma.coupon.findUnique({ where: { code: coup.code } });
    if (existing) {
      await prisma.coupon.update({
        where: { id: existing.id },
        data: { description: coup.description },
      });
      console.log(`  ✓ Updated coupon: ${coup.code}`);
    }
  }

  // 6. Users (Admin and Customers)
  console.log('👤 Translating Users...');
  const userTranslations = [
    { email: 'admin@store.local', firstName: 'مدیر', lastName: 'سیستم' },
    { email: 'customer@store.local', firstName: 'علیرضا', lastName: 'شایان' },
    { email: 'eleanor.vance@example.com', firstName: 'مریم', lastName: 'صادقی' },
    { email: 'marcus.chen@example.com', firstName: 'رضا', lastName: 'طاهری' },
    { email: 'studio@store.local', firstName: 'استودیو', lastName: 'طراحی' },
  ];

  for (const u of userTranslations) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { firstName: u.firstName, lastName: u.lastName },
      });
      console.log(`  ✓ Updated user: ${u.firstName} ${u.lastName} (${u.email})`);
    }
  }

  // 7. Orders: Customer names, Carriers, and Items
  console.log('🛍️ Translating Orders & Items...');
  const customerNameMap = {
    'Alexander Wright': 'علیرضا شایان',
    'Marcus Chen': 'رضا طاهری',
    'Eleanor Vance': 'مریم صادقی',
    'Store Admin': 'مدیر سیستم',
  };

  const carrierMap = {
    'White Glove Freight Delivery': 'باربری اختصاصی با خدمات چیدمان',
    'FedEx Freight': 'باربری اختصاصی فروشگاه',
    'Old Dominion Freight Line': 'باربری بین‌شهری کالارسان',
    'Standard Freight': 'باربری چاپار لجستیک',
    'Chapar Logistics': 'باربری و پیک چاپار',
    'Standard Express Courier': 'پست پیشتاز تیپاکس',
    'Tipax Express Courier': 'تیپاکس اکسپرس',
    'Freight Logistics': 'باربری ویژه فروشگاه',
    'UPS Freight': 'باربری اختصاصی فروشگاه',
  };

  const orders = await prisma.order.findMany({ include: { items: true } });
  for (const ord of orders) {
    const newCustomerName = customerNameMap[ord.customerName] || ord.customerName;
    const newCarrier = carrierMap[ord.shippingCarrier] || ord.shippingCarrier;
    const newMethod = carrierMap[ord.shippingMethod] || ord.shippingMethod;

    await prisma.order.update({
      where: { id: ord.id },
      data: {
        customerName: newCustomerName,
        shippingCarrier: newCarrier,
        shippingMethod: newMethod,
      },
    });

    // Also update order item names to Persian
    for (const itm of ord.items) {
      let persianProdName = itm.productName;
      if (itm.productName.includes('Aalborg')) persianProdName = 'میز ناهارخوری ۸ نفره چوب بلوط آلبورگ';
      else if (itm.productName.includes('Nordic Minimalist')) persianProdName = 'مبل راحتی تک‌نفره نوردیک مینیمال';
      else if (itm.productName.includes('Kyoto')) persianProdName = 'تخت‌خواب چوب گردو مدل کیوتو';
      else if (itm.productName.includes('Sora')) persianProdName = 'میز جلو مبلی ارگانیک و مجسمه‌ای سورا';
      else if (itm.productName.includes('Heritage')) persianProdName = 'دراور ۶ کشو چوب گردوی موروثی';
      else if (itm.productName.includes('Hana')) persianProdName = 'پاتختی چوب گردوی طبیعی هانا';
      else if (itm.productName.includes('Kanso')) persianProdName = 'صندلی ناهارخوری منحنی چوب بلوط کانسو';
      else if (itm.productName.includes('Minka')) persianProdName = 'میز ناهارخوری پایه‌خرپایی چوب زبان‌گنجشک مینکا';
      else if (itm.productName.includes('Takumi')) persianProdName = 'میز عسلی کنده یکپارچه بلوط تاکومی';
      else if (itm.productName.includes('Shizuka')) persianProdName = 'کاناپه راحتی پایه‌کوتاه شیزوکا';

      let persianVariantName = itm.variantName;
      if (persianVariantName) {
        if (persianVariantName.includes('Forest Green')) persianVariantName = 'چوب گردوی آمریکایی / مخمل سبز جنگلی';
        else if (persianVariantName.includes('Charcoal')) persianVariantName = 'چوب گردوی آمریکایی / پارچه خاکستری زغالی';
        else if (persianVariantName.includes('Ivory Linen')) persianVariantName = 'چوب گردوی آمریکایی / کتان لینن عاجی';
        else if (persianVariantName.includes('White Oak')) persianVariantName = 'چوب بلوط سفید / مخمل سبز جنگلی';
      }

      await prisma.orderItem.update({
        where: { id: itm.id },
        data: {
          productName: persianProdName,
          variantName: persianVariantName,
        },
      });
    }

    console.log(`  ✓ Updated order: ${ord.orderNumber} -> مشتری: ${newCustomerName}`);
  }

  console.log('🎉 Persian database translation completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during Persian translation:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
