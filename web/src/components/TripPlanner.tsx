import type { Content } from '@/lib/content';
import type { Messages } from '@/lib/messages';
import { CountUp } from './CountUp';
import { delay } from './ui';
import { TripCalculator } from './TripCalculator';
import { DEST_GATEWAYS } from '@/lib/origins';

type Lang = 'id' | 'en';

export function TripPlanner({ c, t, lang, slug }: { c: Content; t: Messages; lang: Lang; slug: string }) {
  const T = t.trip;
  const b = c.budget;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapQuery)}`;
  return (
    <article className="dsec rv trip" aria-labelledby="trip-h">
      <h2 id="trip-h" className="display">{T.h}</h2>
      {c.advisory && (
        <aside className={`advisory advisory-${c.advisory.level}`} role="note">
          <p className="mono kicker">{c.advisory.level === 'warn' ? T.advWarn : T.advInfo}</p>
          <p className="mono small">{c.advisory.text[lang]}</p>
          <p className="mono small">
            {T.asOf} {c.advisory.asOf} · {T.src}: <a href={c.sources[c.advisory.src]?.url} target="_blank" rel="noopener noreferrer">{c.sources[c.advisory.src]?.label} ↗</a>
          </p>
        </aside>
      )}
      <p className="mono small"><span className="chip chip-doc">{T.warn}</span></p>

      <ol className="route" aria-label={T.routeH}>
        {c.steps.map((s, i) => (
          <li className="rv route-step" style={delay(i * 0.12)} key={s.from.id + s.to.id}>
            <span className="route-dot" aria-hidden="true">{i + 1}</span>
            <div className="route-body">
              <p className="route-leg display">{s.from[lang]} <span aria-hidden="true">→</span><span className="sr-only"> {T.to} </span> {s.to[lang]}</p>
              <p className="mono small">{s.how[lang]}</p>
              {(s.time || s.cost) && (
                <p className="route-meta">
                  {s.time && <span className="chip">{s.time[lang]}</span>}
                  {s.cost && <span className="chip chip-cost">{s.cost[lang]}</span>}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {c.facts.length > 0 && (
        <dl className="trip-facts">
          {c.facts.map((f, i) => (
            <div className="rv" style={delay(i * 0.08)} key={f.label.id}>
              <dt className="mono small">{f.label[lang]}</dt>
              <dd className="display">{f.value[lang]}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="budget rv">
        <p className="mono kicker">{T.budgetH}</p>
        {b ? (
          <>
            <p className="budget-num display">
              <span className="budget-cur">Rp</span>
              <CountUp to={b.min} locale={lang} />
              {b.max !== b.min && (
                <>
                  <span className="budget-dash" aria-hidden="true"> – </span>
                  <span className="sr-only"> {T.toRange} </span>
                  <CountUp to={b.max} locale={lang} />
                </>
              )}
              <span className="budget-per mono"> {T.perPerson}</span>
            </p>
            <p className="mono small">{T.basis}: {b.basis[lang]}</p>
            {b.extra && <p className="mono small budget-extra">+ {b.extra[lang]}</p>}
          </>
        ) : (
          <p className="mono">{T.budgetNone}</p>
        )}
        <p className="mono small budget-note">{T.budgetNote}</p>
      </div>

      <TripCalculator t={t} lang={lang} gateways={DEST_GATEWAYS[slug] ?? []} budget={b ? { min: b.min, max: b.max } : null} />

      <p>
        <a className="pill pill-teal" href={mapUrl} target="_blank" rel="noopener noreferrer">{T.openMap} ↗</a>
      </p>
      <p className="mono small">{T.mapNote}</p>
    </article>
  );
}
