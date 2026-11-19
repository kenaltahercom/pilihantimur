\set ON_ERROR_STOP off
\pset tuples_only on
-- siapkan pengguna
insert into auth.users values ('00000000-0000-0000-0000-0000000000a1'),('00000000-0000-0000-0000-0000000000e1');
insert into profiles (id, display_name, role) values
 ('00000000-0000-0000-0000-0000000000a1','Admin','admin'),
 ('00000000-0000-0000-0000-0000000000e1','Editor','editor');

\echo '1. anon melihat destinasi draft (harus 0):'
set role anon; select count(*) from destinations; select count(*) from destination_translations; reset role; reset request.jwt.claim.sub;

\echo '2. anon tak boleh insert destinasi (harus error):'
set role anon; insert into destinations (slug,name,kabupaten,region_id,access,doc_status) values ('x','x','x','flores','A','P1'); reset role; reset request.jwt.claim.sub;

\echo '3. editor melihat semua (45):'
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000e1'; select count(*) from destinations;

\echo '4. editor mencoba menerbitkan (harus error 42501):'
update destinations set status='published' where slug='pantai-pede';
\echo '5. editor ajukan review (harus OK, 1):'
update destinations set status='in_review' where slug='pantai-pede'; select count(*) from destinations where status='in_review';
\echo '6. editor tak bisa naikkan role sendiri (harus error/0 baris):'
update profiles set role='admin' where id='00000000-0000-0000-0000-0000000000e1'; select role from profiles where id='00000000-0000-0000-0000-0000000000e1';
\echo '7. editor tak bisa baca audit (0):'
select count(*) from audit_logs;
reset role; reset request.jwt.claim.sub;

\echo '8. admin terbitkan tanpa verifikasi (harus error 23514):'
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a1';
update destinations set status='published' where slug='pantai-pede';
\echo '9. admin terbitkan tanpa sumber, walau verified (harus error):'
update destinations set verified_at = now() where slug='pantai-pede';
update destinations set status='published' where slug='pantai-pede';
\echo '10. admin: sumber + terbit (harus OK):'
insert into content_sources (destination_id,title,url) select id,'Dinas Pariwisata (contoh uji)','https://example.org' from destinations where slug='pantai-pede';
update destinations set status='published' where slug='pantai-pede';
select status, published_at is not null from destinations where slug='pantai-pede';
reset role; reset request.jwt.claim.sub;

\echo '11. anon: hanya 1 destinasi + 1 sumber kini terlihat:'
set role anon; select count(*) from destinations; select count(*) from content_sources; reset role; reset request.jwt.claim.sub;

\echo '12. media published tanpa kredit/lisensi (harus error check):'
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a1';
insert into media_assets (kind,url,status) values ('photo','https://example.org/a.jpg','published');
insert into media_assets (kind,url,status,credit,license) values ('photo','https://example.org/a.jpg','published','Fotografer X','CC BY 4.0');
reset role; reset request.jwt.claim.sub;
\echo '13. anon laporan koreksi (insert OK, baca ditolak):'
set role anon; insert into correction_reports (destination_slug,message) values ('pantai-pede','Jam buka sudah berubah sejak 2026');
select count(*) from correction_reports; reset role; reset request.jwt.claim.sub;
\echo '14. anon tak bisa set status laporan sendiri (harus error):'
set role anon; insert into correction_reports (destination_slug,message,status) values ('pantai-pede','pesan cukup panjang','resolved'); reset role; reset request.jwt.claim.sub;
\echo '15. audit tercatat (admin lihat >0):'
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a1'; select count(*)>0 from audit_logs; reset role; reset request.jwt.claim.sub;
\echo '16. slug tak valid (harus error):'
insert into destinations (slug,name,kabupaten,region_id,access,doc_status) values ('Bad Slug','x','x','flores','A','P1');
