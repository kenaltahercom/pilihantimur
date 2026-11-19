'use server';

import { revalidatePath } from 'next/cache';
import { getStaff } from '@/lib/admin-auth';
import { hasText, validateDestination, type DestinationInput } from '@/lib/destination-form';

export type Result<T = undefined> = { ok: true; data?: T; message?: string } | { ok: false; error: string };
const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });
const NOT_ALLOWED = 'Sesi tidak valid atau akun belum diberi akses.';

async function load(slug: string) {
  const staff = await getStaff();
  if (!staff) return { staff: null, dest: null } as const;
  const { data } = await staff.supabase
    .from('destinations')
    .select('id, slug, name, kabupaten, status, verified_at')
    .eq('slug', slug)
    .maybeSingle();
  return { staff, dest: data as { id: string; slug: string; name: string; kabupaten: string; status: string; verified_at: string | null } | null };
}
const refresh = (slug: string) => revalidatePath(`/admin/destinations/${slug}`);
/** Memperbarui halaman publik (ISR) setelah status terbit berubah. */
const refreshPublic = (slug: string) => {
  for (const l of ['id', 'en']) {
    revalidatePath(`/${l}/destinations/${slug}`);
    revalidatePath(`/${l}/destinations`);
  }
};

export async function saveDestination(slug: string, input: DestinationInput): Promise<Result> {
  const { staff, dest } = await load(slug);
  if (!staff) return fail(NOT_ALLOWED);
  if (!dest) return fail('Destinasi tidak ditemukan.');
  if (['published', 'archived'].includes(dest.status) && staff.role !== 'admin')
    return fail('Hanya admin yang boleh mengubah konten yang sudah terbit atau diarsipkan.');
  const v = validateDestination(input);
  if (!v.ok) return fail(v.error);

  // Cek perubahan agar verifikasi lama dicabut bila isi berubah (selama belum terbit).
  const { data: before } = await staff.supabase
    .from('destination_translations')
    .select('lang, summary, description, access_notes, tips')
    .eq('destination_id', dest.id);
  const { data: d0 } = await staff.supabase.from('destinations').select('access, doc_status, latitude, longitude').eq('id', dest.id).single();
  const norm = (x: unknown) => JSON.stringify(x);
  const prevState = norm({ d0: [d0?.access, d0?.doc_status, d0?.latitude === null ? null : Number(d0?.latitude), d0?.longitude === null ? null : Number(d0?.longitude)], t: (before ?? []).map((r: Record<string, unknown>) => [r.lang, r.summary ?? '', r.description ?? '', r.access_notes ?? '', r.tips ?? '']).sort() });
  const rows = (['id', 'en'] as const).map((lang) => ({ destination_id: dest.id, lang, ...input[lang] }));
  const newState = norm({ d0: [input.access, input.doc_status, v.latitude, v.longitude], t: rows.filter((r) => hasText(input[r.lang as 'id' | 'en']) || (before ?? []).some((b: Record<string, unknown>) => b.lang === r.lang)).map((r) => [r.lang, r.summary, r.description, r.access_notes, r.tips]).sort() });
  const changed = prevState !== newState;

  const patch: Record<string, unknown> = { access: input.access, doc_status: input.doc_status, latitude: v.latitude, longitude: v.longitude };
  const revoke = changed && dest.verified_at !== null && dest.status !== 'published';
  if (revoke) patch.verified_at = null;

  const up = await staff.supabase.from('destinations').update(patch).eq('id', dest.id);
  if (up.error) return fail(`Gagal menyimpan: ${up.error.message}`);
  for (const r of rows) {
    if (!hasText(input[r.lang as 'id' | 'en']) && !(before ?? []).some((b: Record<string, unknown>) => b.lang === r.lang)) continue;
    const t = await staff.supabase.from('destination_translations').upsert(r, { onConflict: 'destination_id,lang' });
    if (t.error) return fail(`Gagal menyimpan terjemahan: ${t.error.message}`);
  }
  refresh(slug);
  return { ok: true, message: revoke ? 'Tersimpan. Verifikasi sebelumnya dicabut karena isi berubah.' : 'Tersimpan.' };
}

export async function addSource(slug: string, s: { title: string; url: string; publisher: string }): Promise<Result> {
  const { staff, dest } = await load(slug);
  if (!staff) return fail(NOT_ALLOWED);
  if (!dest) return fail('Destinasi tidak ditemukan.');
  const title = s.title.trim().slice(0, 200);
  const publisher = s.publisher.trim().slice(0, 200);
  let url = s.url.trim();
  if (!title) return fail('Judul sumber wajib diisi.');
  try {
    const u = new URL(url);
    if (!['http:', 'https:'].includes(u.protocol)) throw new Error();
    url = u.toString();
  } catch {
    return fail('URL sumber harus diawali http:// atau https://.');
  }
  const dup = await staff.supabase.from('content_sources').select('id').eq('destination_id', dest.id).eq('url', url).maybeSingle();
  if (dup.data) return fail('Sumber dengan URL ini sudah ada.');
  const ins = await staff.supabase.from('content_sources').insert({
    destination_id: dest.id, title, url, publisher: publisher || null, accessed_on: new Date().toISOString().slice(0, 10), created_by: staff.uid,
  });
  if (ins.error) return fail(`Gagal menambah sumber: ${ins.error.message}`);
  if (dest.verified_at && dest.status !== 'published') await staff.supabase.from('destinations').update({ verified_at: null }).eq('id', dest.id);
  refresh(slug);
  return { ok: true, message: 'Sumber ditambahkan.' };
}

export async function removeSource(slug: string, id: string): Promise<Result> {
  const { staff, dest } = await load(slug);
  if (!staff) return fail(NOT_ALLOWED);
  if (!dest) return fail('Destinasi tidak ditemukan.');
  const del = await staff.supabase.from('content_sources').delete().eq('id', id).eq('destination_id', dest.id);
  if (del.error) return fail(`Gagal menghapus: ${del.error.message}`);
  if (dest.verified_at && dest.status !== 'published') await staff.supabase.from('destinations').update({ verified_at: null }).eq('id', dest.id);
  refresh(slug);
  return { ok: true, message: 'Sumber dihapus.' };
}

export async function markVerified(slug: string, note: string): Promise<Result> {
  const { staff, dest } = await load(slug);
  if (!staff) return fail(NOT_ALLOWED);
  if (staff.role !== 'admin') return fail('Hanya admin yang dapat menandai terverifikasi.');
  if (!dest) return fail('Destinasi tidak ditemukan.');
  const { count } = await staff.supabase.from('content_sources').select('id', { count: 'exact', head: true }).eq('destination_id', dest.id);
  if (!count) return fail('Tambahkan minimal satu sumber sebelum verifikasi.');
  const { data: tr } = await staff.supabase.from('destination_translations').select('summary').eq('destination_id', dest.id).eq('lang', 'id').maybeSingle();
  if (!tr?.summary || !String(tr.summary).trim()) return fail('Isi ringkasan bahasa Indonesia sebelum verifikasi.');
  const now = new Date().toISOString();
  const up = await staff.supabase.from('destinations').update({ verified_at: now }).eq('id', dest.id);
  if (up.error) return fail(`Gagal: ${up.error.message}`);
  await staff.supabase.from('verification_logs').insert({ destination_id: dest.id, verified_by: staff.uid, note: note.trim().slice(0, 500) || null });
  refresh(slug);
  return { ok: true, message: 'Ditandai terverifikasi.' };
}

export async function requestReview(slug: string): Promise<Result> {
  const { staff, dest } = await load(slug);
  if (!staff) return fail(NOT_ALLOWED);
  if (!dest) return fail('Destinasi tidak ditemukan.');
  if (dest.status !== 'draft') return fail('Hanya draf yang bisa diajukan.');
  const { count } = await staff.supabase.from('content_sources').select('id', { count: 'exact', head: true }).eq('destination_id', dest.id);
  if (!count) return fail('Tambahkan minimal satu sumber sebelum mengajukan pemeriksaan.');
  const { data: tr } = await staff.supabase.from('destination_translations').select('summary').eq('destination_id', dest.id).eq('lang', 'id').maybeSingle();
  if (!tr?.summary || !String(tr.summary).trim()) return fail('Isi ringkasan bahasa Indonesia sebelum mengajukan.');
  const up = await staff.supabase.from('destinations').update({ status: 'in_review' }).eq('id', dest.id);
  if (up.error) return fail(`Gagal: ${up.error.message}`);
  refresh(slug);
  return { ok: true, message: 'Diajukan untuk diperiksa admin.' };
}

export async function publishDestination(slug: string): Promise<Result> {
  const { staff, dest } = await load(slug);
  if (!staff) return fail(NOT_ALLOWED);
  if (staff.role !== 'admin') return fail('Hanya admin yang dapat menerbitkan.');
  if (!dest) return fail('Destinasi tidak ditemukan.');
  if (!['draft', 'in_review'].includes(dest.status)) return fail('Hanya draf atau yang menunggu pemeriksaan yang bisa diterbitkan.');
  // Pemeriksaan ramah di aplikasi; aturan sebenarnya dijaga trigger database.
  const { data: trs } = await staff.supabase.from('destination_translations').select('lang, summary').eq('destination_id', dest.id);
  const ok = (l: string) => (trs ?? []).some((t: { lang: string; summary: string | null }) => t.lang === l && (t.summary ?? '').trim() !== '');
  if (!dest.verified_at) return fail('Tandai terverifikasi dulu sebelum menerbitkan.');
  if (!ok('id') || !ok('en')) return fail('Ringkasan bahasa Indonesia dan Inggris wajib terisi sebelum terbit.');
  const up = await staff.supabase.from('destinations').update({ status: 'published' }).eq('id', dest.id);
  if (up.error) return fail(`Gagal menerbitkan: ${up.error.message}`);
  refresh(slug);
  refreshPublic(slug);
  return { ok: true, message: 'Diterbitkan. Halaman publik diperbarui dalam beberapa saat.' };
}

export async function unpublishDestination(slug: string): Promise<Result> {
  const { staff, dest } = await load(slug);
  if (!staff) return fail(NOT_ALLOWED);
  if (staff.role !== 'admin') return fail('Hanya admin yang dapat menarik konten dari situs publik.');
  if (!dest) return fail('Destinasi tidak ditemukan.');
  if (dest.status !== 'published') return fail('Destinasi ini tidak sedang terbit.');
  const up = await staff.supabase.from('destinations').update({ status: 'draft' }).eq('id', dest.id);
  if (up.error) return fail(`Gagal: ${up.error.message}`);
  refresh(slug);
  refreshPublic(slug);
  return { ok: true, message: 'Ditarik dari situs publik dan dikembalikan ke draf.' };
}
