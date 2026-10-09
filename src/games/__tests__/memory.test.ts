import { describe, it, expect } from 'vitest';
import { createDeck, memoryScore, MEMORY_SYMBOLS } from '../memory';
import { games } from '../config';

describe('Kod Hafızası mantığı', () => {
  it('deste her sembolden tam iki kart içerir', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(MEMORY_SYMBOLS.length * 2);
    for (const s of MEMORY_SYMBOLS) {
      expect(deck.filter((c) => c.symbol === s)).toHaveLength(2);
    }
    expect(new Set(deck.map((c) => c.id)).size).toBe(deck.length);
  });

  it('puan 100’den başlar, her hata −5, sıfırın altına inmez', () => {
    expect(memoryScore(0)).toBe(100);
    expect(memoryScore(6)).toBe(70);
    expect(memoryScore(7)).toBe(65);
    expect(memoryScore(50)).toBe(0);
  });

  it('sticker eşikleri ulaşılabilir değerlerdir', () => {
    for (const g of games) expect(g.stickerScore).toBeGreaterThan(0);
    expect(games.find((g) => g.slug === 'hafiza')!.stickerScore).toBeLessThanOrEqual(memoryScore(0));
  });
});
