import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { publicMediaUrl } from './media';
import { supabaseEnv } from './supabase/env';

export interface PubText {
  summary: string;
  description: string;
  accessNotes: string;
  tips: string;
}
export interface PubSource {
  title: string;
  url: string | null;
  publisher: string | null;
  accessedOn: string | null;
}
export interface PubPhoto {
  id: string;
  src: string;
  altId: string;
  altEn: string;
  credit: string;
  license: string;
  featured: boolean;
  width?: number;
  height?: number;
}
export interface PublishedDestination {
  slug: string;
  latitude: number | null;
  longitude: number | null;
  verifiedAt: string | null;
  text: { id?: PubText; en?: PubText };
  sources: PubSource[];
  photos: PubPhoto[];
}

type Row = {
  slug?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  verified_at?: unknown;
  destination_translations?: { lang?: unknown; summary?: unknown; description?: unknown; access_notes?: unknown; tips?: unknown }[];
  content_sources?: { title?: unknown; url?: unknown; publisher?: unknown; accessed_on?: unknown }[];
  destination_media?: {
    sort_order?: unknown;
    media_assets?: { id?: unknown; kind?: unknown; status?: unknown; storage_path?: unknown; alt_id?: unknown; alt_en?: unknown; credit?: unknown; license?: unknown; permission_note?: unknown; featured?: unknown } | null;
  }[];
};

const s = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const n = (v: unknown): number | null => (v === null || v === undefined || v === '' ? null : Number.isFinite(Number(v)) ? Number(v) : null);

/** Mengubah baris database menjadi bentuk aman untuk halaman publik (murni, mudah diuji). */
export function mapRow(r: Row, mediaBase?: string): PublishedDestination | null {
  const slug = s(r.slug);
  if (!slug) return null;
  const text: PublishedDestination['text'] = {};
  for (const t of r.destination_translations ?? []) {
    if (t.lang !== 'id' && t.lang !== 'en') continue;
    text[t.lang] = { summary: s(t.summary), description: s(t.description), accessNotes: s(t.access_notes), tips: s(t.tips) };
  }
  let lat = n(r.latitude);
  let lng = n(r.longitude);
  if (lat === null || lng === null || Math.abs(lat) > 90 || Math.abs(lng) > 180) lat = lng = null;
  const photos: PubPhoto[] = [];
  if (mediaBase) {
    const sorted = [...(r.destination_media ?? [])].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
    for (const dm of sorted) {
      const m = dm.media_assets;
      if (!m || m.status !== 'published' || m.kind !== 'photo') continue;
      const src = publicMediaUrl(mediaBase, m.storage_path);
      const id = s(m.id);
      // Foto hanya tampil bila lengkap: alt ID+EN, kredit, dan lisensi/izin (aturan yang sama dengan database).
      if (!src || !id || !s(m.alt_id) || !s(m.alt_en) || !s(m.credit) || !(s(m.license) || s(m.permission_note))) continue;
      photos.push({ id, src, altId: s(m.alt_id), altEn: s(m.alt_en), credit: s(m.credit), license: s(m.license) || s(m.permission_note), featured: m.featured === true });
    }
    photos.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  const httpUrl = (u: unknown) => (typeof u === 'string' && /^https?:\/\//i.test(u) ? u : null);
  return {
    slug,
    latitude: lat,
    longitude: lng,
    verifiedAt: typeof r.verified_at === 'string' ? r.verified_at : null,
    text,
    photos,
    sources: (r.content_sources ?? []).map((c) => ({ title: s(c.title), url: httpUrl(c.url), publisher: s(c.publisher) || null, accessedOn: s(c.accessed_on) || null })).filter((c) => c.title),
  };
}

type Loaded = Map<string, PublishedDestination>;
const TTL_OK = 60_000; // berhasil: pakai ulang 1 menit (build memanggil per halaman)
const TTL_FAIL = 10_000; // gagal: coba lagi segera, tanpa membanjiri log
let memo: { at: number; ttl: number; value: Promise<Loaded> } | null = null;

async function load(): Promise<{ map: Loaded; ok: boolean }> {
  const out: Loaded = new Map();
  const env = supabaseEnv();
  if (!env) return { map: out, ok: true };
  try {
    const sb = createClient(env.url, env.key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await sb
      .from('destinations')
      .select('slug, latitude, longitude, verified_at, destination_translations(lang, summary, description, access_notes, tips), content_sources(title, url, publisher, accessed_on), destination_media(sort_order, media_assets(id, kind, status, storage_path, alt_id, alt_en, credit, license, permission_note, featured))')
      .eq('status', 'published');
    if (error) throw new Error(error.message || 'kueri gagal');
    for (const row of (data ?? []) as Row[]) {
      const d = mapRow(row, env.url);
      if (d) out.set(d.slug, d);
    }
    return { map: out, ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`getPublished gagal (${msg.slice(0, 120)}); memakai daftar kandidat saja.`);
    return { map: new Map(), ok: false };
  }
}

/**
 * Destinasi berstatus published (dibaca sebagai anon; RLS membatasi ke yang terbit).
 * Bila Supabase belum dikonfigurasi atau gagal, mengembalikan kosong sehingga situs tetap tampil
 * dengan daftar kandidat dari data.ts.
 */
export const getPublished = cache(async (): Promise<Loaded> => {
  const now = Date.now();
  if (memo && now - memo.at < memo.ttl) return memo.value;
  const p = load();
  const entry = { at: now, ttl: TTL_OK, value: p.then((r) => r.map) };
  memo = entry;
  void p.then((r) => {
    if (!r.ok) entry.ttl = TTL_FAIL;
  });
  return entry.value;
});

/** Tautan peta OpenStreetMap untuk koordinat tervalidasi. */
export const mapUrl = (lat: number, lng: number) =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;
