# 0002 — Port ke Next.js

Status: diterapkan (Nov 2026)

- Stack: Next.js 16 (App Router, `proxy.ts`), React 19, next-intl 4 (`/id`, `/en`), Tailwind 4, TypeScript strict, vitest.
- DOM dan nama kelas prototype dipertahankan agar CSS yang sama berlaku (globals.css).
- Teks dibaca lewat `getMsgs()` bertipe; data destinasi di `src/lib/data.ts` (45 kandidat, belum terverifikasi).
- Verifikasi: tsc, eslint, vitest (5 tes), `next build` (111 halaman), audit Playwright 36 kombinasi halaman/viewport/bahasa: 0 masalah.
- Ditunda: Supabase, admin, aset berlisensi.

## Lanjutan: skema Supabase (5 Nov 2026)
Skema PRD §13 ada di `supabase/` (migrasi, seed 45 draft, uji RLS). Belum diterapkan ke proyek remote; menunggu keputusan proyek/region Supabase.

## Update: skema Supabase (5 Nov 2026)
- Migrasi awal `web/supabase/migrations/20261105000000_init_schema.sql` mengikuti PRD §13–14. Keputusan: aturan penerbitan, kewajiban kredit/lisensi media, dan role dijaga di database (trigger + RLS), bukan hanya di aplikasi.
- `profiles` tidak dibuat otomatis saat signup (menghindari akun asing menjadi staf).
- Diuji di PostgreSQL 16 lokal dengan stub `auth` (16 skenario, `supabase/tests/rls.sql`). Satu bug ditemukan dan diperbaiki saat uji (`media_assets.published_at` belum ada).
- Diterapkan ke Supabase asli (proyek `ragam-timur`, ap-southeast-1). Advisor menemukan fungsi SECURITY DEFINER terekspos lewat RPC dan banyak policy permisif tumpang tindih; diperbaiki di migrasi `20261105120000_harden_policies.sql` (fungsi peran ke schema `private`, SELECT tunggal per tabel). Advisor setelahnya: keamanan 0 temuan.
- Cek akhir di proyek nyata: peran anon melihat 0 destinasi draft, 7 wilayah, 8 kategori.

## Update: strategi tahap awal Supabase (6 Nov 2026)
- Keputusan pemilik: halaman publik tetap membaca `data.ts`; database dipakai dulu oleh dashboard admin. Alasan: semua destinasi masih kandidat/draf, sehingga membaca dari DB akan mengosongkan daftar publik.
- `/admin` berada di luar `[locale]` (layout sendiri, `noindex`). `proxy.ts` mengarahkan permintaan tanpa sesi ke `/admin/login`; halaman admin memeriksa ulang sesi dan peran di server (proxy bukan satu-satunya pertahanan; RLS tetap penegak akhir).
- Pesan gagal login sengaja generik. Klien Supabase tanpa tipe generik untuk saat ini; tipe penuh dibuat saat modul edit admin dibangun.

## Update: editor admin dan bantuan sumber otomatis (6 Nov 2026)
- Rekomendasi sumber memakai API pencarian (Tavily) dan menilai domain: .go.id/.desa.id = P1, media/direktori = P2, lainnya P3. Ini hanya saran status dokumentasi; admin memutuskan. Status dokumentasi bukan izin pakai foto.
- Draf deskripsi disusun Claude hanya dari teks sumber yang SUDAH tersimpan untuk destinasi itu (klien tidak bisa menyuplai URL bebas). Prompt melarang fakta di luar kutipan dan melarang koordinat/harga/jam/jarak tanpa sumber; isi halaman diperlakukan sebagai data tak tepercaya. Hasil berupa usulan yang harus dimasukkan ke formulir dan disimpan manual.
- Pengambilan halaman: hanya https ke alamat publik, validasi DNS dan tiap pengalihan, batas 8 dtk / 400 KB. Risiko sisa: DNS rebinding antara validasi dan fetch (hanya staf yang bisa menambah URL).
- Mengubah isi/sumber destinasi yang belum terbit mencabut verifikasi sebelumnya.
- Kunci API hanya di server (tanpa NEXT_PUBLIC_). Fitur otomatis nonaktif tanpa kunci.

## Update: bantuan sumber otomatis DILEPAS (6 Nov 2026)
- Keputusan pemilik: sumber diisi manual. Pencarian sumber (Tavily) dan draf deskripsi (Claude API) dihapus dari kode beserta pengambil halaman web (SSRF guard), kunci API, dan tesnya. Alasan: butuh kunci API berbayar yang tidak dipakai, dan mengurangi permukaan serangan.
- Tetap ada: label domain + saran status dokumentasi (P1/P2/P3) di daftar sumber (tanpa panggilan jaringan). Versi yang lengkap tersimpan di berkas `ragam-timur-web-v2.zip` bila ingin dipulihkan.

## Update: penerbitan dan halaman publik dari database (6 Nov 2026)
- Migrasi `20261106140000_publish_rules.sql`: hanya admin boleh mengubah status konten terbit/arsip (editor tak bisa menarik); terbit butuh verified_at + ≥1 sumber + ringkasan ID dan EN.
- Halaman publik tetap menampilkan 45 kandidat; yang berstatus published di DB ditandai "Terverifikasi" dan memakai teks/koordinat/sumber dari DB. Jalur baca memakai klien anon (RLS membatasi ke published), cache 60 dtk, ISR 300 dtk, dan revalidasi saat admin terbit/tarik. Bila DB gagal: jatuh ke kandidat (diuji, build tetap berhasil).
- Koreksi: uji login palsu sebelumnya tidak membuktikan koneksi Supabase (sandbox tak bisa me-resolve domain Supabase; pesan galat login sengaja generik sehingga galat jaringan tampak sama). Perilaku DB diuji lewat SQL; rendering publik diuji dengan server tiruan PostgREST.
- Kasus ditemukan saat uji: DB sudah berisi data sungguhan pemilik; uji tulis dilakukan pada destinasi lain dan di-ROLLBACK.

## Update: laporan koreksi (8 Nov 2026)
- Pengunjung anonim boleh menulis (INSERT) ke `correction_reports` lewat kunci publik; tidak bisa membaca atau mengubah. Staf hanya bisa mengubah `status` dan `handled_note` (hak kolom); `handled_by/at` diisi trigger.
- Anti-penyalahgunaan: kolom jebakan (bot dianggap berhasil tanpa disimpan), validasi panjang, dan batas laju di database (10/jam/destinasi, 60/jam total). Kompromi: penyerang bisa menghabiskan kuota jam itu dan menahan laporan sah sementara; diterima untuk tahap ini, tanpa IP/captcha.
- Laporan menyimpan slug (bukan hanya destination_id) karena destinasi kandidat belum ada di DB publik.
- Uji: aturan di DB lewat transaksi ROLLBACK; formulir dengan Playwright + PostgREST tiruan (sukses, galat, batas laju, bot). Isi formulir dipertahankan saat gagal.

## Update: foto terpasang dari folder `public/photos` (9 Nov 2026)
- Dari sandbox tidak ada jalur ke Supabase Storage, dan mengunggah ratusan foto lewat form admin satu per satu tidak praktis. Tahap awal: foto dipasang sebagai berkas statis + manifest TypeScript (`src/lib/photos.ts`), ditampilkan di halaman detail termasuk destinasi kandidat. Foto dari database (terbit) tetap didahulukan, jadi jalur admin/bucket tidak berubah.
- Kompromi: foto statis melewati gerbang penerbitan admin (alt/kredit/lisensi dijaga lewat manifest dan tes, bukan constraint DB), ikut membesarkan repo/zip (~0,6 MB per destinasi), dan lisensi hanya pernyataan pengelola. Bila foto nanti dipindah ke bucket, manifest cukup dikosongkan per destinasi.
- Foto tidak diperbesar (hanya diperkecil ke 1600 px), EXIF dibuang. Foto resolusi rendah (<700 px) tampil di galeri kecil, bukan sebagai foto utama.
