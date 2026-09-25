import SectionHeading from '../components/SectionHeading';
import CommunityAboutCard from '../components/about/CommunityAboutCard';
import SocialLinksRow from '../components/about/SocialLinksRow';
import TeamCard from '../components/about/TeamCard';
import { communities } from '../data/communities';
import rawAboutData from '../data/about.json';
import type { AboutData } from '../data/about.types';

/**
 * /biz-kimiz — Biz Kimiz sayfası.
 * Tüm içerik (misyon, topluluk tanıtımları, ekip, sosyal medya) veri odaklıdır:
 *   src/data/about.json  → düzenleme talimatları: src/data/about.README.md
 * Ekip fotoğrafları: public/ekip/<slug>-baskan.jpg konvansiyonu (public/ekip/README.md).
 */
const aboutData = rawAboutData as AboutData;

export default function AboutPage() {
  const aboutBySlug = new Map(aboutData.communities.map((c) => [c.slug, c.about]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* 1. Ana topluluk tanıtımı */}
      <SectionHeading
        kicker="biz kimiz"
        title="TOBB ETÜ Bilgisayar Topluluğu"
        description={aboutData.hero.mission}
      />
      <p className="mb-16 max-w-2xl leading-relaxed text-cream-dim">{aboutData.hero.intro}</p>

      {/* 2. Topluluklar */}
      <SectionHeading
        kicker="topluluklar"
        title="Topluluklarımız"
        description="Beş ekibimizin her biri kendi alanında etkinlikler ve projeler yürütür."
      />
      <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {communities.map((community) => (
          <CommunityAboutCard
            key={community.slug}
            community={community}
            about={aboutBySlug.get(community.slug)}
          />
        ))}
      </div>

      {/* 3. Yönetim ekibi */}
      <SectionHeading
        kicker="yönetim"
        title="Yönetim Ekibimiz"
        description="Her topluluğun başkanı ve başkan yardımcısı."
      />
      <div className="mb-16 space-y-10">
        {aboutData.team.map((team) => {
          const community = communities.find((c) => c.slug === team.communitySlug);
          if (!community) return null;
          return (
            <section key={team.communitySlug}>
              <h3 className="mb-4 font-mono text-sm font-medium tracking-wide text-cream-dim">
                <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: community.color }} aria-hidden="true" />
                {community.name}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {team.members.map((member) => (
                  <TeamCard
                    key={member.role}
                    slug={team.communitySlug}
                    color={community.color}
                    member={member}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* 4. İletişim / sosyal medya */}
      <SectionHeading
        kicker="iletişim"
        title="Bize Ulaşın"
        description="Sorularınız ve katılım için sosyal medya hesaplarımız."
      />
      <SocialLinksRow socials={aboutData.socials} />
    </div>
  );
}
