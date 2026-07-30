import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * L2 — PrismaHealthIndicator
 * يُنفِّذ SELECT 1 على قاعدة البيانات للتحقق من الاتصال.
 * يُستخدَم مع HealthCheckService في HealthController.
 */
@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return this.getStatus(key, true);
    } catch {
      throw new HealthCheckError(
        'Database connection failed',
        this.getStatus(key, false),
      );
    }
  }
}
