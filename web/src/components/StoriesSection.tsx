'use client';

import { useRef, useState } from 'react';
import { Arrow, RuleHeading } from './ui';
import { pad } from '@/lib/utils';

interface Props {
  kicker: string;
  heading: string;
  body: string;
  nextLabel: string;
  themes: string[];
  themeBody: string;
}

/** Bagian "Cerita dari Warga Lokal" dengan tumpukan sticky note yang bisa digeser. */
export function StoriesSection({ kicker, heading, body, nextLabel, themes, themeBody }: Props) {
  const n = themes.length;
  const [pos, setPos] = useState<number[]>(() => themes.map((_, i) => i));
  const [flying, setFlying] = useState<number | null>(null);
  const busy = useRef(false);

  const next = () => {
    if (busy.current) return;
    busy.current = true;
    const advance = () => {
      setPos((p) => p.map((v) => (v + n - 1) % n));
      setFlying(null);
      busy.current = false;
    };
    const top = pos.indexOf(0);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return advance();
    setFlying(top);
    setTimeout(advance, 380);
  };

  return (
    <section className="stories" aria-labelledby="stories-h">
      <div className="wrap stories-grid">
        <div className="stories-copy">
          <p className="mono kicker rv">{kicker}</p>
          <RuleHeading className="left">
            <span id="stories-h">{heading}</span>
          </RuleHeading>
          <p className="mono lead rv">{body}</p>
          <button className="pill pill-teal rv notes-next" type="button" onClick={next}>
            {nextLabel}
            <Arrow />
          </button>
        </div>
        <ul className="notes rv" aria-live="polite">
          {themes.map((th, i) => (
            <li
              key={th}
              className={`note n-${i}${flying === i ? ' fly' : ''}`}
              data-pos={pos[i]}
              onClick={() => pos[i] === 0 && next()}
            >
              <p className="mono note-n">
                {pad(i + 1)} / {pad(n)}
              </p>
              <h3 className="script">{th}</h3>
              <p className="mono">{themeBody}</p>
              <p className="mono note-soon">{kicker}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
