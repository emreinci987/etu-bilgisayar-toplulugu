/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import { communities } from '../communities';
import type { EventsFile } from '../events.types';
import type { AboutData, TeamRole } from '../about.types';
import rawEvents from '../events.json';
import rawAbout from '../about.json';

const events = (rawEvents as EventsFile).items;
const about = rawAbout as AboutData;

const validSlugs = new Set(communities.map((c) => c.slug));
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_ROLES: TeamRole[] = ['Başkan', 'Başkan Yardımcısı'];

/** ISO görünümlü ama takvimde olmayan tarihleri (2025-13-40 gibi) de yakalar */
function isRealISODate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

describe('events.json şeması', () => {
  it('en az bir etkinlik içerir', () => {
    expect(events.length).toBeGreaterThan(0);
  });

  it('her kayıt zorunlu alanları dolu string olarak taşır', () => {
    for (const e of events) {
      expect(typeof e.id, `id: ${e.id}`).toBe('string');
      expect(e.id.trim().length, `id boş: ${e.id}`).toBeGreaterThan(0);
      for (const field of ['title', 'date', 'location', 'communitySlug', 'summary'] as const) {
        expect(typeof e[field], `${e.id}.${field} tip`).toBe('string');
        expect((e[field] as string).trim().length, `${e.id}.${field} boş`).toBeGreaterThan(0);
      }
    }
  });

  it('id’ler benzersizdir', () => {
    const ids = events.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('communitySlug değerleri communities.ts’teki slug’larla eşleşir', () => {
    for (const e of events) {
      expect(validSlugs.has(e.communitySlug), `${e.id} → geçersiz slug: ${e.communitySlug}`).toBe(true);
    }
  });

  it('tarihler geçerli ISO (YYYY-MM-DD) takvim tarihleridir', () => {
    for (const e of events) {
      expect(isRealISODate(e.date), `${e.id} → geçersiz tarih: ${e.date}`).toBe(true);
    }
  });

  it('opsiyonel alanlar verilmişse doğru tiptedir', () => {
    for (const e of events) {
      if (e.image !== undefined) {
        expect(e.image.startsWith('/etkinlikler/'), `${e.id}.image yolu`).toBe(true);
      }
      for (const img of e.gallery ?? []) {
        expect(img.startsWith('/etkinlikler/'), `${e.id}.gallery yolu`).toBe(true);
      }
      for (const slug of e.relatedSlugs ?? []) {
        expect(validSlugs.has(slug), `${e.id} → geçersiz relatedSlug: ${slug}`).toBe(true);
      }
      for (const l of e.links ?? []) {
        expect(l.url, `${e.id} link URL değil`).toMatch(/^https?:\/\//);
      }
      if (e.tags !== undefined) {
        expect(Array.isArray(e.tags), `${e.id}.tags dizi`).toBe(true);
        for (const tag of e.tags) expect(tag.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

// public/etkinlikler içeriği (yalnızca dosya adları gerekli; içerik yüklenmez)
const publicEventFiles = new Set(
  Object.keys(import.meta.glob('../../../public/etkinlikler/*')).map((p) =>
    p.replace('../../../public', ''),
  ),
);

it('events.json’daki görseller public/etkinlikler altında mevcuttur', () => {
  expect(publicEventFiles.size).toBeGreaterThan(0);
  for (const e of events) {
    for (const img of [e.image, ...(e.gallery ?? [])].filter(Boolean) as string[]) {
      expect(publicEventFiles.has(img), `${e.id} → ${img} yok`).toBe(true);
    }
  }
});

describe('public/logolar', () => {
  const logoFiles = Object.keys(import.meta.glob('../../../public/logolar/*.{png,svg}')).map(
    (p) => p.split('/').pop()!,
  );

  it('logo dosya adları communities.ts slug’larıyla birebir eşleşir', () => {
    expect(logoFiles.length).toBeGreaterThan(0);
    for (const file of logoFiles) {
      const slug = file.replace(/\.(png|svg)$/, '');
      expect(validSlugs.has(slug), `${file} → bilinmeyen slug`).toBe(true);
    }
  });
});

describe('about.json şeması', () => {
  it('hero.mission ve hero.intro dolu metinlerdir', () => {
    expect(about.hero.mission.trim().length).toBeGreaterThan(0);
    expect(about.hero.intro.trim().length).toBeGreaterThan(0);
  });

  it('communities dizisi communities.ts’teki tüm slug’ları birebir kapsar', () => {
    const slugs = about.communities.map((c) => c.slug);
    expect(new Set(slugs).size, 'slug tekrarı var').toBe(slugs.length);
    expect(slugs.sort()).toEqual([...validSlugs].sort());
    for (const c of about.communities) {
      expect(c.about.trim().length, `${c.slug}.about boş`).toBeGreaterThan(0);
    }
  });

  it('topluluk instagram/whatsapp alanları verilmişse geçerli http(s) URL’dir', () => {
    for (const c of about.communities) {
      for (const key of ['instagram', 'whatsapp'] as const) {
        const url = c[key];
        if (url !== undefined && url.trim().length > 0) {
          expect(url, `${c.slug}.${key} URL değil`).toMatch(/^https?:\/\//);
        }
      }
    }
  });

  it('team kayıtları geçerli slug ve rol değerleri taşır', () => {
    expect(about.team.length).toBeGreaterThan(0);
    for (const t of about.team) {
      expect(validSlugs.has(t.communitySlug), `geçersiz slug: ${t.communitySlug}`).toBe(true);
      expect(t.members.length).toBeGreaterThan(0);
      for (const m of t.members) {
        expect(VALID_ROLES, `${t.communitySlug} → geçersiz rol: ${m.role}`).toContain(m.role);
        expect(typeof m.name).toBe('string');
        expect(typeof m.title).toBe('string');
      }
    }
  });

  it('socials 5 platformu string olarak içerir; dolu ise http(s) URL’dir', () => {
    for (const key of ['instagram', 'linkedin', 'github', 'discord', 'whatsapp'] as const) {
      const value = about.socials[key];
      expect(typeof value, `socials.${key} tip`).toBe('string');
      if (value.trim().length > 0) {
        expect(value, `socials.${key} URL değil`).toMatch(/^https?:\/\//);
      }
    }
  });
});
