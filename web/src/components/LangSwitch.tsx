'use client';

import { Link, usePathname } from '@/i18n/navigation';

/** Tautan ganti bahasa ke halaman yang sama di locale lain. */
export function LangSwitch({ other, label }: { other: 'id' | 'en'; label: string }) {
  const pathname = usePathname();
  return (
    <Link className="lang" href={pathname} locale={other} hrefLang={other} lang={other}>
      {label}
    </Link>
  );
}
