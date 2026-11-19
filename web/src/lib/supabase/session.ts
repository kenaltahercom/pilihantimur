import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseEnv } from './env';

/** Menyegarkan sesi Supabase dan mengarahkan pengunjung tanpa sesi ke /admin/login. */
export async function updateSession(req: NextRequest): Promise<NextResponse> {
  const env = supabaseEnv();
  let res = NextResponse.next({ request: req });
  if (!env) return res;

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const path = req.nextUrl.pathname;
  if (!data?.claims && path !== '/admin/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return res;
}
