// Penilaian awal kepercayaan sumber berdasarkan domain. Ini SARAN untuk status dokumentasi PRD §8
// (P1 resmi, P2 media/direktori, P3 belum jelas). Keputusan akhir tetap di tangan admin.

export type Tier = 'official' | 'academic' | 'media' | 'directory' | 'social' | 'other';
export type DocSuggestion = 'P1' | 'P2' | 'P3';
export interface Trust {
  tier: Tier;
  docStatus: DocSuggestion;
  label: string;
}

const MEDIA = [
  'kompas.com', 'detik.com', 'antaranews.com', 'tempo.co', 'cnnindonesia.com', 'liputan6.com', 'tribunnews.com',
  'kumparan.com', 'republika.co.id', 'mongabay.co.id', 'idntimes.com', 'bbc.com', 'nationalgeographic.com',
  'nationalgeographic.co.id', 'voaindonesia.com', 'mediaindonesia.com', 'suara.com',
];
const DIRECTORY = [
  'tripadvisor.com', 'tripadvisor.co.id', 'traveloka.com', 'tiket.com', 'pegipegi.com', 'lonelyplanet.com',
  'wikivoyage.org', 'wikipedia.org', 'indonesia.travel',
];
const SOCIAL = ['instagram.com', 'facebook.com', 'tiktok.com', 'youtube.com', 'youtu.be', 'x.com', 'twitter.com', 'pinterest.com'];

export function hostOf(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    return u.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

const matches = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);

export function classifyUrl(rawUrl: string): Trust {
  const host = hostOf(rawUrl);
  if (!host) return { tier: 'other', docStatus: 'P3', label: 'Tidak dikenali' };
  // Cocokkan akhiran dengan titik: "evil.go.id.example.com" tidak lolos sebagai situs pemerintah.
  if (matches(host, 'go.id')) return { tier: 'official', docStatus: 'P1', label: 'Situs pemerintah (.go.id)' };
  if (matches(host, 'desa.id')) return { tier: 'official', docStatus: 'P1', label: 'Situs desa (.desa.id)' };
  if (matches(host, 'ac.id')) return { tier: 'academic', docStatus: 'P2', label: 'Akademik (.ac.id)' };
  if (matches(host, 'indonesia.travel')) return { tier: 'official', docStatus: 'P1', label: 'Portal wisata nasional' };
  if (MEDIA.some((d) => matches(host, d))) return { tier: 'media', docStatus: 'P2', label: 'Media' };
  if (DIRECTORY.some((d) => matches(host, d))) return { tier: 'directory', docStatus: 'P2', label: 'Direktori wisata' };
  if (SOCIAL.some((d) => matches(host, d))) return { tier: 'social', docStatus: 'P3', label: 'Media sosial' };
  return { tier: 'other', docStatus: 'P3', label: 'Lainnya (perlu dinilai manual)' };
}

const RANK: Record<Tier, number> = { official: 0, academic: 1, media: 2, directory: 3, other: 4, social: 5 };
export const tierRank = (t: Tier) => RANK[t];

/** Status dokumentasi tertinggi (P1 terbaik) dari sekumpulan sumber; P0 bila tak ada. */
export function bestDocStatus(urls: string[]): 'P0' | DocSuggestion {
  if (!urls.length) return 'P0';
  const order: DocSuggestion[] = ['P1', 'P2', 'P3'];
  const found = new Set(urls.map((u) => classifyUrl(u).docStatus));
  return order.find((s) => found.has(s)) ?? 'P3';
}
