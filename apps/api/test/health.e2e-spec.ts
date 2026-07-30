import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * R8 — Integration Tests: Health endpoint
 *
 * يختبر أن /api/v1/health يُعيد 200 أو 503 (حسب حالة DB).
 * في CI بدون DB → نتوقع 503 لكن يجب ألا تكون 404 أو 500.
 */
describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // تعيين متغيرات بيئة أساسية للاختبار
    process.env.DATABASE_URL      = process.env.DATABASE_URL      || 'postgresql://test:test@localhost:5432/test';
    process.env.JWT_SECRET        = process.env.JWT_SECRET        || 'test-secret-minimum-32-characters-long';
    process.env.JWT_REFRESH_SECRET= process.env.JWT_REFRESH_SECRET|| 'test-refresh-secret-minimum-32-chars-long';
    process.env.NODE_ENV          = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /api/v1/health — يُعيد 200 أو 503 (ليس 404)', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health');
    expect([200, 503]).toContain(res.status);
  });

  it('GET /api/v1/health — يحتوي على حقل status', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health');
    expect(res.body).toHaveProperty('status');
  });
});
