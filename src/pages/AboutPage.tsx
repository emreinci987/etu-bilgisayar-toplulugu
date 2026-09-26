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
  const aboutBySlug = new Map(aboutData.communities.map((c) => [c.slug, c]));
  const whatsapp = aboutData.socials.whatsapp.trim();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* 1. Ana topluluk tanıtımı */}
      <SectionHeading
        kicker="biz kimiz"
        title="TOBB ETÜ Bilgisayar Topluluğu"
        description={aboutData.hero.mission}
      />
      <p className="mb-6 max-w-2xl leading-relaxed text-cream-dim">{aboutData.hero.intro}</p>
      {whatsapp.length > 0 && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-16 inline-flex w-full items-center justify-center gap-2 rounded-card bg-amber px-5 py-3 font-mono text-sm font-medium text-coal transition-colors hover:bg-amber-soft sm:w-auto"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
            <path d="M9.2 8.4c-.3 0-.8.1-.8.7 0 1.4 1.2 3.3 2.6 4.4 1.3 1 2.4 1.3 3.1 1.3.6 0 1-.5 1-1v-.6l-1.8-.7-.8.8c-.9-.5-2.1-1.7-2.6-2.6l.8-.8-.7-1.8-.8.3Z" fill="currentColor" stroke="none" />
          </svg>
          WhatsApp Grubuna Katıl
        </a>
      )}

      {/* 2. Topluluklar */}
      <SectionHeading
        kicker="topluluklar"
        title="Topluluklarımız"
        description="Her ekibimiz kendi alanında etkinlikler ve projeler yürütür."
      />
      <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {communities.map((community) => {
          const record = aboutBySlug.get(community.slug);
          return (
            <CommunityAboutCard
              key={community.slug}
              community={community}
              about={record?.about}
              instagram={record?.instagram}
            />
          );
        })}
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
                    communityName={community.name}
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
