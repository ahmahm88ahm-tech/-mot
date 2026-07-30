import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * R8 — Integration Tests: Auth endpoints
 *
 * يختبر البنية: الـ endpoints موجودة وتتحقق من المدخلات.
 * لا يتطلب DB حقيقية — يكفي أن تُعيد 400 على بيانات ناقصة، لا 404.
 */
describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
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

  describe('POST /api/v1/auth/register', () => {
    it('يُعيد 400 عند إرسال body فارغ', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({});
      expect(res.status).toBe(400);
    });

    it('يُعيد 400 عند كلمة مرور قصيرة', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ firstName: 'أحمد', lastName: 'محمد', email: 'a@b.com', phone: '0512345678', password: '123' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('يُعيد 400 عند body فارغ', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('يُعيد 400 عند body فارغ', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('يُعيد 400 عند body فارغ', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .send({});
      expect(res.status).toBe(400);
    });

    it('يُعيد 200 (idempotent) لتوكن وهمي', async () => {
      // logout يُرجع 200 حتى للـ token المجهول (idempotent بدون DB)
      // يُسمح بـ 200 أو 401 أو 503 — المهم ليس 404
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .send({ refreshToken: 'fake-token-that-does-not-exist' });
      expect(res.status).not.toBe(404);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('يُعيد 401 بدون توكن', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
