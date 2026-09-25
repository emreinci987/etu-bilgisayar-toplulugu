import { communities } from '../../data/communities';

interface Props {
  /** Aktif topluluk slug'ı; null = Tümü */
  active: string | null;
  onChange: (slug: string | null) => void;
}

/** 'Tümü' + 5 topluluk filtre çipi; aktif çip amber vurgulu */
export default function EventFilterChips({ active, onChange }: Props) {
  const chipClass = (isActive: boolean) =>
    `rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
      isActive
        ? 'border-amber bg-amber/10 text-amber'
        : 'border-coal-600 text-cream-dim hover:border-cream-faint hover:text-cream'
    }`;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Topluluğa göre filtrele">
      <button
        type="button"
        className={chipClass(active === null)}
        aria-pressed={active === null}
        onClick={() => onChange(null)}
      >
        Tümü
      </button>
      {communities.map((c) => (
        <button
          key={c.slug}
          type="button"
          className={chipClass(active === c.slug)}
          aria-pressed={active === c.slug}
          onClick={() => onChange(c.slug)}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
