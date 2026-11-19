# Pilihan Timur (dulu "Ragam Timur")

> **Catatan 15 Nov 2026:** situs aktif ada di `web/` (Next.js; lihat `CLAUDE.md` dan `docs/decisions/0003-pilihan-timur.md`). Folder akar ini hanya prototype statis lama untuk acuan sejarah; isinya (32 kandidat, Kawasan, Cerita, Video Atlas) sudah TIDAK berlaku.


Setiap Pulau Punya Cerita. · Every Island Has a Story.

```bash
node src/build.mjs                                    # menghasilkan dist/ (100 halaman: /id dan /en)
python3 -m http.server 8077 --directory dist          # buka http://localhost:8077/id/index.html
```

Halaman: Beranda, Destinasi (filter + 32 kandidat), Detail Destinasi, Kawasan, Cerita (empty state), Tentang, serta kerangka Video Atlas, Panduan Perjalanan, dan Inspirasi Rute (tanpa isi karangan).
Detail keputusan desain: `docs/decisions/0001-typography-and-motion.md`. Produk: `docs/product/PRD.md`.

**Belum ada:** foto berlisensi, video hero, isi nyata Video Atlas/Panduan/Rute, peta, backend/dashboard admin (PRD fase berikutnya).
