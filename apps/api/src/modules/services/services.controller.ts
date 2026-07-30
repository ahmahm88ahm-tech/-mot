import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Services')
@Controller('services')
@Public()
export class ServicesController {
  constructor(private svc: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'قائمة الخدمات المتاحة (عام)' })
  @ApiQuery({ name: 'city', required: false, description: 'فلترة حسب المدينة' })
  findAll(@Query('city') city?: string) {
    return this.svc.findAll(city);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'تفاصيل خدمة بالـ slug' })
  @ApiParam({ name: 'slug', description: 'معرّف الخدمة النصي' })
  findOne(@Param('slug') slug: string) {
    return this.svc.findOne(slug);
  }
}
