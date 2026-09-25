import type { SocialLinks } from '../../data/about.types';

/**
 * İletişim / sosyal medya bağlantıları.
 * Linkler src/data/about.json → socials alanından okunur; boş bırakılan
 * platform otomatik olarak gizlenir. İkonlar inline SVG'dir (bağımlılık yok).
 */

interface SocialEntry {
  key: keyof SocialLinks;
  label: string;
  icon: JSX.Element;
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const ENTRIES: SocialEntry[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" {...stroke} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" {...stroke} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 10.5V17" />
        <circle cx="8" cy="7.6" r="0.6" fill="currentColor" stroke="none" />
        <path d="M12 17v-4a2.5 2.5 0 0 1 5 0v4" />
      </svg>
    ),
  },
  {
    key: 'github',
    label: 'GitHub',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" {...stroke} aria-hidden="true">
        <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
      </svg>
    ),
  },
  {
    key: 'discord',
    label: 'Discord',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" {...stroke} aria-hidden="true">
        <path d="M18.6 5.3A16 16 0 0 0 14.7 4l-.2.4a13 13 0 0 0-5 0L9.3 4a16 16 0 0 0-3.9 1.3A16.6 16.6 0 0 0 3 16.7a16.2 16.2 0 0 0 4.9 2.5l.8-1.3a10 10 0 0 1-1.6-.8l.4-.3a11.5 11.5 0 0 0 9 0l.4.3-1.6.8.8 1.3a16.2 16.2 0 0 0 4.9-2.5 16.6 16.6 0 0 0-2.5-11.4Z" />
        <circle cx="9.3" cy="13.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="14.7" cy="13.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function SocialLinksRow({ socials }: { socials: SocialLinks }) {
  const active = ENTRIES.filter((e) => socials[e.key].trim().length > 0);

  if (active.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-coal-600 p-6 text-center font-mono text-sm text-cream-faint">
        sosyal medya bağlantıları yakında eklenecek
      </p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-3">
      {active.map((e) => (
        <li key={e.key}>
          <a
            href={socials[e.key]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-card border border-coal-600 bg-coal-800 px-4 py-3 font-mono text-sm text-cream-dim transition-colors hover:border-amber hover:text-amber"
          >
            {e.icon}
            {e.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
