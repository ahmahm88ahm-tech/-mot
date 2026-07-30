import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Metrics')
@ApiBearerAuth('JWT')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MANAGER', 'SUPER_ADMIN')
export class MetricsController {
  constructor(private readonly svc: MetricsService) {}

  @Get('status')
  @ApiOperation({ summary: 'حالة النظام (Admin)' })
  status() { return this.svc.status(); }

  @Get('metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4')
  @ApiOperation({ summary: 'Prometheus metrics (Admin)' })
  metrics() { return this.svc.prometheus(); }
}
