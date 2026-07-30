import { test, expect } from '@playwright/test';
import { loginAs, createOrderViaApi } from './fixtures';

test('السيناريو الذهبي: صحة → دخول → طلب → فاتورة → ضمان', async ({ page }) => {
  // ١) الصحة
  const health = await page.request.get((process.env.E2E_API_URL || 'http://localhost:4000') + '/api/v1/health');
  expect(health.ok()).toBeTruthy();

  // ٢) الصفحة الرئيسية تُحمَّل بالمشهد السينمائي
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();

  // ٣) تسجيل الدخول
  const token = await loginAs(page);
  expect(token).toBeTruthy();

  // ٤) إنشاء طلب (عبر API) ثم التحقق من ظهوره في اللوحة
  const orderNumber = await createOrderViaApi(page, token);
  expect(orderNumber).toMatch(/MTQ-/);
  await page.goto('/dashboard');
  await expect(page.getByText(orderNumber)).toBeVisible({ timeout: 10_000 });

  // ٥) الفاتورة تُفتح وتحوي رمزاً زكوياً وختم «الدفع عند الإكمال»
  await page.goto(`/invoice/${orderNumber}`);
  await expect(page.getByText(/فاتورة ضريبية مبسّطة/)).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(/الدفع بعد إتمام الخدمة/)).toBeVisible();

  // ٦) صفحة الضمان منشورة
  await page.goto('/guarantee');
  await expect(page.getByRole('heading', { name: /سياسة/ })).toBeVisible();
});

test('الصفحات النظامية منشورة (خصوصية + شروط)', async ({ page }) => {
  await page.goto('/privacy-policy');
  await expect(page.getByText(/نظام حماية البيانات الشخصية/)).toBeVisible();
  await page.goto('/terms');
  await expect(page.getByText(/قبول الشروط/)).toBeVisible();
});
