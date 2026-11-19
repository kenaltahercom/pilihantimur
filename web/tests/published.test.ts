import { describe, expect, it } from 'vitest';
import { mapRow, mapUrl } from '../src/lib/published';

describe('mapRow', () => {
  it('memetakan terjemahan, koordinat, dan sumber', () => {
    const d = mapRow({
      slug: 'danau-kelimutu',
      latitude: '-8.4905',
      longitude: 119.8777,
      verified_at: '2026-11-06T01:00:00Z',
      destination_translations: [
        { lang: 'id', summary: ' Ringkasan ', description: 'Isi', access_notes: null, tips: undefined },
        { lang: 'en', summary: 'Summary' },
        { lang: 'fr', summary: 'abaikan' },
      ],
      content_sources: [{ title: 'Dinas', url: 'https://a.go.id/x', publisher: 'Disparbud', accessed_on: '2026-11-06' }],
    });
    expect(d?.latitude).toBe(-8.4905);
    expect(d?.text.id?.summary).toBe('Ringkasan');
    expect(d?.text.en?.summary).toBe('Summary');
    expect(Object.keys(d?.text ?? {}).sort()).toEqual(['en', 'id']);
    expect(d?.sources[0]?.publisher).toBe('Disparbud');
  });
  it('menolak baris tanpa slug dan membuang koordinat tak valid', () => {
    expect(mapRow({})).toBeNull();
    const d = mapRow({ slug: 'x', latitude: 95, longitude: 10 });
    expect(d?.latitude).toBeNull();
    expect(d?.longitude).toBeNull();
    expect(mapRow({ slug: 'x', latitude: 'abc', longitude: 1 })?.latitude).toBeNull();
  });
  it('hanya meneruskan URL http(s) dan membuang sumber tanpa judul', () => {
    const d = mapRow({
      slug: 'x',
      content_sources: [
        { title: 'Aman', url: 'javascript:alert(1)' },
        { title: '', url: 'https://a.go.id' },
        { title: 'Ok', url: 'https://a.go.id' },
      ],
    });
    expect(d?.sources.map((s) => [s.title, s.url])).toEqual([['Aman', null], ['Ok', 'https://a.go.id']]);
  });
  it('mapUrl membentuk tautan OpenStreetMap', () => {
    expect(mapUrl(-8.5, 119.9)).toBe('https://www.openstreetmap.org/?mlat=-8.5&mlon=119.9#map=14/-8.5/119.9');
  });
});
