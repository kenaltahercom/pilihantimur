'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getStaff } from '@/lib/admin-auth';
import { BUCKET, MAX_PHOTO_BYTES, cleanPhotoFields, photoMissing, sniffImage, type PhotoFields } from '@/lib/media';

export type Result = { ok: true; message?: string } | { ok: false; error: string };
const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });
const NOT_ALLOWED = 'Sesi tidak valid atau akun belum diberi akses.';
const MAX_PHOTOS = 12;

async function load(slug: string) {
  const staff = await getStaff();
  if (!staff) return { staff: null, dest: null } as const;
  const { data } = await staff.supabase.from('destinations').select('id, slug, status').eq('slug', slug).maybeSingle();
  return { staff, dest: data as { id: string; slug: string; status: string } | null };
}

/** Foto milik destinasi ini (mencegah mengubah media destinasi lain lewat id tebakan). */
async function loadPhoto(slug: string, mediaId: string) {
  const ctx = await load(slug);
  if (!ctx.staff) return { ...ctx, photo: null, error: NOT_ALLOWED } as const;
  if (!ctx.dest) return { ...ctx, photo: null, error: 'Destinasi tidak ditemukan.' } as const;
  const { data } = await ctx.staff.supabase
    .from('destination_media')
    .select('media_assets(id, status, storage_path, alt_id, alt_en, credit, license, permission_note)')
    .eq('destination_id', ctx.dest.id)
    .eq('media_id', mediaId)
    .maybeSingle();
  const m = (data as { media_assets: { id: string; status: string; storage_path: string | null; alt_id: string | null; alt_en: string | null; credit: string | null; license: string | null; permission_note: string | null } | null } | null)?.media_assets;
  if (!m) return { ...ctx, photo: null, error: 'Foto tidak ditemukan pada destinasi ini.' } as const;
  return { ...ctx, photo: m, error: null } as const;
}

const refresh = (slug: string) => revalidatePath(`/admin/destinations/${slug}`);
const refreshPublic = (slug: string) => {
  for (const l of ['id', 'en']) revalidatePath(`/${l}/destinations/${slug}`);
};
const fieldsFrom = (fd: FormData): Partial<PhotoFields> => {
  const g = (k: string) => (typeof fd.get(k) === 'string' ? (fd.get(k) as string) : '');
  return { alt_id: g('alt_id'), alt_en: g('alt_en'), credit: g('credit'), license: g('license'), permission_note: g('permission_note'), taken_on: g('taken_on') };
};

/** Mengunggah foto sebagai DRAF. Terbit dilakukan terpisah oleh admin setelah lisensi/kredit lengkap. */
export async function addPhoto(slug: string, fd: FormData): Promise<Result> {
  const { staff, dest } = await load(slug);
  if (!staff) return fail(NOT_ALLOWED);
  if (!dest) return fail('Destinasi tidak ditemukan.');
  if (['published', 'archived'].includes(dest.status) && staff.role !== 'admin')
    return fail('Hanya admin yang boleh mengubah konten yang sudah terbit atau diarsipkan.');

  const file = fd.get('file');
  if (!(file instanceof File) || file.size === 0) return fail('Pilih berkas foto terlebih dahulu.');
  if (file.size > MAX_PHOTO_BYTES) return fail('Ukuran foto maksimal 5 MB.');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImage(bytes);
  if (!type) return fail('Format tidak didukung. Gunakan JPG, PNG, atau WebP.');
  const f = cleanPhotoFields(fieldsFrom(fd));
  if (!f.ok) return fail(f.error);

  const { count } = await staff.supabase.from('destination_media').select('media_id', { count: 'exact', head: true }).eq('destination_id', dest.id);
  if ((count ?? 0) >= MAX_PHOTOS) return fail(`Maksimal ${MAX_PHOTOS} foto per destinasi.`);

  const id = randomUUID();
  const path = `destinations/${dest.slug}/${id}.${type.ext}`;
  const up = await staff.supabase.storage.from(BUCKET).upload(path, bytes, { contentType: type.mime, upsert: false, cacheControl: '31536000' });
  if (up.error) return fail(`Gagal mengunggah: ${up.error.message}`);
  const pub = staff.supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const ins = await staff.supabase.from('media_assets').insert({
    id, kind: 'photo', url: pub, storage_path: path, status: 'draft', created_by: staff.uid,
    title: file.name.slice(0, 200) || null, ...f.value, taken_on: f.value.taken_on || null,
  });
  if (ins.error) {
    await staff.supabase.storage.from(BUCKET).remove([path]);
    return fail(`Gagal menyimpan data foto: ${ins.error.message}`);
  }
  const link = await staff.supabase.from('destination_media').insert({ destination_id: dest.id, media_id: id, sort_order: (count ?? 0) + 1 });
  if (link.error) {
    await staff.supabase.from('media_assets').delete().eq('id', id);
    await staff.supabase.storage.from(BUCKET).remove([path]);
    return fail(`Gagal menautkan foto: ${link.error.message}`);
  }
  refresh(slug);
  return { ok: true, message: 'Foto diunggah sebagai draf. Lengkapi kredit dan lisensi, lalu admin dapat menerbitkannya.' };
}

export async function updatePhoto(slug: string, mediaId: string, fields: Partial<PhotoFields>): Promise<Result> {
  const { staff, dest, photo, error } = await loadPhoto(slug, mediaId);
  if (!staff || !dest || !photo) return fail(error ?? NOT_ALLOWED);
  if (photo.status === 'published' && staff.role !== 'admin') return fail('Hanya admin yang boleh mengubah foto yang sudah terbit.');
  const f = cleanPhotoFields(fields);
  if (!f.ok) return fail(f.error);
  if (photo.status === 'published') {
    const miss = photoMissing(f.value);
    if (miss.length) return fail(`Foto terbit harus tetap lengkap. Masih kurang: ${miss.join(', ')}.`);
  }
  const up = await staff.supabase.from('media_assets').update({ ...f.value, taken_on: f.value.taken_on || null }).eq('id', photo.id);
  if (up.error) return fail(`Gagal menyimpan: ${up.error.message}`);
  refresh(slug);
  if (photo.status === 'published') refreshPublic(slug);
  return { ok: true, message: 'Data foto tersimpan.' };
}

export async function publishPhoto(slug: string, mediaId: string): Promise<Result> {
  const { staff, dest, photo, error } = await loadPhoto(slug, mediaId);
  if (!staff || !dest || !photo) return fail(error ?? NOT_ALLOWED);
  if (staff.role !== 'admin') return fail('Hanya admin yang dapat menerbitkan foto.');
  if (photo.status === 'published') return fail('Foto ini sudah terbit.');
  const miss = photoMissing({ alt_id: photo.alt_id ?? '', alt_en: photo.alt_en ?? '', credit: photo.credit ?? '', license: photo.license ?? '', permission_note: photo.permission_note ?? '', taken_on: '' });
  if (miss.length) return fail(`Belum bisa terbit. Lengkapi: ${miss.join(', ')}.`);
  const up = await staff.supabase.from('media_assets').update({ status: 'published' }).eq('id', photo.id);
  if (up.error) return fail(`Gagal menerbitkan foto: ${up.error.message}`);
  refresh(slug);
  refreshPublic(slug);
  return { ok: true, message: dest.status === 'published' ? 'Foto diterbitkan.' : 'Foto siap terbit; akan tampil di situs setelah destinasinya diterbitkan.' };
}

export async function unpublishPhoto(slug: string, mediaId: string): Promise<Result> {
  const { staff, dest, photo, error } = await loadPhoto(slug, mediaId);
  if (!staff || !dest || !photo) return fail(error ?? NOT_ALLOWED);
  if (staff.role !== 'admin') return fail('Hanya admin yang dapat menarik foto.');
  if (photo.status !== 'published') return fail('Foto ini tidak sedang terbit.');
  const up = await staff.supabase.from('media_assets').update({ status: 'draft', featured: false }).eq('id', photo.id);
  if (up.error) return fail(`Gagal: ${up.error.message}`);
  refresh(slug);
  refreshPublic(slug);
  return { ok: true, message: 'Foto ditarik dari situs publik.' };
}

/** Menjadikan satu foto sebagai foto utama (hero). Hanya foto terbit yang bisa jadi utama. */
export async function setHeroPhoto(slug: string, mediaId: string): Promise<Result> {
  const { staff, dest, photo, error } = await loadPhoto(slug, mediaId);
  if (!staff || !dest || !photo) return fail(error ?? NOT_ALLOWED);
  if (staff.role !== 'admin') return fail('Hanya admin yang dapat memilih foto utama.');
  if (photo.status !== 'published') return fail('Terbitkan foto ini dulu sebelum dijadikan foto utama.');
  const { data: all } = await staff.supabase.from('destination_media').select('media_id').eq('destination_id', dest.id);
  const ids = (all ?? []).map((r: { media_id: string }) => r.media_id).filter((x) => x !== photo.id);
  if (ids.length) {
    const clear = await staff.supabase.from('media_assets').update({ featured: false }).in('id', ids);
    if (clear.error) return fail(`Gagal: ${clear.error.message}`);
  }
  const up = await staff.supabase.from('media_assets').update({ featured: true }).eq('id', photo.id);
  if (up.error) return fail(`Gagal: ${up.error.message}`);
  refresh(slug);
  refreshPublic(slug);
  return { ok: true, message: 'Foto utama diperbarui.' };
}

export async function removePhoto(slug: string, mediaId: string): Promise<Result> {
  const { staff, dest, photo, error } = await loadPhoto(slug, mediaId);
  if (!staff || !dest || !photo) return fail(error ?? NOT_ALLOWED);
  if (photo.status === 'published' && staff.role !== 'admin') return fail('Hanya admin yang boleh menghapus foto yang sudah terbit.');
  const del = await staff.supabase.from('media_assets').delete().eq('id', photo.id);
  if (del.error) return fail(`Gagal menghapus: ${del.error.message}`);
  if (photo.storage_path) await staff.supabase.storage.from(BUCKET).remove([photo.storage_path]);
  refresh(slug);
  if (photo.status === 'published') refreshPublic(slug);
  return { ok: true, message: 'Foto dihapus.' };
}
