import type { ReactNode } from 'react';
import type { Destination } from '@/lib/data';
import type { Messages } from '@/lib/messages';

export const Arrow = () => (
  <svg aria-hidden="true">
    <use href="#arrow" />
  </svg>
);

/** Judul dengan garis ganda yang "digambar" saat muncul. */
export function RuleHeading({ children, as: Tag = 'h2', className = '' }: { children: ReactNode; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <div className={`rule-h rv ${className}`.trim()}>
      <Tag className="script">{children}</Tag>
    </div>
  );
}

export function Chips({ d, t }: { d: Destination; t: Messages }) {
  return (
    <>
      <span className={`chip tier-${d.access}`}>{t.tierShort[d.access]}</span>
    </>
  );
}

export const delay = (s: number) => ({ '--d': `${s}s` }) as React.CSSProperties;
