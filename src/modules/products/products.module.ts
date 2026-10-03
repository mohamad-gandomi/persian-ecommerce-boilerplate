import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';

@Module({
  controllers: [ProductsController, AttributesController],
  providers: [ProductsService, AttributesService],
  exports: [ProductsService, AttributesService],
})
export class ProductsModule {}
