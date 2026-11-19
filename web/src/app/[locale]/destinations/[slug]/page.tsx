import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getMsgs } from '@/lib/messages';
import { pageMeta } from '@/lib/seo';
import { getPublished, mapUrl } from '@/lib/published';
import { staticPhotos } from '@/lib/photos';
import { DESTINATIONS } from '@/lib/data';
import { CONTENT } from '@/lib/content';
import { asLang, categoryName, kindOf, pad, regionName } from '@/lib/utils';
import { Scene } from '@/components/Scene';
import { Chips, delay } from '@/components/ui';
import { TripPlanner } from '@/components/TripPlanner';
import { ReportForm } from './ReportForm';

type Params = { params: Promise<{ locale: string; slug: string }> };

// Slug tak dikenal -> 404 (bukan dirender saat request).
export const dynamicParams = false;

// Isi terbit dibaca dari database; halaman disegarkan berkala dan saat admin menerbitkan.
export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => DESTINATIONS.map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const d = DESTINATIONS.find((x) => x.slug === slug);
  if (!d) return {};
  const t = await getMsgs();
  const pub = (await getPublished()).get(slug);
  const sum = pub?.text[locale === 'en' ? 'en' : 'id']?.summary;
  return pageMeta(locale, `/destinations/${slug}`, d.name, sum || `${d.name}, ${d.kabupaten}. ${t.detail.candidate}.`);
}

export default async function DestinationDetailPage({ params }: Params) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const d = DESTINATIONS.find((x) => x.slug === slug);
  if (!d) notFound();
  const t = await getMsgs();
  const lang = asLang(locale);
  const D = t.detail;
  const pub = (await getPublished()).get(slug);
  const tx = pub?.text[lang];
  const C = CONTENT[slug];
  // Foto dari database (terbit) didahulukan; bila belum ada, pakai foto terpasang di folder public/photos.
  const photos = pub?.photos?.length ? pub.photos : staticPhotos(slug, lang);
  const hero = photos[0];
  const more = photos.slice(1);
  const catLabel = categoryName(d.category, lang, t.list.uncat);
  const same = DESTINATIONS.filter((x) => x.kabupaten === d.kabupaten && x.slug !== d.slug);
  const galleryKinds = [kindOf(d), 'beach', 'mountains', 'lakes', 'geo', 'culture'];
  const heroLabel = (lang === 'id' ? 'Ilustrasi pengisi untuk ' : 'Placeholder illustration for ') + d.name;

  return (
    <>
      <section className="detail-head wrap">
        <nav className="crumbs mono" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">{D.crumbHome}</Link>
            </li>
            <li>
              <Link href="/destinations">{t.nav.destinations}</Link>
            </li>
            <li aria-current="page">{d.name}</li>
          </ol>
        </nav>
        <p className="mono kicker rv">
          {d.kabupaten} · {regionName(d.region, lang)}
        </p>
        <h1 className="detail-title display rv">{d.name}</h1>
        <p className="chips rv">
          <Chips d={d} t={t} />
          {pub ? <span className="chip chip-ok">{D.verified}</span> : null}
          <span className="chip chip-cat">{catLabel}</span>
        </p>
      </section>

      <section className="wrap">
        <figure className="hero-fig rv">
          <div className="hero-frame frame">
            {hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="photo" src={hero.src} alt={lang === 'id' ? hero.altId : hero.altEn} width={hero.width} height={hero.height} fetchPriority="high" decoding="async" />
            ) : (
              <Scene kind={kindOf(d)} label={heroLabel} />
            )}
          </div>
          {hero && <figcaption className="photo-credit mono">{D.photoBy}: {hero.credit} · {hero.license}</figcaption>}
        </figure>
      </section>

      <section className="wrap detail-grid">
        <div className="detail-main">
          {tx && (tx.summary || tx.description) && (
            <article className="dsec rv">
              <h2 className="display">{D.about}</h2>
              {tx.summary && <p className="mono lead desc">{tx.summary}</p>}
              {tx.description && <p className="mono desc">{tx.description}</p>}
            </article>
          )}
          {!(tx && (tx.summary || tx.description)) && C && (
            <article className="dsec rv">
              <h2 className="display">{D.about}</h2>
              <p className="mono lead desc">{C.summary[lang]}</p>
              <p className="mono desc">{C.description[lang]}</p>
            </article>
          )}
          {(photos.length === 0 || more.length > 0) && (
          <article className="dsec rv">
            <h2 className="display">{D.journey}</h2>
            {photos.length === 0 && <p className="mono">{D.journeyBody}</p>}
            {more.length > 0 ? (
              <ul className="photo-grid">
                {more.map((ph) => (
                  <li key={ph.id}>
                    <figure>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="photo" src={ph.src} alt={lang === 'id' ? ph.altId : ph.altEn} width={ph.width} height={ph.height} loading="lazy" decoding="async" />
                      <figcaption className="photo-credit mono">{D.photoBy}: {ph.credit} · {ph.license}</figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            ) : photos.length === 0 ? (
            <ol className="gallery gallery-sm">
              {galleryKinds.map((k, i) => (
                <li className={`g-item g-${i + 1} rv`} style={delay(i * 0.07)} key={i}>
                  <span className="num">{pad(i + 1)}</span>
                  <div className="frame">
                    <Scene kind={k} />
                  </div>
                </li>
              ))}
            </ol>
            ) : null}
          </article>
          )}

          <article className="dsec rv">
            <h2 className="display">{D.getting}</h2>
            <p className="mono desc">{tx?.accessNotes || C?.access[lang] || D.gettingBody}</p>
            <dl className="facts mono">
              <div>
                <dt>{t.know.access}</dt>
                <dd>
                  <span className={`chip tier-${d.access}`}>{t.tierShort[d.access]}</span> {t.tier[d.access].slice(4)}
                </dd>
              </div>
            </dl>
          </article>

          {C && <TripPlanner c={C} t={t} lang={lang} slug={slug} />}

          {C && (
            <article className="dsec rv" aria-labelledby="cost-h">
              <h2 id="cost-h" className="display">{D.cost}</h2>
              <p className="mono small"><span className="chip chip-doc">{D.costWarn}</span></p>
              <dl className="facts mono cost-list" hidden={C.costs.every((c) => c.value.id === 'Belum ada data')}>
                {C.costs.filter((c) => c.value.id !== 'Belum ada data').map((c) => (
                  <div key={c.label.id}>
                    <dt>{c.label[lang]}</dt>
                    <dd>{c.value[lang]}</dd>
                  </div>
                ))}
              </dl>
              <p className="mono small">{C.costNote[lang]}</p>
              <p className="mono small">
                {D.costSrc}:{' '}
                {C.sources.map((src, i) => (
                  <span key={src.url}>
                    {i > 0 && ' · '}
                    <a href={src.url} target="_blank" rel="noopener noreferrer">{src.label}</a> ({D.checked} {src.date})
                  </span>
                ))}
              </p>
            </article>
          )}

          <article className="dsec rv" aria-labelledby="video-h">
            <h2 id="video-h" className="display">{D.videoH}</h2>
            {C && C.videos.length > 0 ? (
              <div className="video-list">
                {C.videos.map((v) =>
                  v.kind === 'youtube' ? (
                    <div className="video-frame" key={v.id}>
                      <iframe src={`https://www.youtube-nocookie.com/embed/${v.id}`} title={v.title[lang]} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                    </div>
                  ) : (
                    <video className={v.portrait ? 'video-frame video-portrait' : 'video-frame'} key={v.src} controls playsInline preload="none" poster={v.poster} src={v.src} aria-label={v.title[lang]} />
                  ),
                )}
              </div>
            ) : (
              <div className="video-soon" role="note">
                <span className="video-play" aria-hidden="true">▶</span>
                <div>
                  <strong className="display">{D.videoSoon}</strong>
                  <p className="mono small">{D.videoSoonBody}</p>
                </div>
              </div>
            )}
          </article>

          <article className="dsec rv">
            <h2 className="display">{D.prepare}</h2>
            {tx?.tips && <p className="mono">{tx.tips}</p>}
            <p className="mono">{D.prepareBody}</p>
          </article>
        </div>

        <aside className="detail-side">
          <section className="side-card rv" aria-labelledby="loc-h">
            <h2 id="loc-h" className="display">
              {D.where}
            </h2>
            <dl className="facts mono">
              <div>
                <dt>{D.kab}</dt>
                <dd>{d.kabupaten}</dd>
              </div>
              {pub && pub.latitude !== null && pub.longitude !== null ? (
                <div>
                  <dt>{D.coords}</dt>
                  <dd>
                    {pub.latitude.toFixed(4)}, {pub.longitude.toFixed(4)}
                    <br />
                    <a href={mapUrl(pub.latitude, pub.longitude)} target="_blank" rel="noopener noreferrer">
                      {D.openMap}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>
          <section className="side-card rv" aria-labelledby="fresh-h">
            <h2 id="fresh-h" className="display">
              {D.fresh}
            </h2>
            <dl className="facts mono">
              <div>
                <dt>{pub?.verifiedAt ? D.verifiedOn : D.lastChecked}</dt>
                <dd>
                  {pub?.verifiedAt ? <span className="chip chip-ok">{pub.verifiedAt.slice(0, 10)}</span> : C ? C.sources.map((s) => s.date).sort().at(-1) : '–'}
                </dd>
              </div>
              <div>
                <dt>{D.source}</dt>
                <dd>
                  {pub && pub.sources.length > 0 ? (
                    <ul className="src-list">
                      {pub.sources.map((src) => (
                        <li key={src.url ?? src.title}>
                          {src.url ? (
                            <a href={src.url} target="_blank" rel="noopener noreferrer">
                              {src.title}
                            </a>
                          ) : (
                            src.title
                          )}
                          {src.publisher ? ` · ${src.publisher}` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : C ? (
                    <ul className="src-list">
                      {C.sources.map((src) => (
                        <li key={src.url}>
                          <a href={src.url} target="_blank" rel="noopener noreferrer">{src.label}</a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    D.sourceNone
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </section>

      {same.length > 0 && (
        <section className="wrap related">
          <h2 className="display rv">{D.related}</h2>
          <ul className="dgrid dgrid-sm">
            {same.map((x, i) => (
              <li className="dcard rv" style={delay(i * 0.06)} key={x.slug}>
                <Link href={`/destinations/${x.slug}`}>
                  <div className="frame">
                    <Scene kind={kindOf(x)} />
                  </div>
                  <div className="dmeta">
                    <h3 className="display">{x.name}</h3>
                    <p className="chips">
                      <Chips d={x} t={t} />
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="wrap">
        <ReportForm slug={d.slug} L={D.reportForm} />
      </section>

      <section className="wrap detail-foot">
        <p className="mono small">{D.report}</p>
        <Link className="pill pill-teal" href="/destinations">
          {D.back}
        </Link>
      </section>
    </>
  );
}
