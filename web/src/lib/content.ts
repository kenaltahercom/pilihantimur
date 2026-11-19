/**
 * Isi editorial 6 destinasi: deskripsi, akses, estimasi biaya, sumber, dan slot video.
 * Semua angka berasal dari sumber yang tercantum beserta tanggal cek; belum diverifikasi lapangan.
 * Bila sumber tidak memuat suatu fakta, fakta itu sengaja dikosongkan ("belum ada data"), bukan ditebak.
 * Video: tambahkan ke `videos` { kind: 'youtube', id, title } atau { kind: 'file', src, poster?, title } (boleh 2–3 per tempat).
 */
export type Bi = { id: string; en: string };
export interface CostItem { label: Bi; value: Bi; src: number }
export interface Source { label: string; url: string; date: string }
export type VideoItem = { kind: 'youtube'; id: string; title: Bi } | { kind: 'file'; src: string; poster?: string; portrait?: boolean; title: Bi } 
export interface Step { from: Bi; to: Bi; how: Bi; time?: Bi; cost?: Bi }
export interface Fact { label: Bi; value: Bi }
/** Anggaran hanya dari komponen yang punya sumber (rupiah per orang). null = belum bisa dihitung. */
export interface Budget { min: number; max: number; basis: Bi; extra?: Bi }
export interface Advisory { level: 'warn' | 'info'; text: Bi; asOf: string; src: number }
export interface Content {
  advisory?: Advisory;
  mapQuery: string;
  steps: Step[];
  facts: Fact[];
  budget: Budget | null;
  summary: Bi;
  description: Bi;
  access: Bi;
  costs: CostItem[];
  costNote: Bi;
  sources: Source[];
  videos: VideoItem[];
}

const CHECKED = '2026-11-13';
const NEW = '2026-11-15';
const TODAY = '2026-11-16';
const NODATA: Bi = { id: 'Belum ada data', en: 'No data yet' };

export const CONTENT: Record<string, Content> = {
  'danau-kelimutu': {
    mapQuery: 'Danau Kelimutu, Ende, NTT',
    steps: [
      { from: { id: 'Ende', en: 'Ende' }, to: { id: 'Moni', en: 'Moni' }, how: { id: 'Angkutan umum / mobil bersama (± 50 km)', en: 'Public transport / shared car (≈ 50 km)' }, time: { id: '± 1–2,5 jam (sumber berbeda)', en: '≈ 1–2.5 h (sources differ)' }, cost: { id: 'Rp20.000–100.000 per orang (sumber berbeda)', en: 'IDR 20,000–100,000 per person (sources differ)' } },
      { from: { id: 'Moni', en: 'Moni' }, to: { id: 'Danau Kelimutu', en: 'Kelimutu lakes' }, how: { id: 'Kendaraan ke kawasan danau (± 13 km)', en: 'Vehicle to the lake area (≈ 13 km)' }, time: { id: '± 30–45 menit', en: '≈ 30–45 min' }, cost: { id: 'Ojek pulang-pergi Rp120.000–250.000', en: 'Return motorbike taxi IDR 120,000–250,000' } },
    ],
    facts: [
      { label: { id: 'Jam buka (per 19 Okt 2026)', en: 'Opening hours (as of 19 Oct 2026)' }, value: { id: '04.30–16.00 WITA', en: '04:30–16:00 WITA' } },
      { label: { id: 'Titik pandang Ata Polo', en: 'Ata Polo viewpoint' }, value: { id: 'Ditutup sementara', en: 'Temporarily closed' } },
      { label: { id: 'Waktu disarankan', en: 'Suggested time' }, value: { id: '08.00–09.00', en: '08:00–09:00' } },
      { label: { id: 'Maumere → Moni', en: 'Maumere → Moni' }, value: { id: '± 125 km, 2,5–3 jam', en: '≈ 125 km, 2.5–3 h' } },
    ],
    budget: { min: 170000, max: 460000, basis: { id: 'tiket lokal Rp10.000 + angkutan Ende–Moni PP + ojek Moni–danau PP (tarif sumber berbeda-beda)', en: 'local ticket IDR 10,000 + return Ende–Moni transport + return motorbike taxi Moni–lakes (rates differ by source)' }, extra: { id: 'Wisatawan asing: tiket Rp150.000 (hari kerja) / Rp225.000 (akhir pekan dan libur)', en: 'Foreign visitors: ticket IDR 150,000 (weekdays) / 225,000 (weekends and holidays)' } },
    advisory: { level: 'warn', asOf: '2026-10-19', src: 2, text: { id: 'Gempa M7,7 (15 Agu 2026) sempat menutup Taman Nasional Kelimutu. Per 19 Okt 2026 kawasan buka 04.30–16.00 WITA lewat jalur resmi (Arboretum, Anjungan Garugiwa, Mesbah Pati Ka, titik puncak), sedangkan titik pandang Danau Ata Polo masih ditutup karena retakan dinding kawah. Jangan melewati pagar atau rambu, dan konfirmasi status ke pengelola sebelum berangkat.', en: 'The M7.7 earthquake (15 Aug 2026) briefly closed Kelimutu National Park. As of 19 Oct 2026 the park is open 04:30–16:00 WITA on official trails (Arboretum, Garugiwa viewpoint, Mesbah Pati Ka, summit point), while the Ata Polo lake viewpoint stays closed because of cracks in the crater wall. Do not cross fences or signs, and confirm the status with the park before you go.' } },
    summary: {
      id: 'Danau kawah di puncak Gunung Kelimutu, Ende, yang warna airnya berbeda-beda.',
      en: 'Crater lakes on top of Mount Kelimutu in Ende, known for their differently coloured water.',
    },
    description: {
      id: 'Kelimutu berada di Taman Nasional Kelimutu, Kabupaten Ende, Flores. Pengunjung berjalan dari area parkir ke titik pandang untuk melihat danau-danau kawah dari atas. Warna air bisa berubah dari waktu ke waktu, jadi warna pada foto belum tentu sama dengan saat Anda datang.',
      en: 'Kelimutu sits inside Kelimutu National Park in Ende Regency, Flores. Visitors walk from the car park to a viewpoint to look down on the crater lakes. The water colour changes over time, so the colours in photos may differ from what you see.',
    },
    access: {
      id: 'Basis terdekat adalah desa Moni, sekitar 13 km dari danau. Dari Kota Ende ke Moni sumber berbeda: sekitar 1 jam (± 50 km) sampai 2,5 jam. Dari Moni ke kawasan danau sekitar 30–45 menit. Dari Maumere ke Moni sekitar 125 km (2,5–3 jam). Jam buka per 19 Okt 2026: 04.30–16.00 WITA (sumber lama menyebut 05.00–17.00). Penulis panduan yang kami baca menyarankan datang sekitar pukul 08.00–09.00 karena lebih sepi dan cahaya lebih baik daripada saat matahari terbit.',
      en: 'The nearest base is Moni village, about 13 km from the lakes. Ende town to Moni: sources differ, from about 1 hour (≈ 50 km) to 2.5 hours. Moni to the lake area is about 30–45 minutes. Maumere to Moni is about 125 km (2.5–3 h). Hours as of 19 Oct 2026: 04:30–16:00 WITA (an older source says 05:00–17:00). The guide we read suggests arriving around 08:00–09:00 for fewer people and better light than at sunrise.',
    },
    costs: [
      { label: { id: 'Tiket masuk, wisatawan asing', en: 'Entry, foreign visitors' }, value: { id: 'Rp150.000 (hari kerja) / Rp225.000 (akhir pekan, libur)', en: 'IDR 150,000 (weekdays) / 225,000 (weekends, holidays)' }, src: 1 },
      { label: { id: 'Tiket masuk, wisatawan lokal', en: 'Entry, local visitors' }, value: { id: 'Rp10.000', en: 'IDR 10,000' }, src: 0 },
      { label: { id: 'Angkutan Ende–Moni (sekali jalan, per orang)', en: 'Transport Ende–Moni (one way, per person)' }, value: { id: 'Rp20.000–40.000 (blog 1) / Rp60.000–100.000 (blog 2)', en: 'IDR 20,000–40,000 (blog 1) / 60,000–100,000 (blog 2)' }, src: 1 },
      { label: { id: 'Ojek Moni–danau (pulang-pergi)', en: 'Motorbike taxi Moni–lakes (return)' }, value: { id: 'Rp120.000–250.000', en: 'IDR 120,000–250,000' }, src: 1 },
      { label: { id: 'Parkir', en: 'Parking' }, value: NODATA, src: 0 },
    ],
    costNote: {
      id: 'Tarif tiket dikutip dari blog perjalanan (diperbarui 7 Mar 2026), bukan dari loket resmi. Tanyakan tarif terbaru ke Balai Taman Nasional Kelimutu.',
      en: 'Ticket prices are quoted from a travel blog (updated 7 Mar 2026), not from the official ticket office. Ask Kelimutu National Park for current rates.',
    },
    sources: [
      { label: 'Backpack Moments, “How to visit the Kelimutu Lakes”', url: 'https://backpackmoments.com/kelimutu-lakes/', date: CHECKED },
      { label: 'BucketListly, “How to Get to Kelimutu Lakes” (diperbarui 24 Okt 2026)', url: 'https://www.bucketlistly.blog/posts/how-get-to-kelimutu-lakes-flores-indonesia', date: NEW },
      { label: 'Mounture, jam buka dan lokasi yang diizinkan (19 Okt 2026)', url: 'https://mounture.com/berita/mau-menikmati-sunrise-di-kelimutu-simak-jam-buka-dan-lokasi-yang-diizinkan/', date: NEW },
    ],
    videos: [
      { kind: 'file', src: '/videos/danau-kelimutu/01.mp4', poster: '/videos/danau-kelimutu/01.jpg', portrait: true, title: { id: 'Video Danau Kelimutu (1)', en: 'Kelimutu lakes video (1)' } },
      { kind: 'file', src: '/videos/danau-kelimutu/02.mp4', poster: '/videos/danau-kelimutu/02.jpg', portrait: true, title: { id: 'Video Danau Kelimutu (2)', en: 'Kelimutu lakes video (2)' } },
    ],
  },
  'taman-nasional-komodo': {
    mapQuery: 'Taman Nasional Komodo, Labuan Bajo, NTT',
    steps: [
      { from: { id: 'Labuan Bajo', en: 'Labuan Bajo' }, to: { id: 'Pulau di kawasan TN Komodo', en: 'Islands in Komodo National Park' }, how: { id: 'Kapal wisata (paket sehari: Padar, Pink Beach, Pulau Komodo, Taka Makassar, Manta Point)', en: 'Tour boat (day trip: Padar, Pink Beach, Komodo Island, Taka Makassar, Manta Point)' }, time: { id: 'Paket penuh ± 10 jam (berangkat ± 06.00–07.00, kembali 16.00–17.30)', en: 'Full trip ≈ 10 h (departs ≈ 06:00–07:00, back 16:00–17:30)' }, cost: { id: 'Paket bersama Rp1.450.000–1.580.000 per orang, belum termasuk tiket taman', en: 'Shared trip IDR 1,450,000–1,580,000 per person, park fees not included' } },
    ],
    facts: [
      { label: { id: 'Kuota harian (sejak Apr 2026)', en: 'Daily quota (since Apr 2026)' }, value: { id: '1.000 orang seluruh kawasan, via SiORA', en: '1,000 people across the park, via SiORA' } },
      { label: { id: 'Ranger wajib untuk trekking', en: 'Ranger required for trekking' }, value: { id: 'Komodo/Rinca ± Rp200.000, Padar ± Rp150.000 per grup (maks. 5 orang)', en: 'Komodo/Rinca ≈ IDR 200,000, Padar ≈ IDR 150,000 per group (max 5 people)' } },
      { label: { id: 'Trek Padar', en: 'Padar trek' }, value: { id: '± 1 jam, pemandangan 360°', en: '≈ 1 h, 360° view' } },
      { label: { id: 'Trek Pulau Komodo', en: 'Komodo Island trek' }, value: { id: '± 2 jam bersama ranger', en: '≈ 2 h with a ranger' } },
    ],
    budget: { min: 1650000, max: 1830000, basis: { id: 'paket kapal sehari bersama (Rp1,45–1,58 juta) + tiket taman untuk WNI Rp200.000–250.000 per hari menurut operator', en: 'shared day-trip boat package (IDR 1.45–1.58 million) + park fee for Indonesians IDR 200,000–250,000 per day per operators' }, extra: { id: 'Sumber tarif tiket resmi berbeda-beda (Rp5.000 sampai Rp350.000 untuk WNI). Wisatawan asing: tiket Rp375.000–400.000 per hari ditambah ranger; paket kapal ± USD 90', en: 'Sources disagree on official ticket prices (IDR 5,000 up to 350,000 for Indonesians). Foreign visitors: ticket IDR 375,000–400,000 per day plus ranger; boat package ≈ USD 90' } },
    advisory: { level: 'info', asOf: '2026-08-19', src: 2, text: { id: 'Setelah gempa M7,7 (15 Agu 2026), Kemenpar menyatakan (19 Agu 2026) akses pelayaran ke TN Komodo dibuka kembali; Pulau Padar, Loh Liang (Pulau Komodo), Loh Buaya (Rinca), dan Gili Lawa beroperasi lagi, dengan lebih dari 2.000 pengunjung tercatat pada 17 Agu. Cek status dan cuaca terbaru ke operator atau pengelola taman sebelum berangkat.', en: 'After the M7.7 earthquake (15 Aug 2026), the Ministry of Tourism said (19 Aug 2026) that boat access to Komodo National Park had reopened; Padar Island, Loh Liang (Komodo Island), Loh Buaya (Rinca) and Gili Lawa resumed operations, with more than 2,000 visitors recorded on 17 Aug. Check the latest status and weather with your operator or the park before you go.' } },
    summary: {
      id: 'Kawasan pulau dan laut di sekitar Labuan Bajo, tempat melihat komodo dan perbukitan Padar.',
      en: 'Islands and sea around Labuan Bajo, where you can see Komodo dragons and the hills of Padar.',
    },
    description: {
      id: 'Taman Nasional Komodo adalah kawasan pulau dan laut di sekitar Labuan Bajo, Kabupaten Manggarai Barat. Paket perjalanan sehari yang umum menjual mencakup trekking Pulau Padar, Pink Beach, trekking Pulau Komodo bersama ranger untuk melihat komodo, serta snorkeling di Taka Makassar dan Manta Point. Kunjungan dibatasi kuota harian dan trekking harus didampingi ranger.',
      en: 'Komodo National Park is a group of islands and sea around Labuan Bajo, West Manggarai. Common day-trip packages cover the Padar Island trek, Pink Beach, a ranger-led trek on Komodo Island to see Komodo dragons, and snorkelling at Taka Makassar and Manta Point. Visits are limited by a daily quota and treks must be accompanied by a ranger.',
    },
    access: {
      id: 'Semua kunjungan berangkat dari Labuan Bajo dengan kapal. Paket sehari yang kami baca menjemput di hotel sekitar 05.30–06.30, berlayar ± 07.00, dan kembali 16.00–17.30; cuaca dan kondisi laut bisa mengubah rute dan jam. Urutan umum: Padar (trek ± 1 jam), Pink Beach (± 1 jam), Pulau Komodo (trek ± 2 jam dengan ranger), lalu Taka Makassar dan Manta Point (± 1 jam masing-masing). Kuota 1.000 orang per hari dikelola lewat SiORA, jadi pesan lebih awal. Jarak dari bandara ke pelabuhan belum ada di sumber kami.',
      en: 'All visits start from Labuan Bajo by boat. The day trips we read pick you up at your hotel around 05:30–06:30, sail at about 07:00 and return between 16:00 and 17:30; weather and sea conditions can change the route and times. The usual order is Padar (≈ 1 h trek), Pink Beach (≈ 1 h), Komodo Island (≈ 2 h ranger-led trek), then Taka Makassar and Manta Point (≈ 1 h each). The 1,000-people-per-day quota is managed through SiORA, so book early. The distance from the airport to the harbour is not in our sources.',
    },
    costs: [
      { label: { id: 'Tiket masuk, WNI', en: 'Entry, Indonesian citizens' }, value: { id: 'Rp50.000 (Sen–Sab) / Rp75.000 (Minggu, libur) + konservasi Rp10.000; operator menyebut Rp200.000–250.000 per hari; satu sumber Rp5.000', en: 'IDR 50,000 (Mon–Sat) / 75,000 (Sun, holidays) + conservation IDR 10,000; operators quote IDR 200,000–250,000 per day; one source IDR 5,000' }, src: 0 },
      { label: { id: 'Tiket masuk, wisatawan asing', en: 'Entry, foreign visitors' }, value: { id: 'Rp250.000 + konservasi Rp100.000 + pelabuhan Rp25.000 = Rp375.000 per hari; operator menyebut Rp400.000', en: 'IDR 250,000 + conservation IDR 100,000 + harbour IDR 25,000 = IDR 375,000 per day; an operator quotes IDR 400,000' }, src: 0 },
      { label: { id: 'Ranger (per grup maks. 5 orang)', en: 'Ranger (per group of up to 5)' }, value: { id: 'Komodo/Rinca ± Rp200.000; Padar ± Rp150.000', en: 'Komodo/Rinca ≈ IDR 200,000; Padar ≈ IDR 150,000' }, src: 0 },
      { label: { id: 'Paket kapal sehari, bersama (per orang)', en: 'Shared day-trip boat package (per person)' }, value: { id: 'Rp1.450.000 (data Mei 2025) – Rp1.580.000; belum termasuk tiket taman', en: 'IDR 1,450,000 (May 2025 data) – 1,580,000; park fees not included' }, src: 4 },
      { label: { id: 'Izin drone', en: 'Drone permit' }, value: { id: 'Rp2.000.000 per unit per hari', en: 'IDR 2,000,000 per unit per day' }, src: 0 },
    ],
    costNote: {
      id: 'Sumber tarif berbeda satu sama lain (Rp5.000 sampai Rp350.000 untuk WNI) dan semuanya situs operator atau blog, bukan loket resmi. Konfirmasi tarif dan kuota ke pengelola taman atau SiORA (siora.id) sebelum membayar.',
      en: 'Fee sources disagree (IDR 5,000 up to 350,000 for Indonesians) and are all operator sites or blogs, not the official ticket office. Confirm fees and quota with the park authority or SiORA (siora.id) before paying.',
    },
    sources: [
      { label: 'Komodo Resort, tarif dan aturan masuk 2026 (16 Mei 2026)', url: 'https://www.komodoresort.com/blog/komodo-national-park-entrance-fees/', date: TODAY },
      { label: 'Kanha Liveaboard, informasi tiket masuk TN Komodo 2026 (22 Apr 2026)', url: 'https://kanhaliveaboard.com/post/serba-serbi-informasi-tiket-masuk-taman-nasional-komodo-2026/', date: TODAY },
      { label: 'Investortrust, Kemenpar: pariwisata Labuan Bajo dan TN Komodo mulai normal pascagempa (19 Agu 2026)', url: 'https://investortrust.id/national/113494/kemenpar-pariwisata-labuan-bajo-dan-tn-komodo-mulai-normal-pascagempa', date: TODAY },
      { label: 'Ocean Earth Travels, Komodo day trip', url: 'https://www.oceanearthtravels.com/tour-packages/komodo-day-trip', date: TODAY },
      { label: 'IndonesiaJuara, Komodo one day open trip (diubah 7 Mei 2025)', url: 'https://indonesiajuara.asia/en/labuan-bajo-one-day-open-trip', date: TODAY },
      { label: 'Komodo Guide, harga tiket dan kuota 2026 (situs terkait operator)', url: 'https://www.komodoguide.org/travel-guide/fees-and-quota-2026/', date: TODAY },
    ],
    videos: [
      { kind: 'file', src: '/videos/taman-nasional-komodo/01.mp4', poster: '/videos/taman-nasional-komodo/01.jpg', portrait: true, title: { id: 'Video Taman Nasional Komodo (1)', en: 'Komodo National Park video (1)' } },
      { kind: 'file', src: '/videos/taman-nasional-komodo/02.mp4', poster: '/videos/taman-nasional-komodo/02.jpg', portrait: true, title: { id: 'Video Taman Nasional Komodo (2)', en: 'Komodo National Park video (2)' } },
    ],
  },
  'lingko-lodok-cancar': {
    mapQuery: 'Lingko Lodok Cancar, Manggarai, NTT',
    steps: [
      { from: { id: 'Labuan Bajo', en: 'Labuan Bajo' }, to: { id: 'Ruteng', en: 'Ruteng' }, how: { id: 'Elf / travel atau mobil sewa (± 130–135 km)', en: 'Shared elf / travel or hired car (≈ 130–135 km)' }, time: { id: '± 3–4 jam', en: '≈ 3–4 hours' }, cost: { id: 'Elf Rp80.000–120.000 per orang; mobil Rp700.000–900.000 per mobil', en: 'Elf IDR 80,000–120,000 per person; car IDR 700,000–900,000 per car' } },
      { from: { id: 'Ruteng', en: 'Ruteng' }, to: { id: 'Desa Cancar', en: 'Cancar village' }, how: { id: 'Ojek pulang-pergi (± 5–10 km)', en: 'Return motorbike taxi (≈ 5–10 km)' }, cost: { id: 'Rp40.000–60.000', en: 'IDR 40,000–60,000' } },
    ],
    facts: [
      { label: { id: 'Waktu foto terbaik', en: 'Best light' }, value: { id: '06.00–09.00', en: '06:00–09:00' } },
      { label: { id: 'Sawah hijau', en: 'Green fields' }, value: { id: 'Nov–Apr (musim hujan)', en: 'Nov–Apr (wet season)' } },
    ],
    budget: { min: 200000, max: 300000, basis: { id: 'elf Labuan Bajo–Ruteng PP (Rp80–120 rb sekali jalan) + ojek Ruteng–Cancar PP', en: 'return elf Labuan Bajo–Ruteng (IDR 80–120k one way) + return motorbike taxi Ruteng–Cancar' }, extra: { id: 'Tiket titik pandang tidak tercatat di sumber', en: 'Viewpoint ticket not listed in the source' } },
    advisory: { level: 'info', asOf: '2026-08-19', src: 2, text: { id: 'Sebagian destinasi di Manggarai (Wae Rebo, Ruteng Pu’u) sempat ditutup pascagempa M7,7 (15 Agu 2026); Lingko Cancar tidak disebut dalam laporan itu. Jalan Ruteng–Borong dilaporkan pulih (23 Agu 2026). Cek status ke Dinas Pariwisata Manggarai.', en: 'Some Manggarai sites (Wae Rebo, Ruteng Pu’u) were closed after the M7.7 earthquake (15 Aug 2026); Lingko Cancar is not named in that report. The Ruteng–Borong road was reported restored (23 Aug 2026). Check with the Manggarai tourism office.' } },
    summary: {
      id: 'Sawah berpola jaring laba-laba khas Manggarai di sekitar desa Cancar.',
      en: 'The spider-web patterned rice fields typical of Manggarai, around Cancar village.',
    },
    description: {
      id: 'Lingko adalah kebun komunal adat Manggarai yang dibagi dari satu titik pusat (lodok) sehingga membentuk pola seperti jaring laba-laba. Pola ini dilihat dari titik pandang di sekitar desa Cancar. Kondisi sawah bergantung musim tanam.',
      en: 'A lingko is a Manggarai customary communal field divided from a central point (lodok), forming a spider-web pattern. It is seen from viewpoints around Cancar village. The look of the fields depends on the planting season.',
    },
    access: {
      id: 'Desa Cancar terletak sekitar 5–10 km dari Ruteng (sumber berbeda-beda, jadi dua angka dicantumkan). Ojek pulang-pergi dari Ruteng dilaporkan Rp40.000–60.000. Musim hujan (Nov–Apr) membuat sawah hijau; waktu foto terbaik pagi sekitar 06.00–09.00 sebelum awan naik.',
      en: 'Cancar village is about 5–10 km from Ruteng (our source is inconsistent, so both figures are given). A return motorbike taxi from Ruteng is reported at IDR 40,000–60,000. The wet season (Nov–Apr) turns the fields green; best light is around 06:00–09:00 before clouds build.',
    },
    costs: [
      { label: { id: 'Ojek Ruteng–Cancar (pulang-pergi)', en: 'Motorbike taxi Ruteng–Cancar (return)' }, value: { id: 'Rp40.000–60.000', en: 'IDR 40,000–60,000' }, src: 0 },
      { label: { id: 'Tiket masuk titik pandang Cancar', en: 'Cancar viewpoint entry' }, value: { id: 'Tidak tercatat di sumber', en: 'Not listed in the source' }, src: 0 },
      { label: { id: 'Pemandu informal (bila ada)', en: 'Informal guide (if any)' }, value: { id: 'Rp50.000–80.000', en: 'IDR 50,000–80,000' }, src: 0 },
      { label: { id: 'Elf Labuan Bajo–Ruteng (sekali jalan, per orang)', en: 'Elf Labuan Bajo–Ruteng (one way, per person)' }, value: { id: 'Rp80.000–120.000 (Mei 2026)', en: 'IDR 80,000–120,000 (May 2026)' }, src: 1 },
    ],
    costNote: {
      id: 'Sumbernya blog agen perjalanan; tarif pemandu mungkin tidak berlaku di Cancar. Pengelola daerah: Dinas Pariwisata Manggarai.',
      en: 'The source is a travel-agency blog; guide rates may not apply at Cancar. Local authority: Manggarai tourism office.',
    },
    sources: [
      { label: 'Komodo travel guide, “Spider Web Rice Fields (Lingko)”', url: 'https://komodo-1so.pages.dev/experiences/spider-web-rice-fields', date: CHECKED },
      { label: 'Komodo Travel, “Trans-Flores Highway West” (12 Mei 2026)', url: 'https://komodo-1so.pages.dev/blog/flores-overland-guide', date: NEW },
      { label: 'ANTARA, destinasi wisata yang masih ditutup pascagempa di NTT (19 Agu 2026)', url: 'https://www.antaranews.com/berita/5701036/destinasi-wisata-yang-masih-ditutup-pascagempa-di-ntt', date: NEW },
    ],
    videos: [
      { kind: 'file', src: '/videos/lingko-lodok-cancar/01.mp4', poster: '/videos/lingko-lodok-cancar/01.jpg', portrait: true, title: { id: 'Video Lingko Lodok Cancar (1)', en: 'Lingko Lodok Cancar video (1)' } },
      { kind: 'file', src: '/videos/lingko-lodok-cancar/02.mp4', poster: '/videos/lingko-lodok-cancar/02.jpg', portrait: true, title: { id: 'Video Lingko Lodok Cancar (2)', en: 'Lingko Lodok Cancar video (2)' } },
    ],
  },
  '17-pulau-riung': {
    mapQuery: '17 Pulau Riung, Ngada, NTT',
    steps: [
      { from: { id: 'Labuan Bajo', en: 'Labuan Bajo' }, to: { id: 'Ruteng', en: 'Ruteng' }, how: { id: 'Elf / travel atau mobil sewa (± 130–135 km)', en: 'Shared elf / travel or hired car (≈ 130–135 km)' }, time: { id: '± 3–4 jam', en: '≈ 3–4 hours' }, cost: { id: 'Elf Rp80.000–120.000 per orang; mobil Rp700.000–900.000 per mobil', en: 'Elf IDR 80,000–120,000 per person; car IDR 700,000–900,000 per car' } },
      { from: { id: 'Ruteng', en: 'Ruteng' }, to: { id: 'Bajawa', en: 'Bajawa' }, how: { id: 'Elf / travel atau mobil sewa (± 110–130 km)', en: 'Shared elf / travel or hired car (≈ 110–130 km)' }, time: { id: '± 3–5 jam', en: '≈ 3–5 hours' }, cost: { id: 'Elf Rp70.000–100.000 per orang; mobil Rp650.000–850.000 per mobil', en: 'Elf IDR 70,000–100,000 per person; car IDR 650,000–850,000 per car' } },
      { from: { id: 'Bajawa', en: 'Bajawa' }, to: { id: 'Riung', en: 'Riung' }, how: { id: 'Mobil bersama (± 75 km)', en: 'Shared car (≈ 75 km)' }, time: { id: '± 2 jam', en: '≈ 2 hours' }, cost: { id: 'Rp100.000 per orang (2023)', en: 'IDR 100,000 per person (2023)' } },
      { from: { id: 'Dermaga Riung', en: 'Riung pier' }, to: { id: 'Pulau-pulau', en: 'The islands' }, how: { id: 'Perahu sewaan sehari penuh', en: 'Chartered boat, full day' }, time: { id: '± 7,5 jam (09.00–16.30)', en: '≈ 7.5 h (09:00–16:30)' }, cost: { id: '± Rp1.500.000 per perahu (2023)', en: '≈ IDR 1,500,000 per boat (2023)' } },
    ],
    facts: [
      { label: { id: 'Durasi tur', en: 'Tour length' }, value: { id: '± 7,5 jam', en: '≈ 7.5 hours' } },
      { label: { id: 'Dari Bajawa', en: 'From Bajawa' }, value: { id: '± 2 jam', en: '≈ 2 hours' } },
      { label: { id: 'Termasuk di tarif perahu', en: 'In the boat rate' }, value: { id: 'Alat snorkeling + biaya taman', en: 'Snorkel gear + park fees' } },
    ],
    budget: { min: 500000, max: 640000, basis: { id: 'elf Labuan Bajo–Ruteng–Bajawa PP (Rp150–220 rb sekali jalan) + mobil bersama Bajawa–Riung PP (tarif 2023)', en: 'return elf Labuan Bajo–Ruteng–Bajawa (IDR 150–220k one way) + return shared car Bajawa–Riung (2023 rate)' }, extra: { id: 'Ditambah sewa perahu ± Rp1.500.000 per perahu, dibagi rombongan', en: 'Plus boat charter ≈ IDR 1,500,000 per boat, shared by the group' } },
    advisory: { level: 'warn', asOf: '2026-08-27', src: 3, text: { id: 'Pascagempa M7,7 (15 Agu 2026), laporan 27 Agu 2026 menyarankan menghindari area Riung: taman laut sempat ditutup sementara dan snorkeling ditutup. Kami belum menemukan status terbaru. Konfirmasi ke operator atau pengelola kawasan sebelum berangkat.', en: 'After the M7.7 earthquake (15 Aug 2026), a 27 Aug 2026 update advised avoiding the Riung area: the marine park was temporarily closed and snorkelling shut. We have not found a newer status. Confirm with an operator or the park manager before you go.' } },
    summary: {
      id: 'Gugusan pulau kecil di Riung, Ngada, untuk snorkeling dan melihat satwa.',
      en: 'A cluster of small islands off Riung, Ngada, for snorkelling and wildlife.',
    },
    description: {
      id: 'Taman Wisata Alam Laut 17 Pulau Riung ada di Kecamatan Riung, Kabupaten Ngada. Menurut detikBali (29 Okt 2025) kegiatan yang umum meliputi snorkeling dan menyelam, melihat matahari terbenam, serta mengamati kelelawar dan satwa di Pulau Ontoloe. Mengamati mbau (kerabat kecil komodo) disarankan dengan pemandu berpengalaman.',
      en: 'The 17 Islands Marine Park is in Riung District, Ngada Regency. According to detikBali (29 Oct 2025), common activities include snorkelling and diving, sunset viewing, and watching bats and wildlife on Ontoloe Island. Spotting the mbau (a small relative of the komodo) is advised with an experienced guide.',
    },
    access: {
      id: 'Dari Bajawa ke Riung sekitar 2 jam bermobil (mobil bersama dilaporkan Rp100.000 per orang pada 2023); ada bus harian dengan perjalanan minimal 4–5 jam. Dari dermaga Riung, wisata dilakukan dengan perahu sewaan; satu contoh perjalanan berangkat 09.00 dan kembali sekitar 16.30.',
      en: 'Bajawa to Riung is about 2 hours by car (a shared car was reported at IDR 100,000 per person in 2023); a daily bus takes at least 4–5 hours. From Riung pier, trips use a chartered boat; one example trip left at 09:00 and returned around 16:30.',
    },
    costs: [
      { label: { id: 'Sewa perahu satu hari (seluruh perahu)', en: 'Boat charter, full day (whole boat)' }, value: { id: '± Rp1.500.000 (tarif Juli 2023)', en: '≈ IDR 1,500,000 (July 2023 rate)' }, src: 1 },
      { label: { id: 'Termasuk dalam tarif perahu', en: 'Included in the boat rate' }, value: { id: 'Alat snorkeling dan biaya taman nasional', en: 'Snorkel gear and national park fees' }, src: 1 },
      { label: { id: 'Mobil bersama Bajawa–Riung', en: 'Shared car Bajawa–Riung' }, value: { id: 'Rp100.000 per orang (2023)', en: 'IDR 100,000 per person (2023)' }, src: 1 },
      { label: { id: 'Elf Labuan Bajo–Ruteng–Bajawa (sekali jalan, per orang)', en: 'Elf Labuan Bajo–Ruteng–Bajawa (one way, per person)' }, value: { id: 'Rp150.000–220.000 (Mei 2026)', en: 'IDR 150,000–220,000 (May 2026)' }, src: 2 },
    ],
    costNote: {
      id: 'Tarif perahu berusia lebih dari tiga tahun dan bisa sudah berubah. Anggap sebagai gambaran kasar, lalu konfirmasi ke operator di Riung.',
      en: 'The boat rate is over three years old and may have changed. Treat it as a rough guide and confirm with an operator in Riung.',
    },
    sources: [
      { label: 'detikBali, “7 Fakta Menarik TWA Laut 17 Pulau Riung”', url: 'https://www.detik.com/bali/wisata/d-8184459/7-fakta-menarik-tentang-twa-laut-17-pulau-riung-di-ngada', date: CHECKED },
      { label: 'Museum of Wander, “17 Islands Marine Park”', url: 'https://museumofwander.com/17-islands-marine-park-flores/', date: CHECKED },
      { label: 'Komodo Travel, “Trans-Flores Highway West” (12 Mei 2026)', url: 'https://komodo-1so.pages.dev/blog/flores-overland-guide', date: NEW },
      { label: 'Khiri, “Flores Travel Update” (27 Agu 2026)', url: 'https://khiri.com/flores-earthquake-situation/', date: NEW },
    ],
    videos: [
      { kind: 'file', src: '/videos/17-pulau-riung/01.mp4', poster: '/videos/17-pulau-riung/01.jpg', title: { id: 'Video 17 Pulau Riung (1)', en: '17 Riung Islands video (1)' } },
      { kind: 'file', src: '/videos/17-pulau-riung/02.mp4', poster: '/videos/17-pulau-riung/02.jpg', portrait: true, title: { id: 'Video 17 Pulau Riung (2)', en: '17 Riung Islands video (2)' } },
    ],
  },
  'danau-rana-mese': {
    mapQuery: 'Danau Rana Mese, Manggarai Timur, NTT',
    steps: [
      { from: { id: 'Labuan Bajo', en: 'Labuan Bajo' }, to: { id: 'Ruteng', en: 'Ruteng' }, how: { id: 'Elf / travel atau mobil sewa (± 130–135 km)', en: 'Shared elf / travel or hired car (≈ 130–135 km)' }, time: { id: '± 3–4 jam', en: '≈ 3–4 hours' }, cost: { id: 'Elf Rp80.000–120.000 per orang; mobil Rp700.000–900.000 per mobil', en: 'Elf IDR 80,000–120,000 per person; car IDR 700,000–900,000 per car' } },
      { from: { id: 'Ruteng', en: 'Ruteng' }, to: { id: 'Danau Rana Mese', en: 'Rana Mese lake' }, how: { id: 'Kendaraan bermotor', en: 'Motor vehicle' }, time: { id: '± 30 menit', en: '≈ 30 min' } },
      { from: { id: 'Borong', en: 'Borong' }, to: { id: 'Danau Rana Mese', en: 'Rana Mese lake' }, how: { id: 'Kendaraan bermotor', en: 'Motor vehicle' }, time: { id: '± 1 jam', en: '≈ 1 hour' } },
    ],
    facts: [
      { label: { id: 'Jam buka', en: 'Opening hours' }, value: { id: '08.00–18.00 WITA', en: '08:00–18:00 WITA' } },
      { label: { id: 'Ketinggian', en: 'Elevation' }, value: { id: '± 1.200 m', en: '≈ 1,200 m' } },
    ],
    budget: { min: 165000, max: 245000, basis: { id: 'tiket domestik Rp5.000 + elf Labuan Bajo–Ruteng PP (Rp80–120 rb sekali jalan)', en: 'domestic ticket IDR 5,000 + return elf Labuan Bajo–Ruteng (IDR 80–120k one way)' }, extra: { id: 'Ruteng–danau belum ada tarif di sumber. Wisatawan asing: tiket Rp100.000. Penginapan terdekat mulai Rp200.000', en: 'No fare for Ruteng–lake in the sources. Foreign visitors: ticket IDR 100,000. Nearby lodging from IDR 200,000' } },
    advisory: { level: 'info', asOf: '2026-08-19', src: 2, text: { id: 'Laporan pascagempa M7,7 (15 Agu 2026) tidak menyebut Manggarai Timur, tetapi sebagian destinasi di Manggarai sempat ditutup. Jalan Ruteng–Borong dilaporkan pulih (23 Agu 2026). Cek status ke BBKSDA NTT sebelum berangkat.', en: 'Post-quake reports (M7.7, 15 Aug 2026) do not mention East Manggarai, but some Manggarai sites were closed. The Ruteng–Borong road was reported restored (23 Aug 2026). Check with BBKSDA NTT before you go.' } },
    summary: {
      id: 'Danau tenang di tengah hutan kawasan TWA Ruteng, Manggarai Timur.',
      en: 'A quiet lake in the forest of Ruteng Nature Park, East Manggarai.',
    },
    description: {
      id: 'Rana Mese ada di Desa Golo Loni, Kecamatan Rana Mese, Manggarai Timur. Menurut detikBali (23 Agu 2025) danau ini di ketinggian sekitar 1.200 m dengan kedalaman 43 m dan luas sekitar 5 hektare, tersembunyi di hutan. Tersedia toilet, parkir, dan penginapan.',
      en: 'Rana Mese is in Golo Loni village, Rana Mese District, East Manggarai. According to detikBali (23 Aug 2025) the lake lies at about 1,200 m, is 43 m deep and covers about 5 hectares, hidden in forest. Toilets, parking and lodging are available.',
    },
    access: {
      id: 'Dari Ruteng sekitar 30 menit, dari Borong sekitar 1 jam dengan kendaraan bermotor. Buka setiap hari 08.00–18.00 WITA. Pagi paling baik sebelum kabut turun menjelang siang; udara dingin, bawa jaket dan sepatu tertutup. Catatan di database kami menyebut larangan berenang (DetikBali, 11 Mei 2026); patuhi rambu di lokasi.',
      en: 'About 30 minutes from Ruteng and about 1 hour from Borong by motor vehicle. Open daily 08:00–18:00 WITA. Mornings are best before mist rolls in near midday; it is cold, so bring a jacket and closed shoes. Our database notes a swimming ban (DetikBali, 11 May 2026); follow posted signs.',
    },
    costs: [
      { label: { id: 'Tiket masuk, wisatawan domestik', en: 'Entry, domestic visitors' }, value: { id: 'Rp5.000', en: 'IDR 5,000' }, src: 0 },
      { label: { id: 'Tiket masuk, wisatawan asing', en: 'Entry, foreign visitors' }, value: { id: 'Rp100.000', en: 'IDR 100,000' }, src: 0 },
      { label: { id: 'Penginapan terdekat', en: 'Nearby lodging' }, value: { id: 'Mulai Rp200.000', en: 'From IDR 200,000' }, src: 0 },
      { label: { id: 'Elf Labuan Bajo–Ruteng (sekali jalan, per orang)', en: 'Elf Labuan Bajo–Ruteng (one way, per person)' }, value: { id: 'Rp80.000–120.000 (Mei 2026)', en: 'IDR 80,000–120,000 (May 2026)' }, src: 1 },
    ],
    costNote: {
      id: 'Dari satu artikel berita (Agu 2025). Pengelola kawasan: BBKSDA NTT (TWA Ruteng).',
      en: 'From a single news article (Aug 2025). Area manager: BBKSDA NTT (Ruteng Nature Park).',
    },
    sources: [
      { label: 'detikBali, “Asal Usul hingga Tips Berwisata Danau Rana Mese”', url: 'https://www.detik.com/bali/wisata/d-8074891/asal-usul-hingga-tips-berwisata-danau-rana-mese-di-manggarai-timur-ntt', date: CHECKED },
      { label: 'Komodo Travel, “Trans-Flores Highway West” (12 Mei 2026)', url: 'https://komodo-1so.pages.dev/blog/flores-overland-guide', date: NEW },
      { label: 'ANTARA, destinasi wisata yang masih ditutup pascagempa di NTT (19 Agu 2026)', url: 'https://www.antaranews.com/berita/5701036/destinasi-wisata-yang-masih-ditutup-pascagempa-di-ntt', date: NEW },
    ],
    videos: [
      { kind: 'file', src: '/videos/danau-rana-mese/01.mp4', poster: '/videos/danau-rana-mese/01.jpg', portrait: true, title: { id: 'Video Danau Rana Mese (1)', en: 'Lake Rana Mese video (1)' } },
      { kind: 'file', src: '/videos/danau-rana-mese/02.mp4', poster: '/videos/danau-rana-mese/02.jpg', portrait: true, title: { id: 'Video Danau Rana Mese (2)', en: 'Lake Rana Mese video (2)' } },
    ],
  },
  'pantai-tanjung-kajuwulu': {
    mapQuery: 'Pantai Tanjung Kajuwulu, Sikka, NTT',
    steps: [
      { from: { id: 'Kota Maumere', en: 'Maumere town' }, to: { id: 'Kajuwulu', en: 'Kajuwulu' }, how: { id: 'Ke arah barat (± 24 km); moda dan kondisi jalan belum tercatat', en: 'Westward (≈ 24 km); transport and road condition not recorded yet' } },
    ],
    facts: [],
    budget: null,
    advisory: { level: 'info', asOf: '2026-08-19', src: 1, text: { id: 'Pascagempa M7,7 (15 Agu 2026), sebagian destinasi di Sikka sempat ditutup (mis. TWAL Gugus Pulau Teluk Maumere per 19 Agu 2026). Kajuwulu tidak disebut dalam laporan itu; cek ke Dinas Pariwisata Sikka.', en: 'After the M7.7 earthquake (15 Aug 2026), some Sikka sites were closed (e.g. the Maumere Bay islands marine park as of 19 Aug 2026). Kajuwulu is not named in that report; check with the Sikka tourism office.' } },
    summary: {
      id: 'Tanjung berpasir putih dikelilingi bukit, di sebelah barat Kota Maumere, Sikka.',
      en: 'A white-sand headland ringed by hills, west of Maumere town in Sikka.',
    },
    description: {
      id: 'Pantai Kajuwulu berada di Kabupaten Sikka. Direktori Pariwisata Indonesia menggambarkannya sebagai tanjung berpasir putih yang dikelilingi perbukitan, dengan air laut jernih yang cocok untuk berenang dan snorkeling.',
      en: 'Kajuwulu Beach is in Sikka Regency. The Indonesian tourism directory describes a white-sand headland ringed by hills, with clear water suitable for swimming and snorkelling.',
    },
    access: {
      id: 'Sekitar 24 km ke arah barat Kota Maumere. Informasi moda transportasi dan kondisi jalan belum tersedia.',
      en: 'About 24 km west of Maumere town. Information on transport options and road condition is not available yet.',
    },
    costs: [
      { label: { id: 'Tiket masuk', en: 'Entry' }, value: NODATA, src: 0 },
      { label: { id: 'Parkir', en: 'Parking' }, value: NODATA, src: 0 },
    ],
    costNote: {
      id: 'Belum ada angka biaya yang kami temukan untuk tempat ini. Tanyakan tarif terbaru ke Dinas Pariwisata Sikka.',
      en: 'We have not found cost figures for this place yet. Ask the Sikka tourism office for current rates.',
    },
    sources: [
      { label: 'Direktori Pariwisata Indonesia, Pantai Kajuwulu', url: 'https://direktoripariwisata.id/pdf/334', date: CHECKED },
      { label: 'ANTARA, destinasi wisata yang masih ditutup pascagempa di NTT (19 Agu 2026)', url: 'https://www.antaranews.com/berita/5701036/destinasi-wisata-yang-masih-ditutup-pascagempa-di-ntt', date: NEW },
    ],
    videos: [
      { kind: 'file', src: '/videos/pantai-tanjung-kajuwulu/01.mp4', poster: '/videos/pantai-tanjung-kajuwulu/01.jpg', portrait: true, title: { id: 'Video Pantai Tanjung Kajuwulu (1)', en: 'Tanjung Kajuwulu beach video (1)' } },
      { kind: 'file', src: '/videos/pantai-tanjung-kajuwulu/02.mp4', poster: '/videos/pantai-tanjung-kajuwulu/02.jpg', portrait: true, title: { id: 'Video Pantai Tanjung Kajuwulu (2)', en: 'Tanjung Kajuwulu beach video (2)' } },
    ],
  },
};
