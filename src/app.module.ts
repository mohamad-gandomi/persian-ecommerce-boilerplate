import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import configuration from '@/config/configuration';
import { DatabaseModule } from '@/database/database.module';
import { SmsModule } from '@/modules/sms/sms.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { ProductsModule } from '@/modules/products/products.module';
import { BlogModule } from '@/modules/blog/blog.module';
import { UploadModule } from '@/modules/upload/upload.module';
import { SettingsModule } from '@/modules/settings/settings.module';
import { CouponsModule } from '@/modules/coupons/coupons.module';
import { ShippingModule } from '@/modules/shipping/shipping.module';
import { PaymentsModule } from '@/modules/payments/payments.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { WalletModule } from '@/modules/wallet/wallet.module';
import { ReferralModule } from '@/modules/referral/referral.module';
import { FlashDealsModule } from '@/modules/flash-deals/flash-deals.module';

import { APP_GUARD } from '@nestjs/core';
import { FeatureGuard } from '@/common/guards/feature.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    SmsModule,
    NotificationsModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    BlogModule,
    UploadModule,
    SettingsModule,
    CouponsModule,
    ShippingModule,
    PaymentsModule,
    OrdersModule,
    WalletModule,
    ReferralModule,
    FlashDealsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: FeatureGuard,
    },
  ],
})
export class AppModule {}

