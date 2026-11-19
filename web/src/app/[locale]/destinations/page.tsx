import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getMsgs } from '@/lib/messages';
import { pageMeta } from '@/lib/seo';
import { asLang } from '@/lib/utils';
import { SixGrid } from '@/components/SixGrid';
import { RuleHeading } from '@/components/ui';

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getMsgs();
  return pageMeta(locale, '/destinations', t.six.kicker, t.six.body);
}

export default async function DestinationsPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getMsgs();
  return (
    <>
      <section className="page-head wrap">
        <p className="mono kicker rv">{t.six.kicker}</p>
        <RuleHeading as="h1">{t.six.h}</RuleHeading>
        <p className="mono lead rv">{t.six.body}</p>
      </section>
      <section className="wrap six-sec list-wrap">
        <SixGrid t={t} lang={asLang(locale)} />
      </section>
    </>
  );
}
