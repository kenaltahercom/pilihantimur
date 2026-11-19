'use client';
import { useEffect, useRef, useState } from 'react';

/** Angka rupiah yang menghitung naik saat terlihat. Server merender nilai akhir; tanpa JS / reduced-motion tetap benar. */
export function CountUp({ to, locale }: { to: number; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || to === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    setV(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1100);
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US').format(v)}</span>;
}
