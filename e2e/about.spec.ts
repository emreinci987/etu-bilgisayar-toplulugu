import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { communities } from '../src/data/communities';
import type { AboutData } from '../src/data/about.types';

const about = JSON.parse(
  readFileSync(fileURLToPath(new URL('../src/data/about.json', import.meta.url)), 'utf-8'),
) as AboutData;
const emptyNameCount = about.team.reduce(
  (sum, t) => sum + t.members.filter((m) => m.name.trim().length === 0).length,
  0,
);

test('biz-kimiz: topluluk bölümleri ve yönetim ekibi görünür', async ({ page }) => {
  await page.goto('/biz-kimiz');

  await expect(
    page.getByRole('heading', { name: 'TOBB ETÜ Bilgisayar Topluluğu' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Topluluklarımız' })).toBeVisible();

  // her topluluk için bir "hakkında" kartı
  await expect(page.locator('article')).toHaveCount(communities.length);

  // Yönetim ekibi bölümü: her topluluk için başkan + yardımcı; ismi boş olanlar → "Yakında"
  await expect(page.getByRole('heading', { name: 'Yönetim Ekibimiz' })).toBeVisible();
  await expect(page.getByText('Yakında', { exact: true })).toHaveCount(emptyNameCount);
  for (const m of about.team.flatMap((t) => t.members).filter((m) => m.name.trim())) {
    await expect(page.getByText(m.name, { exact: true }).first()).toBeVisible();
  }
});

test('biz-kimiz: WhatsApp CTA butonu görünür ve doğru gruba işaret eder', async ({ page }) => {
  await page.goto('/biz-kimiz');

  const cta = page.getByRole('link', { name: /WhatsApp Grubuna Katıl/ });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', about.socials.whatsapp);
  await expect(cta).toHaveAttribute('target', '_blank');
});

test('biz-kimiz: topluluk kartlarında Instagram butonları doğru hesaplara işaret eder', async ({ page }) => {
  await page.goto('/biz-kimiz');

  const withInstagram = about.communities.filter(
    (c) => (c.instagram ?? '').trim().length > 0,
  );
  await expect(
    page.getByRole('link', { name: /Instagram'da Takip Et/ }),
  ).toHaveCount(withInstagram.length);

  // Örnek: AI topluluğunun Instagram bağlantısı
  const ai = withInstagram.find((c) => c.slug === 'ai');
  if (ai) {
    await expect(
      page.getByRole('link', { name: /Instagram'da Takip Et/ }).nth(withInstagram.indexOf(ai)),
    ).toHaveAttribute('href', ai.instagram as string);
  }
});
