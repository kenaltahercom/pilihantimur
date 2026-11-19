// Membuat supabase/seed.sql dari src/lib/data.ts (sumber tunggal 32 kandidat).
// Jalankan: node scripts/gen-seed.mts   (semua baris berstatus 'draft' — belum diverifikasi)
import { writeFileSync } from 'node:fs';
import { CATEGORIES, DESTINATIONS, REGIONS } from '../src/lib/data.ts';

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const out: string[] = ['-- DIHASILKAN oleh scripts/gen-seed.mts — jangan diedit manual.', 'begin;'];

REGIONS.forEach((r, i) => {
  out.push(`insert into public.regions (id, sort_order) values (${q(r.id)}, ${i});`);
  out.push(`insert into public.region_translations (region_id, lang, name) values (${q(r.id)}, 'id', ${q(r.id_name)}), (${q(r.id)}, 'en', ${q(r.en_name)});`);
});
Object.entries(CATEGORIES).forEach(([k, v], i) => {
  out.push(`insert into public.categories (id, sort_order) values (${q(k)}, ${i});`);
  out.push(`insert into public.category_translations (category_id, lang, name) values (${q(k)}, 'id', ${q(v.id)}), (${q(k)}, 'en', ${q(v.en)});`);
});
out.push('insert into public.destinations (slug, name, kabupaten, region_id, access, doc_status, sort_order, status) values');
out.push(DESTINATIONS.map((d, i) => `  (${q(d.slug)}, ${q(d.name)}, ${q(d.kabupaten)}, ${q(d.region)}, ${q(d.access)}, ${q(d.doc)}, ${i}, 'draft')`).join(',\n') + ';');
const cats = DESTINATIONS.filter((d) => d.category);
out.push('insert into public.destination_categories (destination_id, category_id)');
out.push('select d.id, v.c from public.destinations d join (values');
out.push(cats.map((d) => `  (${q(d.slug)}, ${q(d.category!)})`).join(',\n'));
out.push(') as v(slug, c) on v.slug = d.slug;');
out.push('commit;');
writeFileSync(new URL('../supabase/seed.sql', import.meta.url), out.join('\n') + '\n');
console.log(`seed.sql: ${REGIONS.length} wilayah, ${Object.keys(CATEGORIES).length} kategori, ${DESTINATIONS.length} destinasi`);
