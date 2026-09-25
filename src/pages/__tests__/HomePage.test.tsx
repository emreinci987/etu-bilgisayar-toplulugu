import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../HomePage';
import { communities } from '../../data/communities';

// three.js jsdom'da WebGL context üretemez — HeroCanvas'ı mock'la
vi.mock('../../components/HeroCanvas', () => ({
  default: () => <div data-testid="hero-canvas-mock" aria-hidden="true" />,
}));

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage (integration, HeroCanvas mock’lu)', () => {
  it('hero başlığı ve 5 topluluk kartı render olur', () => {
    renderHome();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Bilgisayar');
    expect(h1).toHaveTextContent('Topluluğu');

    for (const c of communities) {
      expect(screen.getByRole('heading', { name: c.name })).toBeInTheDocument();
    }
  });

  it('son 3 etkinlik önizlemesi yeniden eskiye listelenir', () => {
    renderHome();
    const times = screen.getAllByRole('time');
    expect(times).toHaveLength(3);
    const dates = times.map((t) => t.getAttribute('datetime') ?? '');
    const sorted = [...dates].sort((a, b) => b.localeCompare(a));
    expect(dates).toEqual(sorted);
  });

  it('Etkinlikler ve Biz Kimiz sayfalarına link içerir', () => {
    renderHome();
    expect(screen.getByRole('link', { name: 'Etkinlikler' })).toHaveAttribute('href', '/etkinlikler');
    expect(screen.getByRole('link', { name: /Bizi Tanıyın/ })).toHaveAttribute('href', '/biz-kimiz');
    expect(screen.getByRole('link', { name: /Tüm etkinlikler/ })).toHaveAttribute('href', '/etkinlikler');
  });
});
