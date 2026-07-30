import { Page } from '@playwright/test';

const API = process.env.E2E_API_URL || 'http://localhost:4000';
export const TEST_CREDS = { identifier: 'customer@motanaqil.com', password: 'Motanaqil@2026' };

/** يسجّل الدخول عبر الـ API مباشرة ويحقن الـ token في localStorage — سريع وثابت. */
export async function loginAs(page: Page, creds = TEST_CREDS): Promise<string> {
  const res = await page.request.post(`${API}/api/v1/auth/login`, { data: creds });
  const body = await res.json();
  const token = body?.accessToken || body?.data?.accessToken;
  await page.goto('/');
  await page.evaluate((t) => localStorage.setItem('token', t), token);
  return token;
}

/** ينشئ طلباً عبر الـ API ويعيد رقمه — لتجاوز هشاشة الـ UI في الإعداد. */
export async function createOrderViaApi(page: Page, token: string): Promise<string> {
  const services = await (await page.request.get(`${API}/api/v1/services`, { headers: { Authorization: `Bearer ${token}` } })).json();
  const serviceId = (Array.isArray(services) ? services : services?.data)?.[0]?.id;
  const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString();
  const res = await page.request.post(`${API}/api/v1/orders`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: {
      serviceId,
      fromAddress: 'حي النرجس، الرياض', toAddress: 'حي الملقا، الرياض',
      fromLat: 24.8044, fromLng: 46.6297, toLat: 24.7916, toLng: 46.6222,
      date: tomorrow, slot: 'morning', notes: 'طلب اختبار آلي',
    },
  });
  const body = await res.json();
  return body?.orderNumber || body?.data?.orderNumber;
}
