import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto, VerifyOtpDto, ChangePhoneSendOtpDto, ChangePhoneVerifyDto } from './dto/otp.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new customer account' })
  @ApiResponse({ status: 201, description: 'Customer registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT Bearer token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('otp/send')
  @ApiOperation({ summary: 'Request SMS OTP verification code via Kavenegar' })
  @ApiResponse({ status: 200, description: 'OTP code sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid phone or rate limited' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify SMS OTP code and log in or auto-register customer' })
  @ApiResponse({ status: 200, description: 'OTP verified, returns user profile and JWT Bearer token' })
  @ApiResponse({ status: 401, description: 'Invalid or expired code' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile of the currently logged in user' })
  @ApiResponse({ status: 200, description: 'Current user profile with saved addresses' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update customer first name, last name, or email' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('phone/send-otp')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request SMS OTP to verify a new phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent to new phone number' })
  async sendPhoneChangeOtp(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePhoneSendOtpDto,
  ) {
    return this.authService.sendPhoneChangeOtp(userId, dto.newPhone);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('phone/verify-change')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify OTP and update user phone number' })
  @ApiResponse({ status: 200, description: 'Phone number updated successfully' })
  async verifyPhoneChange(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePhoneVerifyDto,
  ) {
    return this.authService.verifyPhoneChange(userId, dto.newPhone, dto.code);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset instructions for customer email' })
  @ApiResponse({ status: 200, description: 'Reset instructions issued' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset customer password using reset token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}

