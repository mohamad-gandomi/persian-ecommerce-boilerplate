import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { DiscountType } from '@prisma/client';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID "${id}" not found`);
    }
    return coupon;
  }

  async findByCode(code: string) {
    const normalizedCode = code.trim().toUpperCase();
    return this.prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });
  }

  async create(dto: CreateCouponDto) {
    const normalizedCode = dto.code.trim().toUpperCase();
    const existing = await this.prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });
    if (existing) {
      throw new ConflictException(`Coupon code "${normalizedCode}" already exists`);
    }

    return this.prisma.coupon.create({
      data: {
        ...dto,
        code: normalizedCode,
      },
    });
  }

  async update(id: string, dto: UpdateCouponDto) {
    await this.findOne(id);

    const updateData: any = { ...dto };
    if (dto.code) {
      updateData.code = dto.code.trim().toUpperCase();
      const existing = await this.prisma.coupon.findUnique({
        where: { code: updateData.code },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Coupon code "${updateData.code}" is already in use`);
      }
    }

    return this.prisma.coupon.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.coupon.delete({
      where: { id },
    });
  }

  async validateCoupon(code: string, cartSubtotal: number) {
    const normalizedCode = code.trim().toUpperCase();
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon code "${normalizedCode}" does not exist`);
    }

    if (!coupon.isActive) {
      throw new BadRequestException(`Coupon "${normalizedCode}" is currently inactive`);
    }

    const now = new Date();
    if (coupon.startDate && now < new Date(coupon.startDate)) {
      throw new BadRequestException(`Coupon "${normalizedCode}" is not valid yet`);
    }

    if (coupon.endDate && now > new Date(coupon.endDate)) {
      throw new BadRequestException(`Coupon "${normalizedCode}" has expired`);
    }

    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException(`Coupon "${normalizedCode}" has reached its maximum redemptions`);
    }

    const minAmount = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
    if (cartSubtotal < minAmount) {
      throw new BadRequestException(
        `Minimum order amount of $${minAmount.toFixed(2)} required for coupon "${normalizedCode}"`,
      );
    }

    let discountAmount = 0;
    const discountVal = Number(coupon.discountValue);

    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discountAmount = (cartSubtotal * discountVal) / 100;
      if (coupon.maxDiscountAmount) {
        const maxCap = Number(coupon.maxDiscountAmount);
        if (discountAmount > maxCap) {
          discountAmount = maxCap;
        }
      }
    } else {
      discountAmount = Math.min(discountVal, cartSubtotal);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;
    const finalTotal = Math.max(0, Math.round((cartSubtotal - discountAmount) * 100) / 100);

    return {
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
        maxDiscountAmount: coupon.maxDiscountAmount ? Number(coupon.maxDiscountAmount) : null,
      },
      cartSubtotal,
      discountAmount,
      discountedTotal: finalTotal,
    };
  }

  async incrementUsage(couponId: string) {
    return this.prisma.coupon.update({
      where: { id: couponId },
      data: {
        usageCount: { increment: 1 },
      },
    });
  }
}
