import { communities } from '../data/communities';

/** Kulüp Hafızası oyununun saf mantığı (UI'dan bağımsız, test edilebilir) */

/** Kart sembolleri = topluluk slug'ları; ön yüzde /logolar/<slug>.png gösterilir */
export const MEMORY_SYMBOLS: readonly string[] = communities.map((c) => c.slug);

export const MEMORY_START_SCORE = 100;
export const MEMORY_MISTAKE_PENALTY = 5;

export interface MemoryCard {
  id: number;
  symbol: string;
}

/** Her sembolden iki kart; Fisher–Yates ile karıştırılmış */
export function createDeck(random: () => number = Math.random): MemoryCard[] {
  const cards = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS].map((symbol, id) => ({ id, symbol }));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function memoryScore(mistakes: number): number {
  return Math.max(0, MEMORY_START_SCORE - mistakes * MEMORY_MISTAKE_PENALTY);
}
