import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildZatcaBase64 } from './zatca';
import type { InvoiceData, InvoiceLine } from './invoice.dto';

const FALLBACK_VAT = '300000000000003'; // placeholder حتى يضبط المستخدم رقمه الحقيقي

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async getForOrder(orderNumber: string, viewer: { id: string; role: string }): Promise<InvoiceData> {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: { service: true, customer: { select: { firstName: true, lastName: true } } },
    });
    if (!order) throw new NotFoundException('الطلب غير موجود');
    if (viewer.role === 'CUSTOMER' && order.customerId !== viewer.id) {
      throw new ForbiddenException('ليست فاتورتك');
    }

    const total = Number(order.totalAmount);
    const vat = Number(order.taxAmount);
    const subtotal = Math.round((total - vat) * 100) / 100;

    const lines: InvoiceLine[] = [
      { name: order.service?.nameAr || 'خدمة نقل', quantity: 1, unitPrice: Number(order.basePrice), total: Number(order.basePrice) },
    ];
    if (Number(order.distancePrice) > 0) {
      lines.push({ name: `رسوم المسافة (${order.distanceKm ?? 0} كم)`, quantity: 1, unitPrice: Number(order.distancePrice), total: Number(order.distancePrice) });
    }

    const now = order.createdAt;
    const vatNumber = process.env.ZATCA_VAT_NUMBER || FALLBACK_VAT;
    const sellerName = 'مؤسسة مُتنقِّل لنقل وتركيب الأثاث';

    const qrBase64 = buildZatcaBase64({
      sellerName,
      vatNumber,
      timestamp: now.toISOString(),
      totalWithVat: total.toFixed(2),
      vatAmount: vat.toFixed(2),
    });

    const year = now.getFullYear();
    const seq = String(orderNumber.split('-').pop() || '0').padStart(6, '0');

    return {
      invoiceNumber: `INV-${year}-${seq}`,
      orderNumber,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      seller: { name: sellerName, vatNumber },
      buyer: { name: `${order.customer.firstName} ${order.customer.lastName}` },
      lines,
      subtotal,
      vatRate: 0.15,
      vatAmount: vat,
      total,
      currency: 'SAR',
      qrBase64,
      paymentNote: 'الدفع بعد إتمام الخدمة — نقداً أو تحويلاً بنكياً.',
    };
  }
}
