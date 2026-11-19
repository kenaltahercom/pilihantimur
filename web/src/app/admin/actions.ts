'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signIn(_prev: { error: string } | null, form: FormData): Promise<{ error: string } | null> {
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  if (!email || !password) return { error: 'Isi email dan kata sandi.' };
  const supabase = await createClient();
  if (!supabase) return { error: 'Supabase belum dikonfigurasi (lihat .env.example).' };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  // Pesan sengaja generik agar tidak membocorkan apakah email terdaftar.
  if (error) return { error: 'Email atau kata sandi salah.' };
  redirect('/admin');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect('/admin/login');
}
