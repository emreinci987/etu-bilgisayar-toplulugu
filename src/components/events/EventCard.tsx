import { useState } from 'react';
import type { Event } from '../../data/events.types';
import { getCommunityBySlug } from '../../data/communities';
import CommunityLogo from '../CommunityLogo';

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
}

/** Tek etkinlik kartı — görsel yoksa/bozuksa CommunityLogo monogramlı placeholder */
export default function EventCard({ event }: Props) {
  const community = getCommunityBySlug(event.communitySlug);
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(event.image) && !imgFailed;

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-coal-600 bg-coal-800">
      {/* Görsel alanı (16:9) */}
      <div className="aspect-video w-full overflow-hidden bg-coal-700">
        {showImage ? (
          <img
            src={event.image}
            alt={`${event.title} etkinlik görseli`}
            loading="lazy"
            className="h-full w-full object-cover"
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
      </div>

      {/* Metin alanı */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-mono text-xs tracking-wider text-amber">
          {formatEventDate(event.date)}
        </p>
        <h3 className="font-mono text-base font-semibold leading-snug text-cream">
          {event.title}
        </h3>
        <p className="font-mono text-xs text-cream-faint">{event.location}</p>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-cream-dim">{event.summary}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {community && (
            <span
              className="inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-xs tracking-wider"
              style={{ color: community.color, borderColor: community.color }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: community.color }}
                aria-hidden="true"
              />
              {community.name}
            </span>
          )}
          {event.tags?.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
