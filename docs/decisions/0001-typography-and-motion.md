# ADR 0001 — Tipografi & gerak mengacu pada Coparadiso

Status: Diterima (prototype) · Tanggal: 2026-11-04

## Konteks
PRD 1.0 §5.3 menetapkan DM Serif Display + Manrope ("Local Editorial"). Pemilik produk meminta font
dan seluruh animasi mengacu pada https://www.coparadiso.com/ (playful, hangat, bertekstur).

## Keputusan
1. **Font** mengikuti *karakter* Coparadiso, bukan nama font aslinya (belum terkonfirmasi — hanya terlihat
   dari video/screenshot; wordmark "Co Paradiso" adalah SVG, bukan font):
   - Display (judul, nav, tombol): `Caprasimo` — serif bulat tebal ala Cooper Black
   - Script (judul besar): `Kaushan Script` — kuas miring tebal
   - Mono (paragraf, form): `Courier Prime` — mesin ketik
   - Label: `Archivo Black`
   Semua OFL/Google Fonts. Cooper Black asli berlisensi komersial, jadi tidak dipakai.
   Tumpukan font + cadangan sistem ada di `assets/css/app.css` (`--f-*`); file font belum disertakan (lihat `assets/css/fonts.css`).
2. **Palet tetap PRD §5.4.** Ditambah turunan agar kontras AA terpenuhi untuk teks krem di atas latar berwarna:
   `--sea-deep #2E5957`, `--terra-deep #8A4A37`, plus aksen logo `--sun #E8A53A`, `--leaf #5F7F3E`.
   Terracotta/Sea Teal asli hanya untuk elemen besar/dekoratif di atas krem.
3. **Gerak** (vanilla JS/CSS, tanpa library): nav pill melayang, hero berlapis (matahari terbit, ombak, perahu),
   judul huruf-demi-huruf, garis ganda yang "digambar", kartu sticky bertumpuk, sticky note miring yang bisa digeser,
   stiker bulat berputar, galeri bernomor, ilustrasi melayang (parallax), progress bar saat pindah halaman,
   View Transitions antar-dokumen.
4. **Yang TIDAK ditiru:** logo, ilustrasi, foto, dan copy Coparadiso. Hanya pola interaksi dan karakter tipografi.

## Konsekuensi / risiko
- Paragraf monospace kurang nyaman untuk artikel panjang. Dipakai untuk blok pendek;
  untuk Travel Stories panjang pertimbangkan font body proporsional (uji keterbacaan).
- Semua gerak wajib menghormati `prefers-reduced-motion` (sudah) dan tidak menunda akses konten tanpa JS (sudah).
- Gerak sumber (hover/scroll Coparadiso) hanya diamati dari rekaman 24 detik; detail timing/easing adalah interpretasi.

## Belum diputuskan
- Nama font asli Coparadiso (jika ingin presisi): cek DevTools → Computed → `font-family` pada judul & paragraf.
- Video hero + tombol suara (ada di acuan): butuh aset video berlisensi.

## Pembaruan 2026-11-04 (setelah analisis rekaman layar acuan)
- Ditambahkan **ticker** berjalan di bawah hero (acuan punya strip berjalan). Isi memakai fakta PRD, bukan copy Coparadiso. Berhenti saat hover dan saat reduced-motion.
- Dari rekaman terlihat hero acuan berupa foto/video pantai penuh layar dengan wordmark SVG, tombol suara di kiri bawah (di rekaman tidak terdengar suara). Prototype memakai ilustrasi sendiri; video hero dan tombol suara **ditunda** sampai ada aset berlisensi.
- File font **sudah terpasang** (self-hosted woff2 subset latin di `assets/fonts/`, diunduh pemilik dari google-webfonts-helper karena registry npm diblokir di sesi pembuatan).
- Ditambahkan kerangka halaman Video Atlas, Travel Guides, dan Itineraries (ID/EN, 106 halaman total). Isinya hanya struktur dari PRD §9/§12 dan empty state; tidak ada video, rute, atau panduan destinasi yang dikarang. Timeline itinerary adalah contoh tata letak berlabel, bukan rute nyata. Ketiganya ditautkan dari footer dan dari seksi "Lebih banyak cara menjelajah" di Beranda; belum masuk nav pill agar nav tetap ringkas.
