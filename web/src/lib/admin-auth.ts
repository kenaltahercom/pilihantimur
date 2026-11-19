import { createClient } from '@/lib/supabase/server';

export type StaffRole = 'editor' | 'admin';
export interface Staff {
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>;
  uid: string;
  name: string;
  role: StaffRole;
}

/** Staf yang sedang masuk (punya baris di profiles), atau null. Dipanggil ulang di setiap aksi server. */
export async function getStaff(): Promise<Staff | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getClaims();
  const uid = data?.claims?.sub;
  if (!uid) return null;
  const { data: p } = await supabase.from('profiles').select('display_name, role').eq('id', uid).maybeSingle();
  if (!p) return null;
  return { supabase, uid, name: String(p.display_name), role: p.role === 'admin' ? 'admin' : 'editor' };
}
