import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MemoryGame from '../MemoryGame';
import { MEMORY_SYMBOLS } from '../memory';

// Desteyi karıştırmadan üret: kartlar [s0..s7, s0..s7] sırasında
vi.mock('../memory', async (orig) => {
  const mod = await orig<typeof import('../memory')>();
  return { ...mod, createDeck: () => mod.createDeck(() => 0.999999) };
});

describe('MemoryGame', () => {
  it('hatasız bitirince sticker kazanma ekranı açılır', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MemoryGame />
      </MemoryRouter>,
    );
    const cards = within(screen.getByRole('list', { name: 'Kartlar' })).getAllByRole('button');
    const n = MEMORY_SYMBOLS.length;
    for (let i = 0; i < n; i++) {
      await user.click(cards[i]);
      await user.click(cards[i + n]);
    }
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('KAZANDIN');
    expect(dialog).toHaveTextContent('100');
  });
});
