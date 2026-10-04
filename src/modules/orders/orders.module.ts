import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CouponsModule } from '@/modules/coupons/coupons.module';
import { ShippingModule } from '@/modules/shipping/shipping.module';
import { WalletModule } from '@/modules/wallet/wallet.module';
import { ReferralModule } from '@/modules/referral/referral.module';
import { FlashDealsModule } from '@/modules/flash-deals/flash-deals.module';

@Module({
  imports: [CouponsModule, ShippingModule, WalletModule, ReferralModule, FlashDealsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
