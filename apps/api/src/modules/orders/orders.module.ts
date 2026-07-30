import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TrackingController } from './tracking.controller';
import { TrackingGateway } from './tracking.gateway';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [OrdersController, TrackingController],
  providers: [OrdersService, TrackingGateway],
  exports: [OrdersService, TrackingGateway],
})
export class OrdersModule {}
