import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';

const STATUS_TTL = 30 * 1000; // 30 ثانية (cache-manager v5 بالميلي ثانية)

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private readonly startedAt = Date.now();

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  // R10: نتيجة /status مُخزَّنة 30 ثانية لتخفيف الضغط على DB
  async status() {
    const key = 'metrics:status';
    const cached = await this.cache.get<any>(key);
    if (cached) return { ...cached, fromCache: true };

    const result = await this.computeStatus();
    await this.cache.set(key, result, STATUS_TTL);
    return result;
  }

  private async computeStatus() {
    const checks: Record<string, { ok: boolean; ms?: number; error?: string }> = {};
    checks.db = await this.timeCheck(async () => { await this.prisma.$queryRaw`SELECT 1`; });
    checks.memory = { ok: true };

    let orders = -1, users = -1;
    try { orders = await this.prisma.order.count(); } catch (e: any) { this.logger.warn('orders count: ' + e.message); }
    try { users  = await this.prisma.user.count();  } catch (e: any) { this.logger.warn('users count: '  + e.message); }

    const mem = process.memoryUsage();
    return {
      ok: checks.db.ok,
      uptimeSec: Math.floor((Date.now() - this.startedAt) / 1000),
      checks,
      counts: { orders: orders >= 0 ? orders : null, users: users >= 0 ? users : null },
      memoryMB: { rss: Math.round(mem.rss / 1e6), heap: Math.round(mem.heapUsed / 1e6) },
      ts: new Date().toISOString(),
    };
  }

  async prometheus(): Promise<string> {
    const s = await this.computeStatus(); // Prometheus لا يستخدم الكاش — يحتاج أرقاماً حيّة
    const lines = [
      `# HELP motanaqil_up 1 if the service is healthy`,
      `# TYPE motanaqil_up gauge`,
      `motanaqil_up ${s.ok ? 1 : 0}`,
      `# HELP motanaqil_uptime_seconds`,
      `# TYPE motanaqil_uptime_seconds gauge`,
      `motanaqil_uptime_seconds ${s.uptimeSec}`,
      `# HELP motanaqil_orders_total`,
      `# TYPE motanaqil_orders_total gauge`,
      `motanaqil_orders_total ${s.counts.orders ?? 0}`,
      `# HELP motanaqil_users_total`,
      `# TYPE motanaqil_users_total gauge`,
      `motanaqil_users_total ${s.counts.users ?? 0}`,
      `# HELP motanaqil_memory_rss_bytes`,
      `# TYPE motanaqil_memory_rss_bytes gauge`,
      `motanaqil_memory_rss_bytes ${s.memoryMB.rss * 1e6}`,
    ];
    return lines.join('\n') + '\n';
  }

  private async timeCheck(fn: () => Promise<void>): Promise<{ ok: boolean; ms: number; error?: string }> {
    const t0 = Date.now();
    try   { await fn(); return { ok: true,  ms: Date.now() - t0 }; }
    catch (e: any) { return { ok: false, ms: Date.now() - t0, error: e.message }; }
  }
}
