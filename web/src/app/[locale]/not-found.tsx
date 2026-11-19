import { getMsgs } from '@/lib/messages';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getMsgs();
  return (
    <section className="page-head wrap">
      <div className="rule-h in">
        <h1 className="script">{t.notFound}</h1>
      </div>
      <p className="center">
        <Link className="pill pill-teal" href="/">
          {t.detail.crumbHome}
        </Link>
      </p>
    </section>
  );
}
