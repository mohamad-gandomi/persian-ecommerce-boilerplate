import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Role } from '@/common/enums/role.enum';
import { CreateShippingMethodDto, UpdateShippingMethodDto } from './dto/shipping.dto';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Public()
  @Get('methods')
  @ApiOperation({ summary: 'Public: List active shipping methods and rates' })
  getMethods() {
    return this.shippingService.findAll();
  }

  @Public()
  @Get('methods/:id')
  @ApiOperation({ summary: 'Public: Get specific shipping method' })
  getMethod(@Param('id') id: string) {
    return this.shippingService.findById(id);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: List all shipping methods including inactive' })
  getAdminMethods() {
    return this.shippingService.findAllAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Create shipping method' })
  createMethod(@Body() dto: CreateShippingMethodDto) {
    return this.shippingService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Update shipping method' })
  updateMethod(@Param('id') id: string, @Body() dto: UpdateShippingMethodDto) {
    return this.shippingService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Delete shipping method' })
  deleteMethod(@Param('id') id: string) {
    return this.shippingService.delete(id);
  }
}
