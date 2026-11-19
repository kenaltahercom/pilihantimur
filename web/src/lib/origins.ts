/**
 * Kota asal (seluruh Indonesia) dan bandara gerbang di Flores/NTT untuk fitur "Rencana".
 * Koordinat kota = titik kasar kota/bandara (hanya untuk menggambar peta), bukan data destinasi.
 * Pasangan bandara gerbang ↔ destinasi adalah USULAN orientasi, belum diverifikasi; tarif tidak disimpan di sini:
 * harga tiket selalu dicek pengunjung lewat situs penyedia (lihat `bookingLinks`).
 */
export interface Origin { code: string; city: string; province: string; lon: number; lat: number }
export interface Gateway { code: string; city: string; airport: string; lon: number; lat: number }

export const ORIGINS: Origin[] = [
  { code: 'BTJ', city: 'Banda Aceh', province: 'Aceh', lon: 95.32, lat: 5.55 },
  { code: 'KNO', city: 'Medan', province: 'Sumatera Utara', lon: 98.67, lat: 3.59 },
  { code: 'PDG', city: 'Padang', province: 'Sumatera Barat', lon: 100.35, lat: -0.95 },
  { code: 'PKU', city: 'Pekanbaru', province: 'Riau', lon: 101.45, lat: 0.51 },
  { code: 'BTH', city: 'Batam', province: 'Kepulauan Riau', lon: 104.03, lat: 1.12 },
  { code: 'PLM', city: 'Palembang', province: 'Sumatera Selatan', lon: 104.75, lat: -2.99 },
  { code: 'TKG', city: 'Bandar Lampung', province: 'Lampung', lon: 105.26, lat: -5.43 },
  { code: 'CGK', city: 'Jakarta', province: 'DKI Jakarta', lon: 106.82, lat: -6.2 },
  { code: 'BDO', city: 'Bandung', province: 'Jawa Barat', lon: 107.61, lat: -6.91 },
  { code: 'SRG', city: 'Semarang', province: 'Jawa Tengah', lon: 110.42, lat: -6.97 },
  { code: 'YIA', city: 'Yogyakarta', province: 'DI Yogyakarta', lon: 110.36, lat: -7.8 },
  { code: 'SUB', city: 'Surabaya', province: 'Jawa Timur', lon: 112.75, lat: -7.25 },
  { code: 'MLG', city: 'Malang', province: 'Jawa Timur', lon: 112.63, lat: -7.98 },
  { code: 'DPS', city: 'Denpasar', province: 'Bali', lon: 115.22, lat: -8.65 },
  { code: 'LOP', city: 'Lombok (Mataram)', province: 'Nusa Tenggara Barat', lon: 116.11, lat: -8.58 },
  { code: 'PNK', city: 'Pontianak', province: 'Kalimantan Barat', lon: 109.34, lat: -0.03 },
  { code: 'BDJ', city: 'Banjarmasin', province: 'Kalimantan Selatan', lon: 114.59, lat: -3.32 },
  { code: 'BPN', city: 'Balikpapan', province: 'Kalimantan Timur', lon: 116.83, lat: -1.27 },
  { code: 'UPG', city: 'Makassar', province: 'Sulawesi Selatan', lon: 119.41, lat: -5.15 },
  { code: 'PLW', city: 'Palu', province: 'Sulawesi Tengah', lon: 119.87, lat: -0.9 },
  { code: 'KDI', city: 'Kendari', province: 'Sulawesi Tenggara', lon: 122.51, lat: -3.97 },
  { code: 'MDC', city: 'Manado', province: 'Sulawesi Utara', lon: 124.84, lat: 1.47 },
  { code: 'AMQ', city: 'Ambon', province: 'Maluku', lon: 128.19, lat: -3.7 },
  { code: 'TTE', city: 'Ternate', province: 'Maluku Utara', lon: 127.38, lat: 0.79 },
  { code: 'SOQ', city: 'Sorong', province: 'Papua Barat Daya', lon: 131.26, lat: -0.88 },
  { code: 'DJJ', city: 'Jayapura', province: 'Papua', lon: 140.7, lat: -2.53 },
  { code: 'KOE', city: 'Kupang', province: 'Nusa Tenggara Timur', lon: 123.61, lat: -10.17 },
];

export const GATEWAYS: Record<string, Gateway> = {
  LBJ: { code: 'LBJ', city: 'Labuan Bajo', airport: 'Bandara Komodo', lon: 119.89, lat: -8.49 },
  ENE: { code: 'ENE', city: 'Ende', airport: 'Bandara H. Hasan Aroeboesman', lon: 121.66, lat: -8.85 },
  MOF: { code: 'MOF', city: 'Maumere', airport: 'Bandara Frans Seda', lon: 122.24, lat: -8.64 },
};

/** Gerbang yang disarankan per destinasi (orientasi, belum diverifikasi). Urutan = prioritas. */
export const DEST_GATEWAYS: Record<string, string[]> = {
  'taman-nasional-komodo': ['LBJ'],
  'lingko-lodok-cancar': ['LBJ'],
  'danau-rana-mese': ['LBJ'],
  '17-pulau-riung': ['LBJ'],
  'danau-kelimutu': ['ENE', 'MOF'],
  'pantai-tanjung-kajuwulu': ['MOF'],
};

export interface Link { id: string; label: string; url: string }

/** Tautan ke penyedia informasi/tiket. Semua dibuka di tab baru; harga dicek langsung di sana. */
export function bookingLinks(from: Origin, to: Gateway): Link[] {
  const q = encodeURIComponent(`Flights from ${from.code} to ${to.code}`);
  return [
    { id: 'gflights', label: 'Google Flights', url: `https://www.google.com/travel/flights?q=${q}` },
    { id: 'skyscanner', label: 'Skyscanner', url: `https://www.skyscanner.co.id/transport/flights/${from.code.toLowerCase()}/${to.code.toLowerCase()}/` },
    { id: 'traveloka', label: 'Traveloka', url: 'https://www.traveloka.com/id-id/flight' },
    { id: 'tiket', label: 'tiket.com', url: 'https://www.tiket.com/pesawat' },
  ];
}

/** Moda lain, tautan ke situs resmi/penyedia (tanpa tarif di sini). */
export const OTHER_MODES: Link[] = [
  { id: 'pelni', label: 'PELNI (kapal laut)', url: 'https://www.pelni.co.id' },
  { id: 'asdp', label: 'ASDP (feri)', url: 'https://www.asdp.id' },
  { id: 'kai', label: 'KAI (kereta, untuk Jawa/Sumatera)', url: 'https://kai.id' },
];

export const findOrigin = (code: string | null | undefined) => ORIGINS.find((o) => o.code === code);
