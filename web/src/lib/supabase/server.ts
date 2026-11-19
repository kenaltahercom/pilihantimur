import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseEnv } from './env';

/** Klien Supabase untuk Server Component / Server Action. Mengembalikan null bila env belum diisi. */
export async function createClient() {
  const env = supabaseEnv();
  if (!env) return null;
  const store = await cookies();
  return createServerClient(env.url, env.key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Dipanggil dari Server Component (tak boleh set cookie): sesi disegarkan di proxy.ts.
        }
      },
    },
  });
}
