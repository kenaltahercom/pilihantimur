'use client';
import { Link } from '@/i18n/navigation';
import { GATEWAYS, ORIGINS, OTHER_MODES, bookingLinks, findOrigin } from '@/lib/origins';
import { INDONESIA_PATH, MAP_H, MAP_W, NEIGHBOR_PATH, project } from '@/lib/indonesia-map';
import type { Messages } from '@/lib/messages';
import { useOrigin } from './useOrigin';
import { FareBox } from './FareBox';

export interface PlanPick {
  slug: string; name: string; kabupaten: string; n: string; gateways: string[];
  budget: { min: number; max: number } | null; photo: { src: string; alt: string } | null;
}

const fmt = (n: number, lang: 'id' | 'en') => new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US').format(n);

export function PlanClient({ t, lang, picks }: { t: Messages; lang: 'id' | 'en'; picks: PlanPick[] }) {
  const P = t.plan;
  const [code, setCode] = useOrigin();
  const origin = findOrigin(code);
  const flores = project(121.2, -8.6);
  const o = origin ? project(origin.lon, origin.lat) : null;
  const arc = o ? `M${o[0]},${o[1]} Q${(o[0] + flores[0]) / 2},${Math.min(o[1], flores[1]) - 60} ${flores[0]},${flores[1]}` : '';
  const groups = new Map<string, typeof ORIGINS>();
  for (const x of ORIGINS) groups.set(x.province, [...(groups.get(x.province) ?? []), x]);

  return (
    <div className="plan">
      <aside className="advisory advisory-warn" role="note">
        <p className="mono kicker">{P.quakeH}</p>
        <p className="mono small">{P.quake}</p>
        <p className="mono small"><a href="https://bpolbf.kemenpar.go.id/boplbf/news/aktivitas-pariwisata-flores-berangsur-pulih-pascagempa-keselamatan-wisatawan-tetap-jadi-prioritas" target="_blank" rel="noopener noreferrer">{P.quakeSrc} ↗</a></p>
      </aside>
      <div className="plan-pick">
        <label className="mono kicker" htmlFor="origin">{P.pick}</label>
        <select id="origin" className="plan-select mono" value={code} onChange={(e) => setCode(e.target.value)}>
          <option value="">{P.pickPh}</option>
          {ORIGINS.map((x) => (
            <option key={x.code} value={x.code}>{x.city} — {x.province}</option>
          ))}
        </select>
        <p className="mono small">{origin ? P.picked.replace('{city}', origin.city) : P.pickHint}</p>
      </div>

      <figure className="pmap" aria-label={P.mapLabel}>
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="group" aria-label={P.mapLabel}>
          <path className="pmap-nb" d={NEIGHBOR_PATH} />
          <path className="pmap-land" d={INDONESIA_PATH} />
          {arc && <path key={code} className="pmap-arc" d={arc} fill="none" />}
          {ORIGINS.map((x) => {
            const [px, py] = project(x.lon, x.lat);
            const on = x.code === code;
            return (
              <g key={x.code} className={`pmap-o${on ? ' on' : ''}`} transform={`translate(${px} ${py})`}>
                <circle r={on ? 7 : 4.5} />
                <circle className="pmap-hit" r="12" tabIndex={0} role="button" aria-label={`${x.city}`} aria-pressed={on}
                  onClick={() => setCode(x.code)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCode(x.code); } }} />
                {(on || x.code === 'CGK' || x.code === 'DJJ' || x.code === 'MDC' || x.code === 'KNO') && <text y="-11" textAnchor={x.lon > 135 ? 'end' : 'middle'} x={x.lon > 135 ? 10 : 0}>{x.city}</text>}
              </g>
            );
          })}
          <g className="pmap-flores" transform={`translate(${flores[0]} ${flores[1]})`}>
            <circle r="9" />
            <text y="26" textAnchor="middle">Flores · NTT</text>
          </g>
        </svg>
        <figcaption className="mono small">{P.mapNote}</figcaption>
      </figure>

      <ol className="plan-list">
        {picks.map((p) => (
          <li key={p.slug} className="plan-card rv">
            <div className="plan-card-head">
              {p.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photo.src} alt={p.photo.alt} width={160} height={120} loading="lazy" decoding="async" />
              )}
              <div>
                <p className="mono kicker">{p.n} · {p.kabupaten}</p>
                <h3 className="display">{p.name}</h3>
                <p className="mono small">{P.gatewayH}: {p.gateways.map((g) => `${GATEWAYS[g]?.city} (${g})`).join(' / ')}</p>
              </div>
            </div>
            {origin ? (
              <div className="plan-check">
                <p className="mono small"><strong>{P.checkH.replace('{city}', origin.city)}</strong></p>
                {p.gateways.map((g) => {
                  const gw = GATEWAYS[g];
                  if (!gw) return null;
                  return (
                    <div key={g}>
                      <p className="plan-links">
                        <span className="mono small">{origin.code} → {gw.code}</span>
                        {bookingLinks(origin, gw).map((l) => (
                          <a key={l.id} className="chip" href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
                        ))}
                      </p>
                      <FareBox from={origin.code} to={gw.code} t={t} lang={lang} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mono small plan-empty">{P.pickHint}</p>
            )}
            <p className="mono small">
              {p.budget ? `${P.local}: Rp${fmt(p.budget.min, lang)}${p.budget.max !== p.budget.min ? ` – ${fmt(p.budget.max, lang)}` : ''} ${P.perPerson}` : P.localNone}
            </p>
            <Link className="pill pill-teal" href={`/destinations/${p.slug}${code ? `?dari=${code}` : ''}`}>{P.calc} →</Link>
          </li>
        ))}
      </ol>

      <aside className="plan-modes">
        <h2 className="display">{P.otherH}</h2>
        <p className="mono small">{P.otherNote}</p>
        <p className="plan-links">
          {OTHER_MODES.map((l) => (
            <a key={l.id} className="chip" href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
          ))}
        </p>
        <p className="mono small">{P.flightsNote}</p>
      </aside>
    </div>
  );
}
