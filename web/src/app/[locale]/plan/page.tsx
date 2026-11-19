import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getMsgs } from '@/lib/messages';
import { pageMeta } from '@/lib/seo';
import { asLang, pad } from '@/lib/utils';
import { DESTINATIONS, EDITORS_PICKS } from '@/lib/data';
import { CONTENT } from '@/lib/content';
import { DEST_GATEWAYS } from '@/lib/origins';
import { staticPhotos } from '@/lib/photos';
import { PlanClient, type PlanPick } from '@/components/PlanClient';
import { RuleHeading } from '@/components/ui';

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getMsgs();
  return pageMeta(locale, '/plan', t.plan.kicker, t.plan.body);
}

export default async function PlanPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getMsgs();
  const lang = asLang(locale);
  const picks: PlanPick[] = EDITORS_PICKS.flatMap((slug, i) => {
    const d = DESTINATIONS.find((x) => x.slug === slug);
    if (!d) return [];
    const ph = staticPhotos(slug, lang)[0];
    return [{
      slug, name: d.name, kabupaten: d.kabupaten, n: pad(i + 1), gateways: DEST_GATEWAYS[slug] ?? [],
      budget: CONTENT[slug]?.budget ? { min: CONTENT[slug].budget!.min, max: CONTENT[slug].budget!.max } : null,
      photo: ph ? { src: ph.src, alt: lang === 'id' ? ph.altId : ph.altEn } : null,
    }];
  });
  return (
    <>
      <section className="page-head wrap">
        <p className="mono kicker rv">{t.plan.kicker}</p>
        <RuleHeading as="h1">{t.plan.h}</RuleHeading>
        <p className="mono lead rv">{t.plan.body}</p>
      </section>
      <section className="wrap list-wrap">
        <PlanClient t={t} lang={lang} picks={picks} />
      </section>
    </>
  );
}
