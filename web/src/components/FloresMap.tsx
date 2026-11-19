import { Link } from '@/i18n/navigation';
import { DESTINATIONS, EDITORS_PICKS } from '@/lib/data';
import { pad } from '@/lib/utils';
import type { Messages } from '@/lib/messages';

/**
 * Skema garis posisi relatif enam pilihan di Flores (barat → timur). BUKAN peta akurat dan bukan data koordinat:
 * posisi hanya perkiraan kasar untuk orientasi; koordinat resmi menunggu verifikasi.
 */
const BELOW = new Set(['danau-rana-mese', 'danau-kelimutu']);
const END = new Set(['pantai-tanjung-kajuwulu']);
const POS: Record<string, [number, number]> = {
  'taman-nasional-komodo': [60, 150],
  'lingko-lodok-cancar': [190, 118],
  'danau-rana-mese': [300, 132],
  '17-pulau-riung': [430, 70],
  'danau-kelimutu': [640, 172],
  'pantai-tanjung-kajuwulu': [740, 104],
};

export function FloresMap({ t }: { t: Messages }) {
  const pins = EDITORS_PICKS.flatMap((slug, i) => {
    const d = DESTINATIONS.find((x) => x.slug === slug);
    const pos = POS[slug];
    return d && pos ? [{ slug, name: d.name, x: pos[0], y: pos[1], n: pad(i + 1) }] : [];
  });
  const ordered = [...pins].sort((a, b) => a.x - b.x);
  const line = ordered.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <figure className="fmap" aria-label={t.six.mapLabel}>
      <svg viewBox="0 0 800 230" role="group" aria-label={t.six.mapLabel}>
        <polyline className="fmap-line" points={line} fill="none" />
        {ordered.map((p) => (
          <Link key={p.slug} href={`/destinations/${p.slug}`} aria-label={`${p.n} ${p.name}`}>
            <g className="fmap-pin" transform={`translate(${p.x} ${p.y})`}>
              <circle r="16" />
              <text y="5" textAnchor="middle">{p.n}</text>
              <text className="fmap-name" y={BELOW.has(p.slug) ? 40 : -26} textAnchor={END.has(p.slug) ? 'end' : 'middle'} x={END.has(p.slug) ? 18 : 0}>{p.name}</text>
            </g>
          </Link>
        ))}
      </svg>
      <ol className="fmap-legend mono small">
        {pins.map((p) => (
          <li key={p.slug}>
            <span className="fmap-n">{p.n}</span> {p.name}
          </li>
        ))}
      </ol>
      <figcaption className="mono small">{t.six.mapNote}</figcaption>
    </figure>
  );
}
