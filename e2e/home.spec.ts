import { test, expect } from '@playwright/test';

test('ana sayfa yüklenir: başlık ve 5 topluluk kartı görünür', async ({ page }) => {
  await page.goto('/');

  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('Bilgisayar');
  await expect(h1).toContainText('Topluluğu');

  const communityNames = [
    'Ana Topluluk',
    'FinTech Topluluğu',
    'App Geliştirme Topluluğu',
    'AI Topluluğu',
    'Oyun Geliştirme Topluluğu',
  ];
  for (const name of communityNames) {
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  }
});
