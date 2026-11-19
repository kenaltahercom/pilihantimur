'use client';
import { useMemo } from 'react';
import { GATEWAYS, ORIGINS, OTHER_MODES, bookingLinks, findOrigin } from '@/lib/origins';
import type { Messages } from '@/lib/messages';
import { CountUp } from './CountUp';
import { useOrigin } from './useOrigin';
import { useStoredString } from './localStore';
import { FareBox } from './FareBox';

const KEY = 'pt-calc';
type St = { fare: string; people: string; nights: string; lodging: string; meals: string };
const INIT: St = { fare: '', people: '2', nights: '3', lodging: '', meals: '' };
const num = (s: string) => { const n = Number(s.replace(/[^\d]/g, '')); return Number.isFinite(n) ? n : 0; };

/** Kalkulator biaya dari kota asal. Harga tiket/penginapan/makan DIISI pengunjung (tarif berubah-ubah); biaya lokal berasal dari sumber. */
export function TripCalculator({ t, lang, gateways, budget }: { t: Messages; lang: 'id' | 'en'; gateways: string[]; budget: { min: number; max: number } | null }) {
  const C = t.calc;
  const [code, setCode] = useOrigin();
  const [raw, save] = useStoredString(KEY);
  const s = useMemo<St>(() => { try { return { ...INIT, ...(raw ? JSON.parse(raw) : {}) }; } catch { return INIT; } }, [raw]);
  const up = (k: keyof St) => (e: React.ChangeEvent<HTMLInputElement>) => save(JSON.stringify({ ...s, [k]: e.target.value }));
  const origin = findOrigin(code);
  const people = Math.max(1, num(s.people));
  const nights = num(s.nights);
  const fixed = num(s.fare) * people + num(s.lodging) * nights + num(s.meals) * (nights + 1) * people;
  const lo = fixed + (budget?.min ?? 0) * people;
  const hi = fixed + (budget?.max ?? 0) * people;
  const hasFare = num(s.fare) > 0;

  return (
    <article className="dsec rv calc" aria-labelledby="calc-h">
      <h2 id="calc-h" className="display">{C.h}</h2>
      <p className="mono small">{C.intro}</p>

      <div className="calc-grid">
        <label className="calc-f"><span className="mono small">{C.origin}</span>
          <select className="plan-select mono" value={code} onChange={(e) => setCode(e.target.value)}>
            <option value="">{t.plan.pickPh}</option>
            {ORIGINS.map((x) => <option key={x.code} value={x.code}>{x.city} — {x.province}</option>)}
          </select>
        </label>
        <label className="calc-f"><span className="mono small">{C.people}</span>
          <input className="mono" inputMode="numeric" value={s.people} onChange={up('people')} />
        </label>
        <label className="calc-f"><span className="mono small">{C.fare}</span>
          <input className="mono" inputMode="numeric" placeholder="0" value={s.fare} onChange={up('fare')} />
        </label>
        <label className="calc-f"><span className="mono small">{C.nights}</span>
          <input className="mono" inputMode="numeric" value={s.nights} onChange={up('nights')} />
        </label>
        <label className="calc-f"><span className="mono small">{C.lodging}</span>
          <input className="mono" inputMode="numeric" placeholder="0" value={s.lodging} onChange={up('lodging')} />
        </label>
        <label className="calc-f"><span className="mono small">{C.meals}</span>
          <input className="mono" inputMode="numeric" placeholder="0" value={s.meals} onChange={up('meals')} />
        </label>
      </div>

      {origin && (
        <div className="calc-links">
          <p className="mono small"><strong>{C.check.replace('{city}', origin.city)}</strong></p>
          {gateways.map((g) => {
            const gw = GATEWAYS[g];
            return gw ? (
              <div key={g}>
                <p className="plan-links">
                  <span className="mono small">{origin.code} → {gw.code} ({gw.city})</span>
                  {bookingLinks(origin, gw).map((l) => <a key={l.id} className="chip" href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>)}
                </p>
                <FareBox from={origin.code} to={gw.code} t={t} lang={lang} onUse={(v) => save(JSON.stringify({ ...s, fare: String(v) }))} />
              </div>
            ) : null;
          })}
          <p className="mono small">{t.fares.disc}</p>
          <p className="plan-links">
            {OTHER_MODES.map((l) => <a key={l.id} className="chip" href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>)}
          </p>
        </div>
      )}

      <div className="budget calc-total" aria-live="polite">
        <p className="mono kicker">{C.total.replace('{n}', String(people))}</p>
        {hasFare || fixed > 0 ? (
          <p className="budget-num display">
            <span className="budget-cur">Rp</span>
            <CountUp key={`${lo}-${hi}`} to={lo} locale={lang} />
            {hi !== lo && <><span className="budget-dash" aria-hidden="true"> – </span><span className="sr-only"> {t.trip.toRange} </span><CountUp key={`h${lo}-${hi}`} to={hi} locale={lang} /></>}
          </p>
        ) : (
          <p className="mono">{C.fillFare}</p>
        )}
        <p className="mono small">{C.formula}</p>
        {!hasFare && <p className="mono small budget-extra">{C.noFare}</p>}
        <p className="mono small budget-note">{C.disclaimer}</p>
      </div>
    </article>
  );
}
