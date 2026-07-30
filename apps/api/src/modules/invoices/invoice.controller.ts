import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Invoices')
@ApiBearerAuth('JWT')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly svc: InvoiceService) {}

  @Get(':orderNumber')
  @ApiOperation({ summary: 'فاتورة طلب (ZATCA QR)' })
  @ApiParam({ name: 'orderNumber', description: 'رقم الطلب' })
  get(@Param('orderNumber') orderNumber: string, @CurrentUser() user: any) {
    return this.svc.getForOrder(orderNumber, user);
  }
}
