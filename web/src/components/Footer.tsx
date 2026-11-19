import { Link } from '@/i18n/navigation';
import type { Messages } from '@/lib/messages';
import type { Lang } from '@/lib/data';
import { LangSwitch } from './LangSwitch';

export function Footer({ t, lang }: { t: Messages; lang: Lang }) {
  const other = lang === 'id' ? 'en' : 'id';
  const items: [string, string][] = [
    ['/', lang === 'id' ? 'Beranda' : 'Home'],
    ['/destinations', t.nav.destinations],
    ['/about', t.nav.about],
  ];
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <nav aria-label={t.footer.nav}>
          <ul className="flinks">
            {items.map(([href, label]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-logo footer-word">
          <span className="display">Pilihan Timur</span>
          <span className="script">{t.tagline}</span>
        </div>
        <div className="footer-note">
          <p className="mono">{t.footer.note}</p>
          <p className="mono">
            <span>{t.footer.lang}:</span>{' '}
            <LangSwitch other={other} label={t.nav.switchTo} />
          </p>
        </div>
      </div>
    </footer>
  );
}
