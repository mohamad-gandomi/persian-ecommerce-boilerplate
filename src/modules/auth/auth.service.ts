import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { KavenegarService } from './kavenegar.service';
import { Role } from '@/common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private kavenegarService: KavenegarService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: Role.CUSTOMER,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user,
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const identifier = dto.email.trim();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { phone: identifier },
          { phone: this.normalizePhone(identifier) },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account has been deactivated.');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: token,
    };
  }

  async sendOtp(dto: SendOtpDto) {
    const cleanPhone = this.normalizePhone(dto.phone);

    // Cooldown verification (60 seconds)
    const recentOtp = await this.prisma.otpVerification.findFirst({
      where: {
        phone: cleanPhone,
        used: false,
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentOtp) {
      const remainingSeconds = Math.ceil(
        (recentOtp.createdAt.getTime() + 60 * 1000 - Date.now()) / 1000,
      );
      throw new BadRequestException(
        `Please wait ${remainingSeconds} seconds before requesting a new verification code.`,
      );
    }

    // Invalidate previous active OTPs for this phone
    await this.prisma.otpVerification.updateMany({
      where: { phone: cleanPhone, used: false },
      data: { used: true },
    });

    // Generate random 5-digit code
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 120 * 1000); // 2 minutes expiry

    await this.prisma.otpVerification.create({
      data: {
        phone: cleanPhone,
        code,
        expiresAt,
        used: false,
      },
    });

    // Send via Kavenegar SMS
    const sendResult = await this.kavenegarService.sendVerificationCode(cleanPhone, code);

    return {
      success: true,
      message: 'Verification code sent via SMS.',
      phone: cleanPhone,
      expiresIn: 120,
      devCode: sendResult.isDev ? code : undefined,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const cleanPhone = this.normalizePhone(dto.phone);
    const code = dto.code.trim();

    const record = await this.prisma.otpVerification.findFirst({
      where: {
        phone: cleanPhone,
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new UnauthorizedException('Verification code has expired or is invalid. Please request a new code.');
    }

    if (record.code !== code) {
      const updated = await this.prisma.otpVerification.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });

      if (updated.attempts >= 5) {
        await this.prisma.otpVerification.update({
          where: { id: record.id },
          data: { used: true },
        });
        throw new UnauthorizedException('Maximum attempts reached. Please request a new code.');
      }

      throw new UnauthorizedException('Invalid verification code.');
    }

    // Mark as used
    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { used: true },
    });

    // Look up or auto-create customer user
    let user = await this.prisma.user.findFirst({
      where: { phone: cleanPhone },
    });

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      const internalEmail = `${cleanPhone.replace(/\D/g, '')}@guest.store.internal`;
      const salt = await bcrypt.genSalt(10);
      const dummyPasswordHash = await bcrypt.hash(`OtpUser@${Date.now()}`, salt);

      user = await this.prisma.user.create({
        data: {
          phone: cleanPhone,
          email: internalEmail,
          firstName: 'Customer',
          lastName: '',
          passwordHash: dummyPasswordHash,
          role: Role.CUSTOMER,
        },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account has been deactivated.');
    }

    const token = this.generateToken(user.id, user.email, user.role);
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: token,
      isNewUser,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        addresses: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (dto.email && dto.email.toLowerCase().trim() !== user.email.toLowerCase()) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase().trim() },
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException('This email is already in use by another account.');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName !== undefined ? dto.firstName.trim() : undefined,
        lastName: dto.lastName !== undefined ? dto.lastName.trim() : undefined,
        email: dto.email !== undefined ? dto.email.toLowerCase().trim() : undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        addresses: true,
      },
    });

    return updatedUser;
  }

  async sendPhoneChangeOtp(userId: string, newPhone: string) {
    const cleanPhone = this.normalizePhone(newPhone);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.phone && user.phone === cleanPhone) {
      throw new BadRequestException('The new phone number is identical to your current phone number.');
    }

    // Check if another user is already using this phone number
    const existingUser = await this.prisma.user.findFirst({
      where: { phone: cleanPhone, id: { not: userId } },
    });
    if (existingUser) {
      throw new ConflictException('This phone number is already registered to another account.');
    }

    // Cooldown verification (60 seconds)
    const recentOtp = await this.prisma.otpVerification.findFirst({
      where: {
        phone: cleanPhone,
        used: false,
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentOtp) {
      const remainingSeconds = Math.ceil(
        (recentOtp.createdAt.getTime() + 60 * 1000 - Date.now()) / 1000,
      );
      throw new BadRequestException(
        `Please wait ${remainingSeconds} seconds before requesting a new verification code.`,
      );
    }

    // Invalidate previous active OTPs for this phone
    await this.prisma.otpVerification.updateMany({
      where: { phone: cleanPhone, used: false },
      data: { used: true },
    });

    // Generate random 5-digit code
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 120 * 1000); // 2 minutes expiry

    await this.prisma.otpVerification.create({
      data: {
        phone: cleanPhone,
        code,
        expiresAt,
        used: false,
      },
    });

    // Send via Kavenegar SMS
    const sendResult = await this.kavenegarService.sendVerificationCode(cleanPhone, code);

    return {
      success: true,
      message: `Verification code sent to ${cleanPhone}.`,
      phone: cleanPhone,
      expiresIn: 120,
      devCode: sendResult.isDev ? code : undefined,
    };
  }

  async verifyPhoneChange(userId: string, newPhone: string, inputCode: string) {
    const cleanPhone = this.normalizePhone(newPhone);
    const code = inputCode.trim();

    const record = await this.prisma.otpVerification.findFirst({
      where: {
        phone: cleanPhone,
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new UnauthorizedException('Verification code has expired or is invalid. Please request a new code.');
    }

    if (record.code !== code) {
      const updated = await this.prisma.otpVerification.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });

      if (updated.attempts >= 5) {
        await this.prisma.otpVerification.update({
          where: { id: record.id },
          data: { used: true },
        });
        throw new UnauthorizedException('Maximum attempts reached. Please request a new code.');
      }

      throw new UnauthorizedException('Invalid verification code.');
    }

    // Mark OTP as used
    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { used: true },
    });

    // Ensure phone is not taken by another user
    const existingUser = await this.prisma.user.findFirst({
      where: { phone: cleanPhone, id: { not: userId } },
    });
    if (existingUser) {
      throw new ConflictException('This phone number was recently registered to another account.');
    }

    // Update user phone number
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { phone: cleanPhone },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        addresses: true,
      },
    });

    return {
      success: true,
      message: 'Mobile phone number updated successfully.',
      user: updatedUser,
    };
  }

  private generateToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }

  private normalizePhone(phone: string): string {
    let p = phone.trim().replace(/[\s-]/g, '');
    if (p.startsWith('+98')) {
      p = '0' + p.slice(3);
    } else if (p.startsWith('0098')) {
      p = '0' + p.slice(4);
    } else if (!p.startsWith('0') && p.length === 10) {
      p = '0' + p;
    }
    return p;
  }
}
