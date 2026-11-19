import type { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';

// Root layout sengaja minimal: html/body dirender di app/[locale]/layout.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script
        id="enable-js-class"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('js')",
        }}
      />
      {children}
    </>
  );
}