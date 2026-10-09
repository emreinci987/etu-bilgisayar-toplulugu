import { useEffect, useState } from 'react';

/**
 * Tam ekran "Sticker kazandın" ekranı. Standdaki görevli doğrulasın diye
 * canlı saat ve sürekli dönen animasyon içerir — eski bir ekran görüntüsü
 * canlı ekrandan kolayca ayırt edilir. Sunucu gerekmez.
 */

const CLAIM_KEY = 'etu-sticker-teslim';

function readClaimed(): boolean {
  try {
    return localStorage.getItem(CLAIM_KEY) !== null;
  } catch {
    return false;
  }
}

interface Props {
  gameTitle: string;
  score: number;
  onClose: () => void;
}

export default function WinOverlay({ gameTitle, score, onClose }: Props) {
  const [now, setNow] = useState(() => new Date());
  const [claimedBefore] = useState(readClaimed);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  function markClaimed() {
    try {
      localStorage.setItem(CLAIM_KEY, new Date().toISOString());
    } catch {
      // depolama kapalıysa sorun değil; teslim yine ekranda görünür
    }
    setClaimed(true);
  }

  const time = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
      className="win-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div className="win-rays pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative flex flex-col items-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-white/80">{gameTitle}</p>
        <h2 id="win-title" className="win-pulse mt-4 font-mono text-4xl font-bold leading-tight text-white sm:text-6xl">
          STICKER
          <br />
          KAZANDIN!
        </h2>
        <p className="mt-6 font-mono text-7xl font-bold text-white">{score}</p>
        <p className="font-mono text-sm uppercase tracking-widest text-white/80">puan</p>

        <div className="mt-8 rounded-card bg-black/25 px-5 py-3 font-mono text-white">
          <p className="text-3xl font-bold tabular-nums">{time}</p>
          <p className="text-sm text-white/80">{date}</p>
        </div>

        {claimed ? (
          <p className="mt-8 font-mono text-lg font-bold text-white">✓ Sticker teslim edildi</p>
        ) : (
          <>
            <p className="mt-8 max-w-xs text-base text-white">
              Bu ekranı standdaki görevliye göster, sticker&apos;ını al!
            </p>
            {claimedBefore && (
              <p className="mt-3 max-w-xs font-mono text-xs text-white/90">
                not: bu cihazda daha önce sticker teslim edildi
              </p>
            )}
            <button
              type="button"
              onClick={markClaimed}
              className="mt-6 rounded-card border-2 border-white/70 px-5 py-2 font-mono text-xs text-white"
            >
              Görevli: teslim ettim
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-card bg-white px-6 py-3 font-mono text-sm font-bold text-black"
        >
          Tekrar oyna
        </button>
      </div>
    </div>
  );
}
