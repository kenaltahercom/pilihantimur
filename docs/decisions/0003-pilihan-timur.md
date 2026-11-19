# 0003 — Pilihan Timur: cakupan 6 destinasi, gaya "Peta Laut", rencana dari kota asal

Status: diterima (13–15 Nov 2026, atas permintaan pengelola).

## Konteks
Daftar 45 kandidat terlalu luas untuk digarap dengan sumber yang bisa dipertanggungjawabkan.

## Keputusan
- Cakupan: 6 destinasi (Kelimutu, Pede, Lingko Lodok Cancar, 17 Pulau Riung, Rana Mese, Tanjung Kajuwulu). Halaman Kawasan/Cerita/Panduan/Rute/Video Atlas dialihkan ke beranda.
- Nama: "Pilihan Timur" (sebelumnya "Ragam Timur", lalu "Enam Pilihan NTT"). Logo: pin lokasi.
- Gaya: "Peta Laut" (putih tulang, biru laut, toska, koral; Space Grotesk + Inter). Menggantikan gaya yang meniru karakter Coparadiso (ADR 0001 hanya riwayat).
- Isi editorial di `web/src/lib/content.ts` (bukan DB dulu): semua bersumber, bertanggal, ditandai belum terverifikasi.
- Rencana nasional: pilih kota asal (27 kota, 25 provinsi) → bandara gerbang (usulan) → tautan ke penyedia tiket + kalkulator biaya. Harga tiket tidak disimpan; hanya contoh bersumber di `fares.ts` dengan tanggal data.
- Peringatan keselamatan per destinasi (`advisory`) setelah gempa M7,7 15 Agu 2026.

## Konsekuensi
- Konten harus diperbarui manual (tarif, jam buka, status pascagempa). Belum ada alur verifikasi/terbit untuk isi `content.ts`; menyalinnya ke tabel DB adalah langkah berikutnya.
- Dependensi peta dihasilkan sekali oleh skrip (world-atlas, domain publik) dan disimpan sebagai berkas statis.
