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
    title: 'Kod Hafızası',
    description: 'Kartları çevir, aynı kod sembollerini eşleştir. 100 puanla başlarsın, her yanlış eşleşme −5.',
    stickerScore: 70,
    goal: '70 puan ve üzeri',
  },
];

export function getGame(slug: GameInfo['slug']): GameInfo {
  return games.find((g) => g.slug === slug)!;
}
