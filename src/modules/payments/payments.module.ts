import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ZarinpalProvider } from './providers/zarinpal.provider';
import { MellatProvider } from './providers/mellat.provider';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, ZarinpalProvider, MellatProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}
