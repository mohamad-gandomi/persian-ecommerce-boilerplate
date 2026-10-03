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
import { UsersService } from './users.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Users & Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: List all users with pagination' })
  findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Create a new user or customer account' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Customer: Get saved addresses' })
  getMyAddresses(@CurrentUser('id') userId: string) {
    return this.usersService.getAddresses(userId);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Customer: Add a new address (shipping/billing)' })
  addAddress(@CurrentUser('id') userId: string, @Body() dto: CreateAddressDto) {
    return this.usersService.addAddress(userId, dto);
  }

  @Delete('addresses/:addressId')
  @ApiOperation({ summary: 'Customer: Delete an address' })
  deleteAddress(
    @CurrentUser('id') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.usersService.deleteAddress(userId, addressId);
  }

  @Patch('addresses/:addressId')
  @ApiOperation({ summary: 'Customer: Update an address' })
  updateAddress(
    @CurrentUser('id') userId: string,
    @Param('addressId') addressId: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(userId, addressId, dto);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Get user details by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update user role, status or details' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete user account' })
  remove(
    @Param('id') id: string,
    @CurrentUser('id') currentAdminId: string,
  ) {
    return this.usersService.remove(id, currentAdminId);
  }

  @Post(':id/addresses')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Add an address for a specific user' })
  addAddressForUser(
    @Param('id') userId: string,
    @Body() dto: CreateAddressDto,
  ) {
    return this.usersService.addAddress(userId, dto);
  }

  @Delete(':id/addresses/:addressId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete an address of a specific user' })
  deleteAddressForUser(
    @Param('id') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.usersService.deleteAddress(userId, addressId);
  }

  @Patch(':id/addresses/:addressId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update an address of a specific user' })
  updateAddressForUser(
    @Param('id') userId: string,
    @Param('addressId') addressId: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(userId, addressId, dto);
  }
}
