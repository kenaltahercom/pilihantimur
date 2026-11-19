'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { EMPTY_PHOTO, photoMissing, type PhotoFields } from '@/lib/media';
import { addPhoto, publishPhoto, removePhoto, setHeroPhoto, unpublishPhoto, updatePhoto, type Result } from './media-actions';

export type PhotoRow = PhotoFields & { id: string; url: string; status: string; featured: boolean };
interface Props {
  slug: string;
  role: 'editor' | 'admin';
  locked: boolean;
  destPublished: boolean;
  photos: PhotoRow[];
}

const LABEL: Record<string, string> = { draft: 'Draf', in_review: 'Diperiksa', published: 'Terbit', archived: 'Arsip' };

function Fields({ v, set, disabled }: { v: PhotoFields; set: (k: keyof PhotoFields, val: string) => void; disabled: boolean }) {
  const inp = (k: keyof PhotoFields, label: string, ph = '') => (
    <label>{label}
      <input value={v[k]} disabled={disabled} placeholder={ph} onChange={(e) => set(k, e.target.value)} />
    </label>
  );
  return (
    <div className="adm-photo-fields">
      {inp('alt_id', 'Teks alternatif (Indonesia)', 'Apa yang terlihat di foto')}
      {inp('alt_en', 'Alt text (English)', 'What the photo shows')}
      {inp('credit', 'Kredit (fotografer/pemilik)', 'Nama fotografer atau lembaga')}
      {inp('license', 'Lisensi', 'mis. CC BY 4.0, atau izin tertulis')}
      {inp('permission_note', 'Catatan izin / sumber', 'Asal berkas, bukti izin, tautan halaman asal')}
      <label>Tanggal foto
        <input type="date" value={v.taken_on} disabled={disabled} onChange={(e) => set('taken_on', e.target.value)} />
      </label>
    </div>
  );
}

function PhotoCard({ p, slug, role, locked, run, busy }: { p: PhotoRow; slug: string; role: Props['role']; locked: boolean; run: (fn: () => Promise<Result>) => void; busy: boolean }) {
  const [v, setV] = useState<PhotoFields>({ alt_id: p.alt_id, alt_en: p.alt_en, credit: p.credit, license: p.license, permission_note: p.permission_note, taken_on: p.taken_on });
  const published = p.status === 'published';
  const readOnly = busy || locked || (published && role !== 'admin');
  const miss = photoMissing(v);
  return (
    <li className="adm-photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.url} alt={p.alt_id || 'Pratinjau foto'} width={160} height={120} loading="lazy" />
      <div>
        <p>
          <span className={`st st-${p.status}`}>{LABEL[p.status] ?? p.status}</span>
          {p.featured && <b> · Foto utama</b>}
        </p>
        <Fields v={v} set={(k, val) => setV((x) => ({ ...x, [k]: val }))} disabled={readOnly} />
        {!published && miss.length > 0 && <p className="adm-hint">Belum bisa terbit. Kurang: {miss.join(', ')}.</p>}
        <p className="adm-actions">
          <button className="adm-btn" disabled={readOnly} onClick={() => run(() => updatePhoto(slug, p.id, v))}>Simpan data foto</button>
          {role === 'admin' && !published && (
            <button className="adm-btn solid" disabled={busy || locked || miss.length > 0} onClick={() => window.confirm('Terbitkan foto ini? Pastikan lisensi/izin sudah benar.') && run(() => publishPhoto(slug, p.id))}>Terbitkan foto</button>
          )}
          {role === 'admin' && published && (
            <>
              {!p.featured && <button className="adm-btn" disabled={busy} onClick={() => run(() => setHeroPhoto(slug, p.id))}>Jadikan foto utama</button>}
              <button className="adm-btn" disabled={busy} onClick={() => run(() => unpublishPhoto(slug, p.id))}>Tarik</button>
            </>
          )}
          <button className="adm-btn" disabled={busy || locked || (published && role !== 'admin')} onClick={() => window.confirm('Hapus foto ini beserta berkasnya?') && run(() => removePhoto(slug, p.id))}>Hapus</button>
        </p>
      </div>
    </li>
  );
}

export function Photos(p: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState<PhotoFields>(EMPTY_PHOTO);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<Result>, after?: () => void) =>
    start(async () => {
      const r = await fn();
      setMsg(r.ok ? { ok: true, text: r.message ?? 'Selesai.' } : { ok: false, text: r.error });
      if (r.ok) {
        after?.();
        router.refresh();
      }
    });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    run(() => addPhoto(p.slug, fd), () => {
      formRef.current?.reset();
      setFields(EMPTY_PHOTO);
    });
  };

  return (
    <section className="adm-card" aria-labelledby="photos-h">
      <h2 id="photos-h">4. Foto</h2>
      <p className="adm-hint">
        Foto hanya boleh dipakai bila lisensi atau izinnya jelas. Tautan dari Google/Bing, artikel, dan galeri media bukan lisensi. Gunakan foto sendiri, Creative Commons, atau yang
        sudah berizin tertulis. JPG/PNG/WebP, maks 5 MB, maks 12 foto. Foto baru selalu berstatus draf.
      </p>
      {msg && <p className={msg.ok ? 'adm-note' : 'adm-err'} role={msg.ok ? 'status' : 'alert'}>{msg.text}</p>}
      <ul className="adm-photos">
        {p.photos.map((ph) => (
          <PhotoCard key={`${ph.id}-${ph.status}-${ph.featured}`} p={ph} slug={p.slug} role={p.role} locked={p.locked} run={run} busy={pending} />
        ))}
        {!p.photos.length && <li>Belum ada foto. Situs memakai ilustrasi pengisi sampai ada foto yang diterbitkan.</li>}
      </ul>
      {!p.destPublished && p.photos.some((x) => x.status === 'published') && (
        <p className="adm-hint">Foto yang sudah terbit baru tampil di situs setelah destinasinya diterbitkan.</p>
      )}

      <h3>Unggah foto baru</h3>
      <form ref={formRef} onSubmit={submit}>
        <label>Berkas foto
          <input type="file" name="file" accept="image/jpeg,image/png,image/webp" required disabled={p.locked || pending} />
        </label>
        <Fields v={fields} set={(k, val) => setFields((x) => ({ ...x, [k]: val }))} disabled={p.locked || pending} />
        {(Object.keys(fields) as (keyof PhotoFields)[]).map((k) => <input key={k} type="hidden" name={k} value={fields[k]} />)}
        <p><button className="adm-btn solid" type="submit" disabled={p.locked || pending}>{pending ? 'Mengunggah…' : 'Unggah sebagai draf'}</button></p>
      </form>
    </section>
  );
}
