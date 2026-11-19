import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signOut } from './actions';
import { STATUS_LABEL, STATUS_ORDER, countByStatus, type DestinationRow } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const supabase = await createClient();
  if (!supabase) redirect('/admin/login');
  const { data: claims } = await supabase.auth.getClaims();
  const uid = claims?.claims?.sub;
  if (!uid) redirect('/admin/login');

  // Peran dibaca dari tabel profiles (RLS: staf hanya melihat profilnya sendiri; admin melihat semua).
  const { data: profile } = await supabase.from('profiles').select('display_name, role').eq('id', uid).maybeSingle();

  const bar = (name: string) => (
    <header className="adm-bar">
      <strong>Pilihan Timur · Admin</strong>
      <form action={signOut}>
        <span>{name} </span>
        <button className="adm-btn" type="submit">
          Keluar
        </button>
      </form>
    </header>
  );

  if (!profile) {
    return (
      <>
        {bar('')}
        <main className="adm-main">
          <h1>Akun belum diberi akses</h1>
          <p className="adm-note">
            Akun ini sudah masuk, tetapi belum terdaftar sebagai editor/admin. Minta admin menambahkan baris untuk akun ini di tabel{' '}
            <code>profiles</code>.
          </p>
        </main>
      </>
    );
  }

  const { data, error } = await supabase
    .from('destinations')
    .select('slug, name, kabupaten, access, doc_status, status, verified_at')
    .order('sort_order');
  const rows = (data ?? []) as DestinationRow[];
  const { count: openReports } = await supabase.from('correction_reports').select('id', { count: 'exact', head: true }).eq('status', 'open');
  const counts = countByStatus(rows);

  return (
    <>
      {bar(`${profile.display_name} (${profile.role})`)}
      <main className="adm-main">
        <h1>Destinasi</h1>
        <p>
          Semua destinasi masih kandidat. Penerbitan hanya oleh admin, dan butuh tanggal verifikasi serta minimal satu sumber (diwajibkan database).
        </p>
        {error && (
          <p className="adm-err" role="alert">
            Gagal memuat data: {error.message}
          </p>
        )}
        <p>
          <Link className="adm-btn" href="/admin/reports">
            Laporan koreksi{openReports ? ` (${openReports} baru)` : ''}
          </Link>
        </p>
        <ul className="adm-stats">
          {STATUS_ORDER.map((s) => (
            <li key={s}>
              <b>{counts[s]}</b>
              {STATUS_LABEL[s]}
            </li>
          ))}
        </ul>
        <div className="adm-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kabupaten</th>
                <th>Akses</th>
                <th>Dokumentasi</th>
                <th>Status</th>
                <th>Verifikasi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug}>
                  <td>
                    <Link href={`/admin/destinations/${r.slug}`}>{r.name}</Link>
                  </td>
                  <td>{r.kabupaten}</td>
                  <td>{r.access}</td>
                  <td>{r.doc_status}</td>
                  <td>
                    <span className={`st st-${r.status}`}>{STATUS_LABEL[r.status]}</span>
                  </td>
                  <td>{r.verified_at ? r.verified_at.slice(0, 10) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
