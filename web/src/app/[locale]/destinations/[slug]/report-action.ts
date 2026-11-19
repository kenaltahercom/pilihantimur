'use server';

import { createClient } from '@/lib/supabase/server';
import { DESTINATIONS } from '@/lib/data';
import { validateReport } from '@/lib/report';

export type ReportState = { status: 'idle' | 'ok' | 'invalid' | 'throttled' | 'error'; message?: string; contact?: string };

const SLUGS: ReadonlySet<string> = new Set(DESTINATIONS.map((d) => d.slug));
const str = (fd: FormData, k: string) => (typeof fd.get(k) === 'string' ? (fd.get(k) as string) : '');

/** Mengirim laporan koreksi. Memakai kunci publik; database yang membatasi apa yang boleh ditulis. */
export async function submitReport(_prev: ReportState, fd: FormData): Promise<ReportState> {
  // Isi yang diketik dikembalikan saat gagal, karena React mengosongkan formulir setelah dikirim.
  const keep = { message: str(fd, 'message'), contact: str(fd, 'contact') };
  const v = validateReport({ slug: str(fd, 'slug'), message: str(fd, 'message'), contact: str(fd, 'contact'), website: str(fd, 'website') }, SLUGS);
  // Bot (kolom jebakan terisi): pura-pura berhasil tanpa menyimpan apa pun.
  if (!v.ok) return v.code === 'spam' ? { status: 'ok' } : { status: 'invalid', ...keep };

  const supabase = await createClient();
  if (!supabase) return { status: 'error', ...keep };
  const { error } = await supabase
    .from('correction_reports')
    .insert({ destination_slug: v.value.slug, message: v.value.message, contact: v.value.contact });
  if (error) {
    if (error.code === '54000') return { status: 'throttled', ...keep };
    console.error('submitReport gagal:', error.code);
    return { status: 'error', ...keep };
  }
  return { status: 'ok' };
}
