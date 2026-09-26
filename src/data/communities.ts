/**
 * Tek gerçek kaynak: topluluk listesi.
 * Yeni topluluk eklemek = buraya kayıt eklemek; sayfalar ve grid buradan beslenir.
 */
export interface Community {
  /** URL-uyumlu kimlik; logo dosyası da /public/logolar/<slug>.svg|png olarak aranır */
  slug: string;
  /** Kartlarda görünen tam ad */
  name: string;
  /** Monogram/placeholder için kısa ad (1-3 karakter) */
  shortName: string;
  /** Tek satırlık tanım */
  tagline: string;
  /**
   * Kart vurgu rengi. Temaya duyarlı CSS değişkeni (var(--c-<slug>));
   * tanımlar src/index.css içinde, aydınlık/koyu palete göre değişir.
   */
  color: string;
}

export const communities: Community[] = [
  {
    slug: 'ana-topluluk',
    name: 'Ana Topluluk',
    shortName: 'AT',
    tagline: 'TOBB ETÜ’de bilgisayar biliminin buluşma noktası; etkinlikler, atölyeler ve ortak projeler.',
    color: 'var(--c-ana-topluluk)',
  },
  {
    slug: 'fintech',
    name: 'FinTech Topluluğu',
    shortName: 'FT',
    tagline: 'Finans teknolojileri, ödeme sistemleri ve veri odaklı finans ürünleri üzerine çalışmalar.',
    color: 'var(--c-fintech)',
  },
  {
    slug: 'app-gelistirme',
    name: 'App Geliştirme Topluluğu',
    shortName: 'AG',
    tagline: 'Mobil ve web uygulamaları; fikirden yayına kadar ürün geliştirme pratiği.',
    color: 'var(--c-app-gelistirme)',
  },
  {
    slug: 'ai',
    name: 'AI Topluluğu',
    shortName: 'AI',
    tagline: 'Yapay zekâ ve makine öğrenmesi; araştırmadan uygulamaya projeler ve okuma grupları.',
    color: 'var(--c-ai)',
  },
  {
    slug: 'oyun-gelistirme',
    name: 'Oyun Geliştirme Topluluğu',
    shortName: 'OG',
    tagline: 'Oyun tasarımı ve geliştirme; game jam’ler, prototipler ve ortak oyun projeleri.',
    color: 'var(--c-oyun-gelistirme)',
  },
  {
    slug: 'blockchain',
    name: 'Blockchain Topluluğu',
    shortName: 'BC',
    tagline: 'Blokzincir teknolojileri, akıllı kontratlar ve merkeziyetsiz uygulamalar üzerine çalışmalar.',
    color: 'var(--c-blockchain)',
  },
  {
    slug: 'siber-guvenlik',
    name: 'Siber Güvenlik Topluluğu',
    shortName: 'SG',
    tagline: 'Siber güvenlik ve sızma testleri; CTF yarışmaları, atölyeler ve savunma pratikleri.',
    color: 'var(--c-siber-guvenlik)',
  },
];

export function getCommunityBySlug(slug: string): Community | undefined {
  return communities.find((c) => c.slug === slug);
}
