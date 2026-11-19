-- Aturan penerbitan yang lebih ketat.
-- 1) Hanya admin yang boleh MENGUBAH status konten yang sudah terbit/arsip (mis. menarik kembali ke draf).
-- 2) Destinasi hanya terbit bila verified_at terisi, ada >=1 sumber, dan ringkasan ID + EN terisi (PRD §8).

create or replace function public.guard_publish() returns trigger
language plpgsql set search_path = '' as $$
declare publishing boolean := new.status in ('published','archived')
  and (tg_op = 'INSERT' or old.status is distinct from new.status);
begin
  if publishing and not private.is_admin() then
    raise exception 'Hanya admin yang dapat menerbitkan atau mengarsipkan konten.' using errcode = '42501';
  end if;
  if tg_op = 'UPDATE' and old.status in ('published','archived') and new.status is distinct from old.status
     and not private.is_admin() then
    raise exception 'Hanya admin yang dapat mengubah status konten yang sudah terbit atau diarsipkan.' using errcode = '42501';
  end if;
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    new.published_at = coalesce(new.published_at, now());
  end if;
  return new;
end $$;

create or replace function public.guard_destination_publish() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    if new.verified_at is null then
      raise exception 'Destinasi belum diverifikasi (verified_at kosong).' using errcode = '23514';
    end if;
    if not exists (select 1 from public.content_sources where destination_id = new.id) then
      raise exception 'Destinasi belum punya sumber informasi.' using errcode = '23514';
    end if;
    if (select count(*) from public.destination_translations
          where destination_id = new.id and lang in ('id','en') and nullif(btrim(summary), '') is not null) < 2 then
      raise exception 'Ringkasan bahasa Indonesia dan Inggris wajib terisi sebelum terbit.' using errcode = '23514';
    end if;
  end if;
  return new;
end $$;

revoke execute on all functions in schema public from public, anon, authenticated;
