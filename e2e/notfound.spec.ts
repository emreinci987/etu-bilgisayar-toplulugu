import { test, expect } from '@playwright/test';

test('bilinmeyen route NotFound sayfası gösterir', async ({ page }) => {
  await page.goto('/boyle-bir-sayfa-yok');

  await expect(page.getByText('404', { exact: true })).toBeVisible();
  await expect(page.getByText('sayfa bulunamadı')).toBeVisible();

  await page.getByRole('link', { name: /Ana sayfaya dön/ }).click();
  await expect(page).toHaveURL(/\/$/);
});
