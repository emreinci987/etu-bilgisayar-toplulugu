import { communities } from '../data/communities';

export default function Footer() {
  return (
    <footer className="border-t border-coal-600">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-sm font-bold text-cream">
              <span className="text-amber">~/</span>etu-bilgisayar
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream-faint">
              TOBB Ekonomi ve Teknoloji Üniversitesi Bilgisayar Topluluğu.
              Öğrenciler tarafından, öğrenciler için.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {communities.map((c) => (
              <li key={c.slug} className="font-mono text-xs text-cream-faint">
                {c.shortName}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 border-t border-coal-800 pt-4 font-mono text-xs text-cream-faint">
          © {new Date().getFullYear()} TOBB ETÜ Bilgisayar Topluluğu
        </p>
      </div>
    </footer>
  );
}
