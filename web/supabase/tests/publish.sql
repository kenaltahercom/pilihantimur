-- Uji aturan penerbitan. Jalankan di dalam transaksi lalu ROLLBACK; jangan pada data sungguhan.
-- Ganti 'pantai-weri' dengan destinasi yang masih KOSONG (tanpa terjemahan/sumber).
-- Hasil yang diharapkan: ditolak, ditolak, published, ditolak (editor), draft.
-- (Skrip lengkapnya dijalankan pada 6 Nov 2026; lihat docs/decisions/0002-port-nextjs.md.)
begin;
-- 1) siapkan: sumber + verified_at (sebagai superuser)
-- 2) admin: terbit tanpa ringkasan -> ditolak; hanya ID -> ditolak; ID+EN -> published
-- 3) editor: tarik published ke draft -> ditolak ("Hanya admin ...")
-- 4) admin: tarik ke draft -> berhasil
rollback;
