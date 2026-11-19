> **Catatan 15 Nov 2026:** cakupan produk berubah dari 45 kandidat menjadi 6 destinasi pilihan, nama menjadi "Pilihan Timur", fitur Kawasan/Cerita/Video Atlas/Panduan/Rute ditunda (halaman dialihkan). Lihat `docs/decisions/0003-pilihan-timur.md`. Bagian lain PRD ini belum direvisi.

# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# RAGAM TIMUR
## Website Panduan Wisata Nusa Tenggara Timur

**Tagline:** Setiap Pulau Punya Cerita.  
**English Tagline:** Every Island Has a Story.  
**Brand Descriptor:** A Local Travel Guide to East Nusa Tenggara.

| Informasi | Keterangan |
|---|---|
| Nama produk | Ragam Timur |
| Jenis produk | Bilingual Tourism Guide Platform |
| Kategori | Tourism, Travel Guide & Destination Discovery |
| Cakupan wilayah | Seluruh Nusa Tenggara Timur |
| Target pengguna | Wisatawan domestik dan internasional |
| Bahasa | Bahasa Indonesia dan English |
| Platform | Website responsif |
| Status | Perencanaan produk dan persiapan desain |
| Versi dokumen | PRD 1.0 — Draft |

---

# 1. EXECUTIVE SUMMARY

Ragam Timur merupakan platform digital panduan wisata yang bertujuan memperkenalkan keindahan alam, keragaman budaya, destinasi, dan kehidupan masyarakat di seluruh wilayah Provinsi Nusa Tenggara Timur (NTT).

Platform ini dirancang untuk membantu wisatawan menemukan destinasi, melihat dokumentasi visual, memahami akses perjalanan, mengenal cerita masyarakat lokal, serta memperoleh inspirasi sebelum melakukan perjalanan.

Berbeda dari website wisata yang hanya berfungsi sebagai katalog destinasi, Ragam Timur menggabungkan beberapa pengalaman dalam satu platform, yaitu eksplorasi destinasi, galeri foto, dokumentasi video, panduan perjalanan praktis, dan cerita lokal.

Konsep utama yang diusung adalah **Living Travel Atlas**, yaitu panduan wisata digital yang terus berkembang melalui dokumentasi visual dan informasi destinasi dari berbagai daerah NTT.

Ragam Timur tidak berfokus pada pemesanan tiket, hotel, atau pembayaran perjalanan. Tujuan utamanya adalah membuat wisatawan lebih mudah mengenal tempat yang ingin dikunjungi serta mempersiapkan perjalanan dengan informasi yang lebih terstruktur.

# 2. BACKGROUND & PROBLEM STATEMENT

Informasi mengenai destinasi wisata NTT saat ini dapat ditemukan melalui berbagai platform, seperti TikTok, Instagram, Google Search, YouTube, Google Maps, website pemerintah, blog perjalanan, dan komunitas wisata.

Calon wisatawan biasanya mencari inspirasi melalui media sosial, melanjutkan pencarian melalui mesin pencari, menonton dokumentasi perjalanan, memeriksa lokasi menggunakan peta, kemudian bertanya kepada teman atau masyarakat lokal apabila masih membutuhkan informasi tambahan.

Proses tersebut mengharuskan wisatawan berpindah-pindah platform untuk mengumpulkan informasi yang saling berkaitan.

Beberapa hipotesis permasalahan yang menjadi dasar pengembangan Ragam Timur adalah:

1. Informasi destinasi wisata NTT tersebar di berbagai sumber.
2. Wisatawan membutuhkan waktu untuk mengumpulkan informasi lokasi, akses, fasilitas, dan kondisi destinasi.
3. Foto dan video promosi tidak selalu memberikan gambaran lengkap mengenai perjalanan menuju lokasi.
4. Informasi akses dan fasilitas bisa berbeda kebaruannya antara satu sumber dengan sumber lainnya.
5. Destinasi di luar wilayah populer belum tentu mudah ditemukan oleh wisatawan.
6. Wisatawan internasional membutuhkan informasi berbahasa Inggris serta penjelasan konteks budaya lokal.

Permasalahan tersebut merupakan hipotesis awal dan belum seluruhnya divalidasi melalui wawancara pengguna.

**Problem statement:**

Wisatawan domestik dan internasional membutuhkan panduan yang lebih terstruktur untuk menemukan, memahami, dan mempersiapkan perjalanan ke destinasi wisata Nusa Tenggara Timur karena informasi yang mereka perlukan tersebar di berbagai platform dan belum selalu tersedia dalam bentuk yang lengkap serta mudah diperiksa.

# 3. TARGET USERS

Ragam Timur memiliki tiga kelompok pengguna.

### 3.1 Domestic Travelers

Wisatawan Indonesia yang ingin menjelajahi NTT, mencari destinasi, melihat dokumentasi, dan mendapatkan panduan perjalanan.

Kebutuhan:
- Informasi destinasi.
- Lokasi dan akses.
- Dokumentasi foto dan video.
- Tips perjalanan.
- Inspirasi rute.
- Informasi budaya lokal.

### 3.2 International Travelers

Wisatawan luar negeri yang membutuhkan informasi perjalanan ke NTT dalam bahasa Inggris.

Kebutuhan:
- Informasi bilingual.
- Lokasi dan panduan akses.
- Etika kunjungan.
- Penjelasan budaya.
- Informasi praktis perjalanan.

### 3.3 Internal Users

Pengguna internal terdiri atas admin dan editor yang bertanggung jawab mengelola informasi destinasi, media, artikel, terjemahan, serta pembaruan konten.

### Persona Ilustratif

Nadia, 24 tahun, seorang wisatawan domestik dari luar NTT, berencana mengunjungi Flores bersama teman-temannya. Ia mencari inspirasi melalui TikTok dan Instagram, membaca artikel melalui Google, menonton YouTube, serta menggunakan Google Maps.

Kesulitannya adalah harus membuka banyak sumber untuk memahami satu destinasi secara menyeluruh.

Nadia membutuhkan satu panduan yang dapat membantunya melihat destinasi, memahami lokasinya, mengetahui akses perjalanan, serta mengenal pengalaman lokal.

Persona ini merupakan ilustrasi untuk kebutuhan desain, bukan hasil wawancara pengguna.

# 4. PRODUCT VISION & POSITIONING

**Vision:** Menjadi platform panduan digital yang memperkenalkan kekayaan destinasi, alam, dan budaya Nusa Tenggara Timur kepada wisatawan Indonesia maupun dunia.

**Mission:** Menyajikan informasi wisata yang terstruktur, visual, mudah ditemukan, bilingual, dan memperhatikan konteks lokal.

**Positioning:**

A bilingual local travel guide that helps travelers discover East Nusa Tenggara through curated destinations, visual journeys, practical travel notes, and local stories.

### Product Differentiation

Ragam Timur mengembangkan empat pendekatan utama:

**A. Photo Journey**

Setiap destinasi memiliki dokumentasi foto dari berbagai sudut, sehingga wisatawan dapat memahami karakter tempat sebelum berkunjung.

**B. Video Atlas**

Fitur dokumentasi video dari berbagai kabupaten/kota. Admin dapat menambahkan video melalui unggahan atau tautan video, kemudian menghubungkannya dengan daerah dan destinasi tertentu.

**C. Real Travel Notes**

Informasi mengenai lokasi, akses, perkiraan jarak, fasilitas, persiapan, kondisi perjalanan, dan tanggal terakhir pemeriksaan informasi.

**D. Stories from the Locals**

Artikel dan dokumentasi tentang budaya, tradisi, kerajinan, kuliner, lingkungan, serta kehidupan masyarakat lokal.

Pembeda utama yang ingin dibangun adalah integrasi antara katalog destinasi lintas 22 kabupaten/kota, dokumentasi foto dan video, panduan akses, serta cerita lokal dalam satu pengalaman bilingual. Fitur serupa mungkin tersedia pada platform lain, sehingga diferensiasi ini perlu diuji dan dikembangkan melalui kualitas implementasi.

# 5. BRAND IDENTITY & VISUAL DIRECTION

### 5.1 Brand Identity

Nama merek: **RAGAM TIMUR**

Tagline: **Setiap Pulau Punya Cerita.**

English tagline: **Every Island Has a Story.**

Brand descriptor: **A Local Travel Guide to East Nusa Tenggara.**

Karakter merek:
- Lokal.
- Hangat.
- Eksploratif.
- Informatif.
- Menghargai budaya.
- Ramah bagi wisatawan internasional.

Brand archetype menggunakan kombinasi The Explorer dan The Sage.

### 5.2 Logo Concept

Logo menggunakan ilustrasi yang menggabungkan unsur:
- Matahari sebagai simbol kehangatan.
- Pulau dan pegunungan sebagai representasi lanskap.
- Laut dan perahu sebagai simbol kehidupan bahari.
- Rumah tradisional sebagai inspirasi kehidupan lokal.
- Elemen geometris orisinal sebagai interpretasi visual kekayaan kerajinan NTT.

Logo utama terdiri dari simbol ilustratif, tulisan RAGAM TIMUR, tagline, dan descriptor.

Variasi yang perlu dikembangkan:
1. Primary logo.
2. Horizontal logo.
3. Brand symbol.
4. Favicon.
5. Monochrome logo.
6. Versi terang dan gelap.

Logo yang sudah dibuat masih berupa konsep PNG. Pengembangan vektor SVG dan pemeriksaan akhir elemen visual perlu dilakukan sebelum penggunaan publik.

### 5.3 Typography

**DM Serif Display:** digunakan untuk heading utama, judul halaman, headline editorial, dan judul artikel.

**Manrope:** digunakan untuk navigasi, paragraf, deskripsi, tombol, form, caption, dan dashboard.

Hierarki ukuran:
- H1 desktop: 64–80 px.
- H1 mobile: 40–48 px.
- H2: 40–48 px.
- H3: 24–30 px.
- Body: 16–18 px.
- Caption: 12–14 px.

### 5.4 Color Palette

| Warna | Hex | Penggunaan |
|---|---|---|
| Ocean Teal | #173F4A | Identitas utama |
| Sea Teal | #477A78 | Aksen dan navigasi |
| Savanna Gold | #C99B5E | Aksen visual |
| Terracotta | #A65F49 | Elemen pendukung |
| Limestone Cream | #F4EFE4 | Background utama |
| Charcoal | #272E2D | Teks utama |

Gaya visual yang digunakan adalah **Local Editorial**, yaitu tampilan seperti majalah perjalanan modern dengan ruang kosong yang cukup, fotografi besar, tipografi kuat, dan navigasi sederhana.

# 6. CORE USER EXPERIENCE

Keberhasilan pengalaman pertama pengguna ditentukan oleh satu tindakan utama:

**Lihat satu destinasi dan kenali sebelum berkunjung.**

Pengunjung pertama kali harus dapat menemukan satu destinasi yang menarik, melihat dokumentasi visualnya, dan mendapatkan gambaran mengenai lokasi serta aksesnya.

Alur pengalaman pertama:

1. Pengunjung membuka homepage.
2. Melihat foto destinasi unggulan.
3. Menemukan destinasi melalui Explore atau pencarian.
4. Membuka halaman detail.
5. Melihat Photo Journey.
6. Membaca lokasi dan informasi akses.
7. Menemukan tips serta persiapan perjalanan.

Pengalaman ini menjadi prioritas utama dalam desain homepage dan halaman detail destinasi.

### Core User Journey

**Destination Discovery:** pengguna menemukan tempat berdasarkan nama, wilayah, atau kategori.

**Destination Exploration:** pengguna melihat foto, informasi, dan cerita destinasi.

**Travel Preparation:** pengguna memahami akses dan hal yang perlu disiapkan.

**Travel Inspiration:** pengguna menemukan itinerary dan destinasi terkait.

# 7. COVERAGE & DESTINATION STRUCTURE

Ragam Timur mencakup seluruh 22 kabupaten/kota NTT.

Untuk navigasi editorial, destinasi dikelompokkan menjadi tujuh kawasan:

1. Flores dan pulau-pulau sekitarnya.
2. Sumba.
3. Timor dan pulau sekitarnya.
4. Alor dan Pantar.
5. Lembata dan Solor.
6. Rote Ndao.
7. Sabu Raijua.

Filter administratif harus tetap menyediakan pilihan seluruh kabupaten/kota, bukan hanya kelompok editorial tersebut.

Kategori wisata alam:
- Beach & Coastal Landscape.
- Marine & Island Exploration.
- Lakes & Volcanic Landscape.
- Waterfalls.
- Mountains & Highlands.
- Geological Wonders.
- Savanna & Forest.
- Springs & Geothermal.

Kategori pendukung:
- Nature & Culture.
- Village & Local Life.
- Culinary.
- Culture & Heritage.

Destinasi yang memiliki unsur alam sekaligus budaya dapat masuk ke dua kategori sesuai konten dan konteksnya.

# 8. DESTINATION CURATION

Prioritas pertama adalah wisata alam yang relatif mudah dijangkau dan mempunyai dokumentasi foto publik.

### Tingkat akses

- A: relatif mudah dijangkau kendaraan dengan jalan kaki singkat.
- B: memerlukan persiapan, perjalanan lebih jauh, atau jalan kaki.
- C: membutuhkan transportasi khusus, perahu, atau trekking berat.

### Status dokumentasi

- P1: terdapat dokumentasi dari pemerintah, dinas, pengelola, atau portal resmi.
- P2: terdapat dokumentasi dari media atau direktori wisata.
- P3: dokumentasi publik ada, tetapi pemilik atau lisensinya belum jelas.
- P0: dokumentasi belum ditemukan atau belum memadai.

Status dokumentasi tidak berarti izin penggunaan foto telah diperoleh.

### Kandidat awal Flores dan sekitarnya

**Manggarai Barat**
1. Pantai Pede — A/P1.
2. Gua Batu Cermin — A/P1.
3. Puncak Waringin — A/P1.
4. Pantai Waecicu — A/P1.
5. Bukit Sylvia — B/P2.

**Manggarai**
1. Wae Garit — A/P1.
2. Liang Bua — A/P1.
3. Ruteng Pu'u — A/P1.
4. Lingko Lodok Cancar — B/P1.
5. Lingko Meler — B/P1.

**Manggarai Timur**
1. Pantai Cepi Watu — A/P1.
2. Pantai Liang Bala — A/P1.
3. Pantai Ligota — B/P1.
4. Danau Rana Mese — B/P1.
5. Pantai Mbolata — B/P2.

**Ngada**
1. Bukit Wolobobo — A/P2.
2. Air Panas Mengeruda — B/P1/P2.
3. Air Terjun Ogi — B/P1.
4. Danau Kawah Wawomudha — B/P1.
5. Air Panas Malanage — B/P2.

**Nagekeo**
1. Bukit Weworowet — A/P2.
2. Batu Kodok Nggolo Mbay — A/P2.
3. Pantai Kota Jogo — B/P1.
4. Air Panas Nangadhero — B/P2.
5. Pantai Enagera — B/P3.

**Ende**
1. Danau Kelimutu — B/P1.
2. Pantai Penggajawa — A/P1.
3. Pantai Mbu'u — A/P2.
4. Pantai Batu Cincin — A/P2.
5. Air Terjun Murundao — B/P2.

**Sikka**
1. Pantai Waiara — A/P2.
2. Pantai Tanjung Kajuwulu — A/P1.
3. Pantai Wairterang — B/P1.
4. Pantai Koka — B/P2.
5. Pantai Paga — B/P3.

**Flores Timur**
1. Pantai Weri — A/P1.
2. Pantai Asam Satu — A/P2.
3. Wai Plati Oka — A/P2.
4. Pantai Nuha Waibalun — B/P3.
5. Pantai Kota Sau — B/P3.

**Lembata**
1. Pantai Wulen Lou — A/P1.
2. Pantai Waijarang — B/P1.
3. Pantai Hadakewa — B/P2.
4. Tanjung Nuhanera — B/P1.
5. Pantai Mingar — B/P2.

Daftar tersebut merupakan 45 kandidat untuk proses verifikasi, bukan 45 destinasi siap publikasi. Kandidat dari Sumba, Timor, Alor, Rote, dan Sabu Raijua akan dilengkapi menggunakan standar kurasi yang sama.

### Persyaratan destinasi sebelum publish

- Nama dan lokasi terkonfirmasi.
- Koordinat dapat diperiksa.
- Akses memiliki sumber informasi.
- Foto hero dan galeri tersedia.
- Hak penggunaan foto jelas.
- Deskripsi ID dan EN lengkap.
- Informasi keselamatan tersedia.
- Sumber dan tanggal pemeriksaan tercatat.

# 9. SITE MAP

Struktur halaman publik:

**Home**
- Hero.
- Destination Finder.
- Editor's Picks.
- Explore Regions.
- Explore Experiences.
- Photo Journey.
- Video Atlas.
- Local Stories.
- Know Before You Go.
- Itinerary Inspiration.
- Responsible Travel.
- Footer.

**Destinations**
- Destination Listing.
- Search & Filter.
- Destination Detail.

**Regions**
- Region Listing.
- Region Detail.

**Experiences**
- Nature & Adventure.
- Marine & Beach.
- Culture & Heritage.
- Village & Local Life.
- Culinary.

**Photo Journey**
- Galeri foto.
- Detail dokumentasi.
- Kredit fotografer.

**Video Atlas**
- Video listing.
- Filter wilayah.
- Filter destinasi.
- Video detail.

**Travel Stories**
- Artikel budaya dan kehidupan masyarakat.
- Detail artikel.

**Travel Guides**
- Panduan akses.
- Persiapan perjalanan.
- Tips dan etika wisata.

**Itineraries**
- Daftar itinerary.
- Detail urutan perjalanan.

**Supporting Pages**
- About.
- Responsible Travel.
- Contact.
- Report Information.
- Privacy Policy.

Struktur bahasa:
- /id untuk Bahasa Indonesia.
- /en untuk English.

# 10. MODUL FRONTEND

Komponen publik yang diperlukan:

- SiteHeader.
- Navigation.
- LanguageSwitcher.
- SiteFooter.
- HeroSection.
- DestinationFinder.
- DestinationCard.
- DestinationGrid.
- DestinationGallery.
- PhotoJourney.
- VideoPlayer.
- VideoGallery.
- RegionCard.
- ExperienceCard.
- StoryCard.
- ArticleContent.
- TravelGuidePanel.
- ItineraryCard.
- ItineraryTimeline.
- GettingTherePanel.
- TravelTipsPanel.
- InformationFreshness.
- Breadcrumbs.
- Search & Filter.
- LoadingSkeleton.
- EmptyState.
- ErrorState.

Halaman harus responsif dan mempertahankan keterbacaan pada ukuran layar desktop, tablet, dan smartphone.

# 11. MODUL ADMIN DASHBOARD

Dashboard merupakan sistem pengelolaan konten internal.

Menu utama:
1. Overview.
2. Destination Management.
3. Region Management.
4. Category Management.
5. Photo Library.
6. Video Library.
7. Travel Stories.
8. Travel Guides.
9. Itinerary Management.
10. Translation Management.
11. Source Management.
12. Verification Logs.
13. User Management.
14. Site Settings.

Admin dapat membuat, mengedit, memeriksa, menerbitkan, dan mengarsipkan konten.

Editor dapat membuat dan mengedit konten, menambahkan foto/video, mengatur terjemahan, serta mengirimkan konten untuk pemeriksaan admin.

# 12. VIDEO MANAGEMENT REQUIREMENTS

Video Atlas merupakan salah satu fitur yang perlu dikembangkan secara khusus.

Setiap video memiliki:
- Judul.
- Deskripsi.
- Wilayah.
- Destinasi terkait.
- Kategori video.
- Thumbnail.
- File atau URL video.
- Bahasa.
- Subtitle.
- Tanggal pengambilan.
- Kredit pembuat.
- Informasi izin penggunaan.
- Status publikasi.
- Pilihan featured video.

Jenis video:
- Aerial View.
- Destination Preview.
- Travel Documentary.
- Road to Destination.
- Local Stories.
- Nature Documentary.

Untuk MVP, admin dapat menambahkan tautan video eksternal yang didukung. Fitur unggah file video langsung dapat diperluas menggunakan layanan penyimpanan dan streaming yang sesuai agar performa website tetap terjaga.

# 13. DATABASE DESIGN

Database menggunakan PostgreSQL.

Tabel utama:

**profiles:** identitas admin dan editor.

**regions:** data wilayah.

**region_translations:** nama dan deskripsi wilayah bilingual.

**categories:** kategori destinasi.

**category_translations:** terjemahan kategori.

**destinations:** data utama destinasi, koordinat, slug, wilayah, dan status.

**destination_translations:** nama, ringkasan, deskripsi, akses, dan tips dalam dua bahasa.

**destination_categories:** hubungan destinasi dan kategori.

**stories:** data artikel.

**story_translations:** konten artikel bilingual.

**itineraries:** data perjalanan.

**itinerary_translations:** terjemahan itinerary.

**itinerary_stops:** urutan destinasi dalam itinerary.

**media_assets:** data foto, video, URL, thumbnail, lisensi, kredit, dan metadata.

**destination_media:** hubungan media dengan destinasi.

**content_sources:** sumber referensi informasi.

**verification_logs:** riwayat pemeriksaan konten.

**correction_reports:** laporan kesalahan informasi.

**audit_logs:** aktivitas admin dan editor.

Kombinasi konten dan bahasa harus unik. Konten draft tidak boleh tampil kepada pengunjung publik. Setiap media harus memiliki hubungan dengan konten yang relevan.

# 14. ROLE & PERMISSION

**Public Visitor**
- Melihat seluruh konten yang dipublikasikan.
- Mencari dan memfilter destinasi.
- Membaca artikel dan panduan.
- Melihat foto dan video.
- Mengakses konten dalam dua bahasa.
- Melaporkan informasi yang tidak akurat.

**Editor**
- Membuat destinasi dan artikel.
- Mengedit konten.
- Mengunggah foto dan video.
- Mengelola terjemahan.
- Mencatat sumber informasi.
- Mengajukan publikasi.

**Admin**
- Semua kewenangan editor.
- Mengelola akun dan role.
- Mengelola wilayah dan kategori.
- Menyetujui publikasi.
- Mengarsipkan konten.
- Mengatur konfigurasi website.
- Memeriksa audit dan verifikasi konten.

Pengunjung tidak diwajibkan memiliki akun.

# 15. TECH STACK

Teknologi yang direkomendasikan:

- Next.js dan TypeScript untuk framework aplikasi.
- Tailwind CSS untuk styling.
- Supabase dan PostgreSQL untuk database serta autentikasi.
- Supabase Storage atau layanan media lain untuk foto.
- Layanan video eksternal atau streaming untuk video.
- next-intl untuk bilingual.
- MapLibre dan OpenStreetMap untuk peta tahap lanjutan.
- Vercel sebagai opsi deployment.

Sistem perlu memiliki validasi server, proteksi kredensial, pembatasan hak akses, serta kebijakan keamanan database.

# 16. NON-FUNCTIONAL REQUIREMENTS

1. Responsive design untuk desktop, tablet, dan mobile.
2. Target LCP maksimal 2,5 detik dalam kondisi pengujian yang ditentukan.
3. SEO bilingual dengan canonical, hreflang, dan sitemap.
4. Konten publik dapat diakses tanpa login.
5. Gambar teroptimasi.
6. Video tidak boleh memperlambat halaman secara berlebihan.
7. Alt text dan aksesibilitas keyboard.
8. Kontras warna yang memenuhi target WCAG 2.2 AA.
9. Audit log untuk perubahan konten.
10. Informasi lokasi dan akses memiliki sumber serta tanggal pemeriksaan.

# 17. ACCEPTANCE CRITERIA

MVP dinilai memenuhi kebutuhan apabila:

- Pengunjung dapat membuka homepage tanpa login.
- Pengunjung dapat menemukan minimal satu destinasi.
- Pengunjung dapat membuka halaman detail destinasi.
- Foto galeri dapat ditampilkan dengan baik.
- Informasi lokasi dan akses tersedia.
- Pencarian dan filter berdasarkan wilayah serta kategori berfungsi.
- Pengunjung dapat berganti bahasa Indonesia dan Inggris.
- Artikel serta itinerary dapat dibaca.
- Video eksternal yang disetujui dapat ditampilkan pada halaman destinasi.
- Admin dapat membuat dan mengedit destinasi.
- Admin/editor dapat mengelola foto dan metadata media.
- Admin dapat mengelola video.
- Editor tidak dapat menerbitkan tanpa persetujuan admin.
- Halaman publik hanya menampilkan konten published.
- Sumber dan tanggal pemeriksaan dapat dikelola.
- Website bekerja pada perangkat mobile dan desktop.

# 18. PRODUCT ROADMAP

**Phase 1 — Product & Research Validation**

Menguji kebutuhan wisatawan, menyusun wawancara, memeriksa kompetitor, dan melakukan pemeriksaan nama merek.

**Phase 2 — Destination Research & Curation**

Mengumpulkan kandidat destinasi 22 kabupaten/kota, memverifikasi lokasi, akses, informasi, dokumentasi foto, serta hak penggunaannya.

**Phase 3 — Brand & UI/UX Design**

Finalisasi logo, design system, wireframe, prototype, homepage, katalog, halaman detail, dan dashboard.

**Phase 4 — Database & System Architecture**

Finalisasi database, API, authentication, authorization, bilingual structure, dan media management.

**Phase 5 — MVP Development**

Pengembangan frontend publik, backend, CMS, galeri, Video Atlas, dan fitur inti wisata.

**Phase 6 — Testing & Deployment**

Testing responsivitas, performa, bilingual, keamanan, konten, serta peluncuran.

# 19. PRODUCT SUCCESS METRICS

Keberhasilan Ragam Timur tidak hanya diukur dari banyaknya pengunjung.

Metrik utama:
- Jumlah pengunjung yang membuka detail destinasi.
- Persentase pengunjung yang berhasil menemukan destinasi melalui pencarian.
- Interaksi dengan galeri foto.
- Interaksi dengan video destinasi.
- Penggunaan filter wilayah dan kategori.
- Penggunaan language switcher.
- Jumlah destinasi yang memiliki informasi terverifikasi.
- Jumlah aset foto dengan izin penggunaan yang jelas.
- Jumlah konten yang diperbarui sesuai jadwal pemeriksaan.

Metrik pengalaman pertama yang paling penting adalah keberhasilan pengguna menemukan satu destinasi, melihat dokumentasinya, dan memahami informasi dasar perjalanan.

# 20. RISIKO DAN PENGENDALIAN

Risiko utama proyek meliputi:

**Informasi kedaluwarsa:** setiap konten harus mencatat sumber dan tanggal pemeriksaan.

**Foto tanpa izin:** seluruh foto harus memiliki lisensi atau izin penggunaan.

**Video berukuran besar:** gunakan hosting/streaming yang sesuai, optimasi thumbnail, dan pemuatan video saat dibutuhkan.

**Cakupan wilayah terlalu luas:** pengumpulan data dilakukan bertahap, tetapi seluruh wilayah sudah tersedia dalam struktur katalog.

**Risiko keselamatan:** kondisi gunung api, ombak, jalur trekking, dan kawasan konservasi harus mengikuti informasi pengelola serta otoritas terkait.

**Kesalahan informasi budaya:** konten harus memiliki konteks lokal dan ditinjau secara layak.

**Perbedaan terjemahan:** setiap versi bahasa harus diperiksa sebelum publikasi.

# 21. KEPUTUSAN PRODUK AKHIR SEMENTARA

Ragam Timur merupakan platform panduan wisata bilingual untuk seluruh wilayah NTT dengan pendekatan Local Editorial dan konsep Living Travel Atlas.

Pengalaman utama pengguna adalah menemukan satu destinasi, melihat dokumentasi fotonya, dan memahami informasi dasar sebelum berkunjung.

Foto menjadi dokumentasi utama, sedangkan Video Atlas menjadi fitur pendukung yang dapat dikelola melalui dashboard admin. Seluruh konten diorganisasikan berdasarkan wilayah, destinasi, kategori, dan pengalaman lokal.

Kurasi awal telah menyusun 45 kandidat destinasi dari sembilan kabupaten dalam kelompok Flores dan sekitarnya. Kandidat tersebut masih perlu verifikasi lanjutan. Wilayah Sumba, Timor, Alor, Rote, dan Sabu Raijua akan dikurasi menggunakan standar yang sama.

Nama merek, tagline, arah logo, font, palet warna, tipe produk, target pengguna, dan arah visual telah ditentukan sebagai dasar desain. Namun, nama/domain tetap memerlukan pemeriksaan ketersediaan dan logo konsep perlu difinalisasi dalam format vektor.

**RAGAM TIMUR — SETIAP PULAU PUNYA CERITA.**

*Explore the Islands. Understand the Culture. Discover the Stories.*

**Status: PRD 1.0 — perencanaan produk dan kurasi konten. Belum memasuki tahap coding.**