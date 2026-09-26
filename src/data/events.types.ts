import type { Community } from './communities';

export interface EventSpeaker {
  name: string;
  /** Unvan / kurum, ör. "ASELSAN Yazılım Test Mühendisliği Bölüm Müdürü" */
  title?: string;
  /** Konuşmacının oturum başlığı */
  topic?: string;
}

export interface EventLink {
  label: string;
  url: string;
}

/**
 * events.json kayıt şeması — /etkinlikler sayfası ve detay görünümü bu tipe göre tüketir.
 * Tarihler ISO (YYYY-MM-DD). image yoksa kartlar placeholder gösterir.
 */
export interface Event {
  id: string;
  title: string;
  /** ISO tarih: YYYY-MM-DD */
  date: string;
  /** Serbest metin saat, ör. "13:00" veya "13:00–17:00" */
  time?: string;
  location: string;
  /** Düzenleyen topluluk; communities.ts içindeki slug ile eşleşir */
  communitySlug: Community['slug'];
  /**
   * Etkinliğin konusu gereği ilişkili diğer topluluklar (ör. yapay zekâ konulu
   * bir etkinlik için "ai"). Filtrede bu topluluklar altında da listelenir.
   */
  relatedSlugs?: Community['slug'][];
  /** Kartta görünen kısa özet */
  summary: string;
  /** Detay görünümünde gösterilen uzun açıklama; paragraflar boş satırla ayrılır */
  description?: string;
  /** Kapak görseli: /public/etkinlikler altındaki dosya yolu; opsiyonel */
  image?: string;
  /** Detay görünümünde kapaktan sonra gösterilen ek görseller */
  gallery?: string[];
  speakers?: EventSpeaker[];
  links?: EventLink[];
  tags?: string[];
}

export interface EventsFile {
  $schema?: string;
  items: Event[];
}

/** Düzenleyen + ilişkili topluluk slug'ları (tekrarsız, düzenleyen başta) */
export function getEventCommunitySlugs(event: Event): string[] {
  return [...new Set([event.communitySlug, ...(event.relatedSlugs ?? [])])];
}

/** Kapak + galeri görselleri, tekrarsız */
export function getEventImages(event: Event): string[] {
  return [...new Set([event.image, ...(event.gallery ?? [])].filter((s): s is string => Boolean(s)))];
}
