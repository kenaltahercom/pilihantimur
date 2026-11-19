import type { PubPhoto } from '@/lib/published';

/**
 * Foto yang dipasang langsung dari folder `public/photos/<slug>/` (tahap awal, sebelum foto masuk ke bucket Supabase).
 * Setiap foto: berkas, ukuran, teks alternatif ID/EN (hanya apa yang terlihat di foto), dan kredit.
 * Lisensi dinyatakan dan dikonfirmasi oleh pengelola situs. Foto dari database (yang terbit) selalu didahulukan.
 * Urutan = urutan tampil; foto pertama menjadi foto utama.
 */
export interface StaticPhoto {
  file: string;
  w: number;
  h: number;
  altId: string;
  altEn: string;
  credit: string;
}

const KOLEKSI = 'Koleksi Pilihan Timur';

export const PHOTOS: Record<string, StaticPhoto[]> = {
  'taman-nasional-komodo': [
    { file: '01.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Pemandangan udara pulau berbukit kering dengan teluk-teluk berair toska dan pasir di sela perbukitan.',
      altEn: 'Aerial view of a dry hilly island with turquoise bays and sandy strips between the hills.' },
    { file: '02.jpg', w: 1472, h: 1104, credit: KOLEKSI,
      altId: 'Teluk berpasir dan berbukit di bawah langit senja berwarna jingga, dilihat dari jalur batu di puncak bukit.',
      altEn: 'Sandy bays and hills under an orange dusk sky, seen from a rocky path on a hilltop.' },
    { file: '03.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Gapura batu bertuliskan "Welcome to Komodo National Park" dengan pengunjung berjalan di jalan tanah di baliknya.',
      altEn: 'A stone gateway reading "Welcome to Komodo National Park" with visitors walking along a dirt path beyond it.' },
    { file: '04.jpg', w: 1306, h: 980, credit: KOLEKSI,
      altId: 'Dua biawak komodo di rumput dengan laut dan perbukitan di belakangnya.',
      altEn: 'Two Komodo dragons on the grass with the sea and hills behind them.' },
    { file: '05.jpg', w: 1472, h: 1104, credit: KOLEKSI,
      altId: 'Kapal kayu berlayar di teluk berair toska di tepi tebing, dengan beberapa biawak komodo di pantai pasir.',
      altEn: 'A wooden boat sailing in a turquoise bay beside a cliff, with Komodo dragons on the sandy beach.' },
    { file: '06.jpg', w: 1472, h: 1104, credit: KOLEKSI,
      altId: 'Papan petunjuk "Selamat datang di Padar Selatan, Taman Nasional Komodo" di padang rumput dengan bukit di belakangnya.',
      altEn: 'A signpost reading "Selamat datang di Padar Selatan, Taman Nasional Komodo" on a grassy slope with a hill behind it.' },
  ],
  'danau-kelimutu': [
    { file: '01.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Pemandangan udara dua danau kawah berwarna toska dan biru di Kelimutu saat senja.',
      altEn: 'Aerial view of two turquoise and blue crater lakes at Kelimutu at dusk.' },
    { file: '02.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Danau kawah toska dan satu danau gelap dengan matahari terbit di cakrawala.',
      altEn: 'A turquoise crater lake and a dark one, with the sun rising on the horizon.' },
    { file: '03.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Danau kawah toska yang diselimuti kabut dan awan tebal.',
      altEn: 'A turquoise crater lake wrapped in mist and thick cloud.' },
    { file: '04.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Dua pengunjung berjalan di jalur setapak di bawah pepohonan tinggi.',
      altEn: 'Two visitors walking along a trail beneath tall trees.' },
    { file: '05.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Pengunjung menuruni tangga berpagar di lereng berbatu di bawah langit biru.',
      altEn: 'Visitors descending a railed staircase on a rocky slope under a blue sky.' },
    { file: '06.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Perbukitan hijau dan awan putih di bawah langit biru, dilihat dari jalur berpagar kayu.',
      altEn: 'Green hills and white clouds under a blue sky, seen from a path with wooden railings.' },
  ],
  'danau-rana-mese': [
    { file: '05.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Danau berair hijau tenang di bawah hutan berkabut dan langit mendung.',
      altEn: 'A calm green lake below a misty forest and an overcast sky.' },
    { file: '01.jpg', w: 974, h: 730, credit: KOLEKSI,
      altId: 'Pemandangan udara danau kecil yang dikelilingi hutan lebat dan perbukitan.',
      altEn: 'Aerial view of a small lake surrounded by dense forest and hills.' },
    { file: '02.jpg', w: 888, h: 666, credit: KOLEKSI,
      altId: 'Permukaan danau hijau yang tenang dibingkai dedaunan dan batang pohon.',
      altEn: 'The calm green surface of a lake framed by foliage and tree trunks.' },
    { file: '03.jpg', w: 896, h: 672, credit: KOLEKSI,
      altId: 'Tepi danau dengan pepohonan rimbun yang memantul di air hijau.',
      altEn: 'A lakeshore with leafy trees reflected in green water.' },
    { file: '04.jpg', w: 1280, h: 960, credit: KOLEKSI,
      altId: 'Tangga batu menuju gazebo kecil di tepi danau, dikelilingi hutan.',
      altEn: 'A stone staircase leading to a small gazebo on the lakeshore, surrounded by forest.' },
    { file: '06.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Jalan beraspal diambil dari rendah, diapit pepohonan tinggi di bawah langit biru.',
      altEn: 'A paved road photographed from low down, lined with tall trees under a blue sky.' },
    { file: '07.jpg', w: 1530, h: 1148, credit: KOLEKSI,
      altId: 'Danau di antara perbukitan berhutan dilihat dari sela batang dan dedaunan pohon, dengan sinar matahari di atas.',
      altEn: 'A lake between forested hills seen through tree trunks and foliage, with sunlight above.' },
  ],
  'lingko-lodok-cancar': [
    { file: '01.jpg', w: 1500, h: 1124, credit: 'Instagram @tukang_jalan',
      altId: 'Sawah berpola jaring laba-laba dilihat dari udara, hijau merata dengan permukiman di sudut atas.',
      altEn: 'Aerial view of a spider-web patterned rice field, evenly green, with a settlement in the upper corner.' },
    { file: '02.jpg', w: 1334, h: 1000, credit: KOLEKSI,
      altId: 'Sawah padi menguning dengan pematang hijau dan rumpun pohon di kejauhan.',
      altEn: 'Ripening golden rice fields with a green path and a clump of trees in the distance.' },
    { file: '03.jpg', w: 1500, h: 1124, credit: 'Instagram @beautifuldestinationsindonesia',
      altId: 'Dua anak berpegangan tangan memandang sawah jaring laba-laba yang hijau kekuningan.',
      altEn: 'Two children holding hands looking out over a yellow-green spider-web rice field.' },
    { file: '04.jpg', w: 1334, h: 1000, credit: KOLEKSI,
      altId: 'Petak-petak sawah berpola jaring laba-laba dengan kampung di latar belakang.',
      altEn: 'Spider-web patterned rice paddies with a village in the background.' },
    { file: '05.jpg', w: 912, h: 684, credit: KOLEKSI,
      altId: 'Sawah hijau terang berpola radial dengan permukiman dan hutan di belakangnya.',
      altEn: 'A bright green radial-patterned rice field with houses and forest behind it.' },
  ],
  'pantai-tanjung-kajuwulu': [
    { file: '01.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Pantai berpasir dengan gazebo beratap biru dan lampu taman, laut biru di seberangnya.',
      altEn: 'A sandy beach with a blue-roofed gazebo and garden lamps, with blue sea beyond.' },
    { file: '02.jpg', w: 1040, h: 780, credit: KOLEKSI,
      altId: 'Pulau karang kecil berpohon di perairan toska yang dangkal.',
      altEn: 'A small rocky tree-covered islet in shallow turquoise water.' },
    { file: '03.jpg', w: 1040, h: 780, credit: KOLEKSI,
      altId: 'Pantai pasir putih di bawah pepohonan dengan lampu taman di tepinya.',
      altEn: 'A white sand beach beneath trees with garden lamps along its edge.' },
    { file: '04.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Gapura bertuliskan "Selamat datang di Tanjung Kajuwulu" yang menghadap laut.',
      altEn: 'A gateway reading "Selamat datang di Tanjung Kajuwulu" facing the sea.' },
    { file: '05.jpg', w: 798, h: 598, credit: KOLEKSI,
      altId: 'Jalan setapak beton di antara rumput menuju gazebo biru dan laut.',
      altEn: 'A concrete path through grass leading to blue gazebos and the sea.' },
    { file: '06.jpg', w: 798, h: 598, credit: KOLEKSI,
      altId: 'Matahari terbenam jingga di atas bukit rumput dengan pohon kering dan laut.',
      altEn: 'An orange sunset over a grassy hill with bare trees and the sea.' },
    { file: '07.jpg', w: 864, h: 648, credit: KOLEKSI,
      altId: 'Pandangan udara perbukitan hijau dan jalan berkelok di tepi teluk.',
      altEn: 'Aerial view of green hills and a winding road beside a bay.' },
  ],
  '17-pulau-riung': [
    { file: '01.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Tanjung pasir putih dan laut biru-toska dengan perbukitan di seberang.',
      altEn: 'A white sand spit and blue-turquoise sea with hills on the far side.' },
    { file: '02.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Kawanan kelelawar beterbangan di atas hutan bakau.',
      altEn: 'A swarm of bats flying above a mangrove forest.' },
    { file: '03.jpg', w: 1574, h: 1180, credit: KOLEKSI,
      altId: 'Seseorang berjalan di perairan dangkal yang jernih di tepi pantai dengan perbukitan di latar.',
      altEn: 'A person wading through clear shallow water by the shore with hills behind.' },
    { file: '04.jpg', w: 1554, h: 1166, credit: KOLEKSI,
      altId: 'Papan bertuliskan "17 Pulau Riung" di dermaga dengan perahu bersandar.',
      altEn: 'A sign reading "17 Pulau Riung" on a pier with a moored boat.' },
    { file: '05.jpg', w: 1600, h: 1200, credit: KOLEKSI,
      altId: 'Pandangan udara pulau-pulau kecil dan terumbu di perairan toska.',
      altEn: 'Aerial view of small islands and reef in turquoise water.' },
    { file: '06.jpg', w: 970, h: 728, credit: KOLEKSI,
      altId: 'Pantai pasir putih dengan gazebo beratap ilalang dan laut yang tenang.',
      altEn: 'A white sand beach with thatched gazebos and calm sea.' },
  ],
};

/** Foto terpasang untuk sebuah destinasi, dalam bentuk yang sama dengan foto dari database. */
export function staticPhotos(slug: string, lang: 'id' | 'en'): PubPhoto[] {
  return (PHOTOS[slug] ?? []).map((p, i) => ({
    id: `static-${slug}-${p.file}`,
    src: `/photos/${slug}/${p.file}`,
    altId: p.altId,
    altEn: p.altEn,
    credit: p.credit,
    license: lang === 'id' ? 'Berlisensi' : 'Licensed',
    featured: i === 0,
    width: p.w,
    height: p.h,
  }));
}
