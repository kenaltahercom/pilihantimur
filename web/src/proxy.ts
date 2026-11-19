import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/session';

const intl = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  const p = req.nextUrl.pathname;
  // /admin tidak berlocale: dijaga sesi Supabase, bukan next-intl. (Server tetap memeriksa ulang peran.)
  if (p === '/admin' || p.startsWith('/admin/')) return updateSession(req);
  return intl(req);
}

export const config = {
  // Semua rute kecuali API, internal Next.js, dan file statis (berekstensi).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
