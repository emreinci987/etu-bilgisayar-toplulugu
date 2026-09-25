import type { Community } from '../../data/communities';
import CommunityLogo from '../CommunityLogo';

/**
 * Tek bir topluluğun "hakkında" kartı: logo, ad, tagline ve about metni.
 * about metni src/data/about.json → communities[] içinden gelir.
 */
interface Props {
  community: Community;
  /** about.json'da bu slug için metin yoksa undefined gelebilir */
  about?: string;
}

export default function CommunityAboutCard({ community, about }: Props) {
  return (
    <article className="rounded-card border border-coal-600 bg-coal-800 p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <CommunityLogo
          slug={community.slug}
          shortName={community.shortName}
          color={community.color}
          size={56}
        />
        <div className="min-w-0">
          <h3 className="font-mono text-base font-bold tracking-tight text-cream sm:text-lg">
            {community.name}
          </h3>
          <p className="text-sm text-cream-faint">{community.tagline}</p>
        </div>
      </div>
      {about && <p className="mt-4 leading-relaxed text-cream-dim">{about}</p>}
    </article>
  );
}
