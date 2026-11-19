import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT } from '@/lib/content';
import { DESTINATIONS } from '@/lib/data';

describe('isi editorial 6 destinasi', () => {
  it('setiap destinasi punya isi', () => {
    expect(Object.keys(CONTENT).sort()).toEqual(DESTINATIONS.map((d) => d.slug).sort());
  });
  for (const [slug, c] of Object.entries(CONTENT)) {
    it(`${slug}: teks ID+EN, sumber, catatan biaya`, () => {
      for (const b of [c.summary, c.description, c.access, c.costNote]) {
        expect(b.id.length).toBeGreaterThan(10);
        expect(b.en.length).toBeGreaterThan(10);
      }
      expect(c.sources.length).toBeGreaterThan(0);
      for (const s of c.sources) {
        expect(s.url).toMatch(/^https:\/\//);
        expect(s.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
      expect(c.costs.length).toBeGreaterThan(0);
      for (const i of c.costs) expect(c.sources[i.src]).toBeDefined();
    });
  }
});

describe('rute & anggaran', () => {
  for (const [slug, c] of Object.entries(CONTENT)) {
    it(`${slug}: kueri peta, rute, anggaran masuk akal`, () => {
      expect(c.mapQuery).toMatch(/NTT$/);
      expect(c.steps.length).toBeGreaterThan(0);
      for (const s of c.steps) expect(s.how.id && s.how.en).toBeTruthy();
      if (c.budget) {
        expect(c.budget.min).toBeLessThanOrEqual(c.budget.max);
        expect(c.budget.basis.id && c.budget.basis.en).toBeTruthy();
      }
    });
  }
});

describe('peringatan & sumber', () => {
  for (const [slug, c] of Object.entries(CONTENT)) {
    it(`${slug}: peringatan merujuk sumber yang ada`, () => {
      if (c.advisory) {
        expect(c.sources[c.advisory.src]).toBeDefined();
        expect(c.advisory.text.id.length).toBeGreaterThan(20);
        expect(c.advisory.text.en.length).toBeGreaterThan(20);
        expect(c.advisory.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });
  }
  it('Kelimutu & Riung punya peringatan tingkat warn pascagempa', () => {
    expect(CONTENT['danau-kelimutu']?.advisory?.level).toBe('warn');
    expect(CONTENT['17-pulau-riung']?.advisory?.level).toBe('warn');
  });
  it('video berkas ada di public/ dan punya judul ID+EN', () => {
    for (const [slug, c] of Object.entries(CONTENT)) {
      for (const v of c.videos) {
        expect(v.title.id.length, slug).toBeGreaterThan(3);
        expect(v.title.en.length, slug).toBeGreaterThan(3);
        if (v.kind === 'file') {
          expect(existsSync(join(process.cwd(), 'public', v.src)), `${slug} ${v.src}`).toBe(true);
          if (v.poster) expect(existsSync(join(process.cwd(), 'public', v.poster)), `${slug} ${v.poster}`).toBe(true);
        }
      }
    }
  });
});
