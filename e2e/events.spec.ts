import { test, expect } from '@playwright/test';

test('etkinlikler filtre akışı: çip → kart sayısı azalır → URL değişir → Tümü ile geri', async ({
  page,
}) => {
  await page.goto('/etkinlikler');

  const cards = page.locator('article');
  await expect(cards).toHaveCount(10);

  await page.getByRole('button', { name: 'AI Topluluğu' }).click();
  await expect(cards).toHaveCount(3);
  await expect(page).toHaveURL(/\/etkinlikler\?topluluk=ai/);

  await page.getByRole('button', { name: 'Tümü' }).click();
  await expect(cards).toHaveCount(10);
  await expect(page).not.toHaveURL(/topluluk=/);
});

test('paylaşılabilir filtre linki doğrudan filtreli açılır', async ({ page }) => {
  await page.goto('/etkinlikler?topluluk=siber-guvenlik');
  await expect(page.locator('article')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Siber Güvenlik Topluluğu' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('etkinlik kartı detay penceresini açar; geri tuşu kapatır', async ({ page }) => {
  await page.goto('/etkinlikler');
  await page.getByRole('button', { name: 'Yapay Zeka Güvenliği' }).click();

  const dialog = page.getByRole('dialog', { name: 'Yapay Zeka Güvenliği' });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/etkinlik=yapay-zeka-guvenligi-2026/);

  await page.goBack();
  await expect(dialog).toBeHidden();
  await expect(page).not.toHaveURL(/etkinlik=/);
});
