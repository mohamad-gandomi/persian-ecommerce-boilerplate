import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Public } from '@/common/decorators/public.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';

@ApiTags('System Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all system settings' })
  getAll() {
    return this.settingsService.getAll();
  }

  @Public()
  @Get(':key')
  @ApiOperation({ summary: 'Get system setting by key (e.g. media, store)' })
  getByKey(@Param('key') key: string) {
    return this.settingsService.get(key);
  }

  @Patch(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Update system setting by key' })
  updateSetting(@Param('key') key: string, @Body() body: any) {
    const value = body && typeof body === 'object' && 'value' in body ? body.value : body;
    return this.settingsService.set(key, value);
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Set or replace system setting by key' })
  setSetting(@Param('key') key: string, @Body() body: any) {
    const value = body && typeof body === 'object' && 'value' in body ? body.value : body;
    return this.settingsService.set(key, value);
  }
}
