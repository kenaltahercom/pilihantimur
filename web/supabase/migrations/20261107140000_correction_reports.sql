-- Laporan koreksi dari pengunjung.
-- - Menyimpan slug destinasi (destinasi kandidat belum ada di DB publik, jadi destination_id bisa kosong).
-- - Batas laju: maks 10 laporan/jam/destinasi dan 60/jam keseluruhan (anti banjir kotak masuk).
-- - Staf hanya boleh mengubah status + catatan; pelapor tidak bisa mengubah apa pun setelah mengirim.

alter table public.correction_reports
  add column if not exists destination_slug text,
  add column if not exists handled_note text,
  add column if not exists handled_by uuid references public.profiles (id) on delete set null,
  add column if not exists handled_at timestamptz;

-- NOT VALID: hanya berlaku untuk baris baru.
alter table public.correction_reports
  add constraint correction_slug_required check (destination_slug is not null) not valid,
  add constraint correction_slug_fmt check (destination_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(destination_slug) <= 80),
  add constraint correction_note_len check (char_length(handled_note) <= 1000);

create index if not exists correction_reports_handled_by_idx on public.correction_reports (handled_by);
create index if not exists correction_reports_status_idx on public.correction_reports (status, created_at desc);
create index if not exists correction_reports_slug_idx on public.correction_reports (destination_slug, created_at desc);

create or replace function private.throttle_reports() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.correction_reports where created_at > now() - interval '1 hour') >= 60
     or (select count(*) from public.correction_reports
           where destination_slug = new.destination_slug and created_at > now() - interval '1 hour') >= 10 then
    raise exception 'Terlalu banyak laporan. Coba lagi nanti.' using errcode = '54000';
  end if;
  return new;
end $$;
revoke all on function private.throttle_reports() from public;
create trigger a_throttle before insert on public.correction_reports
  for each row execute function private.throttle_reports();

-- Catat siapa dan kapan laporan ditangani.
create or replace function private.stamp_report_handled() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.status is distinct from old.status then
    new.handled_by = (select auth.uid());
    new.handled_at = now();
  end if;
  return new;
end $$;
revoke all on function private.stamp_report_handled() from public;
create trigger stamp_handled before update on public.correction_reports
  for each row execute function private.stamp_report_handled();

-- Hak kolom.
grant insert (destination_slug) on public.correction_reports to anon, authenticated;
revoke update on public.correction_reports from authenticated;
grant update (status, handled_note) on public.correction_reports to authenticated;
