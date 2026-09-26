import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { communities } from '../src/data/communities';

// public/logolar'da dosyası olan topluluklar; olmayanlar monogram göstermeli
const withLogo = new Set(
  readdirSync('public/logolar')
    .filter((f) => /\.(png|svg)$/.test(f))
    .map((f) => f.replace(/\.(png|svg)$/, '')),
);

test('ana sayfada logosu olan her topluluğun logosu gerçekten yüklenir', async ({ page }) => {
  await page.goto('/');

  for (const c of communities) {
    const img = page.locator(`img[src^="/logolar/${c.slug}."]`);
    if (withLogo.has(c.slug)) {
      await expect(img, `${c.slug} logosu`).toHaveCount(1);
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth), {
          message: `${c.slug} logosu decode edilemedi`,
        })
        .toBeGreaterThan(0);
    } else {
      // Dosya yoksa monogram placeholder'a düşmeli
      await expect(img, `${c.slug} monograma düşmeli`).toHaveCount(0);
      await expect(page.getByText(c.shortName, { exact: true }).first()).toBeVisible();
    }
  }
});
