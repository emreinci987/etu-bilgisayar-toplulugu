import { test, expect } from '@playwright/test';

test('etkinlikler filtre akışı: çip → kart sayısı azalır → URL değişir → Tümü ile geri', async ({
  page,
}) => {
  await page.goto('/etkinlikler');

  const cards = page.locator('article');
  await expect(cards).toHaveCount(9);

  await page.getByRole('button', { name: 'AI Topluluğu' }).click();
  await expect(cards).toHaveCount(2);
  await expect(page).toHaveURL(/\/etkinlikler\?topluluk=ai/);

  await page.getByRole('button', { name: 'Tümü' }).click();
  await expect(cards).toHaveCount(9);
  await expect(page).not.toHaveURL(/topluluk=/);
});

test('paylaşılabilir filtre linki doğrudan filtreli açılır', async ({ page }) => {
  await page.goto('/etkinlikler?topluluk=fintech');
  await expect(page.locator('article')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'FinTech Topluluğu' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});
