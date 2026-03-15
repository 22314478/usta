import { MetadataRoute } from 'next';

const baseUrl = 'https://kymacyprus.com';
const locales = ['en', 'fa', 'it', 'el', 'tr', 'ru'];

// صفحات استاتیک سایت
const routes = [
  { path: '', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/menu', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/events', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  // برای هر صفحه، همه زبان‌ها رو اضافه می‌کنیم
  routes.forEach((route) => {
    // ابتدا نسخه انگلیسی (بدون locale prefix)
    sitemap.push({
      url: `${baseUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [
            loc,
            `${baseUrl}${loc === 'en' ? route.path : `/${loc}${route.path}`}`
          ])
        )
      }
    });

    // بعد بقیه زبان‌ها
    locales.filter(loc => loc !== 'en').forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc,
              `${baseUrl}${loc === 'en' ? route.path : `/${loc}${route.path}`}`
            ])
          )
        }
      });
    });
  });

  return sitemap;
}
