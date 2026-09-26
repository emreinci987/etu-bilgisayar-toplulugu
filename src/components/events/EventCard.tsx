import { useState } from 'react';
import type { Event } from '../../data/events.types';
import { getEventCommunitySlugs, getEventImages } from '../../data/events.types';
import { getCommunityBySlug } from '../../data/communities';
import CommunityLogo from '../CommunityLogo';
import CommunityBadge from './CommunityBadge';

/**
 * ISO (YYYY-MM-DD) tarihi tr-TR uzun formata çevirir.
 * Geçersiz tarih patlamaz: ham değer olduğu gibi gösterilir.
 */
export function formatEventDate(iso: string): string {
  // "YYYY-MM-DD" → yerel saat diliminde Date (UTC kayması gün değiştirmesin diye)
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(iso);

  if (Number.isNaN(date.getTime())) return iso || 'tarih belirsiz';

  return new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

interface Props {
  event: Event;
  /** Kart tıklanınca detay görünümünü açar */
  onOpen?: (event: Event) => void;
}

/**
 * Tek etkinlik kartı — görsel yoksa/bozuksa CommunityLogo monogramlı placeholder.
 * Başlıktaki buton kartın tamamını kaplar (after:inset-0), böylece kart her yerinden tıklanır.
 */
export default function EventCard({ event, onOpen }: Props) {
  const community = getCommunityBySlug(event.communitySlug);
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(event.image) && !imgFailed;
  const imageCount = getEventImages(event).length;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-coal-600 bg-coal-800 transition-colors focus-within:border-amber hover:border-cream-faint">
      {/* Görsel alanı (16:9) — afişlerin başlığı üstte olduğu için üstten hizalı */}
      <div className="relative aspect-video w-full overflow-hidden bg-coal-700">
        {showImage ? (
          <img
            src={event.image}
            alt={`${event.title} etkinlik görseli`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {community ? (
              <CommunityLogo
                slug={community.slug}
                shortName={community.shortName}
                color={community.color}
                size={64}
              />
            ) : (
              <span className="font-mono text-xs uppercase tracking-wider text-cream-faint">
                görsel yakında
              </span>
            )}
          </div>
        )}
        {imageCount > 1 && (
          <span className="absolute right-2 top-2 rounded bg-coal/80 px-1.5 py-0.5 font-mono text-[11px] text-cream">
            {imageCount} görsel
          </span>
        )}
      </div>

      {/* Metin alanı */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-mono text-xs tracking-wider text-amber">
          {formatEventDate(event.date)}
          {event.time && ` · ${event.time}`}
        </p>
        <h3 className="font-mono text-base font-semibold leading-snug text-cream">
          <button
            type="button"
            onClick={() => onOpen?.(event)}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:content-[''] focus:outline-none"
          >
            {event.title}
          </button>
        </h3>
        <p className="font-mono text-xs text-cream-faint">{event.location}</p>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-cream-dim">{event.summary}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {getEventCommunitySlugs(event).map((slug) => (
            <CommunityBadge key={slug} slug={slug} />
          ))}
          {event.tags?.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-2 font-mono text-xs text-cream-faint transition-colors group-hover:text-amber">
          detaylar →
        </p>
      </div>
    </article>
  );
}
