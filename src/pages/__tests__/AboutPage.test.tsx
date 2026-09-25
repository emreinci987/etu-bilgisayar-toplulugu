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
  it('5 topluluk bölümü render olur', () => {
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
    // about.json'da tüm isimler boş → her boş isim için bir "Yakında"
    expect(screen.getAllByText('Yakında')).toHaveLength(emptyNameCount);
    expect(emptyNameCount).toBe(teamMemberCount);
  });

  it('sosyal linkler boşsa bilgilendirme mesajı gösterilir', () => {
    render(<AboutPage />);
    expect(screen.getByText(/sosyal medya bağlantıları yakında eklenecek/i)).toBeInTheDocument();
  });

  it('hero misyon metni görünür', () => {
    render(<AboutPage />);
    expect(screen.getByText(about.hero.mission)).toBeInTheDocument();
  });
});
