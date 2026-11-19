import { describe, expect, it } from 'vitest';
import { validateReport, isReportStatus } from '../src/lib/report';

const SLUGS = new Set(['pantai-pede', 'danau-kelimutu']);
const ok = { slug: 'pantai-pede', message: 'Jam buka sudah berubah sejak tahun ini.' };

describe('validateReport', () => {
  it('menerima laporan sah dan merapikannya', () => {
    const r = validateReport({ ...ok, message: '  Jam buka berubah.  ', contact: ' a@b.id ' }, SLUGS);
    expect(r).toEqual({ ok: true, value: { slug: 'pantai-pede', message: 'Jam buka berubah.', contact: 'a@b.id' } });
  });
  it('kontak kosong menjadi null', () => {
    const r = validateReport({ ...ok, contact: '   ' }, SLUGS);
    expect(r.ok && r.value.contact).toBe(null);
  });
  it('menolak slug yang tidak dikenal', () => {
    expect(validateReport({ ...ok, slug: 'tidak-ada' }, SLUGS)).toEqual({ ok: false, code: 'invalid' });
  });
  it('menolak pesan terlalu pendek (spasi tidak dihitung) atau terlalu panjang', () => {
    expect(validateReport({ ...ok, message: 'a b c d e f' }, SLUGS).ok).toBe(false);
    expect(validateReport({ ...ok, message: 'x'.repeat(2001) }, SLUGS).ok).toBe(false);
    expect(validateReport({ ...ok, message: 'x'.repeat(2000) }, SLUGS).ok).toBe(true);
  });
  it('menolak kontak terlalu panjang', () => {
    expect(validateReport({ ...ok, contact: 'k'.repeat(201) }, SLUGS).ok).toBe(false);
  });
  it('kolom jebakan terisi dikenali sebagai spam', () => {
    expect(validateReport({ ...ok, website: 'http://spam.example' }, SLUGS)).toEqual({ ok: false, code: 'spam' });
  });
  it('membuang karakter kontrol', () => {
    const r = validateReport({ ...ok, message: 'Jam buka\u0000 berubah\u0007 sekarang' }, SLUGS);
    expect(r.ok && r.value.message).toBe('Jam buka berubah sekarang');
  });
  it('mengenali status laporan', () => {
    expect(isReportStatus('open')).toBe(true);
    expect(isReportStatus('hapus')).toBe(false);
  });
});
