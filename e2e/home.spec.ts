import { test, expect } from '@playwright/test';
import { communities } from '../src/data/communities';

test('ana sayfa yüklenir: başlık ve tüm topluluk kartları görünür', async ({ page }) => {
  await page.goto('/');

  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('Bilgisayar');
  await expect(h1).toContainText('Topluluğu');

  for (const c of communities) {
    await expect(page.getByRole('heading', { name: c.name, exact: true })).toBeVisible();
  }
});
