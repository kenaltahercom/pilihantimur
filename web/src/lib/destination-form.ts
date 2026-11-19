export const ACCESS = ['A', 'B', 'C'] as const;
export const DOC_STATUS = ['P0', 'P1', 'P2', 'P3', 'P1/P2'] as const;

export interface LangFields {
  summary: string;
  description: string;
  access_notes: string;
  tips: string;
}
export interface DestinationInput {
  access: string;
  doc_status: string;
  latitude: string;
  longitude: string;
  id: LangFields;
  en: LangFields;
}
export type Valid = { ok: true; latitude: number | null; longitude: number | null } | { ok: false; error: string };

const MAX = { summary: 300, description: 4000, access_notes: 2000, tips: 2000 } as const;

export function validateDestination(i: DestinationInput): Valid {
  if (!(ACCESS as readonly string[]).includes(i.access)) return { ok: false, error: 'Tingkat akses harus A, B, atau C.' };
  if (!(DOC_STATUS as readonly string[]).includes(i.doc_status)) return { ok: false, error: 'Status dokumentasi tidak valid.' };

  const la = i.latitude.trim().replace(',', '.');
  const lo = i.longitude.trim().replace(',', '.');
  let latitude: number | null = null;
  let longitude: number | null = null;
  if (la || lo) {
    if (!la || !lo) return { ok: false, error: 'Isi lintang dan bujur bersamaan, atau kosongkan keduanya.' };
    latitude = Number(la);
    longitude = Number(lo);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return { ok: false, error: 'Lintang harus antara -90 dan 90.' };
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return { ok: false, error: 'Bujur harus antara -180 dan 180.' };
  }
  for (const lang of ['id', 'en'] as const) {
    for (const k of Object.keys(MAX) as (keyof typeof MAX)[]) {
      if (i[lang][k].length > MAX[k]) return { ok: false, error: `Teks "${k}" (${lang.toUpperCase()}) melebihi ${MAX[k]} karakter.` };
    }
  }
  return { ok: true, latitude, longitude };
}

export const hasText = (f: LangFields) => Object.values(f).some((v) => v.trim() !== '');
