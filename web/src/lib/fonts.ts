import localFont from 'next/font/local';

// Gaya "Peta Laut" (13 Nov 2026): Space Grotesk (judul) + Inter (isi). Keduanya OFL, subset latin, self-hosted.
export const grotesk = localFont({
  src: [
    { path: '../fonts/space-grotesk-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/space-grotesk-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-grotesk',
  display: 'swap',
});
export const inter = localFont({
  src: [
    { path: '../fonts/inter-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/inter-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
});

// 17 Nov 2026: Jungler Traveling (QR Design; judul hero) + TeX Gyre Pagella (serupa Palatino, GUST Font License) untuk deskripsi.
export const jungler = localFont({
  src: [{ path: '../fonts/jungler-traveling.woff2', weight: '400', style: 'normal' }],
  variable: '--font-jungler',
  display: 'swap',
});
export const pagella = localFont({
  src: [
    { path: '../fonts/pagella-regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/pagella-italic.woff2', weight: '400', style: 'italic' },
    { path: '../fonts/pagella-bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-pagella',
  display: 'swap',
});

export const fontVariables = [grotesk, inter, jungler, pagella].map((f) => f.variable).join(' ');
