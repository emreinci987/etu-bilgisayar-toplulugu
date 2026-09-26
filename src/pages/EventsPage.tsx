import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import EventCard from '../components/events/EventCard';
import EventDetailModal from '../components/events/EventDetailModal';
import EventFilterChips from '../components/events/EventFilterChips';
import { communities, getCommunityBySlug } from '../data/communities';
import type { Event } from '../data/events.types';
import { getEventCommunitySlugs } from '../data/events.types';
import { useEvents } from '../hooks';

const FILTER_PARAM = 'topluluk';
const DETAIL_PARAM = 'etkinlik';
const validSlugs = new Set(communities.map((c) => c.slug));

/**
 * /etkinlikler — tüm toplulukların etkinlikleri, yeniden eskiye.
 * Filtre URL ile senkron: /etkinlikler?topluluk=<slug> (paylaşılabilir link).
 * Detay penceresi de öyle: /etkinlikler?etkinlik=<id> — link doğrudan detayı açar,
 * tarayıcının geri tuşu pencereyi kapatır.
 */
export default function EventsPage() {
  const events = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // URL'deki slug geçersizse filtreyi yok say (kırık link sayfayı bozmasın)
  const rawSlug = searchParams.get(FILTER_PARAM);
  const activeSlug = rawSlug && validSlugs.has(rawSlug) ? rawSlug : null;

  const filtered = useMemo(
    () =>
      activeSlug ? events.filter((e) => getEventCommunitySlugs(e).includes(activeSlug)) : events,
    [events, activeSlug],
  );

  // Geçersiz id'de pencere açılmaz (kırık link sayfayı bozmasın)
  const detailId = searchParams.get(DETAIL_PARAM);
  const detailEvent = detailId ? events.find((e) => e.id === detailId) : undefined;

  const openDetail = (event: Event) => {
    const next = new URLSearchParams(searchParams);
    next.set(DETAIL_PARAM, event.id);
    // Push: geri tuşu pencereyi kapatsın; state ile sayfa içinden açıldığını işaretle
    setSearchParams(next, { state: { detailFromList: true } });
  };

  const closeDetail = useCallback(() => {
    if ((location.state as { detailFromList?: boolean } | null)?.detailFromList) {
      navigate(-1);
      return;
    }
    // Doğrudan linkle gelindiyse geri gidilecek sayfa bizim değil; parametreyi sil
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(DETAIL_PARAM);
        return next;
      },
      { replace: true },
    );
  }, [location.state, navigate, setSearchParams]);

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
            <EventCard key={event.id} event={event} onOpen={openDetail} />
          ))}
        </div>
      )}

      {detailEvent && <EventDetailModal event={detailEvent} onClose={closeDetail} />}
    </div>
  );
}
