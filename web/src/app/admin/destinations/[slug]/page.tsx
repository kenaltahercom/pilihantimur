import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getStaff } from '@/lib/admin-auth';
import { STATUS_LABEL, type ContentStatus } from '@/lib/admin';
import { Workspace, type SourceRow, type Tr } from './Workspace';
import { Photos, type PhotoRow } from './Photos';

export const dynamic = 'force-dynamic';

const EMPTY: Tr = { summary: '', description: '', access_notes: '', tips: '' };
type P = { params: Promise<{ slug: string }> };

export default async function EditDestination({ params }: P) {
  const { slug } = await params;
  const staff = await getStaff();
  if (!staff) redirect('/admin');
  const { supabase, role } = staff;

  const { data: d } = await supabase
    .from('destinations')
    .select('id, slug, name, kabupaten, access, doc_status, latitude, longitude, status, verified_at')
    .eq('slug', slug)
    .maybeSingle();
  if (!d) notFound();

  const [trs, srcs, logs, media] = await Promise.all([
    supabase.from('destination_translations').select('lang, summary, description, access_notes, tips').eq('destination_id', d.id),
    supabase.from('content_sources').select('id, title, url, publisher, accessed_on').eq('destination_id', d.id).order('created_at'),
    supabase.from('verification_logs').select('created_at, note').eq('destination_id', d.id).order('created_at', { ascending: false }).limit(3),
    supabase.from('destination_media').select('sort_order, media_assets(id, url, status, featured, alt_id, alt_en, credit, license, permission_note, taken_on)').eq('destination_id', d.id).order('sort_order'),
  ]);
  const pick = (lang: string): Tr => {
    const r = (trs.data ?? []).find((x: { lang: string }) => x.lang === lang);
    return r ? { summary: r.summary ?? '', description: r.description ?? '', access_notes: r.access_notes ?? '', tips: r.tips ?? '' } : { ...EMPTY };
  };
  type M = { id: string; url: string; status: string; featured: boolean; alt_id: string | null; alt_en: string | null; credit: string | null; license: string | null; permission_note: string | null; taken_on: string | null };
  const photos: PhotoRow[] = ((media.data ?? []) as unknown as { media_assets: M | null }[])
    .map((r) => r.media_assets)
    .filter((m): m is M => m !== null)
    .map((m) => ({ id: m.id, url: m.url, status: m.status, featured: m.featured, alt_id: m.alt_id ?? '', alt_en: m.alt_en ?? '', credit: m.credit ?? '', license: m.license ?? '', permission_note: m.permission_note ?? '', taken_on: m.taken_on ?? '' }));
  const status = d.status as ContentStatus;
  const locked = ['published', 'archived'].includes(status) && role !== 'admin';

  return (
    <>
      <header className="adm-bar">
        <strong>Pilihan Timur · Admin</strong>
        <Link className="adm-btn" href="/admin">← Daftar destinasi</Link>
      </header>
      <main className="adm-main">
        <h1>{d.name}</h1>
        <p>
          {d.kabupaten} · <span className={`st st-${status}`}>{STATUS_LABEL[status]}</span>{' '}
          {d.verified_at ? <span className="st st-published">Terverifikasi {String(d.verified_at).slice(0, 10)}</span> : <span className="st st-draft">Belum terverifikasi</span>}
        </p>
        <Workspace
          slug={d.slug}
          role={role}
          status={status}
          locked={locked}
          verifiedAt={d.verified_at}
          initial={{
            access: d.access,
            doc_status: d.doc_status,
            latitude: d.latitude === null ? '' : String(d.latitude),
            longitude: d.longitude === null ? '' : String(d.longitude),
            id: pick('id'),
            en: pick('en'),
          }}
          sources={(srcs.data ?? []) as SourceRow[]}
          logs={(logs.data ?? []) as { created_at: string; note: string | null }[]}
        />
        <Photos slug={d.slug} role={role} locked={locked} destPublished={status === 'published'} photos={photos} />
      </main>
    </>
  );
}
