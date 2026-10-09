import { useEffect, useRef, useState } from 'react';
import { getCommunityBySlug } from '../data/communities';
import { getGame } from './config';
import GameLayout from './GameLayout';
import WinOverlay from './WinOverlay';
import { createDeck, memoryScore, MEMORY_SYMBOLS, type MemoryCard } from './memory';

/** Kulüp Hafızası — 4×3 kart, aynı kulüp logolarını eşleştir */

const FLIP_BACK_MS = 700;

export default function MemoryGame() {
  const game = getGame('hafiza');
  const [deck, setDeck] = useState<MemoryCard[]>(() => createDeck());
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(() => new Set());
  const [mistakes, setMistakes] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [showWin, setShowWin] = useState(false);
  const timeout = useRef<number>();

  const score = memoryScore(mistakes);
  const done = matched.size === MEMORY_SYMBOLS.length;

  useEffect(() => {
    if (startedAt === null || finishedAt !== null) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [startedAt, finishedAt]);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  // Logoları önceden yükle: ilk çevirmede kart boş görünmesin
  useEffect(() => {
    for (const slug of MEMORY_SYMBOLS) new Image().src = `/logolar/${slug}.png`;
  }, []);

  function restart() {
    window.clearTimeout(timeout.current);
    setDeck(createDeck());
    setOpen([]);
    setMatched(new Set());
    setMistakes(0);
    setStartedAt(null);
    setFinishedAt(null);
    setShowWin(false);
  }

  function flip(index: number) {
    if (open.length === 2 || open.includes(index) || matched.has(deck[index].symbol)) return;
    if (startedAt === null) {
      const t = Date.now();
      setStartedAt(t);
      setNow(t);
    }

    const next = [...open, index];
    setOpen(next);
    if (next.length < 2) return;

    const [a, b] = next.map((i) => deck[i]);
    if (a.symbol === b.symbol) {
      const nextMatched = new Set(matched).add(a.symbol);
      setMatched(nextMatched);
      setOpen([]);
      if (nextMatched.size === MEMORY_SYMBOLS.length) {
        setFinishedAt(Date.now());
        if (memoryScore(mistakes) >= game.stickerScore) setShowWin(true);
      }
    } else {
      setMistakes((m) => m + 1);
      timeout.current = window.setTimeout(() => setOpen([]), FLIP_BACK_MS);
    }
  }

  const elapsed = startedAt === null ? 0 : Math.max(0, Math.floor(((finishedAt ?? now) - startedAt) / 1000));

  return (
    <GameLayout game={game}>
      <div className="mb-3 grid grid-cols-3 gap-2 font-mono text-center">
        <div className="rounded-card border border-coal-600 py-2">
          <p className="text-2xl font-bold text-amber">{score}</p>
          <p className="text-[10px] uppercase tracking-wider text-cream-faint">puan</p>
        </div>
        <div className="rounded-card border border-coal-600 py-2">
          <p className="text-2xl font-bold text-cream">{mistakes}</p>
          <p className="text-[10px] uppercase tracking-wider text-cream-faint">hata</p>
        </div>
        <div className="rounded-card border border-coal-600 py-2">
          <p className="text-2xl font-bold text-cream tabular-nums">{elapsed}s</p>
          <p className="text-[10px] uppercase tracking-wider text-cream-faint">süre</p>
        </div>
      </div>

      <ul className="grid grid-cols-4 gap-2" aria-label="Kartlar">
        {deck.map((card, i) => {
          const isMatched = matched.has(card.symbol);
          const faceUp = isMatched || open.includes(i);
          return (
            <li key={card.id}>
              <button
                type="button"
                onClick={() => flip(i)}
                disabled={isMatched}
                aria-label={faceUp ? (getCommunityBySlug(card.symbol)?.name ?? card.symbol) : 'Kapalı kart'}
                className={`flex aspect-square w-full items-center justify-center rounded-card border font-mono text-lg font-bold transition-colors sm:text-xl ${
                  isMatched
                    ? 'border-amber/40 bg-amber/10 text-amber'
                    : faceUp
                      ? 'border-amber bg-coal text-cream'
                      : 'border-coal-600 bg-coal-800 text-cream-faint active:bg-coal-700'
                }`}
              >
                {faceUp ? (
                  <img
                    src={`/logolar/${card.symbol}.png`}
                    alt=""
                    draggable={false}
                    className={`h-full w-full rounded-card bg-white object-contain p-1.5 ${isMatched ? 'opacity-60' : ''}`}
                  />
                ) : (
                  '?'
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {done && !showWin && (
        <div className="mt-4 rounded-card border border-coal-600 p-4 text-center font-mono">
          <p className="text-lg font-bold text-cream">bitti! {score} puan</p>
          <p className="mt-1 text-sm text-cream-dim">
            {score >= game.stickerScore
              ? 'sticker kazandın!'
              : `sticker için en az ${game.stickerScore} puan gerekiyor — bir daha dene`}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={restart}
        className="mt-4 w-full rounded-card border border-coal-600 py-3 font-mono text-sm text-cream-dim hover:border-amber hover:text-amber"
      >
        Yeniden başlat
      </button>

      {showWin && <WinOverlay gameTitle={game.title} score={score} onClose={restart} />}
    </GameLayout>
  );
}
