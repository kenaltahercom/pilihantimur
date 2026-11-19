/**
 * Contoh harga tiket dari agregator (BUKAN tarif pasti, bukan data resmi maskapai). Dicatat apa adanya dari halaman sumber
 * pada tanggal `asOf`; harga berubah tiap hari. Rute yang belum punya contoh sengaja tidak diisi.
 */
import type { Bi } from './content';

export interface Fare {
  ow?: number;        // sekali jalan termurah (Rp)
  rtLow?: number;     // pulang-pergi termurah (Rp)
  rtAvg?: number;     // rata-rata pulang-pergi (Rp)
  rtRange?: [number, number]; // rentang rata-rata bulanan PP (Rp)
  usdOw?: number; usdRt?: number; // bila sumber memakai dolar AS
  label: string; url: string; asOf: string; note: Bi;
}

export const FARES: Record<string, Fare> = {
  'CGK-LBJ': {
    ow: 1323300, rtLow: 2662800, rtRange: [3348800, 5270400],
    label: 'Trip.com, Jakarta–Labuan Bajo', url: 'https://id.trip.com/flights/airport-cgk-lbj/', asOf: '2026-11-15',
    note: { id: 'Penerbangan langsung ± 2 jam 30 menit. Rata-rata PP per bulan selama 12 bulan: Rp3,35 jt (Mar) sampai Rp5,27 jt (Agu).', en: 'Direct flight ≈ 2h 30m. Monthly round-trip average over 12 months: IDR 3.35m (Mar) to 5.27m (Aug).' },
  },
  'SUB-LBJ': {
    ow: 1509600, rtLow: 3260300, rtAvg: 4254100,
    label: 'Trip.com, Surabaya–Labuan Bajo', url: 'https://id.trip.com/flights/airport-sub-city-lbj/', asOf: '2026-11-15',
    note: { id: 'Sekali jalan termurah memakai 1 transit. Angka di halaman sumber tidak konsisten (PP termurah tertulis Rp3,0–3,3 jt).', en: 'Cheapest one-way has 1 stop. Figures on the source page are inconsistent (cheapest round trip listed at IDR 3.0–3.3m).' },
  },
  'DPS-LBJ': {
    ow: 1038630, rtLow: 2131924,
    label: 'Cheapflights, Denpasar–Labuan Bajo (Batik Air)', url: 'https://www.cheapflights.co.id/flights/Denpasar-DPS/Labuan-Bajo-LBJ.ID.ksp', asOf: '2026-11-14',
    note: { id: 'Penerbangan langsung ± 1 jam 15 menit. Rata-rata semua maskapai di halaman itu Rp2,51 jt (campuran sekali jalan dan PP).', en: 'Direct flight ≈ 1h 15m. The page’s all-airline average is IDR 2.51m (one-way and round trip mixed).' },
  },
  'LOP-LBJ': {
    ow: 1525600, rtLow: 3089300, rtAvg: 4648800,
    label: 'Trip.com, Lombok–Labuan Bajo', url: 'https://id.trip.com/flights/lombok-to-labuan-bajo/airfares-lop-lbj/', asOf: '2026-11-15',
    note: { id: 'Sekali jalan termurah memakai 1 transit (± 4 jam); langsung termurah Rp1.566.500.', en: 'Cheapest one-way has 1 stop (≈ 4 h); cheapest direct is IDR 1,566,500.' },
  },
  'CGK-MOF': {
    usdOw: 215, usdRt: 311,
    label: 'Skyscanner, Jakarta–Maumere', url: 'https://www.skyscanner.com/routes/cgki/mof/jakarta-to-maumere.html', asOf: '2026-11-15',
    note: { id: 'Dalam dolar AS dan belum ada penerbangan langsung (semua 1 transit). Halaman sumber tidak mencantumkan tanggal data.', en: 'In US dollars; no direct flights (all 1 stop). The source page gives no data date.' },
  },
};

export const fareKey = (from: string, to: string) => `${from}-${to}`;
