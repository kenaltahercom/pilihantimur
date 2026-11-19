/** Sprite SVG global: simbol dipakai lewat <use href="#id"> di seluruh situs. */
export function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="mark" viewBox="0 0 48 48">
          <path d="M24 3C14.6 3 7 10.4 7 19.6 7 32 24 45 24 45s17-13 17-25.4C41 10.4 33.4 3 24 3Z" fill="currentColor" />
          <circle cx="24" cy="19" r="7.5" fill="var(--teal)" />
        </symbol>
        <symbol id="sun" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="14" fill="var(--sun)" />
          <g stroke="var(--sun)" strokeWidth="4" strokeLinecap="round">
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i * Math.PI) / 6;
              return <path key={i} d={`M${32 + 21 * Math.cos(a)} ${32 + 21 * Math.sin(a)} L${32 + 28 * Math.cos(a)} ${32 + 28 * Math.sin(a)}`} />;
            })}
          </g>
        </symbol>
        <symbol id="boat" viewBox="0 0 120 80">
          <path d="M58 6 L58 52 L18 52 Z" fill="var(--cream)" />
          <path d="M62 14 L62 52 L90 52 Z" fill="var(--gold)" />
          <path d="M8 56 H112 Q104 74 84 74 H36 Q16 74 8 56Z" fill="var(--teal)" />
        </symbol>
        <symbol id="fish" viewBox="0 0 120 70">
          <path d="M8 35 Q40 -2 86 22 L112 6 Q104 35 112 64 L86 48 Q40 72 8 35Z" fill="var(--terra)" />
          <circle cx="32" cy="30" r="4" fill="var(--cream)" />
          <path d="M50 20 Q58 35 50 50" stroke="var(--cream)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </symbol>
        <symbol id="ikat" viewBox="0 0 80 120">
          <rect width="80" height="120" rx="6" fill="var(--terra-deep)" />
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <path d={`M40 ${12 + r * 36} l22 22 l-22 22 l-22 -22Z`} fill="var(--gold)" />
              <path d={`M40 ${24 + r * 36} l10 10 l-10 10 l-10 -10Z`} fill="var(--terra-deep)" />
            </g>
          ))}
        </symbol>
        <symbol id="arrow" viewBox="0 0 24 24">
          <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
      </defs>
    </svg>
  );
}
