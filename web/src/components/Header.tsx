'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import type { Messages } from '@/lib/messages';

interface Props {
  t: Pick<Messages, 'nav'>;
  other: 'id' | 'en';
}

/** Nav pill melayang + menu layar penuh untuk mobile (port dari assets/js/app.js). */
export function Header({ t, other }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // kelas .open (animasi clip-path)
  const [shown, setShown] = useState(false); // atribut hidden
  const openRef = useRef(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items: [string, string][] = [
    ['/destinations', t.nav.destinations],
    ['/plan', t.nav.plan],
    ['/about', t.nav.about],
  ];
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const setMenu = useCallback((next: boolean) => {
    openRef.current = next;
    if (timer.current) clearTimeout(timer.current);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (next) {
      setShown(true);
      requestAnimationFrame(() => {
        if (!openRef.current) return;
        setOpen(true);
        menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
      });
    } else {
      setOpen(false);
      timer.current = setTimeout(() => {
        if (!openRef.current) setShown(false);
      }, reduce ? 0 : 700);
    }
  }, []);

  // Bayangan nav saat halaman di-scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Kunci scroll body saat menu terbuka.
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  // Esc menutup menu; melebar ke desktop menutup menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openRef.current) {
        setMenu(false);
        btnRef.current?.focus();
      }
    };
    const mq = window.matchMedia('(min-width: 961px)');
    const onMq = (m: MediaQueryListEvent) => {
      if (m.matches) setMenu(false);
    };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [setMenu]);

  // Pindah halaman menutup menu.
  useEffect(() => {
    if (openRef.current) setMenu(false);
  }, [pathname, setMenu]);

  return (
    <header className={`nav-wrap${scrolled ? ' scrolled' : ''}`}>
      <nav className="nav" aria-label={t.nav.primary}>
        <Link className="brand" href="/" aria-label="Pilihan Timur">
          <svg className="mark" aria-hidden="true">
            <use href="#mark" />
          </svg>
          <span className="brand-text">Pilihan Timur</span>
        </Link>
        <ul className="nav-links">
          {items.map(([href, label]) => (
            <li key={href}>
              <Link className="nav-link" href={href} aria-current={isCurrent(href) ? 'page' : undefined}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-end">
          <Link className="lang" href={pathname} locale={other} hrefLang={other} lang={other}>
            {t.nav.switchTo}
          </Link>
          <Link className="pill pill-gold nav-cta" href="/destinations">
            {t.nav.cta}
          </Link>
        </div>
        <button
          ref={btnRef}
          className="menu-btn pill pill-gold"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setMenu(!openRef.current)}
        >
          {open ? t.nav.close : t.nav.menu}
        </button>
      </nav>
      <div id="menu" ref={menuRef} className={`menu${open ? ' open' : ''}`} hidden={!shown}>
        <div className="menu-inner">
          <ul>
            {items.map(([href, label], i) => (
              <li key={href} style={{ '--i': i } as React.CSSProperties}>
                <Link href={href} aria-current={isCurrent(href) ? 'page' : undefined} onClick={() => setMenu(false)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu-foot">
            <Link className="pill pill-gold" href="/destinations" onClick={() => setMenu(false)}>
              {t.nav.cta}
            </Link>
            <Link className="lang" href={pathname} locale={other} hrefLang={other} lang={other}>
              {t.nav.switchTo}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
