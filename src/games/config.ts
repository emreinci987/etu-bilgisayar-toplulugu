/**
 * Stand oyunları — sticker eşikleri ve oyun listesi.
 * Eşiği değiştirmek için sadece buradaki sayıları düzenleyin.
 */
export interface GameInfo {
  slug: 'flappy' | 'hafiza';
  title: string;
  description: string;
  /** Bu puana ulaşan (veya geçen) sticker kazanır */
  stickerScore: number;
  /** Eşiği anlatan kısa metin */
  goal: string;
}

export const games: GameInfo[] = [
  {
    slug: 'flappy',
    title: 'Flappy Bug',
    description: 'Ekrana dokun, bug zıplasın. Kod bloklarının arasından geçebildiğin kadar geç.',
    stickerScore: 10,
    goal: '10 engel geç',
  },
  {
    slug: 'hafiza',
    title: 'Kulüp Hafızası',
    description: 'Kartları çevir, aynı kulüp logolarını eşleştir. 100 puanla başlarsın, her yanlış eşleşme −5.',
    stickerScore: 80,
    goal: '80 puan ve üzeri',
  },
];

export function getGame(slug: GameInfo['slug']): GameInfo {
  return games.find((g) => g.slug === slug)!;
}
