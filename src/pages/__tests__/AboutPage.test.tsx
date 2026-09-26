import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from '../AboutPage';
import { communities } from '../../data/communities';
import type { AboutData } from '../../data/about.types';
import rawAbout from '../../data/about.json';

const about = rawAbout as AboutData;
const teamMemberCount = about.team.reduce((sum, t) => sum + t.members.length, 0);
const emptyNameCount = about.team.reduce(
  (sum, t) => sum + t.members.filter((m) => m.name.trim().length === 0).length,
  0,
);

describe('AboutPage (integration)', () => {
  it(`${communities.length} topluluk bölümü render olur`, () => {
    render(<AboutPage />);
    expect(screen.getAllByRole('article')).toHaveLength(communities.length);
    for (const c of communities) {
      expect(screen.getAllByRole('heading', { name: c.name }).length).toBeGreaterThan(0);
    }
  });

  it('tüm ekip kartları render olur', () => {
    render(<AboutPage />);
    expect(screen.getAllByText('Başkan', { exact: true })).toHaveLength(
      about.team.filter((t) => t.members.some((m) => m.role === 'Başkan')).length,
    );
    expect(screen.getAllByText('Başkan Yardımcısı', { exact: true })).toHaveLength(
      about.team.filter((t) => t.members.some((m) => m.role === 'Başkan Yardımcısı')).length,
    );
  });

  it('ismi boş olan üyelerde "Yakında" fallback’i görünür', () => {
    render(<AboutPage />);
    // about.json'da ismi boş olan her üye için bir "Yakında" render edilir
    expect(screen.getAllByText('Yakında')).toHaveLength(emptyNameCount);
    // dolu isimler de doğrudan görünür
    const filledNames = about.team.flatMap((t) =>
      t.members.filter((m) => m.name.trim().length > 0).map((m) => m.name.trim()),
    );
    for (const name of filledNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(emptyNameCount + filledNames.length).toBe(teamMemberCount);
  });

  it('dolu sosyal linkler doğru href ile görünür', () => {
    render(<AboutPage />);
    for (const [key, label] of [
      ['instagram', 'Instagram'],
      ['linkedin', 'LinkedIn'],
      ['whatsapp', 'WhatsApp'],
    ] as const) {
      const url = about.socials[key].trim();
      if (url.length > 0) {
        expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', url);
      }
    }
  });

  it('WhatsApp CTA butonu socials.whatsapp’a işaret eder', () => {
    render(<AboutPage />);
    const cta = screen.getByRole('link', { name: /WhatsApp Grubuna Katıl/ });
    expect(cta).toHaveAttribute('href', about.socials.whatsapp);
    expect(cta).toHaveAttribute('target', '_blank');
    expect(cta).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('instagram URL’i olan her topluluk kartında takip butonu görünür', () => {
    render(<AboutPage />);
    const withInstagram = about.communities.filter(
      (c) => (c.instagram ?? '').trim().length > 0,
    );
    const buttons = screen.getAllByRole('link', { name: /Instagram'da Takip Et/ });
    expect(buttons).toHaveLength(withInstagram.length);
    for (const c of withInstagram) {
      expect(buttons.some((b) => b.getAttribute('href') === c.instagram)).toBe(true);
    }
  });

  it('hero misyon metni görünür', () => {
    render(<AboutPage />);
    expect(screen.getByText(about.hero.mission)).toBeInTheDocument();
  });
});
