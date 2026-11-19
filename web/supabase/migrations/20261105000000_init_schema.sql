-- Ragam Timur — skema awal (PRD §13 & §14).
-- Prinsip: konten non-published tidak pernah terlihat publik; editor tidak bisa
-- menerbitkan; destinasi baru bisa terbit hanya bila sudah punya tanggal verifikasi.

create extension if not exists pgcrypto;

-- ---------- tipe ----------
create type public.lang_code      as enum ('id', 'en');
create type public.content_status as enum ('draft', 'in_review', 'published', 'archived');
create type public.user_role      as enum ('editor', 'admin');
create type public.access_tier    as enum ('A', 'B', 'C');
create type public.media_kind     as enum ('photo', 'video');
create type public.report_status  as enum ('open', 'reviewing', 'resolved', 'rejected');

-- ---------- util ----------
create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;

-- ---------- profiles (identitas admin & editor) ----------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role         public.user_role not null default 'editor',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Fungsi peran: SECURITY DEFINER agar tidak rekursif terhadap RLS profiles.
create function public.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()));
$$;
create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;

-- ---------- wilayah & kategori ----------
create table public.regions (
  id         text primary key,                -- 'flores', 'sumba', ...
  sort_order int  not null default 0
);
create table public.region_translations (
  region_id   text not null references public.regions (id) on delete cascade,
  lang        public.lang_code not null,
  name        text not null,
  description text,
  primary key (region_id, lang)
);
create table public.categories (
  id         text primary key,                -- 'beach', 'lakes', ...
  sort_order int  not null default 0
);
create table public.category_translations (
  category_id text not null references public.categories (id) on delete cascade,
  lang        public.lang_code not null,
  name        text not null,
  primary key (category_id, lang)
);

-- ---------- destinasi ----------
create table public.destinations (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null,
  kabupaten   text not null,
  region_id   text not null references public.regions (id),
  access      public.access_tier not null,
  doc_status  text not null check (doc_status in ('P0','P1','P2','P3','P1/P2')),
  latitude    numeric(9,6) check (latitude  between -90  and 90),
  longitude   numeric(9,6) check (longitude between -180 and 180),
  sort_order  int  not null default 0,
  status      public.content_status not null default 'draft',
  verified_at timestamptz,
  published_at timestamptz,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check ((latitude is null) = (longitude is null))
);
create index on public.destinations (region_id);
create index on public.destinations (status);

create table public.destination_translations (
  destination_id uuid not null references public.destinations (id) on delete cascade,
  lang           public.lang_code not null,
  summary        text,
  description    text,
  access_notes   text,
  tips           text,
  primary key (destination_id, lang)           -- konten × bahasa unik
);
create table public.destination_categories (
  destination_id uuid not null references public.destinations (id) on delete cascade,
  category_id    text not null references public.categories (id),
  primary key (destination_id, category_id)
);

-- ---------- cerita ----------
create table public.stories (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  destination_id uuid references public.destinations (id) on delete set null,
  status       public.content_status not null default 'draft',
  published_at timestamptz,
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create table public.story_translations (
  story_id uuid not null references public.stories (id) on delete cascade,
  lang     public.lang_code not null,
  title    text not null,
  excerpt  text,
  body     text,
  primary key (story_id, lang)
);

-- ---------- itinerary ----------
create table public.itineraries (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status       public.content_status not null default 'draft',
  published_at timestamptz,
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create table public.itinerary_translations (
  itinerary_id uuid not null references public.itineraries (id) on delete cascade,
  lang         public.lang_code not null,
  title        text not null,
  summary      text,
  primary key (itinerary_id, lang)
);
create table public.itinerary_stops (
  itinerary_id   uuid not null references public.itineraries (id) on delete cascade,
  position       int  not null check (position > 0),
  destination_id uuid not null references public.destinations (id),
  note_id        text,
  note_en        text,
  primary key (itinerary_id, position)
);

-- ---------- media ----------
create table public.media_assets (
  id             uuid primary key default gen_random_uuid(),
  kind           public.media_kind not null,
  url            text not null,
  thumbnail_url  text,
  title          text,
  lang           public.lang_code,
  taken_on       date,
  credit         text,               -- kredit pembuat
  license        text,               -- jenis lisensi
  permission_note text,              -- bukti izin penggunaan
  status         public.content_status not null default 'draft',
  featured       boolean not null default false,
  published_at   timestamptz,
  created_by     uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- Media hanya boleh tayang bila kredit dan lisensi/izin tercatat.
  check (status <> 'published'
         or (nullif(btrim(credit), '') is not null
             and (nullif(btrim(license), '') is not null or nullif(btrim(permission_note), '') is not null)))
);
create table public.destination_media (
  destination_id uuid not null references public.destinations (id) on delete cascade,
  media_id       uuid not null references public.media_assets (id) on delete cascade,
  sort_order     int not null default 0,
  primary key (destination_id, media_id)
);
create index on public.destination_media (media_id);

-- ---------- sumber, verifikasi, koreksi, audit ----------
create table public.content_sources (
  id             uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations (id) on delete cascade,
  title          text not null,
  url            text,
  publisher      text,
  accessed_on    date,
  created_by     uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now()
);
create index on public.content_sources (destination_id);

create table public.verification_logs (
  id             uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations (id) on delete cascade,
  verified_by    uuid references public.profiles (id) on delete set null,
  note           text,
  created_at     timestamptz not null default now()
);
create index on public.verification_logs (destination_id);

create table public.correction_reports (
  id             uuid primary key default gen_random_uuid(),
  destination_id uuid references public.destinations (id) on delete set null,
  message        text not null check (char_length(message) between 10 and 2000),
  contact        text check (char_length(contact) <= 200),
  status         public.report_status not null default 'open',
  created_at     timestamptz not null default now()
);

create table public.audit_logs (
  id         bigint generated always as identity primary key,
  actor_id   uuid,
  action     text not null,          -- INSERT / UPDATE / DELETE
  table_name text not null,
  row_id     text,
  created_at timestamptz not null default now()
);

-- ---------- trigger ----------
do $$
declare t text;
begin
  foreach t in array array['profiles','destinations','stories','itineraries','media_assets'] loop
    execute format('create trigger touch before update on public.%I
                    for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- Aturan penerbitan: hanya admin yang boleh mengubah status ke/dari published/archived;
-- destinasi hanya terbit bila verified_at terisi dan ada minimal satu sumber.
create function public.guard_publish() returns trigger
language plpgsql set search_path = '' as $$
declare publishing boolean := new.status in ('published','archived')
  and (tg_op = 'INSERT' or old.status is distinct from new.status);
begin
  if publishing and not public.is_admin() then
    raise exception 'Hanya admin yang dapat menerbitkan atau mengarsipkan konten.' using errcode = '42501';
  end if;
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    new.published_at = coalesce(new.published_at, now());
  end if;
  return new;
end $$;

create function public.guard_destination_publish() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    if new.verified_at is null then
      raise exception 'Destinasi belum diverifikasi (verified_at kosong).' using errcode = '23514';
    end if;
    if not exists (select 1 from public.content_sources where destination_id = new.id) then
      raise exception 'Destinasi belum punya sumber informasi.' using errcode = '23514';
    end if;
  end if;
  return new;
end $$;

create trigger a_guard_publish before insert or update on public.destinations
  for each row execute function public.guard_publish();
create trigger b_guard_destination before insert or update on public.destinations
  for each row execute function public.guard_destination_publish();
create trigger guard_publish before insert or update on public.stories
  for each row execute function public.guard_publish();
create trigger guard_publish before insert or update on public.itineraries
  for each row execute function public.guard_publish();
create trigger guard_publish before insert or update on public.media_assets
  for each row execute function public.guard_publish();

-- Audit aktivitas staf pada tabel konten.
create function public.write_audit() returns trigger
language plpgsql security definer set search_path = '' as $$
declare r jsonb := to_jsonb(coalesce(new, old));
begin
  insert into public.audit_logs (actor_id, action, table_name, row_id)
  values ((select auth.uid()), tg_op, tg_table_name, coalesce(r->>'id', r->>'slug'));
  return null;
end $$;
do $$
declare t text;
begin
  foreach t in array array['destinations','stories','itineraries','media_assets','profiles'] loop
    execute format('create trigger audit after insert or update or delete on public.%I
                    for each row execute function public.write_audit()', t);
  end loop;
end $$;

-- ---------- RLS ----------
do $$
declare t text;
begin
  foreach t in array array['profiles','regions','region_translations','categories','category_translations',
    'destinations','destination_translations','destination_categories','stories','story_translations',
    'itineraries','itinerary_translations','itinerary_stops','media_assets','destination_media',
    'content_sources','verification_logs','correction_reports','audit_logs'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Referensi (wilayah, kategori): publik baca, admin kelola.
do $$
declare t text;
begin
  foreach t in array array['regions','region_translations','categories','category_translations'] loop
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('create policy "admin write" on public.%I for all to authenticated
                    using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Konten: publik hanya melihat yang published; staf melihat & mengubah semua.
create policy "public read published" on public.destinations for select using (status = 'published');
create policy "staff all" on public.destinations for all to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "public read published" on public.stories for select using (status = 'published');
create policy "staff all" on public.stories for all to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "public read published" on public.itineraries for select using (status = 'published');
create policy "staff all" on public.itineraries for all to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "public read published" on public.media_assets for select using (status = 'published');
create policy "staff all" on public.media_assets for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- Tabel anak: publik baca bila induknya published.
create policy "public read" on public.destination_translations for select using (
  exists (select 1 from public.destinations d where d.id = destination_id and d.status = 'published'));
create policy "public read" on public.destination_categories for select using (
  exists (select 1 from public.destinations d where d.id = destination_id and d.status = 'published'));
create policy "public read" on public.story_translations for select using (
  exists (select 1 from public.stories s where s.id = story_id and s.status = 'published'));
create policy "public read" on public.itinerary_translations for select using (
  exists (select 1 from public.itineraries i where i.id = itinerary_id and i.status = 'published'));
create policy "public read" on public.itinerary_stops for select using (
  exists (select 1 from public.itineraries i where i.id = itinerary_id and i.status = 'published')
  and exists (select 1 from public.destinations d where d.id = destination_id and d.status = 'published'));
create policy "public read" on public.destination_media for select using (
  exists (select 1 from public.destinations d where d.id = destination_id and d.status = 'published')
  and exists (select 1 from public.media_assets m where m.id = media_id and m.status = 'published'));
create policy "public read" on public.content_sources for select using (
  exists (select 1 from public.destinations d where d.id = destination_id and d.status = 'published'));

do $$
declare t text;
begin
  foreach t in array array['destination_translations','destination_categories','story_translations',
    'itinerary_translations','itinerary_stops','destination_media','content_sources'] loop
    execute format('create policy "staff all" on public.%I for all to authenticated
                    using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

-- Verifikasi: hanya staf. Koreksi: siapa pun boleh melapor, hanya staf yang membaca/menangani.
create policy "staff all" on public.verification_logs for all to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "anyone reports" on public.correction_reports for insert
  with check (status = 'open');
create policy "staff read" on public.correction_reports for select to authenticated using (public.is_staff());
create policy "staff update" on public.correction_reports for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- Profil: tiap staf melihat profilnya sendiri; admin kelola semua. Role tidak bisa dinaikkan sendiri.
create policy "own profile" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());
create policy "admin write" on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Audit: hanya admin membaca; ditulis lewat trigger saja.
create policy "admin read" on public.audit_logs for select to authenticated using (public.is_admin());

-- ---------- hak tabel ----------
revoke all on all tables in schema public from anon, authenticated;
grant select on public.regions, public.region_translations, public.categories, public.category_translations,
  public.destinations, public.destination_translations, public.destination_categories,
  public.stories, public.story_translations, public.itineraries, public.itinerary_translations,
  public.itinerary_stops, public.media_assets, public.destination_media, public.content_sources to anon;
grant insert (destination_id, message, contact) on public.correction_reports to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant insert (destination_id, message, contact) on public.correction_reports to authenticated;
revoke insert, update, delete on public.audit_logs from authenticated;
revoke execute on all functions in schema public from public, anon;
grant execute on function public.is_staff(), public.is_admin() to authenticated;
