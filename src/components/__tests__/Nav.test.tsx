import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Nav from '../Nav';

function renderNav() {
  return render(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>,
  );
}

describe('Nav (integration)', () => {
  it('linkler doğru route’lara işaret eder', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /etu-bilgisayar/ })).toHaveAttribute('href', '/');
    for (const [label, href] of [
      ['Ana Sayfa', '/'],
      ['Etkinlikler', '/etkinlikler'],
      ['Biz Kimiz', '/biz-kimiz'],
    ] as const) {
      const links = screen.getAllByRole('link', { name: label });
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) expect(link).toHaveAttribute('href', href);
    }
  });

  it('mobil menü butonu menüyü açar ve kapatır', async () => {
    const user = userEvent.setup();
    renderNav();

    const button = screen.getByRole('button', { name: 'Menüyü aç' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    // Kapalıyken yalnızca masaüstü linkleri DOM'da
    expect(screen.getAllByRole('link', { name: 'Etkinlikler' })).toHaveLength(1);

    await user.click(button);
    const closeButton = screen.getByRole('button', { name: 'Menüyü kapat' });
    expect(closeButton).toHaveAttribute('aria-expanded', 'true');
    // Masaüstü + mobil linkler artık DOM'da
    expect(screen.getAllByRole('link', { name: 'Etkinlikler' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'Biz Kimiz' })).toHaveLength(2);

    await user.click(closeButton);
    expect(screen.getByRole('button', { name: 'Menüyü aç' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('link', { name: 'Etkinlikler' })).toHaveLength(1);
  });

  it('mobil menüde bir linke tıklayınca menü kapanır', async () => {
    const user = userEvent.setup();
    renderNav();

    await user.click(screen.getByRole('button', { name: 'Menüyü aç' }));
    const mobileLinks = screen.getAllByRole('link', { name: 'Biz Kimiz' });
    expect(mobileLinks).toHaveLength(2);

    await user.click(mobileLinks[mobileLinks.length - 1]);
    expect(screen.getAllByRole('link', { name: 'Biz Kimiz' })).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Menüyü aç' })).toHaveAttribute('aria-expanded', 'false');
  });
});
