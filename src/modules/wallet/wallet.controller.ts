import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { AdminAdjustWalletDto } from './dto/admin-adjust-wallet.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Role } from '@/common/enums/role.enum';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // ----------------------------------------------------
  // Customer Endpoints
  // ----------------------------------------------------

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Customer: Get current user wallet and balance' })
  getMyBalance(@CurrentUser('id') userId: string) {
    return this.walletService.getBalance(userId);
  }

  @Get('me/transactions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Customer: Get own wallet transaction history' })
  getMyTransactions(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.walletService.getTransactions(
      userId,
      limit ? parseInt(limit, 10) : 50,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  // ----------------------------------------------------
  // Admin Endpoints
  // ----------------------------------------------------

  @Get('admin/list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: List all customer wallets and totals' })
  listWallets(
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.walletService.listAllWallets({
      search,
      limit: limit ? parseInt(limit, 10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }

  @Get('admin/transactions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: List all wallet transactions system-wide' })
  getAllTransactions(
    @Query('walletId') walletId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.walletService.getAllTransactions({
      walletId,
      limit: limit ? parseInt(limit, 10) : 30,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }

  @Post('admin/:userId/adjust')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Manually credit or debit user wallet balance' })
  adjustBalance(
    @Param('userId') userId: string,
    @Body() dto: AdminAdjustWalletDto,
  ) {
    return this.walletService.adminAdjust(userId, dto.amount, dto.description);
  }

  @Patch('admin/:userId/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Toggle wallet active or disabled status' })
  toggleStatus(
    @Param('userId') userId: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.walletService.toggleStatus(userId, isActive);
  }
}
