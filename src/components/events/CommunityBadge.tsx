import { getCommunityBySlug } from '../../data/communities';

/** Topluluk adını kendi rengiyle gösteren küçük rozet; bilinmeyen slug'da hiçbir şey çizmez */
export default function CommunityBadge({ slug }: { slug: string }) {
  const community = getCommunityBySlug(slug);
  if (!community) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-xs tracking-wider"
      style={{ color: community.color, borderColor: community.color }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: community.color }}
        aria-hidden="true"
      />
      {community.name}
    </span>
  );
}
