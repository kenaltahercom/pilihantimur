import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getMsgs } from '@/lib/messages';
import { pageMeta } from '@/lib/seo';
import { staticPhotos } from '@/lib/photos';
import { asLang } from '@/lib/utils';
import { SixGrid } from '@/components/SixGrid';
import { FloresMap } from '@/components/FloresMap';
import { Arrow, RuleHeading } from '@/components/ui';

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getMsgs();
  return pageMeta(locale, '/', t.meta.home, t.meta.homeDesc, true);
}

export default async function HomePage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getMsgs();
  const lang = asLang(locale);
  const hero = staticPhotos('danau-kelimutu', lang)[0];

  return (
    <>
      <section className="hero6" aria-label={t.hero.a11y}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {hero ? <img className="hero6-img" src={hero.src} width={hero.width} height={hero.height} alt="" fetchPriority="high" decoding="async" /> : null}
        <div className="hero6-shade" aria-hidden="true" />
        <div className="hero6-inner wrap">
          <p className="eyebrow">{t.descriptor}</p>
          <h1 className="hero6-title">Pilihan Timur</h1>
          <p className="hero6-tag script">{t.tagline}</p>
          <p className="hero6-sub">{t.hero.sub}</p>
          <p className="hero6-btns">
            <a className="pill pill-gold pill-lg" href="#pilihan">
              {t.six.cta}
              <Arrow />
            </a>
          </p>
        </div>
        {hero ? (
          <p className="hero6-credit mono">
            {t.detail.photoBy} {hero.credit}
          </p>
        ) : null}
      </section>

      <section className="six-sec" id="pilihan" aria-labelledby="six-h">
        <div className="wrap">
          <p className="mono kicker rv">{t.six.kicker}</p>
          <RuleHeading>
            <span id="six-h">{t.six.h}</span>
          </RuleHeading>
          <p className="mono lead rv">{t.six.body}</p>
          <FloresMap t={t} />
          <SixGrid t={t} lang={lang} />
        </div>
      </section>

      <section className="six-about" aria-labelledby="six-about-h">
        <div className="wrap six-about-in">
          <h2 id="six-about-h" className="display rv">
            {t.six.about}
          </h2>
          <p className="mono rv">{t.six.aboutBody}</p>
          <p className="rv">
            <Link className="pill pill-teal" href="/about">
              {t.nav.about}
              <Arrow />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
