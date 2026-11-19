// Fungsi murni untuk foto destinasi (mudah diuji): validasi berkas dan kesiapan terbit.

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // sama dengan batas bucket 'media'
export const BUCKET = 'media';

export type ImageType = { mime: 'image/jpeg' | 'image/png' | 'image/webp'; ext: 'jpg' | 'png' | 'webp' };

/** Mengenali format dari isi berkas (bukan dari nama/tipe yang dikirim klien). */
export function sniffImage(b: Uint8Array): ImageType | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' };
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a)
    return { mime: 'image/png', ext: 'png' };
  const tag = (o: number, s: string) => b.length >= o + s.length && [...s].every((c, i) => b[o + i] === c.charCodeAt(0));
  if (b.length >= 12 && tag(0, 'RIFF') && tag(8, 'WEBP')) return { mime: 'image/webp', ext: 'webp' };
  return null;
}

export interface PhotoFields {
  alt_id: string;
  alt_en: string;
  credit: string;
  license: string;
  permission_note: string;
  taken_on: string; // YYYY-MM-DD atau kosong
}

export const EMPTY_PHOTO: PhotoFields = { alt_id: '', alt_en: '', credit: '', license: '', permission_note: '', taken_on: '' };

const LIMITS: Record<keyof PhotoFields, number> = { alt_id: 300, alt_en: 300, credit: 200, license: 200, permission_note: 600, taken_on: 10 };

/** Membersihkan dan memeriksa isian foto (boleh belum lengkap: itu urusan kesiapan terbit). */
export function cleanPhotoFields(raw: Partial<PhotoFields>): { ok: true; value: PhotoFields } | { ok: false; error: string } {
  const value = { ...EMPTY_PHOTO };
  for (const k of Object.keys(LIMITS) as (keyof PhotoFields)[]) {
    const v = (raw[k] ?? '').trim();
    if (v.length > LIMITS[k]) return { ok: false, error: `Isian "${k}" terlalu panjang (maks ${LIMITS[k]} karakter).` };
    value[k] = v;
  }
  if (value.taken_on) {
    const d = new Date(`${value.taken_on}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value.taken_on) || Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value.taken_on)
      return { ok: false, error: 'Tanggal foto harus berformat TTTT-BB-HH.' };
    if (d.getTime() > Date.now() + 86_400_000) return { ok: false, error: 'Tanggal foto tidak boleh di masa depan.' };
  }
  return { ok: true, value };
}

/** Hal yang masih kurang sebelum foto boleh terbit (sama dengan aturan database). */
export function photoMissing(f: PhotoFields): string[] {
  const out: string[] = [];
  if (!f.alt_id.trim()) out.push('teks alternatif (Indonesia)');
  if (!f.alt_en.trim()) out.push('teks alternatif (Inggris)');
  if (!f.credit.trim()) out.push('kredit fotografer/pemilik');
  if (!f.license.trim() && !f.permission_note.trim()) out.push('lisensi atau catatan izin');
  return out;
}

const PATH_RE = /^destinations\/[a-z0-9-]+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;
export const isValidStoragePath = (p: unknown): p is string => typeof p === 'string' && PATH_RE.test(p);

/** URL publik berkas di bucket publik; null bila jalur tidak valid. */
export function publicMediaUrl(baseUrl: string, path: unknown): string | null {
  if (!isValidStoragePath(path)) return null;
  return `${baseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${BUCKET}/${path}`;
}
