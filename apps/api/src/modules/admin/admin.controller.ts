import {
  Controller, Get, Patch, Param, Query, Body, UseGuards, ParseBoolPipe,
  DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { IsOptional, IsString } from 'class-validator';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class UpdateStatusDto {
  @IsString() status!: string;
  @IsOptional() @IsString() note?: string;
}

@ApiTags('Admin')
@ApiBearerAuth('JWT')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MANAGER', 'SUPER_ADMIN')
export class AdminController {
  constructor(private readonly svc: AdminService) {}

  // ── Dashboard ─────────────────────────────────────────────────────────────
  @Get('dashboard')
  @SkipThrottle({ strict: true })
  @ApiOperation({ summary: 'لوحة التحكم: إحصائيات عامة (Admin)' })
  dashboard() { return this.svc.dashboard(); }

  // ── Orders (filtered + paginated) ────────────────────────────────────────
  @Get('orders')
  @SkipThrottle({ strict: true })
  @ApiOperation({ summary: 'قائمة الطلبات مع فلترة متقدمة (Admin)' })
  @ApiQuery({ name: 'status',        required: false })
  @ApiQuery({ name: 'paymentStatus', required: false })
  @ApiQuery({ name: 'cityId',        required: false })
  @ApiQuery({ name: 'driverId',      required: false })
  @ApiQuery({ name: 'fromDate',      required: false, description: 'ISO date — e.g. 2026-07-01' })
  @ApiQuery({ name: 'toDate',        required: false })
  @ApiQuery({ name: 'page',          required: false, type: Number })
  @ApiQuery({ name: 'limit',         required: false, type: Number })
  @ApiQuery({ name: 'sort',          required: false, enum: ['createdAt','totalAmount','status'] })
  @ApiQuery({ name: 'dir',           required: false, enum: ['asc','desc'] })
  orders(
    @Query('status')        status?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('cityId')        cityId?: string,
    @Query('driverId')      driverId?: string,
    @Query('fromDate')      fromDate?: string,
    @Query('toDate')        toDate?: string,
    @Query('page',  new DefaultValuePipe(1),  ParseIntPipe) page  = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
    @Query('sort')          sort?: 'createdAt' | 'totalAmount' | 'status',
    @Query('dir')           dir?: 'asc' | 'desc',
  ) {
    return this.svc.orders({ status, paymentStatus, cityId, driverId, fromDate, toDate, page, limit, sort, dir });
  }

  // ── Order Detail ──────────────────────────────────────────────────────────
  @Get('orders/:id')
  @SkipThrottle({ strict: true })
  @ApiOperation({ summary: 'تفاصيل طلب كاملة مع سجل الحالات (Admin)' })
  @ApiParam({ name: 'id' })
  orderDetail(@Param('id') id: string) { return this.svc.orderDetail(id); }

  // ── Manual Status Update ──────────────────────────────────────────────────
  @Patch('orders/:id/status')
  @Throttle({ strict: { ttl: 60_000, limit: 30 } })
  @ApiOperation({ summary: 'تغيير حالة طلب يدوياً (Admin)' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateStatusDto })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.svc.updateOrderStatus(id, dto.status, dto.note, user.id);
  }

  // ── Drivers ───────────────────────────────────────────────────────────────
  @Get('drivers')
  @SkipThrottle({ strict: true })
  @ApiOperation({ summary: 'قائمة السائقين مع عدد طلباتهم النشطة (Admin)' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  drivers(
    @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly = false,
  ) {
    return this.svc.drivers(activeOnly);
  }
}
