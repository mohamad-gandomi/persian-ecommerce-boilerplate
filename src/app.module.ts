import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { DatabaseModule } from '@/database/database.module';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
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
  ],
})
export class AppModule {}
