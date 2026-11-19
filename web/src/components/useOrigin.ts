'use client';
import { useCallback, useSyncExternalStore } from 'react';
import { findOrigin } from '@/lib/origins';
import { readStore, writeStore } from './localStore';

const KEY = 'pt-origin';
const subs = new Set<() => void>();
const subscribe = (cb: () => void) => { subs.add(cb); window.addEventListener('storage', cb); return () => { subs.delete(cb); window.removeEventListener('storage', cb); }; };
const fromUrl = () => { try { return new URLSearchParams(window.location.search).get('dari') ?? ''; } catch { return ''; } };
const snapshot = () => { const u = fromUrl(); const c = findOrigin(u) ? u : readStore(KEY); return findOrigin(c) ? c : ''; };

/** Kota asal terpilih (kode bandara). Urutan: ?dari= di URL → penyimpanan perangkat. Tanpa penyimpanan pun tetap berfungsi. */
export function useOrigin(): [string, (code: string) => void] {
  const code = useSyncExternalStore(subscribe, snapshot, () => '');
  const set = useCallback((c: string) => {
    writeStore(KEY, c);
    try {
      const u = new URL(window.location.href);
      if (c) u.searchParams.set('dari', c); else u.searchParams.delete('dari');
      window.history.replaceState(null, '', u);
    } catch { /* abaikan */ }
    subs.forEach((s) => s());
  }, []);
  return [code, set];
}
