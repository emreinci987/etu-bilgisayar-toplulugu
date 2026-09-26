/**
 * /biz-kimiz sayfasının veri şeması.
 * İçerik: src/data/about.json — düzenleme talimatları: src/data/about.README.md
 */

/** Sayfa üstündeki ana topluluk tanıtım bloğu */
export interface AboutHero {
  /** Kısa misyon paragrafı (1-2 cümle) */
  mission: string;
  /** Kulüp tanıtım günü bağlamını anlatan paragraf */
  intro: string;
}

/** Bir topluluğun "hakkında" metni; slug, communities.ts'teki slug ile eşleşmeli */
export interface CommunityAbout {
  slug: string;
  /** 2-4 cümlelik tanıtım metni — topluluk başkanı düzenler */
  about: string;
  /** Topluluğun Instagram URL'i; boşsa kartta Instagram butonu gizlenir */
  instagram?: string;
}

export type TeamRole = 'Başkan' | 'Başkan Yardımcısı';

export interface TeamMember {
  role: TeamRole;
  /** Boş bırakılırsa kartta "Yakında" gösterilir */
  name: string;
  /** Unvan / bölüm / sınıf gibi kısa alt satır (ör. "Bilgisayar Müh. 3. Sınıf") */
  title: string;
}

/** Bir topluluğun yönetim ekibi; communitySlug → /ekip/<slug>-baskan.jpg konvansiyonu */
export interface CommunityTeam {
  communitySlug: string;
  members: TeamMember[];
}

/** Sosyal medya bağlantıları; boş string bırakılırsa o ikon sayfada gizlenir */
export interface SocialLinks {
  instagram: string;
  linkedin: string;
  github: string;
  discord: string;
  /** WhatsApp grup davet URL'i — hero altındaki CTA butonunda da kullanılır */
  whatsapp: string;
}

export interface AboutData {
  hero: AboutHero;
  communities: CommunityAbout[];
  team: CommunityTeam[];
  socials: SocialLinks;
}
