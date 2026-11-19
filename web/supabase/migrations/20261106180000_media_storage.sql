-- Media berlisensi: bucket penyimpanan + kolom alt teks + syarat terbit.
-- Hanya gambar (jpeg/png/webp, maks 5 MB). Video menyusul.

alter table public.media_assets
  add column if not exists storage_path text,
  add column if not exists alt_id text,
  add column if not exists alt_en text;

-- Media terbit wajib: gambar, alt teks ID+EN, dan kredit + lisensi/izin (kredit/lisensi sudah dijaga check lama).
alter table public.media_assets
  add constraint media_publish_alt check (
    status <> 'published'
    or (kind = 'photo'
        and nullif(btrim(alt_id), '') is not null
        and nullif(btrim(alt_en), '') is not null));

-- Bucket publik (URL tak bisa ditebak: nama berkas uuid). Hanya staf yang boleh menulis.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "media staff insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and private.is_staff());
create policy "media staff update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and private.is_staff())
  with check (bucket_id = 'media' and private.is_staff());
create policy "media staff delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and private.is_staff());
-- Staf perlu SELECT agar upsert/hapus bekerja; publik membaca lewat URL bucket publik.
create policy "media staff select" on storage.objects for select to authenticated
  using (bucket_id = 'media' and private.is_staff());
