// Data kurasi awal — SUMBER: docs/product/PRD.md §7 dan §8.
// Semua entri adalah KANDIDAT (belum diverifikasi). Tidak ada deskripsi, koordinat,
// atau klaim akses yang diisi di sini; kategori bersifat sementara dan perlu verifikasi.

export type Lang = 'id' | 'en';
export type Access = 'A' | 'B' | 'C';
export type DocStatus = 'P0' | 'P1' | 'P2' | 'P3' | 'P1/P2';
export type CategoryKey = 'beach' | 'lakes' | 'waterfalls' | 'mountains' | 'geo' | 'springs' | 'naturecult' | 'culture';
export type RegionId = 'flores' | 'sumba' | 'timor' | 'alor' | 'lembata' | 'rote' | 'sabu';

export interface Region { id: RegionId; id_name: string; en_name: string }
export interface Destination {
  slug: string; name: string; kabupaten: string; region: RegionId;
  category: CategoryKey | null; access: Access; doc: DocStatus; order: number;
}

export const REGIONS: Region[] = [
  { id: 'flores', id_name: 'Flores dan pulau-pulau sekitarnya', en_name: 'Flores & surrounding islands' },
  { id: 'sumba', id_name: 'Sumba', en_name: 'Sumba' },
  { id: 'timor', id_name: 'Timor dan pulau sekitarnya', en_name: 'Timor & surrounding islands' },
  { id: 'alor', id_name: 'Alor dan Pantar', en_name: 'Alor & Pantar' },
  { id: 'lembata', id_name: 'Lembata dan Solor', en_name: 'Lembata & Solor' },
  { id: 'rote', id_name: 'Rote Ndao', en_name: 'Rote Ndao' },
  { id: 'sabu', id_name: 'Sabu Raijua', en_name: 'Sabu Raijua' },
];

export const CATEGORIES: Record<CategoryKey, Record<Lang, string>> = {
  beach: { id: 'Pantai & Pesisir', en: 'Beach & Coastal Landscape' },
  lakes: { id: 'Danau & Lanskap Vulkanik', en: 'Lakes & Volcanic Landscape' },
  waterfalls: { id: 'Air Terjun', en: 'Waterfalls' },
  mountains: { id: 'Pegunungan & Dataran Tinggi', en: 'Mountains & Highlands' },
  geo: { id: 'Keajaiban Geologi', en: 'Geological Wonders' },
  springs: { id: 'Mata Air & Panas Bumi', en: 'Springs & Geothermal' },
  naturecult: { id: 'Alam & Budaya', en: 'Nature & Culture' },
  culture: { id: 'Budaya & Warisan', en: 'Culture & Heritage' },
};

// [nama, kategori|null, akses, status dokumentasi]
type RawItem = [string, CategoryKey | null, Access, DocStatus];
const RAW: Record<string, [RegionId, RawItem[]]> = {
  'Manggarai Barat': ['flores', [['Taman Nasional Komodo', 'naturecult', 'B', 'P1']]],
  'Manggarai': ['flores', [['Lingko Lodok Cancar', 'naturecult', 'B', 'P1']]],
  'Manggarai Timur': ['flores', [['Danau Rana Mese', 'lakes', 'B', 'P1']]],
  'Ngada': ['flores', [['17 Pulau Riung', 'beach', 'B', 'P3']]],
  'Ende': ['flores', [['Danau Kelimutu', 'lakes', 'B', 'P1']]],
  'Sikka': ['flores', [['Pantai Tanjung Kajuwulu', 'beach', 'A', 'P1']]],
};

export const slugify = (s: string): string =>
  s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const KABUPATEN = Object.keys(RAW);

export const DESTINATIONS: Destination[] = Object.entries(RAW).flatMap(([kab, [region, items]]) =>
  items.map(([name, cat, access, doc], i) => ({
    slug: slugify(name), name, kabupaten: kab, region, category: cat, access, doc, order: i,
  })),
);

// Enam rekomendasi wisata NTT (urutan tampil di beranda).
export const EDITORS_PICKS: string[] = [
  'danau-kelimutu', 'taman-nasional-komodo', 'lingko-lodok-cancar', '17-pulau-riung', 'danau-rana-mese', 'pantai-tanjung-kajuwulu',
];

/** Kawasan yang punya destinasi; kawasan lain disembunyikan dari situs sampai ada rekomendasinya. */
export const ACTIVE_REGIONS: Region[] = REGIONS.filter((r) => DESTINATIONS.some((d) => d.region === r.id));
