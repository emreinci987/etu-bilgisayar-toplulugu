import type { Community } from './communities';

/**
 * events.json kayıt şeması — sonraki ajanlar (/etkinlikler sayfası) bu tipe göre tüketsin.
 * Tarihler ISO (YYYY-MM-DD). image yoksa kartlar placeholder gösterir.
 */
export interface Event {
  id: string;
  title: string;
  /** ISO tarih: YYYY-MM-DD */
  date: string;
  location: string;
  /** communities.ts içindeki slug ile eşleşir */
  communitySlug: Community['slug'];
  summary: string;
  /** /public/etkinlikler altındaki dosya yolu; opsiyonel */
  image?: string;
  tags?: string[];
}

export interface EventsFile {
  $schema?: string;
  items: Event[];
}
