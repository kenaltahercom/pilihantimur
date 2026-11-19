'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const $ = <T extends Element>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

/**
 * Gerak global (port dari assets/js/app.js): progress bar pindah halaman,
 * reveal saat scroll, parallax hero/ilustrasi, dan kartu bertumpuk.
 * Semua menghormati prefers-reduced-motion.
 */
export function Effects() {
  const pathname = usePathname();
  const first = useRef(true);

  // Progress bar: mulai saat tautan internal diklik, selesai saat rute berganti.
  useEffect(() => {
    const bar = document.getElementById('nav-progress');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin) return;
      if (u.pathname === location.pathname && u.search === location.search) return;
      if (bar && !reduce.matches) {
        bar.className = '';
        void bar.offsetWidth;
        bar.className = 'run';
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const bar = document.getElementById('nav-progress');
    if (bar?.className === 'run') requestAnimationFrame(() => requestAnimationFrame(() => { bar.className = 'done'; }));
  }, [pathname]);

  // Reveal saat scroll + gerak terkait scroll. Dijalankan ulang tiap rute.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rv = $$('.rv:not(.in)');
    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window && !reduce.matches) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add('in');
              io?.unobserve(en.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
      );
      rv.forEach((el) => io?.observe(el));
    } else rv.forEach((el) => el.classList.add('in'));

    const floats = $$<HTMLElement>('.float[data-speed]');
    const hero = $<HTMLElement>('.hero');
    const layers: [HTMLElement, number][] = hero
      ? (
          [['.sun-disc', 0.22], ['.sun-glow', 0.22], ['.hills-far', 0.08], ['.hills-near', 0.04], ['.clouds', 0.12], ['.birds', 0.3], ['.hero-inner', -0.18]] as [string, number][]
        ).flatMap(([s, k]) => {
          const el = $<HTMLElement>(s, hero);
          return el ? [[el, k] as [HTMLElement, number]] : [];
        })
      : [];
    const cards = $$<HTMLElement>('.stack-card');
    let ticking = false;

    const update = () => {
      ticking = false;
      if (reduce.matches) return;
      const vh = innerHeight;
      const y = scrollY;
      floats.forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.speed ?? '0')).toFixed(1)}px`;
      });
      if (hero && y < vh * 1.2) {
        layers.forEach(([el, k]) => { el.style.translate = `0 ${(y * k).toFixed(1)}px`; });
        const inner = $<HTMLElement>('.hero-inner', hero);
        if (inner) inner.style.opacity = String(clamp(1 - y / (vh * 0.7), 0, 1));
      }
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const stickyTop = parseFloat(getComputedStyle(card).top) || 0;
        const h = card.offsetHeight;
        const dist = next.getBoundingClientRect().top - stickyTop;
        const p = clamp(1 - dist / h, 0, 1);
        card.style.transform = p > 0 ? `scale(${(1 - p * 0.06).toFixed(4)})` : '';
        card.style.filter = p > 0 ? `brightness(${(1 - p * 0.28).toFixed(3)})` : '';
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return null;
}
