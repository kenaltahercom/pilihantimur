import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getMsgs } from '@/lib/messages';
import { fontVariables } from '@/lib/fonts';
import { SITE_URL } from '@/lib/seo';
import { Sprite } from '@/components/Sprite';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Effects } from '@/components/Effects';
import { asLang } from '@/lib/utils';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: '#173F4A', width: 'device-width', initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Pilihan Timur', template: '%s â€” Pilihan Timur' },
  applicationName: 'Pilihan Timur',
};

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getMsgs();
  const lang = asLang(locale);
  const other = lang === 'id' ? 'en' : 'id';

  return (
    <html lang={t.htmlLang} className={fontVariables} suppressHydrationWarning>
<body>
        <a className="skip" href="#main">
          {t.skip}
        </a>
        <Sprite />
        <div id="nav-progress" aria-hidden="true" />
        <NextIntlClientProvider locale={locale} messages={{}}>
          <Header t={{ nav: t.nav }} other={other} />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer t={t} lang={lang} />
          <Effects />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
