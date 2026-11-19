import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { fontVariables } from '@/lib/fonts';
import './admin.css';

export const metadata: Metadata = { title: 'Admin — Pilihan Timur', robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={fontVariables}>
      <body className="adm">{children}</body>
    </html>
  );
}
