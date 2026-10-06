import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { FilterNotificationsDto } from './dto/filter-notifications.dto';
import { TestSmsDto, UpdateNotificationSettingsDto } from './dto/notification-settings.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequireFeature } from '@/common/decorators/require-feature.decorator';
import { Role } from '@/common/enums/role.enum';

@ApiTags('Notifications')
@RequireFeature('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ----------------------------------------------------
  // User Endpoints
  // ----------------------------------------------------

  @Get('my')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Customer: List my notifications' })
  findMyNotifications(
    @CurrentUser('id') userId: string,
    @Query() filters: FilterNotificationsDto,
  ) {
    return this.notificationsService.findForUser(userId, filters);
  }

  @Get('my/unread-count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Customer: Get count of unread notifications' })
  getMyUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUserUnreadCount(userId);
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark a notification as read' })
  markAsRead(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';
    return this.notificationsService.markAsRead(id, userId, isAdmin);
  }

  @Patch('my/read-all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Customer: Mark all my notifications as read' })
  markAllMyRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId, false);
  }

  // ----------------------------------------------------
  // Admin Endpoints
  // ----------------------------------------------------

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: List admin notifications' })
  findAdminNotifications(@Query() filters: FilterNotificationsDto) {
    return this.notificationsService.findForAdmin(filters);
  }

  @Get('admin/unread-count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Get count of unread admin notifications' })
  getAdminUnreadCount() {
    return this.notificationsService.getAdminUnreadCount();
  }

  @Patch('admin/read-all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Mark all admin notifications as read' })
  markAllAdminRead() {
    return this.notificationsService.markAllAsRead(undefined, true);
  }

  @Get('settings')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Get notification and SMS matrix settings' })
  getSettings() {
    return this.notificationsService.getSettings();
  }

  @Put('settings')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update notification and SMS matrix settings' })
  updateSettings(@Body() dto: UpdateNotificationSettingsDto) {
    return this.notificationsService.updateSettings(dto);
  }

  @Post('test-sms')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Test SMS provider connection' })
  testSms(@Body() dto: TestSmsDto) {
    return this.notificationsService.testSms(dto);
  }

  @Sse('stream')
  @ApiOperation({ summary: 'Server-Sent Events: Realtime notifications stream' })
  streamNotifications(): Observable<MessageEvent> {
    return this.notificationsService.getEventStream().pipe(
      map(
        (event) =>
          ({
            data: JSON.stringify(event.data),
            type: event.event,
          }) as MessageEvent,
      ),
    );
  }
}
