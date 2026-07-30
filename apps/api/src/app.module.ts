import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerModule } from 'nestjs-pino';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ServicesModule } from './modules/services/services.module';
import { InvoicesModule } from './modules/invoices/invoice.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { HealthModule } from './modules/health/health.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';

const isProd = process.env.NODE_ENV === 'production';

const envValidationSchema = Joi.object({
  DATABASE_URL:          Joi.string().uri().required(),
  JWT_SECRET:            Joi.string().min(32).required(),
  JWT_REFRESH_SECRET:    Joi.string().min(32).required(),
  JWT_EXPIRES_IN:        Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN:Joi.string().default('7d'),
  NODE_ENV:              Joi.string().valid('development', 'production', 'test').default('development'),
  PORT:                  Joi.number().integer().min(1).max(65535).default(4000),
  CORS_ORIGIN:           Joi.string().default('*'),
  ZATCA_VAT_NUMBER:      Joi.string().optional(),
  REDIS_URL:             Joi.string().uri().optional(),
  UPLOAD_DIR:            Joi.string().optional(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false, allowUnknown: true },
    }),

    // ── R10: In-Memory Cache (Redis-ready) ───────────────────────────────────
    // افتراضي: in-memory (بدون Redis). لتفعيل Redis:
    //   npm install cache-manager-ioredis-yet
    //   ثم أضف: store: require('cache-manager-ioredis-yet'), host/port/url
    // CacheModule.isGlobal → CACHE_MANAGER متاح في كل module مباشرة
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000, // افتراضي 1 دقيقة (بالميلي ثانية)
      max: 200,        // حد أقصى 200 مفتاح في الذاكرة
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        level: isProd ? 'warn' : 'info',
        transport: isProd
          ? undefined
          : { target: 'pino-pretty', options: { colorize: true, singleLine: true } },
        customLogLevel: (_req, res) => {
          if (res.statusCode >= 500) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
        redact: { paths: ['req.headers.authorization', 'req.headers.cookie'], censor: '[REDACTED]' },
        genReqId: (req) =>
          (req.headers['x-request-id'] as string) ||
          `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        autoLogging: { ignore: (req) => req.url === '/api/v1/health' },
      },
    }),

    ThrottlerModule.forRoot([
      { name: 'general', ttl: 60_000, limit: 120 },
      { name: 'strict',  ttl: 60_000, limit: 10  },
    ]),

    PrismaModule,
    AuthModule,
    OrdersModule,
    ServicesModule,
    InvoicesModule,
    MetricsModule,
    HealthModule,
    UploadsModule,
    NotificationsModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
