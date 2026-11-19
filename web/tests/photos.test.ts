import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PHOTOS, staticPhotos } from '../src/lib/photos';
import { DESTINATIONS } from '../src/lib/data';

const SLUGS = new Set(DESTINATIONS.map((d) => d.slug));

describe('foto terpasang', () => {
  it('semua slug dikenal dan berkas ada, berformat JPEG', () => {
    for (const [slug, list] of Object.entries(PHOTOS)) {
      expect(SLUGS.has(slug), slug).toBe(true);
      for (const p of list) {
        const f = join(__dirname, '..', 'public', 'photos', slug, p.file);
        expect(existsSync(f), f).toBe(true);
        const head = readFileSync(f).subarray(0, 3);
        expect([...head]).toEqual([0xff, 0xd8, 0xff]);
      }
    }
  });
  it('tiap foto punya alt ID+EN, kredit, dan ukuran; tanpa duplikat berkas', () => {
    for (const [slug, list] of Object.entries(PHOTOS)) {
      expect(new Set(list.map((p) => p.file)).size, slug).toBe(list.length);
      for (const p of list) {
        expect(p.altId.trim().length, `${slug}/${p.file} alt ID`).toBeGreaterThan(15);
        expect(p.altEn.trim().length, `${slug}/${p.file} alt EN`).toBeGreaterThan(15);
        expect(p.credit.trim(), `${slug}/${p.file} kredit`).not.toBe('');
        expect(p.w).toBeGreaterThan(0);
        expect(p.h).toBeGreaterThan(0);
      }
    }
  });
  it('foto pertama jadi foto utama dan lisensi mengikuti bahasa', () => {
    const id = staticPhotos('taman-nasional-komodo', 'id');
    const en = staticPhotos('taman-nasional-komodo', 'en');
    expect(id[0]?.featured).toBe(true);
    expect(id.slice(1).every((p) => !p.featured)).toBe(true);
    expect(id[0]?.license).toBe('Berlisensi');
    expect(en[0]?.license).toBe('Licensed');
    expect(staticPhotos('slug-tak-ada', 'id')).toEqual([]);
  });
});
