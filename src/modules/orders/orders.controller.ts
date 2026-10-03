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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Get dashboard sales and order statistics' })
  getStats() {
    return this.ordersService.getStats();
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: List and search orders with status filters and pagination' })
  findAll(@Query() filters: FilterOrdersDto) {
    return this.ordersService.findAll(filters);
  }

  @Get('my-orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Customer: Get orders belonging to current user' })
  getMyOrders(@CurrentUser('id') userId: string) {
    return this.ordersService.findByUserId(userId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Public/Admin: Get order details, item breakdown, and timeline' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Public: Create a new order via customer checkout' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() user?: any) {
    return this.ordersService.create(dto, user?.id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update order fulfillment status (PROCESSING, SHIPPED, DELIVERED, CANCELLED)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status, dto.note);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update tracking details, shipping carrier, or internal notes' })
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete order' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
