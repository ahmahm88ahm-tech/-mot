import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../../common/decorators/public.decorator';

const STATUS_AR: Record<string, string> = {
  CREATED: 'تم الإنشاء', CONFIRMED: 'تم التأكيد', ASSIGNED: 'تم تعيين السائق',
  DRIVER_STARTED: 'السائق في الطريق', ARRIVED: 'وصل للاستلام', LOADING: 'جاري التحميل',
  MOVING: 'في الطريق', UNLOADING: 'جاري التفريغ', INSTALLATION: 'جاري التركيب',
  COMPLETED: 'مكتمل', CANCELLED: 'ملغي',
};

@ApiTags('Tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get(':orderNumber')
  @ApiOperation({ summary: 'تتبع الطلب برقمه (عام)' })
  @ApiParam({ name: 'orderNumber', description: 'رقم الطلب مثل: ORD-2026-00001' })
  async track(@Param('orderNumber') orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        service: { select: { nameAr: true } },
        assignedTo: { select: { firstName: true, lastName: true } },
        statusHistory: { orderBy: { createdAt: 'asc' }, select: { toStatus: true, createdAt: true, latitude: true, longitude: true } },
      },
    });
    if (!order) throw new NotFoundException('الطلب غير موجود');

    const withLoc = [...order.statusHistory].reverse().find((h) => h.latitude != null && h.longitude != null);
    const lastLocation = withLoc
      ? { latitude: Number(withLoc.latitude), longitude: Number(withLoc.longitude), at: withLoc.createdAt }
      : null;

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      statusLabel: STATUS_AR[order.status] || order.status,
      service: order.service?.nameAr || null,
      driver: order.assignedTo ? { name: `${order.assignedTo.firstName} ${order.assignedTo.lastName}` } : null,
      from: { lat: Number(order.fromLat), lng: Number(order.fromLng) },
      to:   { lat: Number(order.toLat),   lng: Number(order.toLng)   },
      lastLocation,
      history: order.statusHistory.map((h) => ({
        status: h.toStatus,
        label:  STATUS_AR[h.toStatus] || h.toStatus,
        at:     h.createdAt,
      })),
    };
  }
}
