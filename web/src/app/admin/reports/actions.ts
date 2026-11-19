'use server';

import { revalidatePath } from 'next/cache';
import { getStaff } from '@/lib/admin-auth';
import { NOTE_MAX, isReportStatus } from '@/lib/report';

export type Result = { ok: true; message: string } | { ok: false; error: string };

/** Mengubah status dan catatan penanganan sebuah laporan (staf saja; kolom lain tak bisa diubah). */
export async function updateReport(id: string, status: string, note: string): Promise<Result> {
  const staff = await getStaff();
  if (!staff) return { ok: false, error: 'Sesi tidak valid atau akun belum diberi akses.' };
  if (!/^[0-9a-f-]{36}$/.test(id)) return { ok: false, error: 'Laporan tidak valid.' };
  if (!isReportStatus(status)) return { ok: false, error: 'Status tidak valid.' };
  const n = note.trim();
  if (n.length > NOTE_MAX) return { ok: false, error: `Catatan maksimal ${NOTE_MAX} karakter.` };
  const { error, count } = await staff.supabase
    .from('correction_reports')
    .update({ status, handled_note: n || null }, { count: 'exact' })
    .eq('id', id);
  if (error) return { ok: false, error: `Gagal menyimpan: ${error.message}` };
  if (!count) return { ok: false, error: 'Laporan tidak ditemukan.' };
  revalidatePath('/admin/reports');
  revalidatePath('/admin');
  return { ok: true, message: 'Tersimpan.' };
}
