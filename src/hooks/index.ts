import { useEffect, useState } from 'react';
import type { Event, EventsFile } from '../data/events.types';
import rawEvents from '../data/events.json';

const allEvents = (rawEvents as EventsFile).items;

/** Tarihe göre yeniden eskiye sıralı tüm etkinlikler */
export function useEvents(): Event[] {
  return [...allEvents].sort((a, b) => b.date.localeCompare(a.date));
}

/** Son N etkinlik (ana sayfa önizlemesi için) */
export function useLatestEvents(count: number): Event[] {
  const events = useEvents();
  return events.slice(0, count);
}

/** prefers-reduced-motion medya sorgusu — animasyonlar bunu dinler */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
