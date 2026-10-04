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
import { ReferralService } from './referral.service';
import { SetReferralCodeDto } from './dto/set-referral-code.dto';
import { BindReferralDto } from './dto/bind-referral.dto';
import { UpdateReferralSettingsDto } from './dto/referral-settings.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { Role } from '@/common/enums/role.enum';
import { ReferralStatus } from '@prisma/client';
import { RequireFeature } from '@/common/decorators/require-feature.decorator';

@ApiTags('Referral & Rewards')
@RequireFeature('referral')
@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  // ----------------------------------------------------
  // Customer & Public Endpoints
  // ----------------------------------------------------

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Customer: Get own referral code, link and stats' })
  getMyReferralStats(@CurrentUser('id') userId: string) {
    return this.referralService.getOrCreateUserReferralCode(userId);
  }

  @Post('me/customize')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Customer: Set custom vanity referral code' })
  customizeCode(
    @CurrentUser('id') userId: string,
    @Body() dto: SetReferralCodeDto,
  ) {
    return this.referralService.customizeReferralCode(userId, dto.code);
  }

  @Public()
  @Get('track/:code')
  @ApiOperation({ summary: 'Public: Track link click for a referral code' })
  trackLinkClick(@Param('code') code: string) {
    return this.referralService.trackClick(code);
  }

  @Public()
  @Get('validate/:code')
  @ApiOperation({ summary: 'Public: Validate referral code exists and is active' })
  validateCode(@Param('code') code: string) {
    return this.referralService.validateCode(code);
  }

  @Post('bind')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Customer: Bind self to a referrer code' })
  bindReferral(
    @CurrentUser('id') userId: string,
    @Body() dto: BindReferralDto,
  ) {
    return this.referralService.bindReferee(userId, dto.code);
  }

  // ----------------------------------------------------
  // Admin Endpoints
  // ----------------------------------------------------

  @Get('admin/list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: List all referral codes, relationships and stats' })
  listAdmin(
    @Query('search') search?: string,
    @Query('status') status?: ReferralStatus,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.referralService.listReferralsAdmin({
      search,
      status,
      limit: limit ? parseInt(limit, 10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }

  @Get('admin/settings')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Get storewide referral & reward settings' })
  getSettings() {
    return this.referralService.getSettings();
  }

  @Patch('admin/settings')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update storewide referral & reward settings' })
  updateSettings(@Body() dto: UpdateReferralSettingsDto) {
    return this.referralService.updateSettings(dto);
  }
}
