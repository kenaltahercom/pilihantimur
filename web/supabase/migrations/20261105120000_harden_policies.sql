-- Menindaklanjuti advisor Supabase (security: SECURITY DEFINER terekspos; performance: FK tanpa
-- indeks, banyak policy permisif per role/aksi).

-- 1) Fungsi peran dipindah ke schema 'private' (tidak diekspos PostgREST => tidak ada /rpc/is_admin).
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;
alter function public.is_staff() set schema private;
alter function public.is_admin() set schema private;
revoke execute on function private.is_staff(), private.is_admin() from public;
grant execute on function private.is_staff(), private.is_admin() to anon, authenticated;
-- Fungsi trigger tidak perlu dapat dipanggil siapa pun lewat API.
revoke execute on all functions in schema public from public, anon, authenticated;

create or replace function public.guard_publish() returns trigger
language plpgsql set search_path = '' as $$
declare publishing boolean := new.status in ('published','archived')
  and (tg_op = 'INSERT' or old.status is distinct from new.status);
begin
  if publishing and not private.is_admin() then
    raise exception 'Hanya admin yang dapat menerbitkan atau mengarsipkan konten.' using errcode = '42501';
  end if;
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    new.published_at = coalesce(new.published_at, now());
  end if;
  return new;
end $$;

-- 2) Satu policy SELECT per tabel (gabungan "publik" + "staf"), tulis dipecah per aksi.
do $$
declare
  t text;
  spec record;
begin
  -- Tabel utama berstatus: terbaca bila published, atau oleh staf.
  foreach t in array array['destinations','stories','itineraries','media_assets'] loop
    execute format('drop policy "public read published" on public.%I', t);
    execute format('drop policy "staff all" on public.%I', t);
    execute format('create policy "read" on public.%I for select to anon, authenticated
      using (status = ''published'' or (select private.is_staff()))', t);
  end loop;

  -- Tabel anak: terbaca bila induknya published, atau oleh staf.
  for spec in select * from (values
    ('destination_translations', 'exists (select 1 from public.destinations d where d.id = destination_id and d.status = ''published'')'),
    ('destination_categories',   'exists (select 1 from public.destinations d where d.id = destination_id and d.status = ''published'')'),
    ('story_translations',       'exists (select 1 from public.stories s where s.id = story_id and s.status = ''published'')'),
    ('itinerary_translations',   'exists (select 1 from public.itineraries i where i.id = itinerary_id and i.status = ''published'')'),
    ('itinerary_stops',          'exists (select 1 from public.itineraries i where i.id = itinerary_id and i.status = ''published'') and exists (select 1 from public.destinations d where d.id = destination_id and d.status = ''published'')'),
    ('destination_media',        'exists (select 1 from public.destinations d where d.id = destination_id and d.status = ''published'') and exists (select 1 from public.media_assets m where m.id = media_id and m.status = ''published'')'),
    ('content_sources',          'exists (select 1 from public.destinations d where d.id = destination_id and d.status = ''published'')')
  ) as v(tbl, cond) loop
    execute format('drop policy "public read" on public.%I', spec.tbl);
    execute format('drop policy "staff all" on public.%I', spec.tbl);
    execute format('create policy "read" on public.%I for select to anon, authenticated
      using ((%s) or (select private.is_staff()))', spec.tbl, spec.cond);
  end loop;

  -- Tulis (staf) untuk semua tabel konten + verifikasi.
  foreach t in array array['destinations','stories','itineraries','media_assets','destination_translations',
    'destination_categories','story_translations','itinerary_translations','itinerary_stops',
    'destination_media','content_sources'] loop
    execute format('create policy "staff insert" on public.%I for insert to authenticated with check ((select private.is_staff()))', t);
    execute format('create policy "staff update" on public.%I for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()))', t);
    execute format('create policy "staff delete" on public.%I for delete to authenticated using ((select private.is_staff()))', t);
  end loop;

  -- Referensi: baca publik; tulis admin dipecah agar tidak tumpang tindih dengan SELECT.
  foreach t in array array['regions','region_translations','categories','category_translations'] loop
    execute format('drop policy "admin write" on public.%I', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check ((select private.is_admin()))', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using ((select private.is_admin()))', t);
  end loop;
end $$;

-- Profil: SELECT tunggal; tulis hanya admin.
drop policy "own profile" on public.profiles;
drop policy "admin write" on public.profiles;
create policy "read" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));
create policy "admin insert" on public.profiles for insert to authenticated with check ((select private.is_admin()));
create policy "admin update" on public.profiles for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin delete" on public.profiles for delete to authenticated using ((select private.is_admin()));

-- verification_logs / correction_reports / audit_logs: pakai fungsi baru (OID tetap, tapi ganti eksplisit).
drop policy "staff all" on public.verification_logs;
create policy "staff read" on public.verification_logs for select to authenticated using ((select private.is_staff()));
create policy "staff insert" on public.verification_logs for insert to authenticated with check ((select private.is_staff()));
create policy "staff update" on public.verification_logs for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete" on public.verification_logs for delete to authenticated using ((select private.is_staff()));

-- 3) Indeks untuk foreign key.
create index on public.content_sources (created_by);
create index on public.correction_reports (destination_id);
create index on public.destination_categories (category_id);
create index on public.destinations (created_by);
create index on public.itineraries (created_by);
create index on public.itinerary_stops (destination_id);
create index on public.media_assets (created_by);
create index on public.stories (created_by);
create index on public.stories (destination_id);
create index on public.verification_logs (verified_by);
