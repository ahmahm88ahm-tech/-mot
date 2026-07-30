import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaHealthIndicator } from './prisma.health';

/**
 * L2 — Health Endpoint إثراء (@nestjs/terminus)
 *
 * GET /api/v1/health
 * يُعيد:
 * {
 *   status: 'ok' | 'error' | 'shutting_down',
 *   info:    { database: { status: 'up' } },
 *   error:   {},
 *   details: { database: { status: 'up' } }
 * }
 *
 * @Public     — لا يحتاج JWT
 * @SkipThrottle — لا throttle (تُستدعى كثيراً من أدوات المراقبة)
 */
@Controller('health')
@Public()
@SkipThrottle()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
    ]);
  }
}
