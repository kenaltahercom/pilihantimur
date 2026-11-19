import { notFound } from 'next/navigation';

// Menangkap rute tak dikenal di dalam locale agar halaman 404 ikut berbahasa locale.
export default function CatchAll() {
  notFound();
}
