import { useState } from 'react';
import type { TeamMember, TeamRole } from '../../data/about.types';

/**
 * Yönetim ekibi kartı.
 * Fotoğraf konvansiyonu: /ekip/<slug>-baskan.jpg, /ekip/<slug>-baskan-yardimcisi.jpg
 * Fotoğraf yoksa (veya yüklenemezse) isim baş harfli avatar gösterilir.
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
}

export default function TeamCard({ slug, color, member }: Props) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const hasName = member.name.trim().length > 0;

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
          <img
            src={photoPath(slug, member.role)}
            alt={member.name}
            width={64}
            height={64}
            loading="lazy"
            className="aspect-square w-16 shrink-0 rounded-card border border-coal-600 object-cover"
            onError={() => setPhotoFailed(true)}
          />
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
    </div>
  );
}
