import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { CreateVariantDto, UpdateVariantDto } from './dto/create-variant.dto';
import { Public } from '@/common/decorators/public.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Public: Filter and browse products (categories, price, search, sorting)' })
  findAll(@Query() filters: FilterProductsDto) {
    return this.productsService.findAll(filters);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Public: Get product details with attributes and variants by slug or ID' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Create a new simple or variable product' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update a product' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete a product' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // --- Variations Endpoints ---

  @Post(':id/variants')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Add a variation (e.g. Walnut + Forest Velvet) to a variable product' })
  addVariant(@Param('id') productId: string, @Body() dto: CreateVariantDto) {
    return this.productsService.addVariant(productId, dto);
  }

  @Patch('variants/:variantId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update a product variation (price, stock, SKU, attributes)' })
  updateVariant(
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(variantId, dto);
  }

  @Delete('variants/:variantId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete a product variation' })
  deleteVariant(@Param('variantId') variantId: string) {
    return this.productsService.deleteVariant(variantId);
  }
}
