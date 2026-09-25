interface Props {
  /** Mono etiket (ör. "01 / topluluklar") */
  kicker?: string;
  title: string;
  /** Opsiyonel kısa açıklama */
  description?: string;
}

/** Sayfa bölümleri için tutarlı başlık bloğu */
export default function SectionHeading({ kicker, title, description }: Props) {
  return (
    <div className="mb-10 max-w-2xl">
      {kicker && <p className="chip mb-4">{kicker}</p>}
      <h2 className="font-mono text-2xl font-bold tracking-tight text-cream sm:text-3xl">
        {title}
      </h2>
      {description && <p className="mt-3 leading-relaxed text-cream-dim">{description}</p>}
    </div>
  );
}
