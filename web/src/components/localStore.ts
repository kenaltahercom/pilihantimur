'use client';
import { useCallback, useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
const subscribe = (cb: () => void) => { listeners.add(cb); window.addEventListener('storage', cb); return () => { listeners.delete(cb); window.removeEventListener('storage', cb); }; };

export const readStore = (key: string): string => { try { return localStorage.getItem(key) ?? ''; } catch { return ''; } };
export const writeStore = (key: string, v: string) => { try { localStorage.setItem(key, v); } catch { /* penyimpanan diblokir */ } notify(); };

/** String persisten per-perangkat (server merender ''; klien membaca setelah hidrasi tanpa setState di effect). */
export function useStoredString(key: string, read: (stored: string) => string = (s) => s): [string, (v: string) => void] {
  const get = useCallback(() => read(readStore(key)), [key, read]);
  const v = useSyncExternalStore(subscribe, get, () => '');
  const set = useCallback((x: string) => writeStore(key, x), [key]);
  return [v, set];
}
