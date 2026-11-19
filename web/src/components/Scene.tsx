import { useId, type ReactNode } from 'react';

// Ilustrasi placeholder orisinal (SVG) per kategori. Bukan foto destinasi: hanya
// pengisi sampai foto berlisensi tersedia. Warna mengikuti palet PRD + aksen logo.
// Port dari src/scenes.mjs (prototype); geometri dipertahankan.

const C = {
  teal: '#173F4A', sea: '#477A78', gold: '#C99B5E', terra: '#A65F49', cream: '#F4EFE4',
  ink: '#272E2D', sun: '#E8A53A', leaf: '#5F7F3E', seaDeep: '#2E5957', terraDeep: '#8A4A37',
} as const;

const PAL: Record<string, [string, string]> = {
  beach: ['#8FB8B3', '#F6E6C3'], lakes: ['#E9C99B', '#F4EFE4'], waterfalls: ['#9DBBA0', '#E4EBD8'],
  mountains: ['#7FA7A5', '#F1DDB4'], geo: ['#C98E70', '#F0D6A8'], springs: ['#B7CFC9', '#F6E8CF'],
  culture: [C.terraDeep, C.terra], naturecult: ['#9DB07A', '#F0E3B8'], generic: ['#8FB8B3', '#F4E3BF'],
};

export type SceneKind = keyof typeof PAL;

const Sun = ({ x, y, r = 34 }: { x: number; y: number; r?: number }) => <circle cx={x} cy={y} r={r} fill={C.sun} />;

const Wave = ({ y, amp, color, w = 400 }: { y: number; amp: number; color: string; w?: number }) => (
  <path d={`M0 ${y} q ${w / 8} ${-amp} ${w / 4} 0 t ${w / 4} 0 t ${w / 4} 0 t ${w / 4} 0 V300 H0Z`} fill={color} />
);

function art(kind: string, top: string): ReactNode {
  switch (kind) {
    case 'beach':
      return (
        <>
          <Sun x={290} y={120} />
          <Wave y={170} amp={10} color={C.sea} />
          <Wave y={190} amp={8} color={C.seaDeep} />
          <path d="M0 240 Q140 205 400 235 V300 H0Z" fill="#E6CFA0" />
          <path d="M60 238 q-6 -60 6 -98 m-6 98 q30 -30 54 -40 m-54 40 q-34 -22 -52 -26" stroke={C.teal} strokeWidth={4} fill="none" strokeLinecap="round" />
        </>
      );
    case 'lakes':
      return (
        <>
          <path d="M0 170 Q100 110 200 150 T400 140 V300 H0Z" fill={C.seaDeep} />
          <ellipse cx={120} cy={190} rx={62} ry={26} fill={C.sea} />
          <ellipse cx={240} cy={205} rx={52} ry={22} fill={C.terra} />
          <ellipse cx={320} cy={180} rx={40} ry={17} fill={C.gold} />
          <Sun x={70} y={80} r={26} />
        </>
      );
    case 'waterfalls':
      return (
        <>
          <path d="M0 90 L110 60 L110 300 H0Z M290 70 L400 40 V300 H290Z" fill="#33503C" />
          <path d="M110 70 h180 v230 H110Z" fill="#41624A" />
          {[140, 175, 210, 245].map((x, i) => (
            <path key={x} d={`M${x} 70 v${150 + i * 14}`} stroke="#F4EFE4" strokeWidth={i % 2 ? 6 : 10} strokeLinecap="round" />
          ))}
          <Wave y={250} amp={8} color={C.sea} />
        </>
      );
    case 'mountains':
      return (
        <>
          <Sun x={110} y={95} r={30} />
          <path d="M-10 230 L110 120 L190 200 L270 100 L410 230 V300 H-10Z" fill={C.teal} />
          <path d="M-10 255 L90 190 L190 250 L300 185 L410 255 V300 H-10Z" fill={C.leaf} />
        </>
      );
    case 'geo':
      return (
        <>
          <path d="M0 300 V120 Q200 -20 400 120 V300Z" fill={C.ink} />
          <path d="M110 300 V190 Q200 90 290 190 V300Z" fill={top} />
          <Sun x={200} y={215} r={26} />
        </>
      );
    case 'springs':
      return (
        <>
          <ellipse cx={200} cy={230} rx={150} ry={42} fill={C.sea} />
          <ellipse cx={200} cy={224} rx={118} ry={28} fill="#9ED0CB" />
          {[150, 205, 255].map((x, i) => (
            <path key={x} d={`M${x} 200 q-16 -26 0 -46 q16 -22 0 -46`} stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={7} fill="none" strokeLinecap="round" transform={`translate(0 ${i * 6})`} />
          ))}
        </>
      );
    case 'culture':
      return (
        <>
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: 6 }, (_, c) => (
              <path key={`${r}-${c}`} d={`M${40 + c * 64 + (r % 2) * 32} ${40 + r * 64} l28 28 l-28 28 l-28 -28Z`} fill={(r + c) % 2 ? C.gold : C.cream} />
            )),
          )}
          <path d="M0 270 H400 V300 H0Z" fill={C.ink} opacity={0.25} />
        </>
      );
    case 'naturecult':
      return (
        <>
          {[110, 80, 52, 26].map((r, i) => (
            <circle key={r} cx={200} cy={170} r={r} fill={[C.leaf, '#7E9A52', '#9DB07A', C.gold][i]} stroke={C.cream} strokeWidth={3} />
          ))}
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return <path key={i} d={`M200 170 L${200 + 110 * Math.cos(a)} ${170 + 110 * Math.sin(a)}`} stroke={C.cream} strokeWidth={3} />;
          })}
        </>
      );
    default:
      return (
        <>
          <Sun x={260} y={120} />
          <path d="M0 200 Q110 140 220 190 T400 180 V300 H0Z" fill={C.sea} />
          <Wave y={240} amp={8} color={C.teal} />
        </>
      );
  }
}

export function Scene({ kind = 'generic', label = '' }: { kind?: string; label?: string }) {
  const gid = `g${useId().replace(/:/g, '')}`;
  const k = kind in PAL ? kind : 'generic';
  const [top, bot] = PAL[k] as [string, string];
  const a11y = label ? { role: 'img' as const, 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <svg className="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" {...a11y}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bot} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gid})`} />
      {art(k, top)}
    </svg>
  );
}
