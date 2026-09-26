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
  /** about.json → communities[].instagram; boşsa buton gizlenir */
  instagram?: string;
}

export default function CommunityAboutCard({ community, about, instagram }: Props) {
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
      {instagram && instagram.trim().length > 0 && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-card border border-amber px-4 py-2.5 font-mono text-sm text-amber transition-colors hover:bg-amber hover:text-coal sm:w-auto"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
          </svg>
          Instagram'da Takip Et
        </a>
      )}
    </article>
  );
}
