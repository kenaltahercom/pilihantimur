-- DIHASILKAN oleh scripts/gen-seed.mts — jangan diedit manual.
begin;
insert into public.regions (id, sort_order) values ('flores', 0);
insert into public.region_translations (region_id, lang, name) values ('flores', 'id', 'Flores dan pulau-pulau sekitarnya'), ('flores', 'en', 'Flores & surrounding islands');
insert into public.regions (id, sort_order) values ('sumba', 1);
insert into public.region_translations (region_id, lang, name) values ('sumba', 'id', 'Sumba'), ('sumba', 'en', 'Sumba');
insert into public.regions (id, sort_order) values ('timor', 2);
insert into public.region_translations (region_id, lang, name) values ('timor', 'id', 'Timor dan pulau sekitarnya'), ('timor', 'en', 'Timor & surrounding islands');
insert into public.regions (id, sort_order) values ('alor', 3);
insert into public.region_translations (region_id, lang, name) values ('alor', 'id', 'Alor dan Pantar'), ('alor', 'en', 'Alor & Pantar');
insert into public.regions (id, sort_order) values ('lembata', 4);
insert into public.region_translations (region_id, lang, name) values ('lembata', 'id', 'Lembata dan Solor'), ('lembata', 'en', 'Lembata & Solor');
insert into public.regions (id, sort_order) values ('rote', 5);
insert into public.region_translations (region_id, lang, name) values ('rote', 'id', 'Rote Ndao'), ('rote', 'en', 'Rote Ndao');
insert into public.regions (id, sort_order) values ('sabu', 6);
insert into public.region_translations (region_id, lang, name) values ('sabu', 'id', 'Sabu Raijua'), ('sabu', 'en', 'Sabu Raijua');
insert into public.categories (id, sort_order) values ('beach', 0);
insert into public.category_translations (category_id, lang, name) values ('beach', 'id', 'Pantai & Pesisir'), ('beach', 'en', 'Beach & Coastal Landscape');
insert into public.categories (id, sort_order) values ('lakes', 1);
insert into public.category_translations (category_id, lang, name) values ('lakes', 'id', 'Danau & Lanskap Vulkanik'), ('lakes', 'en', 'Lakes & Volcanic Landscape');
insert into public.categories (id, sort_order) values ('waterfalls', 2);
insert into public.category_translations (category_id, lang, name) values ('waterfalls', 'id', 'Air Terjun'), ('waterfalls', 'en', 'Waterfalls');
insert into public.categories (id, sort_order) values ('mountains', 3);
insert into public.category_translations (category_id, lang, name) values ('mountains', 'id', 'Pegunungan & Dataran Tinggi'), ('mountains', 'en', 'Mountains & Highlands');
insert into public.categories (id, sort_order) values ('geo', 4);
insert into public.category_translations (category_id, lang, name) values ('geo', 'id', 'Keajaiban Geologi'), ('geo', 'en', 'Geological Wonders');
insert into public.categories (id, sort_order) values ('springs', 5);
insert into public.category_translations (category_id, lang, name) values ('springs', 'id', 'Mata Air & Panas Bumi'), ('springs', 'en', 'Springs & Geothermal');
insert into public.categories (id, sort_order) values ('naturecult', 6);
insert into public.category_translations (category_id, lang, name) values ('naturecult', 'id', 'Alam & Budaya'), ('naturecult', 'en', 'Nature & Culture');
insert into public.categories (id, sort_order) values ('culture', 7);
insert into public.category_translations (category_id, lang, name) values ('culture', 'id', 'Budaya & Warisan'), ('culture', 'en', 'Culture & Heritage');
insert into public.destinations (slug, name, kabupaten, region_id, access, doc_status, sort_order, status) values
  ('pantai-pede', 'Pantai Pede', 'Manggarai Barat', 'flores', 'A', 'P1', 0, 'draft'),
  ('gua-batu-cermin', 'Gua Batu Cermin', 'Manggarai Barat', 'flores', 'A', 'P1', 1, 'draft'),
  ('puncak-waringin', 'Puncak Waringin', 'Manggarai Barat', 'flores', 'A', 'P1', 2, 'draft'),
  ('pantai-waecicu', 'Pantai Waecicu', 'Manggarai Barat', 'flores', 'A', 'P1', 3, 'draft'),
  ('bukit-sylvia', 'Bukit Sylvia', 'Manggarai Barat', 'flores', 'B', 'P2', 4, 'draft'),
  ('ruteng-puu', 'Ruteng Pu''u', 'Manggarai', 'flores', 'A', 'P1', 5, 'draft'),
  ('lingko-lodok-cancar', 'Lingko Lodok Cancar', 'Manggarai', 'flores', 'B', 'P1', 6, 'draft'),
  ('pantai-cepi-watu', 'Pantai Cepi Watu', 'Manggarai Timur', 'flores', 'A', 'P1', 7, 'draft'),
  ('pantai-liang-bala', 'Pantai Liang Bala', 'Manggarai Timur', 'flores', 'A', 'P1', 8, 'draft'),
  ('pantai-ligota', 'Pantai Ligota', 'Manggarai Timur', 'flores', 'B', 'P1', 9, 'draft'),
  ('danau-rana-mese', 'Danau Rana Mese', 'Manggarai Timur', 'flores', 'B', 'P1', 10, 'draft'),
  ('bukit-wolobobo', 'Bukit Wolobobo', 'Ngada', 'flores', 'A', 'P2', 11, 'draft'),
  ('air-terjun-ogi', 'Air Terjun Ogi', 'Ngada', 'flores', 'B', 'P1', 12, 'draft'),
  ('17-pulau-riung', '17 Pulau Riung', 'Ngada', 'flores', 'B', 'P3', 13, 'draft'),
  ('danau-kelimutu', 'Danau Kelimutu', 'Ende', 'flores', 'B', 'P1', 14, 'draft'),
  ('pantai-mbuu', 'Pantai Mbu''u', 'Ende', 'flores', 'A', 'P2', 15, 'draft'),
  ('pantai-batu-cincin', 'Pantai Batu Cincin', 'Ende', 'flores', 'A', 'P2', 16, 'draft'),
  ('pantai-waiara', 'Pantai Waiara', 'Sikka', 'flores', 'A', 'P2', 17, 'draft'),
  ('pantai-tanjung-kajuwulu', 'Pantai Tanjung Kajuwulu', 'Sikka', 'flores', 'A', 'P1', 18, 'draft'),
  ('pantai-wairterang', 'Pantai Wairterang', 'Sikka', 'flores', 'B', 'P1', 19, 'draft'),
  ('pantai-koka', 'Pantai Koka', 'Sikka', 'flores', 'B', 'P2', 20, 'draft'),
  ('pantai-paga', 'Pantai Paga', 'Sikka', 'flores', 'B', 'P3', 21, 'draft'),
  ('pantai-weri', 'Pantai Weri', 'Flores Timur', 'flores', 'A', 'P1', 22, 'draft'),
  ('pantai-asam-satu', 'Pantai Asam Satu', 'Flores Timur', 'flores', 'A', 'P2', 23, 'draft'),
  ('wai-plati-oka', 'Wai Plati Oka', 'Flores Timur', 'flores', 'A', 'P2', 24, 'draft'),
  ('pantai-nuha-waibalun', 'Pantai Nuha Waibalun', 'Flores Timur', 'flores', 'B', 'P3', 25, 'draft'),
  ('pantai-kota-sau', 'Pantai Kota Sau', 'Flores Timur', 'flores', 'B', 'P3', 26, 'draft'),
  ('pantai-wulen-lou', 'Pantai Wulen Lou', 'Lembata', 'lembata', 'A', 'P1', 27, 'draft'),
  ('pantai-waijarang', 'Pantai Waijarang', 'Lembata', 'lembata', 'B', 'P1', 28, 'draft'),
  ('pantai-hadakewa', 'Pantai Hadakewa', 'Lembata', 'lembata', 'B', 'P2', 29, 'draft'),
  ('tanjung-nuhanera', 'Tanjung Nuhanera', 'Lembata', 'lembata', 'B', 'P1', 30, 'draft'),
  ('pantai-mingar', 'Pantai Mingar', 'Lembata', 'lembata', 'B', 'P2', 31, 'draft');
insert into public.destination_categories (destination_id, category_id)
select d.id, v.c from public.destinations d join (values
  ('pantai-pede', 'beach'),
  ('gua-batu-cermin', 'geo'),
  ('puncak-waringin', 'mountains'),
  ('pantai-waecicu', 'beach'),
  ('bukit-sylvia', 'mountains'),
  ('lingko-lodok-cancar', 'naturecult'),
  ('pantai-cepi-watu', 'beach'),
  ('pantai-liang-bala', 'beach'),
  ('pantai-ligota', 'beach'),
  ('danau-rana-mese', 'lakes'),
  ('bukit-wolobobo', 'mountains'),
  ('air-terjun-ogi', 'waterfalls'),
  ('danau-kelimutu', 'lakes'),
  ('pantai-mbuu', 'beach'),
  ('pantai-batu-cincin', 'beach'),
  ('pantai-waiara', 'beach'),
  ('pantai-tanjung-kajuwulu', 'beach'),
  ('pantai-wairterang', 'beach'),
  ('pantai-koka', 'beach'),
  ('pantai-paga', 'beach'),
  ('pantai-weri', 'beach'),
  ('pantai-asam-satu', 'beach'),
  ('pantai-nuha-waibalun', 'beach'),
  ('pantai-kota-sau', 'beach'),
  ('pantai-wulen-lou', 'beach'),
  ('pantai-waijarang', 'beach'),
  ('pantai-hadakewa', 'beach'),
  ('tanjung-nuhanera', 'beach'),
  ('pantai-mingar', 'beach')
) as v(slug, c) on v.slug = d.slug;
commit;
