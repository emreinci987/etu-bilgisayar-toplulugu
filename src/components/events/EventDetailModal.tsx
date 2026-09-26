import { useEffect, useRef, useState } from 'react';
import type { Event } from '../../data/events.types';
import { getEventCommunitySlugs, getEventImages } from '../../data/events.types';
import { formatEventDate } from './EventCard';
import CommunityBadge from './CommunityBadge';

interface Props {
  event: Event;
  onClose: () => void;
}

/**
 * Etkinlik detay penceresi — afiş/fotoğraflar kırpılmadan büyük gösterilir,
 * birden fazla görsel varsa ok tuşları ve küçük resimlerle gezilir.
 * Esc / arka plan tıklaması kapatır; açılışta odak kapat butonuna gider, kapanışta geri döner.
 */
export default function EventDetailModal({ event, onClose }: Props) {
  const images = getEventImages(event);
  const [index, setIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `event-detail-${event.id}`;

  const hasMany = images.length > 1;
  const current = images[index];
  const step = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  // Etkinlik değişirse ilk görselden başla
  useEffect(() => setIndex(0), [event.id]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (hasMany && e.key === 'ArrowRight') step(1);
      else if (hasMany && e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // step yalnızca images.length'e bağlı; hasMany değişmedikçe yeniden bağlamaya gerek yok
  }, [onClose, hasMany]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex w-full max-w-5xl flex-col overflow-hidden border-coal-600 bg-coal-900 shadow-2xl sm:rounded-card sm:border lg:max-h-[90vh] lg:flex-row"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-coal/80 font-mono text-lg text-cream transition-colors hover:bg-coal hover:text-amber"
        >
          ×
        </button>

        {/* Görsel alanı */}
        {current && (
          <div className="flex flex-col bg-black lg:w-3/5">
            <div className="relative flex flex-1 items-center justify-center">
              <a href={current} target="_blank" rel="noreferrer" title="Görseli tam boyutta aç">
                <img
                  src={current}
                  alt={`${event.title} — görsel ${index + 1}/${images.length}`}
                  className="max-h-[70vh] w-full object-contain lg:max-h-[calc(90vh-5rem)]"
                />
              </a>
              {hasMany && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Önceki görsel"
                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl text-white transition-colors hover:bg-black/80"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Sonraki görsel"
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl text-white transition-colors hover:bg-black/80"
                  >
                    ›
                  </button>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 font-mono text-xs text-white">
                    {index + 1} / {images.length}
                  </span>
                </>
              )}
            </div>
            {hasMany && (
              <div className="flex gap-2 overflow-x-auto p-2" role="group" aria-label="Görseller">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Görsel ${i + 1}`}
                    aria-current={i === index}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded border-2 transition-opacity ${
                      i === index ? 'border-amber' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bilgi alanı */}
        <div className="flex flex-col gap-4 overflow-y-auto p-5 sm:p-6 lg:w-2/5">
          <div>
            <p className="font-mono text-xs tracking-wider text-amber">
              {formatEventDate(event.date)}
              {event.time && ` · ${event.time}`}
            </p>
            <h2 id={titleId} className="mt-2 pr-10 font-mono text-xl font-bold leading-snug text-cream">
              {event.title}
            </h2>
            <p className="mt-1 font-mono text-xs text-cream-faint">{event.location}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {getEventCommunitySlugs(event).map((slug) => (
              <CommunityBadge key={slug} slug={slug} />
            ))}
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-cream-dim">
            {(event.description ?? event.summary).split(/\n\s*\n/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {event.speakers && event.speakers.length > 0 && (
            <div>
              <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-cream-faint">
                {event.speakers.length > 1 ? 'Konuşmacılar' : 'Konuşmacı'}
              </h3>
              <ul className="space-y-2">
                {event.speakers.map((s) => (
                  <li key={s.name} className="rounded border border-coal-600 bg-coal-800 px-3 py-2">
                    <p className="text-sm font-medium text-cream">{s.name}</p>
                    {s.title && <p className="text-xs text-cream-faint">{s.title}</p>}
                    {s.topic && <p className="mt-1 text-xs text-amber">{s.topic}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {event.links && event.links.length > 0 && (
            <div className="flex flex-wrap gap-3 border-t border-coal-600 pt-4">
              {event.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm text-amber hover:underline"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
