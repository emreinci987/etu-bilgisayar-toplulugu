import { test, expect } from '@playwright/test';

test('biz-kimiz: topluluk bölümleri ve yönetim ekibi görünür', async ({ page }) => {
  await page.goto('/biz-kimiz');

  await expect(
    page.getByRole('heading', { name: 'TOBB ETÜ Bilgisayar Topluluğu' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Topluluklarımız' })).toBeVisible();

  // 5 topluluk "hakkında" kartı
  await expect(page.locator('article')).toHaveCount(5);

  // Yönetim ekibi bölümü: her topluluk için başkan + yardımcı, isimler boş → "Yakında"
  await expect(page.getByRole('heading', { name: 'Yönetim Ekibimiz' })).toBeVisible();
  await expect(page.getByText('Yakında', { exact: true })).toHaveCount(10);
});
