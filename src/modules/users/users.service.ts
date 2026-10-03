import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@/database/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Role } from '@/common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { skip, limit } = pagination;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { addresses: true, blogPosts: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page: pagination.page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { addresses: true, blogPosts: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    return this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        phone: dto.phone?.trim() || null,
        role: dto.role || Role.CUSTOMER,
        isActive: dto.isActive ?? true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    // If changing email, verify uniqueness
    if (dto.email && dto.email.toLowerCase().trim() !== user.email.toLowerCase()) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase().trim() },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('This email is already in use by another account.');
      }
    }

    const data: any = {
      firstName: dto.firstName?.trim(),
      lastName: dto.lastName?.trim(),
      phone: dto.phone !== undefined ? (dto.phone?.trim() || null) : undefined,
      role: dto.role,
      isActive: dto.isActive,
    };

    if (dto.email) {
      data.email = dto.email.toLowerCase().trim();
    }

    if (dto.password && dto.password.trim()) {
      const salt = await bcrypt.genSalt(10);
      data.passwordHash = await bcrypt.hash(dto.password.trim(), salt);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, currentAdminId?: string) {
    if (currentAdminId && id === currentAdminId) {
      throw new BadRequestException('You cannot delete your own active administrator account.');
    }

    const user = await this.findOne(id);

    return this.prisma.user.delete({
      where: { id: user.id },
    });
  }

  async addAddress(userId: string, dto: CreateAddressDto) {
    if (dto.isDefaultShipping) {
      await this.prisma.address.updateMany({
        where: { userId, isDefaultShipping: true },
        data: { isDefaultShipping: false },
      });
    }

    if (dto.isDefaultBilling) {
      await this.prisma.address.updateMany({
        where: { userId, isDefaultBilling: true },
        data: { isDefaultBilling: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found or unauthorized');
    }

    return this.prisma.address.delete({
      where: { id: addressId },
    });
  }

  async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found or unauthorized');
    }

    if (dto.isDefaultShipping) {
      await this.prisma.address.updateMany({
        where: { userId, isDefaultShipping: true, id: { not: addressId } },
        data: { isDefaultShipping: false },
      });
    }

    if (dto.isDefaultBilling) {
      await this.prisma.address.updateMany({
        where: { userId, isDefaultBilling: true, id: { not: addressId } },
        data: { isDefaultBilling: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    });
  }
}
