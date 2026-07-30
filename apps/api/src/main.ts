import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { Logger as PinoLogger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // ── M3: pino logger ──────────────────────────────────────────────────────
  const logger = app.get(PinoLogger);
  app.useLogger(logger);

  // ── M2: Helmet — CSP مشدَّد للـ API، مخفَّف لمسار Swagger فقط ──────────
  // مسار /api/docs يحتاج inline scripts/styles لواجهة Swagger UI
  app.use('/api/docs', helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:     ["'self'"],
        scriptSrc:      ["'self'", "'unsafe-inline'"],
        styleSrc:       ["'self'", "'unsafe-inline'"],
        imgSrc:         ["'self'", 'data:'],
        connectSrc:     ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // باقي المسارات: CSP صارم
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc:     ["'none'"],
          scriptSrc:      ["'none'"],
          styleSrc:       ["'none'"],
          imgSrc:         ["'none'"],
          connectSrc:     ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
      strictTransportSecurity: { maxAge: 31_536_000, includeSubDomains: true, preload: true },
      hidePoweredBy:            true,
      noSniff:                  true,
      frameguard:               { action: 'deny' },
      xssFilter:                true,
      referrerPolicy:           { policy: 'no-referrer' },
      dnsPrefetchControl:       { allow: false },
      crossOriginOpenerPolicy:  { policy: 'same-origin' },
      crossOriginResourcePolicy:{ policy: 'same-origin' },
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin:         (process.env.CORS_ORIGIN || '*').split(',').map((o) => o.trim()),
    credentials:    true,
    methods:        ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  // ── R1: Swagger / OpenAPI Docs ────────────────────────────────────────────
  // متاح فقط في غير بيئة الإنتاج — أو قم بحمايته بـ BasicAuth في prod.
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('MOTANAQIL API')
      .setDescription('واجهة برمجية لمنصة مُتنقِّل للنقل العفش والخدمات اللوجستية')
      .setVersion('3.21')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
        'JWT',
      )
      .addServer(`http://localhost:${process.env.PORT || 4000}`, 'Local Development')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    const appLogger = new Logger('Swagger');
    appLogger.log(`📖 Swagger UI: http://localhost:${process.env.PORT || 4000}/api/docs`);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);

  const appLogger = new Logger('Bootstrap');
  appLogger.log(`🚀 API listening on http://localhost:${port}/api/v1`);
}
bootstrap();
