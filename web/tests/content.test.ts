import { describe, expect, it } from 'vitest';
import id from '../messages/id.json';
import en from '../messages/en.json';
import { DESTINATIONS, EDITORS_PICKS, REGIONS } from '../src/lib/data';

const keys = (o: unknown, p = ''): string[] =>
  Array.isArray(o)
    ? [`${p}[${o.length}]`, ...o.flatMap((v, i) => keys(v, `${p}[${i}]`))]
    : o && typeof o === 'object'
      ? Object.entries(o).flatMap(([k, v]) => keys(v, p ? `${p}.${k}` : k))
      : [p];

describe('pesan ID/EN', () => {
  it('memiliki struktur kunci yang sama', () => {
    expect(keys(en).sort()).toEqual(keys(id).sort());
  });
});

describe('data destinasi', () => {
  it('berisi 6 rekomendasi', () => expect(DESTINATIONS).toHaveLength(6));
  it('slug unik', () => expect(new Set(DESTINATIONS.map((d) => d.slug)).size).toBe(DESTINATIONS.length));
  it('region valid', () => {
    const ids = new Set(REGIONS.map((r) => r.id));
    for (const d of DESTINATIONS) expect(ids.has(d.region)).toBe(true);
  });
  it('pilihan editor merujuk slug yang ada', () => {
    const slugs = new Set(DESTINATIONS.map((d) => d.slug));
    for (const p of EDITORS_PICKS) expect(slugs.has(typeof p === 'string' ? p : (p as { slug: string }).slug)).toBe(true);
  });
});
