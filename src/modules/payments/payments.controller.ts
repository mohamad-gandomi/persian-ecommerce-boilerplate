import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { Public } from '@/common/decorators/public.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Get('gateways')
  @ApiOperation({ summary: 'Public: List available payment gateways (Bank Transfer, Mellat, Zarinpal)' })
  getGateways() {
    return this.paymentsService.getAvailableGateways();
  }

  @Public()
  @Post('initiate')
  @ApiOperation({ summary: 'Public: Initiate payment request and get redirection URL' })
  initiate(@Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(dto);
  }

  @Public()
  @Get('callback/:gateway')
  @ApiOperation({ summary: 'Public: Gateway redirect callback verification (Shaparak / Stripe)' })
  async handleGetCallback(
    @Param('gateway') gateway: string,
    @Query() query: any,
    @Res() res: Response,
  ) {
    const result = await this.paymentsService.verifyPayment(gateway, query);
    // Redirect to frontend order details with status banner
    const targetUrl = `http://localhost:4001/orders/${result.orderId}?payment=${result.success ? 'success' : 'failed'}`;
    return res.redirect(targetUrl);
  }

  @Public()
  @Post('callback/:gateway')
  @ApiOperation({ summary: 'Public: Gateway webhook POST callback' })
  async handlePostCallback(
    @Param('gateway') gateway: string,
    @Body() body: any,
    @Query() query: any,
  ) {
    const mergedPayload = { ...query, ...body };
    return this.paymentsService.verifyPayment(gateway, mergedPayload);
  }

  @Get('transactions/:orderId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Get transaction and payment audit trail for an order' })
  getTransactions(@Param('orderId') orderId: string) {
    return this.paymentsService.getOrderTransactions(orderId);
  }
}
