import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import EventCard from '../components/events/EventCard';
import EventFilterChips from '../components/events/EventFilterChips';
import { communities, getCommunityBySlug } from '../data/communities';
import { useEvents } from '../hooks';

const FILTER_PARAM = 'topluluk';
const validSlugs = new Set(communities.map((c) => c.slug));

/**
 * /etkinlikler — tüm toplulukların etkinlikleri, yeniden eskiye.
 * Filtre URL ile senkron: /etkinlikler?topluluk=<slug> (paylaşılabilir link).
 */
export default function EventsPage() {
  const events = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL'deki slug geçersizse filtreyi yok say (kırık link sayfayı bozmasın)
  const rawSlug = searchParams.get(FILTER_PARAM);
  const activeSlug = rawSlug && validSlugs.has(rawSlug) ? rawSlug : null;

  const filtered = useMemo(
    () => (activeSlug ? events.filter((e) => e.communitySlug === activeSlug) : events),
    [events, activeSlug],
  );

  const activeCommunity = activeSlug ? getCommunityBySlug(activeSlug) : undefined;

  const handleFilterChange = (slug: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (slug) next.set(FILTER_PARAM, slug);
        else next.delete(FILTER_PARAM);
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        kicker="etkinlikler"
        title="Etkinlik Takvimi"
        description="Atölyeler, paneller, hackathon'lar ve buluşmalar — tüm topluluklardan, yeniden eskiye."
      />

      <div className="mb-8">
        <EventFilterChips active={activeSlug} onChange={handleFilterChange} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-dashed border-coal-600 p-10 text-center">
          <p className="font-mono text-sm text-cream-dim">
            {activeCommunity
              ? `${activeCommunity.name} için henüz etkinlik kaydı yok.`
              : 'Henüz etkinlik kaydı yok.'}
          </p>
          <p className="mt-2 font-mono text-xs text-cream-faint">
            yeni etkinlikler yakında duyurulacak
          </p>
          {activeSlug && (
            <button
              type="button"
              onClick={() => handleFilterChange(null)}
              className="mt-4 rounded border border-coal-600 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-amber hover:border-amber"
            >
              Tüm etkinlikleri göster
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
