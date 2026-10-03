import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CouponsModule } from '@/modules/coupons/coupons.module';
import { ShippingModule } from '@/modules/shipping/shipping.module';

@Module({
  imports: [CouponsModule, ShippingModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
