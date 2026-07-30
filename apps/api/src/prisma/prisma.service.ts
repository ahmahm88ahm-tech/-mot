import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  /**
   * BUG-FIX (v3.25.0): $connect() مُغلَّف بـ try/catch.
   * Prisma يدعم الاتصال الكسول (lazy connect) — يتصل تلقائياً عند أول
   * استعلام. الاستدعاء الصريح $connect() اختياري، ولكن إذا فشل يجب ألا
   * يُوقف bootstrap التطبيق بالكامل (بيئة Test / بدء بطيء للـ DB).
   */
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (err: any) {
      this.logger.warn(
        `Prisma eager-connect failed — سيتصل عند أول استعلام: ${err?.message ?? err}`,
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
