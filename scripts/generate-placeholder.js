const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generatePlaceholder() {
  const width = 800;
  const height = 800;

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg)" />

  <!-- Inner border box -->
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="24" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="8 8" />

  <!-- Center Card -->
  <rect x="250" y="250" width="300" height="300" rx="32" fill="#ffffff" filter="url(#shadow)" />

  <!-- Image Icon inside Card -->
  <g transform="translate(350, 330) scale(4)" stroke="#94a3b8" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </g>

  <!-- Text -->
  <text x="400" y="480" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#64748b" text-anchor="middle">
    Placeholder Image
  </text>
  <text x="400" y="512" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#94a3b8" text-anchor="middle">
    تصویر پیش‌فرض محصول
  </text>
</svg>
`;

  const webpBuffer = await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toBuffer();

  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const publicDir = path.join(__dirname, '..', 'frontend', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const uploadPath = path.join(uploadsDir, 'placeholder.webp');
  const publicPath = path.join(publicDir, 'placeholder.webp');

  fs.writeFileSync(uploadPath, webpBuffer);
  fs.writeFileSync(publicPath, webpBuffer);

  console.log(`✅ Generated placeholder.webp (${webpBuffer.length} bytes)`);
  console.log(`📁 Saved to ${uploadPath}`);
  console.log(`📁 Saved to ${publicPath}`);
}

generatePlaceholder().catch((err) => {
  console.error('Failed to generate placeholder:', err);
  process.exit(1);
});
