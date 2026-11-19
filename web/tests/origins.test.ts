import { describe, expect, it } from 'vitest';
import { DEST_GATEWAYS, GATEWAYS, ORIGINS, bookingLinks } from '@/lib/origins';
import { DESTINATIONS } from '@/lib/data';
import { INDONESIA_PATH, MAP_H, MAP_W, project } from '@/lib/indonesia-map';

describe('asal kota & gerbang', () => {
  it('kode unik, koordinat di dalam Indonesia, dan terproyeksi ke dalam peta', () => {
    expect(new Set(ORIGINS.map((o) => o.code)).size).toBe(ORIGINS.length);
    for (const o of ORIGINS) {
      const [x, y] = project(o.lon, o.lat);
      expect(x).toBeGreaterThan(0); expect(x).toBeLessThan(MAP_W);
      expect(y).toBeGreaterThan(0); expect(y).toBeLessThan(MAP_H);
    }
    expect(INDONESIA_PATH.length).toBeGreaterThan(1000);
  });
  it('mencakup banyak provinsi (≥ 20)', () => {
    expect(new Set(ORIGINS.map((o) => o.province)).size).toBeGreaterThanOrEqual(20);
  });
  it('tiap destinasi punya gerbang yang dikenal', () => {
    for (const d of DESTINATIONS) {
      const g = DEST_GATEWAYS[d.slug];
      expect(g?.length).toBeGreaterThan(0);
      for (const c of g!) expect(GATEWAYS[c]).toBeDefined();
    }
  });
  it('tautan tiket valid https dan tidak memuat harga', () => {
    const from = ORIGINS[0]!, to = GATEWAYS.LBJ!;
    for (const l of bookingLinks(from, to)) expect(l.url).toMatch(/^https:\/\//);
  });
});

import { FARES, fareKey } from '@/lib/fares';
describe('contoh harga', () => {
  it('kunci mengacu ke kota asal & gerbang yang ada, tautan https, ada tanggal', () => {
    for (const [k, f] of Object.entries(FARES)) {
      const [o, g] = k.split('-');
      expect(ORIGINS.some((x) => x.code === o)).toBe(true);
      expect(GATEWAYS[g!]).toBeDefined();
      expect(f.url).toMatch(/^https:\/\//);
      expect(f.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(f.ow ?? f.rtLow ?? f.usdOw ?? f.usdRt).toBeGreaterThan(0);
      if (f.rtLow && f.rtAvg) expect(f.rtLow).toBeLessThanOrEqual(f.rtAvg);
    }
    expect(fareKey('CGK', 'LBJ')).toBe('CGK-LBJ');
  });
});
