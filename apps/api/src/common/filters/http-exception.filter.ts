import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isPrismaError, mapPrismaError } from './prisma-error.mapper';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpException');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let status  = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'حدث خطأ غير متوقع';
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      // ── أخطاء NestJS HTTP ────────────────────────────────────────────────
      status = exception.getStatus();
      const r = exception.getResponse();
      if (typeof r === 'string') {
        message = r;
      } else if (typeof r === 'object' && r !== null) {
        message = (r as any).message || message;
        if (Array.isArray((r as any).message)) details = (r as any).message;
      }
    } else if (isPrismaError(exception)) {
      // ── L1: أخطاء Prisma — رسائل آمنة لا تكشف تفاصيل DB ─────────────────
      const mapped = mapPrismaError(exception);
      status  = mapped.status;
      message = mapped.message;
      // نُسجِّل الخطأ الأصلي كاملاً داخلياً فقط (للـ devs) لا للمستخدم
      this.logger.error(
        `Prisma ${(exception as any).code} — ${req.method} ${req.url}`,
        (exception as any).message,
      );
    }

    // ── Logging: 5xx كـ error، 4xx كـ warn ──────────────────────────────────
    const logCtx = `${req.method} ${req.url}`;
    if (status >= 500 && !isPrismaError(exception)) {
      this.logger.error(
        `${logCtx} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else if (status >= 400 && status < 500 && !isPrismaError(exception)) {
      this.logger.warn(`${logCtx} → ${status} — ${message}`);
    }

    res.status(status).json({ success: false, error: { message, details } });
  }
}
