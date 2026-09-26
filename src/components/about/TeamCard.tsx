import { useCallback, useState } from 'react';
import type { TeamMember, TeamRole } from '../../data/about.types';
import PhotoLightbox from './PhotoLightbox';

/**
 * Yönetim ekibi kartı.
 * Fotoğraf konvansiyonu: /ekip/<slug>-baskan.jpg, /ekip/<slug>-baskan-yardimcisi.jpg
 * Fotoğraf yoksa (veya yüklenemezse) isim baş harfli avatar gösterilir.
 * Fotoğrafa tıklanınca büyük hâli bir pencerede açılır.
 */

function photoPath(slug: string, role: TeamRole): string {
  return role === 'Başkan' ? `/ekip/${slug}-baskan.jpg` : `/ekip/${slug}-baskan-yardimcisi.jpg`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toLocaleUpperCase('tr'))
    .join('');
}

interface Props {
  slug: string;
  color: string;
  member: TeamMember;
  /** Büyütülmüş fotoğrafın altında rolle birlikte gösterilir */
  communityName?: string;
}

export default function TeamCard({ slug, color, member, communityName }: Props) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const closeZoom = useCallback(() => setZoomed(false), []);
  const hasName = member.name.trim().length > 0;
  const src = photoPath(slug, member.role);

  return (
    <div className="rounded-card border border-coal-600 bg-coal-800 p-4">
      <div className="flex items-center gap-4">
        {photoFailed || !hasName ? (
          <div
            className="flex aspect-square w-16 shrink-0 items-center justify-center rounded-card border border-coal-600 font-mono text-lg font-medium"
            style={{ color, backgroundColor: `${color}14` }}
            aria-hidden="true"
          >
            {hasName ? initials(member.name) : '?'}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`${member.name} fotoğrafını büyüt`}
            aria-haspopup="dialog"
            className="shrink-0 cursor-zoom-in overflow-hidden rounded-card border border-coal-600 transition-colors hover:border-amber focus:outline-none focus-visible:border-amber"
          >
            <img
              src={src}
              alt={member.name}
              width={64}
              height={64}
              loading="lazy"
              className="aspect-square w-16 object-cover transition-transform duration-200 hover:scale-105 motion-reduce:transition-none"
              onError={() => setPhotoFailed(true)}
            />
          </button>
        )}
        <div className="min-w-0">
          <p className="chip">{member.role}</p>
          <p className="mt-2 truncate font-mono text-sm font-medium text-cream">
            {hasName ? member.name : 'Yakında'}
          </p>
          {member.title.trim() && (
            <p className="truncate text-xs text-cream-faint">{member.title}</p>
          )}
        </div>
      </div>

      {zoomed && (
        <PhotoLightbox
          src={src}
          name={member.name}
          caption={[member.role, communityName, member.title.trim()].filter(Boolean).join(' · ')}
          onClose={closeZoom}
        />
      )}
    </div>
  );
}
