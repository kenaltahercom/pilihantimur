import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getStaff } from '@/lib/admin-auth';
import { REPORT_STATUS, REPORT_STATUS_LABEL, isReportStatus, type ReportStatus } from '@/lib/report';
import { DESTINATIONS } from '@/lib/data';
import { ReportRow } from './ReportRow';

export const dynamic = 'force-dynamic';

type Row = { id: string; destination_slug: string | null; message: string; contact: string | null; status: ReportStatus; created_at: string; handled_note: string | null };
const NAME = new Map(DESTINATIONS.map((d) => [d.slug, d.name]));

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const staff = await getStaff();
  if (!staff) redirect('/admin');
  const { status } = await searchParams;
  const filter = isReportStatus(status) ? status : null;

  let q = staff.supabase
    .from('correction_reports')
    .select('id, destination_slug, message, contact, status, created_at, handled_note')
    .order('created_at', { ascending: false })
    .limit(200);
  if (filter) q = q.eq('status', filter);
  const { data, error } = await q;
  const rows = (data ?? []) as Row[];

  return (
    <>
      <header className="adm-bar">
        <strong>Pilihan Timur · Admin</strong>
        <Link className="adm-btn" href="/admin">← Daftar destinasi</Link>
      </header>
      <main className="adm-main">
        <h1>Laporan koreksi</h1>
        <p className="adm-hint">Dikirim pengunjung dari halaman destinasi. Isi laporan hanyalah petunjuk: periksa ke sumber sebelum mengubah konten. Kontak pelapor bersifat pribadi; jangan dibagikan.</p>
        <nav className="adm-actions" aria-label="Saring status">
          <Link className={`adm-btn${filter ? '' : ' solid'}`} href="/admin/reports">Semua</Link>
          {REPORT_STATUS.map((s) => (
            <Link key={s} className={`adm-btn${filter === s ? ' solid' : ''}`} href={`/admin/reports?status=${s}`}>
              {REPORT_STATUS_LABEL[s]}
            </Link>
          ))}
        </nav>
        {error && <p className="adm-err" role="alert">Gagal memuat laporan: {error.message}</p>}
        {!error && rows.length === 0 && <p className="adm-note">Belum ada laporan{filter ? ` berstatus “${REPORT_STATUS_LABEL[filter]}”` : ''}.</p>}
        <ul className="adm-list" style={{ display: 'grid' }}>
          {rows.map((r) => (
            <li key={r.id} style={{ display: 'grid' }}>
              <div>
                <strong>
                  {r.destination_slug ? <Link href={`/admin/destinations/${r.destination_slug}`}>{NAME.get(r.destination_slug) ?? r.destination_slug}</Link> : '—'}
                </strong>{' '}
                · <time dateTime={r.created_at}>{r.created_at.slice(0, 16).replace('T', ' ')} UTC</time> · <span className={`st st-${r.status === 'resolved' ? 'published' : 'draft'}`}>{REPORT_STATUS_LABEL[r.status]}</span>
              </div>
              <p style={{ whiteSpace: 'pre-wrap', margin: '.5rem 0' }}>{r.message}</p>
              <p className="adm-hint">Kontak: {r.contact ?? '—'}</p>
              <ReportRow id={r.id} status={r.status} note={r.handled_note ?? ''} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
