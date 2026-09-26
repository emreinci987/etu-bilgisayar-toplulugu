import { useEffect, useRef } from 'react';

interface Props {
  src: string;
  name: string;
  /** İsmin altındaki kısa satır, ör. "Başkan · Ana Topluluk" */
  caption?: string;
  onClose: () => void;
}

/**
 * Fotoğrafı ekranın ortasında büyük gösteren pencere.
 * Esc / arka plan tıklaması kapatır; açılışta odak kapat butonuna gider, kapanışta geri döner.
 */
export default function PhotoLightbox({ src, name, caption, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <figure
        role="dialog"
        aria-modal="true"
        aria-label={name}
        className="relative w-full max-w-md overflow-hidden rounded-card border border-coal-600 bg-coal-900 shadow-2xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 font-mono text-lg text-white transition-colors hover:bg-black/80"
        >
          ×
        </button>
        <img src={src} alt={name} className="aspect-square w-full object-cover" />
        <figcaption className="p-4">
          <p className="font-mono text-base font-semibold text-cream">{name}</p>
          {caption && <p className="mt-1 font-mono text-xs text-cream-faint">{caption}</p>}
        </figcaption>
      </figure>
    </div>
  );
}
