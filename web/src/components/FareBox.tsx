import { FARES, fareKey } from '@/lib/fares';
import type { Messages } from '@/lib/messages';

const rp = (n: number, lang: 'id' | 'en') => `Rp${new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US').format(n)}`;

/** Contoh harga bersumber untuk satu pasangan kota asal → bandara gerbang. `onUse` mengisi kalkulator (opsional). */
export function FareBox({ from, to, t, lang, onUse }: { from: string; to: string; t: Messages; lang: 'id' | 'en'; onUse?: (rp: number) => void }) {
  const F = t.fares;
  const f = FARES[fareKey(from, to)];
  if (!f) return <p className="mono small fare-none">{from} → {to}: {F.none}</p>;
  const rows: { k: string; label: string; text: string; use?: number }[] = [];
  if (f.ow) rows.push({ k: 'ow', label: F.ow, text: rp(f.ow, lang) });
  if (f.rtLow) rows.push({ k: 'rt', label: F.rt, text: rp(f.rtLow, lang), use: f.rtLow });
  if (f.rtAvg) rows.push({ k: 'avg', label: F.avg, text: rp(f.rtAvg, lang), use: f.rtAvg });
  if (f.rtRange) rows.push({ k: 'rg', label: F.range, text: `${rp(f.rtRange[0], lang)} – ${rp(f.rtRange[1], lang)}` });
  if (f.usdOw) rows.push({ k: 'uow', label: `${F.ow} (${F.usdNote})`, text: `US$${f.usdOw}` });
  if (f.usdRt) rows.push({ k: 'urt', label: `${F.rt} (${F.usdNote})`, text: `US$${f.usdRt}` });
  return (
    <div className="fare">
      <p className="mono small"><strong>{from} → {to}</strong> · {F.h}</p>
      <ul className="fare-rows">
        {rows.map((r) => (
          <li key={r.k}>
            <span className="mono small">{r.label}</span>
            <strong className="display">{r.text}</strong>
            {onUse && r.use ? <button type="button" className="chip" onClick={() => onUse(r.use!)}>{F.use}</button> : null}
          </li>
        ))}
      </ul>
      <p className="mono small">{f.note[lang]}</p>
      <p className="mono small">
        <a href={f.url} target="_blank" rel="noopener noreferrer">{f.label} ↗</a> ({F.data} {f.asOf})
      </p>
    </div>
  );
}
