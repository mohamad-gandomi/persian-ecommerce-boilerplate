import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FlashDealsService } from './flash-deals.service';
import { CreateFlashDealDto } from './dto/create-flash-deal.dto';
import { UpdateFlashDealDto } from './dto/update-flash-deal.dto';
import { AddDealItemDto } from './dto/add-deal-item.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { FeatureGuard } from '@/common/guards/feature.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { RequireFeature } from '@/common/decorators/require-feature.decorator';
import { Role } from '@/common/enums/role.enum';

@ApiTags('Flash Deals')
@Controller('flash-deals')
@RequireFeature('flashDeals')
@UseGuards(FeatureGuard)
export class FlashDealsController {
  constructor(private readonly flashDealsService: FlashDealsService) {}

  @Get('active')
  @ApiOperation({
    summary: 'دریافت فروش شگفت‌انگیز فعال برای صفحه اصلی فروشگاه (عمومی)',
    description: 'بازگرداندن مشخصات کمپین فعال فعلی همراه با محصولات تخفیف‌دار، تایمر و پاداش خرید',
  })
  getActiveDeal() {
    return this.flashDealsService.getActiveDeal();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'لیست تمام کمپین‌های شگفت‌انگیز (مدیریت)' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['all', 'active', 'upcoming', 'expired'],
  })
  findAll(@Query('status') status?: 'all' | 'active' | 'upcoming' | 'expired') {
    return this.flashDealsService.findAll(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت مشخصات و آیتم‌های یک کمپین شگفت‌انگیز' })
  findOne(@Param('id') id: string) {
    return this.flashDealsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد کمپین فروش شگفت‌انگیز جدید' })
  create(@Body() createDto: CreateFlashDealDto) {
    return this.flashDealsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'به‌روزرسانی کمپین فروش شگفت‌انگیز' })
  update(@Param('id') id: string, @Body() updateDto: UpdateFlashDealDto) {
    return this.flashDealsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف کمپین فروش شگفت‌انگیز' })
  remove(@Param('id') id: string) {
    return this.flashDealsService.delete(id);
  }

  @Post(':id/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'افزودن محصول به کمپین شگفت‌انگیز' })
  addItem(@Param('id') id: string, @Body() addItemDto: AddDealItemDto) {
    return this.flashDealsService.addItem(id, addItemDto);
  }

  @Delete(':id/items/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف محصول از کمپین شگفت‌انگیز' })
  removeItem(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.flashDealsService.removeItem(id, productId);
  }
}
