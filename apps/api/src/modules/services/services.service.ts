import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';

const SERVICES_TTL = 5 * 60 * 1000; // 5 دقائق (بالميلي ثانية — cache-manager v5)

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  // R10 — Redis/In-Memory Caching: نتيجة /services مُخزَّنة 5 دقائق
  async findAll(citySlug?: string) {
    const key = `services:all:${citySlug ?? '__all__'}`;
    const cached = await this.cache.get<any[]>(key);
    if (cached) return cached;

    const result = await this.prisma.service.findMany({
      where: {
        isActive: true,
        ...(citySlug ? { city: { slug: citySlug } } : {}),
      },
      include: { city: { select: { nameAr: true, slug: true } } },
      orderBy: { nameAr: 'asc' },
    });

    await this.cache.set(key, result, SERVICES_TTL);
    return result;
  }

  async findOne(slug: string) {
    const key = `services:one:${slug}`;
    const cached = await this.cache.get<any>(key);
    if (cached) return cached;

    const result = await this.prisma.service.findUnique({
      where: { slug },
      include: { city: { select: { nameAr: true, slug: true } } },
    });

    if (result) await this.cache.set(key, result, SERVICES_TTL);
    return result;
  }
}
