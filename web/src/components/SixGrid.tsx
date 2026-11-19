import { Link } from '@/i18n/navigation';
import { DESTINATIONS, EDITORS_PICKS, type Lang } from '@/lib/data';
import { staticPhotos } from '@/lib/photos';
import { pad, regionName } from '@/lib/utils';
import type { Messages } from '@/lib/messages';
import { delay } from '@/components/ui';

/** Enam kartu rekomendasi bergambar; dipakai di beranda dan halaman daftar. */
export function SixGrid({ t, lang }: { t: Messages; lang: Lang }) {
  const bySlug = Object.fromEntries(DESTINATIONS.map((d) => [d.slug, d]));
  const picks = EDITORS_PICKS.map((s) => bySlug[s]).filter((d) => !!d);
  return (
    <ol className="six">
      {picks.map((d, i) => {
        const photo = staticPhotos(d.slug, lang)[0];
        return (
          <li className="rv" style={delay((i % 3) * 0.08)} key={d.slug}>
            <Link className="six-card" href={`/destinations/${d.slug}`}>
              <span className="six-photo">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.src}
                    width={photo.width}
                    height={photo.height}
                    alt={lang === 'id' ? photo.altId : photo.altEn}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ) : null}
                <span className="six-num" aria-hidden="true">
                  {pad(i + 1)}
                </span>
              </span>
              <span className="six-body">
                <span className="mono kicker six-kicker">
                  {d.kabupaten} · {regionName(d.region, lang)}
                </span>
                <span className="display six-name">{d.name}</span>
                <span className="six-foot">
                  <span className="six-more">{t.six.more} →</span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
