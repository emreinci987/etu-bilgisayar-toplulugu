/**
 * Tek gerçek kaynak: 5 topluluk.
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
  /** Kart vurgu rengi (hex). Ana tema amber; topluluklar kendi tonunu taşıyabilir. */
  color: string;
}

export const communities: Community[] = [
  {
    slug: 'ana-topluluk',
    name: 'Ana Topluluk',
    shortName: 'AT',
    tagline: 'TOBB ETÜ’de bilgisayar biliminin buluşma noktası; etkinlikler, atölyeler ve ortak projeler.',
    color: '#e8a33d',
  },
  {
    slug: 'fintech',
    name: 'FinTech Topluluğu',
    shortName: 'FT',
    tagline: 'Finans teknolojileri, ödeme sistemleri ve veri odaklı finans ürünleri üzerine çalışmalar.',
    color: '#7fb069',
  },
  {
    slug: 'app-gelistirme',
    name: 'App Geliştirme Topluluğu',
    shortName: 'AG',
    tagline: 'Mobil ve web uygulamaları; fikirden yayına kadar ürün geliştirme pratiği.',
    color: '#e07a5f',
  },
  {
    slug: 'ai',
    name: 'AI Topluluğu',
    shortName: 'AI',
    tagline: 'Yapay zekâ ve makine öğrenmesi; araştırmadan uygulamaya projeler ve okuma grupları.',
    color: '#81b29a',
  },
  {
    slug: 'oyun-gelistirme',
    name: 'Oyun Geliştirme Topluluğu',
    shortName: 'OG',
    tagline: 'Oyun tasarımı ve geliştirme; game jam’ler, prototipler ve ortak oyun projeleri.',
    color: '#f2cc8f',
  },
];

export function getCommunityBySlug(slug: string): Community | undefined {
  return communities.find((c) => c.slug === slug);
}
