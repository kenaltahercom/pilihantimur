'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { DestinationInput } from '@/lib/destination-form';
import { bestDocStatus, classifyUrl } from '@/lib/sources/trust';
import { addSource, markVerified, publishDestination, removeSource, requestReview, saveDestination, unpublishDestination, type Result } from './actions';

export type Tr = { summary: string; description: string; access_notes: string; tips: string };
export type SourceRow = { id: string; title: string; url: string | null; publisher: string | null; accessed_on: string | null };
interface Props {
  slug: string;
  role: 'editor' | 'admin';
  status: string;
  locked: boolean;
  verifiedAt: string | null;
  initial: DestinationInput;
  sources: SourceRow[];
  logs: { created_at: string; note: string | null }[];
}

export function Workspace(p: Props) {
  const router = useRouter();
  const [form, setForm] = useState<DestinationInput>(p.initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const [manual, setManual] = useState({ title: '', url: '', publisher: '' });
  const [note, setNote] = useState('');

  const show = (r: Result<unknown>, okText?: string) => setMsg(r.ok ? { ok: true, text: r.message ?? okText ?? 'Selesai.' } : { ok: false, text: r.error });
  const run = (fn: () => Promise<Result<unknown>>, after?: () => void) =>
    start(async () => {
      const r = await fn();
      show(r);
      if (r.ok) {
        after?.();
        router.refresh();
      }
    });

  const setLang = (lang: 'id' | 'en', k: keyof Tr, v: string) => setForm((f) => ({ ...f, [lang]: { ...f[lang], [k]: v } }));
  const dis = p.locked || pending;
  const sourceUrls = p.sources.map((s) => s.url).filter((u): u is string => Boolean(u));
  const suggestedDoc = bestDocStatus(sourceUrls);

  return (
    <>
      {msg && (
        <p className={msg.ok ? 'adm-note' : 'adm-err'} role={msg.ok ? 'status' : 'alert'}>
          {msg.text}
        </p>
      )}
      {p.locked && <p className="adm-note">Konten ini sudah terbit/diarsipkan. Hanya admin yang boleh mengubahnya.</p>}

      <section className="adm-card">
        <h2>1. Sumber informasi</h2>
        <p className="adm-hint">Semua isi harus bisa ditelusuri ke sumber. Foto tetap butuh izin terpisah: status dokumentasi bukan izin pakai.</p>
        <ul className="adm-list">
          {p.sources.map((s) => {
            const t = s.url ? classifyUrl(s.url) : null;
            return (
              <li key={s.id}>
                <div>
                  <strong>{s.title}</strong>
                  {t && <span className={`tier tier-${t.tier}`}>{t.label} · {t.docStatus}</span>}
                  <br />
                  {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a>}
                  <br />
                  <small>{s.publisher ?? 'Penerbit tidak dicatat'} · diakses {s.accessed_on ?? '—'}</small>
                </div>
                <button className="adm-btn" disabled={dis} onClick={() => run(() => removeSource(p.slug, s.id))}>Hapus</button>
              </li>
            );
          })}
          {!p.sources.length && <li>Belum ada sumber.</li>}
        </ul>
        {sourceUrls.length > 0 && (
          <p className="adm-hint">Saran status dokumentasi dari domain sumber tersimpan: <b>{suggestedDoc}</b> (admin yang memutuskan).</p>
        )}

        <h3>Tambah manual</h3>
        <div className="adm-row">
          <input aria-label="Judul sumber" placeholder="Judul sumber" value={manual.title} onChange={(e) => setManual({ ...manual, title: e.target.value })} />
          <input aria-label="URL" placeholder="https://…" value={manual.url} onChange={(e) => setManual({ ...manual, url: e.target.value })} />
          <input aria-label="Penerbit" placeholder="Penerbit (opsional)" value={manual.publisher} onChange={(e) => setManual({ ...manual, publisher: e.target.value })} />
          <button className="adm-btn solid" disabled={dis} onClick={() => run(() => addSource(p.slug, manual), () => setManual({ title: '', url: '', publisher: '' }))}>Tambah</button>
        </div>
      </section>

      <section className="adm-card">
        <h2>2. Isi destinasi</h2>
        <div className="adm-row">
          <label>Akses
            <select value={form.access} disabled={dis} onChange={(e) => setForm({ ...form, access: e.target.value })}>
              {['A', 'B', 'C'].map((a) => <option key={a}>{a}</option>)}
            </select>
          </label>
          <label>Dokumentasi
            <select value={form.doc_status} disabled={dis} onChange={(e) => setForm({ ...form, doc_status: e.target.value })}>
              {['P0', 'P1', 'P2', 'P3', 'P1/P2'].map((a) => <option key={a}>{a}</option>)}
            </select>
          </label>
          <label>Lintang
            <input value={form.latitude} disabled={dis} inputMode="decimal" placeholder="-8.4905" onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
          </label>
          <label>Bujur
            <input value={form.longitude} disabled={dis} inputMode="decimal" placeholder="119.8777" onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
          </label>
        </div>
        <p className="adm-hint">Koordinat hanya diisi bila ada di sumber. Kosongkan keduanya kalau belum jelas.</p>
        {(['id', 'en'] as const).map((lang) => (
          <fieldset key={lang} className="adm-lang">
            <legend>{lang === 'id' ? 'Bahasa Indonesia' : 'English'}</legend>
            {([['summary', 'Ringkasan / Summary (maks 300)', 2], ['description', 'Deskripsi / Description', 6], ['access_notes', 'Catatan akses / Access notes', 3], ['tips', 'Tips', 3]] as const).map(([k, label, rows]) => (
              <label key={k}>{label}
                <textarea rows={rows} value={form[lang][k]} disabled={dis} onChange={(e) => setLang(lang, k, e.target.value)} />
              </label>
            ))}
          </fieldset>
        ))}
        <button className="adm-btn solid" disabled={dis} onClick={() => run(() => saveDestination(p.slug, form))}>{pending ? 'Menyimpan…' : 'Simpan'}</button>
      </section>

      <section className="adm-card">
        <h2>3. Pemeriksaan</h2>
        <ul className="adm-hint">
          {p.logs.map((l) => <li key={l.created_at}>{l.created_at.slice(0, 10)} — {l.note ?? 'diverifikasi'}</li>)}
          {!p.logs.length && <li>Belum ada riwayat verifikasi.</li>}
        </ul>
        {p.status === 'draft' && (
          <button className="adm-btn" disabled={dis} onClick={() => run(() => requestReview(p.slug))}>Ajukan untuk diperiksa</button>
        )}{' '}
        {p.role === 'admin' && (
          <span>
            <input aria-label="Catatan verifikasi" placeholder="Catatan verifikasi (opsional)" value={note} onChange={(e) => setNote(e.target.value)} />{' '}
            <button className="adm-btn solid" disabled={dis} onClick={() => run(() => markVerified(p.slug, note), () => setNote(''))}>
              {p.verifiedAt ? 'Verifikasi ulang' : 'Tandai terverifikasi'}
            </button>
          </span>
        )}
        {p.role === 'admin' && ['draft', 'in_review'].includes(p.status) && (
          <p>
            <button
              className="adm-btn solid"
              disabled={dis || !p.verifiedAt}
              onClick={() => {
                if (window.confirm('Terbitkan destinasi ini ke situs publik?')) run(() => publishDestination(p.slug));
              }}
            >
              Terbitkan ke situs publik
            </button>
            {!p.verifiedAt && <span className="adm-hint"> Tandai terverifikasi dulu.</span>}
          </p>
        )}
        {p.role === 'admin' && p.status === 'published' && (
          <p>
            <button
              className="adm-btn"
              disabled={dis}
              onClick={() => {
                if (window.confirm('Tarik destinasi ini dari situs publik dan kembalikan ke draf?')) run(() => unpublishDestination(p.slug));
              }}
            >
              Tarik dari situs publik
            </button>
          </p>
        )}
        <p className="adm-hint">Syarat terbit (dijaga database): terverifikasi, minimal satu sumber, ringkasan bahasa Indonesia dan Inggris terisi. Hanya admin yang bisa menerbitkan atau menarik.</p>
      </section>
    </>
  );
}
