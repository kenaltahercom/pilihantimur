import { describe, expect, it } from 'vitest';
import { cleanPhotoFields, isValidStoragePath, photoMissing, publicMediaUrl, sniffImage, EMPTY_PHOTO } from '../src/lib/media';
import { mapRow } from '../src/lib/published';

const UUID = '3f2b8c1e-5a4d-4e7b-9c10-1234567890ab';
const base = 'https://x.supabase.co';
const good = { id: UUID, kind: 'photo', status: 'published', storage_path: `destinations/pantai-pede/${UUID}.jpg`, alt_id: 'Pantai', alt_en: 'Beach', credit: 'A. Fotografer', license: 'CC BY 4.0', permission_note: null, featured: false };

describe('sniffImage', () => {
  it('mengenali JPEG, PNG, WebP dari isi berkas', () => {
    expect(sniffImage(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]))?.ext).toBe('jpg');
    expect(sniffImage(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]))?.ext).toBe('png');
    const ascii = (t: string) => [...t].map((c) => c.charCodeAt(0));
    expect(sniffImage(Uint8Array.from([...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WEBP')]))?.ext).toBe('webp');
    expect(sniffImage(Uint8Array.from([...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WAVE')]))).toBeNull();
  });
  it('menolak SVG, HTML, dan berkas kosong meski bernama .jpg', () => {
    expect(sniffImage(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"/>'))).toBeNull();
    expect(sniffImage(new TextEncoder().encode('<html>'))).toBeNull();
    expect(sniffImage(new Uint8Array())).toBeNull();
  });
});

describe('isian foto', () => {
  it('foto belum bisa terbit tanpa alt, kredit, dan lisensi/izin', () => {
    expect(photoMissing(EMPTY_PHOTO)).toHaveLength(4);
    expect(photoMissing({ ...EMPTY_PHOTO, alt_id: 'a', alt_en: 'b', credit: 'c', permission_note: 'izin tertulis' })).toEqual([]);
    expect(photoMissing({ ...EMPTY_PHOTO, alt_id: 'a', alt_en: 'b', credit: 'c' })).toEqual(['lisensi atau catatan izin']);
  });
  it('membersihkan spasi, membatasi panjang, dan memeriksa tanggal', () => {
    const ok = cleanPhotoFields({ credit: '  Budi  ', taken_on: '2026-02-03' });
    expect(ok.ok && ok.value.credit).toBe('Budi');
    expect(cleanPhotoFields({ credit: 'x'.repeat(201) }).ok).toBe(false);
    expect(cleanPhotoFields({ taken_on: '2026-02-30' }).ok).toBe(false);
    expect(cleanPhotoFields({ taken_on: '3026-01-01' }).ok).toBe(false);
    expect(cleanPhotoFields({ taken_on: 'kemarin' }).ok).toBe(false);
  });
});

describe('jalur penyimpanan', () => {
  it('hanya menerima jalur destinasi/uuid.ext', () => {
    expect(isValidStoragePath(`destinations/pantai-pede/${UUID}.webp`)).toBe(true);
    for (const bad of ['../x.jpg', `destinations/../${UUID}.jpg`, `destinations/a/${UUID}.svg`, 'https://evil.test/x.jpg', null, 5]) expect(isValidStoragePath(bad)).toBe(false);
  });
  it('membentuk URL publik bucket dari jalur, bukan dari kolom url', () => {
    expect(publicMediaUrl(`${base}/`, `destinations/a/${UUID}.png`)).toBe(`${base}/storage/v1/object/public/media/destinations/a/${UUID}.png`);
    expect(publicMediaUrl(base, 'x')).toBeNull();
  });
});

describe('mapRow foto', () => {
  const row = (m: object, sort = 1) => ({ slug: 'x', destination_media: [{ sort_order: sort, media_assets: m }] });
  it('menampilkan foto terbit yang lengkap', () => {
    expect(mapRow(row(good), base)?.photos[0]?.src).toContain(`/object/public/media/destinations/pantai-pede/${UUID}.jpg`);
  });
  it('tanpa mediaBase tidak ada foto', () => {
    expect(mapRow(row(good))?.photos).toEqual([]);
  });
  it('membuang foto draf, tak lengkap, bukan foto, atau jalur aneh', () => {
    for (const bad of [{ ...good, status: 'draft' }, { ...good, credit: ' ' }, { ...good, alt_en: '' }, { ...good, license: '', permission_note: '' }, { ...good, kind: 'video' }, { ...good, storage_path: 'https://evil.test/a.jpg' }])
      expect(mapRow(row(bad), base)?.photos).toEqual([]);
  });
  it('izin tertulis cukup sebagai pengganti lisensi, dan foto utama didahulukan', () => {
    const d = mapRow({ slug: 'x', destination_media: [
      { sort_order: 1, media_assets: { ...good, id: 'a1', storage_path: `destinations/x/${UUID}.jpg` } },
      { sort_order: 2, media_assets: { ...good, id: 'b2', license: '', permission_note: 'Izin tertulis dinas', featured: true, storage_path: `destinations/x/${UUID.replace('3f2b', '4f2b')}.jpg` } },
    ] }, base);
    expect(d?.photos.map((p) => p.id)).toEqual(['b2', 'a1']);
    expect(d?.photos[0]?.license).toBe('Izin tertulis dinas');
  });
});
