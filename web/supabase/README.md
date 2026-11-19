# Supabase — Pilihan Timur (nama proyek Supabase tetap `ragam-timur`)

- `migrations/20261105000000_init_schema.sql` — skema PRD §13 (19 tabel), RLS PRD §14, aturan penerbitan, audit.
- `seed.sql` — dihasilkan dari `src/lib/data.ts` (`node scripts/gen-seed.mts`): 7 wilayah, 8 kategori, 32 destinasi (per 9 Nov 2026), semua `draft`.
- `tests/rls.sql` — 16 skenario hak akses (anon / editor / admin) untuk dijalankan dengan `psql` pada DB uji.

## Aturan yang ditegakkan di database
- Pengunjung (anon) hanya membaca baris `published`; tabel anak (terjemahan, media, sumber) mengikuti induknya.
- Editor boleh membuat/mengubah dan mengajukan `in_review`; hanya admin yang boleh `published`/`archived`.
- Destinasi hanya terbit bila `verified_at` terisi dan punya ≥1 `content_sources`.
- Media hanya terbit bila kredit dan (lisensi atau bukti izin) tercatat.
- Siapa pun boleh mengirim laporan koreksi (hanya `destination_id`, `message`, `contact`); hanya staf yang membaca.
- Perubahan konten tercatat di `audit_logs` (trigger); hanya admin yang membaca.
- `profiles` tidak dibuat otomatis saat signup: admin pertama dibuat manual, sehingga akun asing tak otomatis jadi staf.

- `migrations/20261107140000_correction_reports.sql` — laporan koreksi: slug, batas laju, hak kolom, cap waktu penanganan.
- `migrations/20261106180000_media_storage.sql` — bucket `media`, alt teks ID/EN, syarat terbit foto.
- `migrations/20261106140000_publish_rules.sql` — editor tak bisa menarik konten terbit; syarat terbit: verifikasi + ≥1 sumber + ringkasan ID dan EN.
- `migrations/20261105120000_harden_policies.sql` — menindaklanjuti advisor: fungsi peran dipindah ke schema `private`, satu policy SELECT per tabel, tulis dipecah per aksi, indeks FK.

## Status penerapan
Sudah diterapkan ke proyek Supabase `ragam-timur` (ref `dbloglhvyiztokputikj`, ap-southeast-1) pada 5 Nov 2026: kedua migrasi + seed (45 destinasi draft, 7 wilayah, 8 kategori).
Advisor keamanan: 0 temuan. Advisor performa: hanya "unused index" (INFO; wajar pada DB baru).
URL dan kunci publishable: lihat `.env.example`.

## Belum dilakukan
- Admin pertama (wajib agar bisa masuk /admin): buat user lewat Supabase Auth, lalu `insert into profiles (id, display_name, role) values (<uid>, '...', 'admin')`.
- Halaman publik: 6 destinasi tetap dari `src/lib/data.ts`; destinasi yang TERBIT di database tampil berlabel "Terverifikasi" dengan ringkasan, deskripsi, koordinat, dan sumbernya (`src/lib/published.ts`). Bila database gagal dijangkau, situs jatuh kembali ke daftar kandidat.
- Admin: login, daftar destinasi, dan editor per destinasi (`/admin/destinations/<slug>`): terjemahan ID/EN, koordinat, akses, sumber, verifikasi, ajukan pemeriksaan. Admin bisa Terbitkan / Tarik dari situs publik. Belum ada: video.
- Sumber diisi manual oleh admin/editor. Fitur pencarian sumber dan draf deskripsi otomatis sempat dibuat lalu dilepas atas keputusan pemilik (butuh kunci API berbayar).
- Pembatasan peran di aplikasi (belum di database): editor tak bisa mengubah konten terbit; verifikasi hanya admin.
- Tipe TypeScript dari skema (buat saat menghubungkan aplikasi).
- Proyek lama di akun yang sama ("kenaltahercom's Project", "saji lokal Project") tidak disentuh.
