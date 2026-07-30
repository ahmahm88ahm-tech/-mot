import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto } from './dto';

const STATUS_AR: Record<string, string> = {
  CREATED: 'تم الإنشاء', CONFIRMED: 'تم التأكيد', ASSIGNED: 'تم تعيين السائق',
  DRIVER_STARTED: 'السائق في الطريق', ARRIVED: 'وصل للاستلام', LOADING: 'جاري التحميل',
  MOVING: 'في الطريق', UNLOADING: 'جاري التفريغ', INSTALLATION: 'جاري التركيب',
  COMPLETED: 'مكتمل', CANCELLED: 'ملغي',
};

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  private haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
    const R = 6371, toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)) * 100) / 100;
  }

  async create(dto: CreateOrderDto, customerId: string) {
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('الخدمة غير موجودة');
    const km = this.haversine({ lat: dto.fromLat, lng: dto.fromLng }, { lat: dto.toLat, lng: dto.toLng });
    const base = Number(service.basePrice);
    const distPrice = Math.round(km * 10 * 100) / 100;
    const subtotal = base + distPrice;
    const tax = Math.round(subtotal * 0.15 * 100) / 100;
    const total = Math.round(subtotal * 1.15 * 100) / 100;
    const year = new Date().getFullYear();
    const count = await this.prisma.order.count();
    const order = await this.prisma.order.create({
      data: {
        orderNumber: `MTQ-${year}-${String(count + 1).padStart(5, '0')}`,
        customerId, serviceId: dto.serviceId, cityId: dto.cityId || null,
        fromAddress: dto.fromAddress, toAddress: dto.toAddress,
        fromLat: dto.fromLat, fromLng: dto.fromLng, toLat: dto.toLat, toLng: dto.toLng,
        basePrice: base, distanceKm: km, distancePrice: distPrice,
        taxAmount: tax, totalAmount: total, notes: dto.notes || null,
        paymentMethod: dto.paymentMethod || 'CASH',
        paymentNote: dto.paymentMethod === 'BANK_TRANSFER' ? 'يُؤكَّد بعد مراجعة الإيصال' : null,
      },
      include: { service: true, city: true, customer: { select: { phone: true } } },
    });
    // R6: إشعار العميل بإنشاء الطلب
    void this.notifications.notifyOrderStatus({
      to: (order.customer as any).phone,
      orderNumber: order.orderNumber,
      status: order.status,
      statusLabel: STATUS_AR[order.status] || order.status,
    });
    return order;
  }

  async mine(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { service: true, city: true },
    });
  }

  async findOne(id: string, user: { id: string; role: string }) {
    const o = await this.prisma.order.findUnique({ where: { id }, include: { service: true, city: true } });
    if (!o) throw new NotFoundException('غير موجود');
    if (user.role === 'CUSTOMER' && o.customerId !== user.id) throw new NotFoundException('غير موجود');
    return o;
  }

  async price(dto: { serviceId: string; fromLat: number; fromLng: number; toLat: number; toLng: number }) {
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('الخدمة غير موجودة');
    const km = this.haversine({ lat: dto.fromLat, lng: dto.fromLng }, { lat: dto.toLat, lng: dto.toLng });
    const base = Number(service.basePrice);
    const subtotal = base + km * 10;
    return {
      basePrice: base, distanceKm: km, distancePrice: km * 10,
      tax: Math.round(subtotal * 0.15 * 100) / 100,
      total: Math.round(subtotal * 1.15 * 100) / 100, currency: 'SAR',
    };
  }

  async confirmPayment(
    orderId: string,
    dto: import('./dto/confirm-payment.dto').ConfirmPaymentDto,
    viewer: { id: string; role: string },
  ) {
    const { BadRequestException, NotFoundException: NF } = await import('@nestjs/common');
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NF('الطلب غير موجود');

    const isAdmin = ['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(viewer.role);
    const isCrew  = ['DRIVER', 'EMPLOYEE'].includes(viewer.role);

    if (dto.method === 'CASH' && !(isAdmin || isCrew))
      throw new ForbiddenException('تأكيد النقد للسائق/الموظف/الإدارة فقط');
    if (dto.method === 'BANK_TRANSFER' && !isAdmin)
      throw new ForbiddenException('تأكيد التحويل البنكي للإدارة فقط بعد مراجعة الإيصال');
    if (isCrew && order.assignedToId !== viewer.id)
      throw new ForbiddenException('لا تؤكّد دفع طلبٍ غير معيّن لك');
    if (order.paymentStatus === 'PAID')
      throw new BadRequestException('الطلب مدفوع مسبقاً');

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        paymentMethod: dto.method,
        paymentRef:    dto.method === 'BANK_TRANSFER' ? dto.reference ?? null : null,
        paymentNote:   dto.note ?? null,
        paidAt:        new Date(),
        paidBy:        viewer.id,
      },
    });
  }

  // R3 — Driver Assignment Automation (integrated with R6 notification)
  async autoAssign(orderId: string, actor: { id: string; role: string }) {
    const isAdmin = ['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(actor.role);
    if (!isAdmin) throw new ForbiddenException('التعيين التلقائي للإدارة فقط');

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: { select: { phone: true } } },
    });
    if (!order) throw new NotFoundException('الطلب غير موجود');
    if (order.assignedToId) throw new ForbiddenException('الطلب معيَّن مسبقاً');

    const busyDriverIds = await this.prisma.order.findMany({
      where: { status: { notIn: ['COMPLETED', 'CANCELLED'] }, assignedToId: { not: null } },
      select: { assignedToId: true },
    }).then((rows) => rows.map((r) => r.assignedToId as string));

    const candidateWhere: any = {
      role: 'DRIVER', status: 'ACTIVE',
      id: busyDriverIds.length ? { notIn: busyDriverIds } : undefined,
    };
    if (order.cityId) candidateWhere.cityId = order.cityId;

    let candidates = await this.prisma.user.findMany({ where: candidateWhere });

    if (!candidates.length) {
      candidates = await this.prisma.user.findMany({
        where: {
          role: 'DRIVER', status: 'ACTIVE',
          id: busyDriverIds.length ? { notIn: busyDriverIds } : undefined,
        },
      });
      if (!candidates.length) throw new NotFoundException('لا يوجد سائق متاح حالياً');
    }

    const best = candidates[0];
    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        assignedToId: best.id,
        status: 'ASSIGNED',
        statusHistory: {
          create: {
            fromStatus: order.status,
            toStatus: 'ASSIGNED',
            note: `تعيين تلقائي للسائق: ${best.firstName} ${best.lastName}`,
            createdBy: actor.id,
          },
        },
      },
      include: { assignedTo: { select: { id: true, firstName: true, lastName: true, phone: true } } },
    });

    // R6: إشعار العميل بتعيين السائق
    void this.notifications.notifyOrderStatus({
      to: (order.customer as any).phone,
      orderNumber: order.orderNumber,
      status: 'ASSIGNED',
      statusLabel: STATUS_AR['ASSIGNED'],
      message: `طلبك ${order.orderNumber} — تم تعيين السائق ${best.firstName} ${best.lastName}`,
    });

    return {
      orderId: updated.id,
      orderNumber: updated.orderNumber,
      status: updated.status,
      driver: updated.assignedTo
        ? { id: updated.assignedTo.id, name: `${updated.assignedTo.firstName} ${updated.assignedTo.lastName}`, phone: updated.assignedTo.phone }
        : null,
    };
  }
}
