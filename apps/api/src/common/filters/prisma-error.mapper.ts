/**
 * L1 — PrismaErrorMapper
 * يُحوِّل PrismaClientKnownRequestError إلى رسائل آمنة للمستخدم.
 * لا يكشف تفاصيل Schema أو أسماء الجداول أو قيود قاعدة البيانات.
 */

import { HttpStatus } from '@nestjs/common';

interface MappedError {
  status: HttpStatus;
  message: string;
}

/**
 * خرائط رموز Prisma → رسالة مستخدم آمنة + HTTP status
 * https://www.prisma.io/docs/reference/api-reference/error-reference
 */
const PRISMA_ERROR_MAP: Record<string, MappedError> = {
  // P2002 — Unique constraint violation
  P2002: { status: HttpStatus.CONFLICT, message: 'البيانات المدخلة موجودة مسبقاً' },

  // P2003 — Foreign key constraint violation
  P2003: { status: HttpStatus.BAD_REQUEST, message: 'مرجع غير صالح — تحقق من البيانات المدخلة' },

  // P2025 — Record not found
  P2025: { status: HttpStatus.NOT_FOUND, message: 'العنصر المطلوب غير موجود' },

  // P2014 — Required relation violation
  P2014: { status: HttpStatus.BAD_REQUEST, message: 'العملية تنتهك علاقة مطلوبة' },

  // P2016 — Query interpretation error
  P2016: { status: HttpStatus.BAD_REQUEST, message: 'خطأ في بيانات الطلب' },

  // P2021 — Table does not exist (migration issue)
  P2021: { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'حدث خطأ في قاعدة البيانات' },

  // P2022 — Column does not exist (migration issue)
  P2022: { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'حدث خطأ في قاعدة البيانات' },

  // P2024 — Timed out fetching a new connection
  P2024: { status: HttpStatus.SERVICE_UNAVAILABLE, message: 'الخادم مشغول، حاول مرة أخرى' },
};

const DEFAULT_DB_ERROR: MappedError = {
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  message: 'حدث خطأ في قاعدة البيانات',
};

/**
 * isPrismaError — تحقق بسيط بدون import مباشر من @prisma/client
 * يعمل حتى لو تغيّر مسار الـ import في إصدارات مستقبلية.
 */
export function isPrismaError(exception: unknown): boolean {
  return (
    typeof exception === 'object' &&
    exception !== null &&
    'code' in exception &&
    typeof (exception as any).code === 'string' &&
    (exception as any).code.startsWith('P')
  );
}

export function mapPrismaError(exception: unknown): MappedError {
  if (!isPrismaError(exception)) return DEFAULT_DB_ERROR;
  const code = (exception as any).code as string;
  return PRISMA_ERROR_MAP[code] ?? DEFAULT_DB_ERROR;
}
