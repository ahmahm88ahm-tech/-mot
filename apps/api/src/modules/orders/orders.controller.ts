import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Orders')
@ApiBearerAuth('JWT')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private svc: OrdersService) {}

  @Post()
  @Throttle({ strict: { ttl: 60_000, limit: 10 } })
  @ApiOperation({ summary: 'إنشاء طلب نقل جديد' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() u: any) {
    return this.svc.create(dto, u.id);
  }

  @Get()
  @SkipThrottle({ strict: true })
  @ApiOperation({ summary: 'طلبات المستخدم الحالي' })
  mine(@CurrentUser('id') id: string) { return this.svc.mine(id); }

  @Post('price')
  @Public()
  @Throttle({ general: { ttl: 60_000, limit: 60 } })
  @ApiOperation({ summary: 'حساب سعر الطلب (عام)' })
  price(@Body() dto: any) { return this.svc.price(dto); }

  @Get(':id')
  @SkipThrottle({ strict: true })
  @ApiOperation({ summary: 'تفاصيل طلب معين' })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  one(@Param('id') id: string, @CurrentUser() u: any) { return this.svc.findOne(id, u); }

  @Patch(':id/payment')
  @Throttle({ strict: { ttl: 60_000, limit: 20 } })
  @ApiOperation({ summary: 'تأكيد الدفع' })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  confirmPayment(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: any) {
    return this.svc.confirmPayment(id, dto, user);
  }

  // R3 — Driver Assignment Automation
  @Patch(':id/auto-assign')
  @Throttle({ strict: { ttl: 60_000, limit: 30 } })
  @ApiOperation({ summary: 'تعيين تلقائي لأقرب سائق متاح (إدارة فقط)' })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  autoAssign(@Param('id') id: string, @CurrentUser() user: any) {
    return this.svc.autoAssign(id, user);
  }
}
