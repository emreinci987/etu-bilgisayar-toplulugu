import { useEffect, useState } from 'react';

/**
 * /logolar/<slug>.png (veya .svg) varsa gösterir; yoksa slug monogramlı
 * zarif bir placeholder çizer. Logo dosyası henüz eklenmemişse site bozulmaz.
 * Kulüp logoları beyaz zemin için tasarlandığından (lacivert yazılar, saydam
 * PNG'ler) her iki temada da beyaz bir karo üzerinde gösterilir.
 */
interface Props {
  slug: string;
  shortName: string;
  /** CSS rengi; hex ya da var(--c-<slug>) gibi değişken referansı olabilir */
  color: string;
  /** px cinsinden kutu boyutu */
  size?: number;
  className?: string;
}

export default function CommunityLogo({ slug, shortName, color, size = 64, className = '' }: Props) {
  const candidates = [`/logolar/${slug}.png`, `/logolar/${slug}.svg`];
  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrcIndex(0);
    setFailed(false);
  }, [slug]);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-card border border-coal-600 font-mono font-medium ${className}`}
        style={{
          width: size,
          height: size,
          color,
          backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`, // %8 opaklıkta renk tonu
        }}
        aria-hidden="true"
      >
        <span style={{ fontSize: size * 0.32 }}>{shortName}</span>
      </div>
    );
  }

  return (
    <img
      src={candidates[srcIndex]}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 rounded-card border border-coal-600 bg-white object-contain ${className}`}
      onError={() => {
        if (srcIndex < candidates.length - 1) setSrcIndex(srcIndex + 1);
        else setFailed(true);
      }}
    />
  );
}
