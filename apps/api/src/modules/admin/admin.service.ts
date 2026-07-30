import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type OrderSortField = 'createdAt' | 'totalAmount' | 'status';

export interface AdminOrdersFilter {
  status?: string;
  cityId?: string;
  driverId?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sort?: OrderSortField;
  dir?: 'asc' | 'desc';
}

const VALID_STATUSES = [
  'CREATED','CONFIRMED','ASSIGNED','DRIVER_STARTED','ARRIVED',
  'LOADING','MOVING','UNLOADING','INSTALLATION','COMPLETED','CANCELLED',
];
const VALID_PAYMENT_STATUSES = ['PENDING','PAID','PARTIAL','REFUNDED'];

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Dashboard Overview ────────────────────────────────────────────────────
  async dashboard() {
    const [
      totalOrders, completedOrders, cancelledOrders, pendingOrders,
      totalUsers, totalDrivers, activeDrivers,
      revenueAgg, todayOrders, weekOrders,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'COMPLETED' } }),
      this.prisma.order.count({ where: { status: 'CANCELLED' } }),
      this.prisma.order.count({ where: { status: { notIn: ['COMPLETED','CANCELLED'] } } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.user.count({ where: { role: 'DRIVER' } }),
      this.prisma.user.count({ where: { role: 'DRIVER', status: 'ACTIVE' } }),
      this.prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count({
        where: { createdAt: { gte: this.startOfDay() } },
      }),
      this.prisma.order.count({
        where: { createdAt: { gte: this.startOfWeek() } },
      }),
    ]);

    const completionRate = totalOrders > 0
      ? Math.round((completedOrders / totalOrders) * 100)
      : 0;

    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        service: { select: { nameAr: true } },
        customer: { select: { firstName: true, lastName: true, phone: true } },
        city: { select: { nameAr: true } },
      },
    });

    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    return {
      summary: {
        totalOrders,
        completedOrders,
        cancelledOrders,
        pendingOrders,
        completionRate,
        totalRevenueSar: Number(revenueAgg._sum.totalAmount ?? 0),
        todayOrders,
        weekOrders,
      },
      users: { customers: totalUsers, totalDrivers, activeDrivers },
      ordersByStatus: ordersByStatus.map((r) => ({ status: r.status, count: r._count.id })),
      recentOrders,
      generatedAt: new Date().toISOString(),
    };
  }

  // ── Orders (paginated + filtered) ─────────────────────────────────────────
  async orders(f: AdminOrdersFilter) {
    const page  = Math.max(1, f.page  ?? 1);
    const limit = Math.min(100, Math.max(1, f.limit ?? 20));
    const skip  = (page - 1) * limit;
    const sort  = f.sort ?? 'createdAt';
    const dir   = f.dir  ?? 'desc';

    if (f.status && !VALID_STATUSES.includes(f.status))
      throw new BadRequestException(`status غير مقبول: ${f.status}`);
    if (f.paymentStatus && !VALID_PAYMENT_STATUSES.includes(f.paymentStatus))
      throw new BadRequestException(`paymentStatus غير مقبول: ${f.paymentStatus}`);

    const where: any = {
      ...(f.status        ? { status: f.status as any }               : {}),
      ...(f.paymentStatus ? { paymentStatus: f.paymentStatus as any } : {}),
      ...(f.cityId        ? { cityId: f.cityId }                      : {}),
      ...(f.driverId      ? { assignedToId: f.driverId }              : {}),
      ...(f.fromDate || f.toDate
        ? {
            createdAt: {
              ...(f.fromDate ? { gte: new Date(f.fromDate) } : {}),
              ...(f.toDate   ? { lte: new Date(f.toDate)   } : {}),
            },
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where, skip, take: limit,
        orderBy: { [sort]: dir },
        include: {
          service:    { select: { nameAr: true, slug: true } },
          customer:   { select: { firstName: true, lastName: true, phone: true } },
          assignedTo: { select: { firstName: true, lastName: true, phone: true } },
          city:       { select: { nameAr: true, slug: true } },
        },
      }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Single Order (full detail + history) ──────────────────────────────────
  async orderDetail(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        service:    true,
        customer:   { select: { id: true, firstName: true, lastName: true, phone: true, email: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, phone: true } },
        city:       true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!order) throw new NotFoundException('الطلب غير موجود');
    return order;
  }

  // ── Drivers list + workload ────────────────────────────────────────────────
  async drivers(activeOnly = false) {
    const users = await this.prisma.user.findMany({
      where: { role: 'DRIVER', ...(activeOnly ? { status: 'ACTIVE' } : {}) },
      select: {
        id: true, firstName: true, lastName: true, phone: true, status: true, cityId: true,
        city: { select: { nameAr: true } },
        assignedOrders: {
          where: { status: { notIn: ['COMPLETED','CANCELLED'] } },
          select: { id: true, orderNumber: true, status: true },
        },
      },
      orderBy: { firstName: 'asc' },
    });

    return users.map((d) => ({
      id: d.id,
      name: `${d.firstName} ${d.lastName}`,
      phone: d.phone,
      status: d.status,
      city: d.city?.nameAr ?? null,
      activeOrdersCount: d.assignedOrders.length,
      activeOrders: d.assignedOrders,
      available: d.status === 'ACTIVE' && d.assignedOrders.length === 0,
    }));
  }

  // ── Manual status update ───────────────────────────────────────────────────
  async updateOrderStatus(
    orderId: string,
    toStatus: string,
    note: string | undefined,
    actorId: string,
  ) {
    if (!VALID_STATUSES.includes(toStatus))
      throw new BadRequestException(`status غير مقبول: ${toStatus}`);

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('الطلب غير موجود');

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: toStatus as any,
        statusHistory: {
          create: {
            fromStatus: order.status,
            toStatus: toStatus as any,
            note: note ?? `تحديث يدوي من الإدارة`,
            createdBy: actorId,
          },
        },
      },
      include: { statusHistory: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  private startOfDay() {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d;
  }
  private startOfWeek() {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
