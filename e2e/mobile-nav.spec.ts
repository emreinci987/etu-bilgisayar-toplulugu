import { test, expect } from '@playwright/test';

test('mobil viewport: hamburger menü açılır ve sayfalar arası gezinme çalışır', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'yalnızca mobil projede çalışır');

  await page.goto('/');

  const toggle = page.getByRole('button', { name: 'Menüyü aç' });
  await expect(toggle).toBeVisible();
  await toggle.click();

  const close = page.getByRole('button', { name: 'Menüyü kapat' });
  await expect(close).toHaveAttribute('aria-expanded', 'true');

  // Mobil menüdeki linke tıkla → sayfa değişir ve menü kapanır
  // (ana sayfadaki "Etkinlikler" CTA'larıyla karışmaması için header kapsamında, exact)
  const nav = page.getByRole('banner');
  await nav.getByRole('link', { name: 'Etkinlikler', exact: true }).click();
  await expect(page).toHaveURL(/\/etkinlikler$/);
  await expect(page.getByRole('heading', { name: 'Etkinlik Takvimi' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Menüyü aç' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );

  // Menüyü tekrar açıp Biz Kimiz'e git
  await page.getByRole('button', { name: 'Menüyü aç' }).click();
  await nav.getByRole('link', { name: 'Biz Kimiz', exact: true }).click();
  await expect(page).toHaveURL(/\/biz-kimiz$/);
  await expect(
    page.getByRole('heading', { name: 'TOBB ETÜ Bilgisayar Topluluğu' }),
  ).toBeVisible();
});
