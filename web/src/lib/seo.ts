import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** Metadata per halaman: judul, deskripsi, canonical, dan hreflang ID/EN (PRD §16.3). */
export function pageMeta(locale: string, path: string, title: string, description: string, absoluteTitle = false): Metadata {
  const clean = path === '/' ? '' : path;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: `/${locale}${clean}`,
      languages: { ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${clean}`])), 'x-default': `/${routing.defaultLocale}${clean}` },
    },
    openGraph: { title, description, locale, type: 'website', siteName: 'Pilihan Timur' },
  };
}
