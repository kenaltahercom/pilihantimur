import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { DESTINATIONS } from '@/lib/data';
import { SITE_URL } from '@/lib/seo';

const STATIC = ['', '/destinations', '/plan', '/about'];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC, ...DESTINATIONS.map((d) => `/destinations/${d.slug}`)];
  return paths.flatMap((p) =>
    routing.locales.map((l) => ({
      url: `${SITE_URL}/${l}${p}`,
      alternates: { languages: Object.fromEntries(routing.locales.map((x) => [x, `${SITE_URL}/${x}${p}`])) },
    })),
  );
}
