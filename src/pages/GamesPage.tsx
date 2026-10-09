import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import { games } from '../games/config';

export default function GamesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <SectionHeading
        kicker="stand oyunları"
        title="Oyna, sticker kazan"
        description="Telefonundan oyna, hedef puanı geç, kazanma ekranını standdaki görevliye göster ve sticker'ını al."
      />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {games.map((g) => (
          <li key={g.slug}>
            <Link
              to={`/oyunlar/${g.slug}`}
              className="flex h-full flex-col rounded-card border border-coal-600 bg-coal-800 p-5 transition-colors hover:border-amber"
            >
              <h3 className="font-mono text-lg font-bold text-cream">{g.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-cream-dim">{g.description}</p>
              <p className="mt-4 font-mono text-xs text-amber">sticker: {g.goal}</p>
              <span className="mt-4 inline-block rounded-card bg-amber px-4 py-2 text-center font-mono text-sm font-medium text-coal">
                Oyna →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
