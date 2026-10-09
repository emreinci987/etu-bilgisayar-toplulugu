import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { GameInfo } from './config';

/** Oyun sayfalarının ortak çerçevesi: geri linki, başlık, hedef */
export default function GameLayout({ game, children }: { game: GameInfo; children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-4 sm:py-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Link to="/oyunlar" className="font-mono text-sm text-cream-dim hover:text-amber">
          ← oyunlar
        </Link>
        <p className="chip">sticker: {game.goal}</p>
      </div>
      <h1 className="mb-3 font-mono text-2xl font-bold text-cream">{game.title}</h1>
      {children}
    </div>
  );
}
