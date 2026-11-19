import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getMsgs } from '@/lib/messages';
import { pageMeta } from '@/lib/seo';
import { asLang, pad } from '@/lib/utils';
import { DESTINATIONS, EDITORS_PICKS } from '@/lib/data';
import { staticPhotos } from '@/lib/photos';
import { RuleHeading, delay } from '@/components/ui';

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getMsgs();
  return pageMeta(locale, '/about', t.aboutPage.h, t.aboutPage.lead);
}

export default async function AboutPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getMsgs();
  const A = t.aboutPage;
  const lang = asLang(locale);
  const shots = EDITORS_PICKS.flatMap((slug) => {
    const d = DESTINATIONS.find((x) => x.slug === slug);
    const ph = staticPhotos(slug, lang)[0];
    return d && ph ? [{ slug, name: d.name, ph }] : [];
  });

  return (
    <>
      <section className="page-head wrap">
        <p className="mono kicker rv">{t.tagline}</p>
        <RuleHeading as="h1">{A.h}</RuleHeading>
        <p className="mono lead about-lead rv">{A.lead}</p>
      </section>
      <section className="wrap about-grid">
        <div className="about-logo rv">
          <p className="display about-word">Pilihan Timur</p>
          <p className="script">{t.tagline}</p>
          <ul className="about-shots" aria-label={A.photosLabel}>
            {shots.map(({ slug, name, ph }) => (
              <li key={slug}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.src} width={ph.width} height={ph.height} alt={lang === 'id' ? ph.altId : ph.altEn} loading="lazy" decoding="async" title={name} />
              </li>
            ))}
          </ul>
        </div>
        <div className="about-copy">
          <h2 className="display rv">{A.visionH}</h2>
          <p className="mono rv">{A.vision}</p>
          <h2 className="display rv">{A.missionH}</h2>
          <p className="mono rv">{A.mission}</p>
        </div>
      </section>
      <section className="wrap">
        <h2 className="display rv">{A.fourH}</h2>
        <ol className="four">
          {A.four.map(([h, p], i) => (
            <li className="rv" style={delay(i * 0.07)} key={h}>
              <span className="num">{pad(i + 1)}</span>
              <h3 className="display">{h}</h3>
              <p className="mono">{p}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="wrap about-care">
        <div className="kcard rv">
          <h2 className="display">{A.careH}</h2>
          <p className="mono">{A.care}</p>
          <p className="mono">{A.noBooking}</p>
        </div>
      </section>
    </>
  );
}
