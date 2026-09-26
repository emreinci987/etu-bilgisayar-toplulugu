import { Link } from 'react-router-dom';
import HeroCanvas from '../components/HeroCanvas';
import SectionHeading from '../components/SectionHeading';
import CommunityLogo from '../components/CommunityLogo';
import { communities } from '../data/communities';
import { useLatestEvents } from '../hooks';

export default function HomePage() {
  const latestEvents = useLatestEvents(3);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[88svh] items-center overflow-hidden border-b border-coal-600">
        <HeroCanvas />
        {/* Okunabilirlik için hafif karartma */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-coal/40 via-transparent to-coal" />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-20 sm:px-6">
          <p className="chip mb-6">tobb etü · öğrenci topluluğu</p>
          <h1 className="max-w-3xl font-mono text-4xl font-bold leading-tight tracking-tight text-cream sm:text-6xl">
            Bilgisayar
            <br />
            Topluluğu<span className="text-amber">_</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-dim">
            Kodu sevenlerin buluşma noktası. {communities.length} alt topluluk, onlarca etkinlik,
            üretmek isteyen herkese açık bir kapı.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/biz-kimiz"
              className="rounded-card bg-amber px-5 py-3 font-mono text-sm font-medium text-coal transition-colors hover:bg-amber-soft"
            >
              Bizi Tanıyın →
            </Link>
            <Link
              to="/etkinlikler"
              className="rounded-card border border-coal-600 px-5 py-3 font-mono text-sm text-cream-dim transition-colors hover:border-cream-faint hover:text-cream"
            >
              Etkinlikler
            </Link>
          </div>
        </div>
      </section>

      {/* ── Topluluklar ──────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <SectionHeading
          kicker="01 / topluluklar"
          title={`${communities.length} topluluk, tek çatı`}
          description="İlgi alanına göre birini seç ya da hepsine katıl. Her topluluk kendi etkinlik ve projelerini yürütür."
        />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((c) => (
            <li
              key={c.slug}
              className="group rounded-card border border-coal-600 bg-coal-800 p-5 transition-colors hover:border-cream-faint"
            >
              <div className="flex items-center gap-4">
                <CommunityLogo slug={c.slug} shortName={c.shortName} color={c.color} size={52} />
                <div>
                  <h3 className="font-mono text-base font-bold text-cream">{c.name}</h3>
                  <p className="font-mono text-xs" style={{ color: c.color }}>
                    {c.slug}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-cream-dim">{c.tagline}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Etkinlik önizleme ────────────────────────────── */}
      <section className="border-t border-coal-600">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <SectionHeading
            kicker="02 / etkinlikler"
            title="Yaklaşan ve son etkinlikler"
            description="Atölyeler, konuşmalar, game jam’ler — takvimden bir kesit."
          />
          {latestEvents.length === 0 ? (
            <p className="rounded-card border border-dashed border-coal-600 p-8 text-center font-mono text-sm text-cream-faint">
              henüz etkinlik kaydı yok — yakında.
            </p>
          ) : (
            <ul className="divide-y divide-coal-800 border-y border-coal-600">
              {latestEvents.map((e) => (
                <li key={e.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                  <time className="shrink-0 font-mono text-sm text-amber" dateTime={e.date}>
                    {e.date}
                  </time>
                  <div>
                    <p className="font-medium text-cream">{e.title}</p>
                    <p className="text-sm text-cream-faint">
                      {e.location} · {e.summary}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/etkinlikler"
            className="mt-6 inline-block font-mono text-sm text-amber hover:underline"
          >
            Tüm etkinlikler →
          </Link>
        </div>
      </section>
    </>
  );
}
