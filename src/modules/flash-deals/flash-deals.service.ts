import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { DiscountType, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CreateFlashDealDto, FlashDealItemInputDto } from './dto/create-flash-deal.dto';
import { UpdateFlashDealDto } from './dto/update-flash-deal.dto';
import { AddDealItemDto } from './dto/add-deal-item.dto';

@Injectable()
export class FlashDealsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0600-\u06FF-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private calculateSpecialPrice(
    basePrice: number,
    discountType: DiscountType,
    discountValue: number,
  ): number {
    if (discountType === DiscountType.PERCENTAGE) {
      const discount = (basePrice * discountValue) / 100;
      return Math.max(0, Math.round(basePrice - discount));
    } else {
      return Math.max(0, Math.round(basePrice - discountValue));
    }
  }

  async findAll(status?: 'all' | 'active' | 'upcoming' | 'expired') {
    const now = new Date();
    let where: Prisma.FlashDealWhereInput = {};

    if (status === 'active') {
      where = {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      };
    } else if (status === 'upcoming') {
      where = {
        startDate: { gt: now },
      };
    } else if (status === 'expired') {
      where = {
        endDate: { lt: now },
      };
    }

    const deals = await this.prisma.flashDeal.findMany({
      where,
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: { items: true },
        },
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
      },
    });

    return deals.map((deal) => {
      const isCurrentlyActive =
        deal.isActive && now >= deal.startDate && now <= deal.endDate;
      const isUpcoming = now < deal.startDate;
      const isExpired = now > deal.endDate;

      let remainingSeconds = 0;
      if (isCurrentlyActive) {
        remainingSeconds = Math.max(
          0,
          Math.floor((deal.endDate.getTime() - now.getTime()) / 1000),
        );
      }

      return {
        ...deal,
        isCurrentlyActive,
        isUpcoming,
        isExpired,
        remainingSeconds,
        itemsCount: deal._count.items,
      };
    });
  }

  async findOne(id: string) {
    const deal = await this.prisma.flashDeal.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!deal) {
      throw new NotFoundException(`پیشنهاد شگفت‌انگیز با شناسه ${id} یافت نشد`);
    }

    const now = new Date();
    const isCurrentlyActive =
      deal.isActive && now >= deal.startDate && now <= deal.endDate;
    const remainingSeconds = isCurrentlyActive
      ? Math.max(0, Math.floor((deal.endDate.getTime() - now.getTime()) / 1000))
      : 0;

    return {
      ...deal,
      isCurrentlyActive,
      isUpcoming: now < deal.startDate,
      isExpired: now > deal.endDate,
      remainingSeconds,
    };
  }

  /**
   * Public endpoint to get the currently active Flash Deal for the storefront (banner & carousel)
   */
  async getActiveDeal() {
    if (!this.configService.get<boolean>('features.flashDeals', true)) {
      return null;
    }
    const now = new Date();
    const deal = await this.prisma.flashDeal.findFirst({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!deal) {
      return null;
    }

    const remainingSeconds = Math.max(
      0,
      Math.floor((deal.endDate.getTime() - now.getTime()) / 1000),
    );

    const formattedItems = deal.items.map((item) => {
      const primaryImage =
        item.product.images.find((img) => img.isPrimary)?.url ||
        item.product.images[0]?.url ||
        null;

      const originalPrice = Number(item.product.basePrice);
      const specialPrice = Number(item.specialPrice);
      const discountPercentage =
        originalPrice > 0
          ? Math.round(((originalPrice - specialPrice) / originalPrice) * 100)
          : 0;

      const hasStockLimit = item.stockLimit !== null;
      const isStockAvailable =
        item.product.stockQuantity > 0 &&
        (!hasStockLimit || item.soldCount < (item.stockLimit || 0));

      return {
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productSlug: item.product.slug,
        categoryName: item.product.category?.name || 'عمومی',
        imageUrl: primaryImage,
        originalPrice,
        specialPrice,
        discountPercentage,
        cashbackAmount: item.cashbackAmount ? Number(item.cashbackAmount) : 0,
        referrerReward: item.referrerReward ? Number(item.referrerReward) : 0,
        stockLimit: item.stockLimit,
        soldCount: item.soldCount,
        isAvailable: isStockAvailable,
      };
    });

    return {
      id: deal.id,
      title: deal.title,
      slug: deal.slug,
      description: deal.description,
      badgeText: deal.badgeText || 'پیشنهاد شگفت‌انگیز',
      bannerImage: deal.bannerImage,
      startDate: deal.startDate.toISOString(),
      endDate: deal.endDate.toISOString(),
      remainingSeconds,
      items: formattedItems,
    };
  }

  async create(dto: CreateFlashDealDto) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (end <= start) {
      throw new BadRequestException('تاریخ و زمان پایان باید بعد از تاریخ شروع باشد');
    }

    let slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.title);
    if (!slug) slug = `deal-${Date.now()}`;

    // Ensure unique slug
    const existing = await this.prisma.flashDeal.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // Prepare items if provided
    const itemsData: Prisma.FlashDealItemCreateWithoutDealInput[] = [];

    if (dto.items && dto.items.length > 0) {
      for (const itemInput of dto.items) {
        const product = await this.prisma.product.findUnique({
          where: { id: itemInput.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `محصول با شناسه ${itemInput.productId} یافت نشد`,
          );
        }

        const discountType = itemInput.discountType || DiscountType.PERCENTAGE;
        const discountValue = itemInput.discountValue;
        const basePrice = Number(product.basePrice);

        const specialPrice =
          itemInput.specialPrice !== undefined
            ? itemInput.specialPrice
            : this.calculateSpecialPrice(basePrice, discountType, discountValue);

        const cashbackAmount =
          itemInput.cashbackAmount !== undefined
            ? itemInput.cashbackAmount
            : dto.defaultCashback !== undefined
            ? dto.defaultCashback
            : 0;

        const referrerReward =
          itemInput.referrerReward !== undefined
            ? itemInput.referrerReward
            : dto.defaultReferrerReward !== undefined
            ? dto.defaultReferrerReward
            : 0;

        itemsData.push({
          product: { connect: { id: product.id } },
          discountType,
          discountValue: new Prisma.Decimal(discountValue),
          specialPrice: new Prisma.Decimal(specialPrice),
          cashbackAmount: cashbackAmount ? new Prisma.Decimal(cashbackAmount) : null,
          referrerReward: referrerReward ? new Prisma.Decimal(referrerReward) : null,
          stockLimit: itemInput.stockLimit ?? null,
        });
      }
    }

    return this.prisma.flashDeal.create({
      data: {
        title: dto.title.trim(),
        slug,
        description: dto.description?.trim() || null,
        badgeText: dto.badgeText?.trim() || 'پیشنهاد شگفت‌انگیز',
        bannerImage: dto.bannerImage?.trim() || null,
        startDate: start,
        endDate: end,
        isActive: dto.isActive ?? true,
        defaultCashback: dto.defaultCashback
          ? new Prisma.Decimal(dto.defaultCashback)
          : null,
        defaultReferrerReward: dto.defaultReferrerReward
          ? new Prisma.Decimal(dto.defaultReferrerReward)
          : null,
        items: itemsData.length > 0 ? { create: itemsData } : undefined,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateFlashDealDto) {
    const deal = await this.findOne(id);

    const start = dto.startDate ? new Date(dto.startDate) : deal.startDate;
    const end = dto.endDate ? new Date(dto.endDate) : deal.endDate;

    if (end <= start) {
      throw new BadRequestException('تاریخ و زمان پایان باید بعد از تاریخ شروع باشد');
    }

    let slug = deal.slug;
    if (dto.slug && dto.slug !== deal.slug) {
      slug = this.slugify(dto.slug);
      const existing = await this.prisma.flashDeal.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('نامک (slug) وارد شده تکراری است');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // If items array is explicitly sent, sync items
      if (dto.items !== undefined) {
        await tx.flashDealItem.deleteMany({ where: { dealId: id } });

        for (const itemInput of dto.items) {
          const product = await tx.product.findUnique({
            where: { id: itemInput.productId },
          });

          if (!product) continue;

          const discountType = itemInput.discountType || DiscountType.PERCENTAGE;
          const discountValue = itemInput.discountValue;
          const basePrice = Number(product.basePrice);

          const specialPrice =
            itemInput.specialPrice !== undefined
              ? itemInput.specialPrice
              : this.calculateSpecialPrice(basePrice, discountType, discountValue);

          const cashbackAmount =
            itemInput.cashbackAmount !== undefined
              ? itemInput.cashbackAmount
              : dto.defaultCashback !== undefined
              ? dto.defaultCashback
              : deal.defaultCashback
              ? Number(deal.defaultCashback)
              : 0;

          const referrerReward =
            itemInput.referrerReward !== undefined
              ? itemInput.referrerReward
              : dto.defaultReferrerReward !== undefined
              ? dto.defaultReferrerReward
              : deal.defaultReferrerReward
              ? Number(deal.defaultReferrerReward)
              : 0;

          await tx.flashDealItem.create({
            data: {
              dealId: id,
              productId: product.id,
              discountType,
              discountValue: new Prisma.Decimal(discountValue),
              specialPrice: new Prisma.Decimal(specialPrice),
              cashbackAmount: cashbackAmount
                ? new Prisma.Decimal(cashbackAmount)
                : null,
              referrerReward: referrerReward
                ? new Prisma.Decimal(referrerReward)
                : null,
              stockLimit: itemInput.stockLimit ?? null,
            },
          });
        }
      }

      return tx.flashDeal.update({
        where: { id },
        data: {
          title: dto.title !== undefined ? dto.title.trim() : undefined,
          slug,
          description:
            dto.description !== undefined
              ? dto.description?.trim() || null
              : undefined,
          badgeText:
            dto.badgeText !== undefined
              ? dto.badgeText?.trim() || null
              : undefined,
          bannerImage:
            dto.bannerImage !== undefined
              ? dto.bannerImage?.trim() || null
              : undefined,
          startDate: dto.startDate ? start : undefined,
          endDate: dto.endDate ? end : undefined,
          isActive: dto.isActive !== undefined ? dto.isActive : undefined,
          defaultCashback:
            dto.defaultCashback !== undefined
              ? dto.defaultCashback
                ? new Prisma.Decimal(dto.defaultCashback)
                : null
              : undefined,
          defaultReferrerReward:
            dto.defaultReferrerReward !== undefined
              ? dto.defaultReferrerReward
                ? new Prisma.Decimal(dto.defaultReferrerReward)
                : null
              : undefined,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.flashDeal.delete({ where: { id } });
  }

  async addItem(dealId: string, dto: AddDealItemDto) {
    const deal = await this.findOne(dealId);

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException(`محصول با شناسه ${dto.productId} یافت نشد`);
    }

    const discountType = dto.discountType || DiscountType.PERCENTAGE;
    const basePrice = Number(product.basePrice);
    const specialPrice =
      dto.specialPrice !== undefined
        ? dto.specialPrice
        : this.calculateSpecialPrice(basePrice, discountType, dto.discountValue);

    const cashbackAmount =
      dto.cashbackAmount !== undefined
        ? dto.cashbackAmount
        : deal.defaultCashback
        ? Number(deal.defaultCashback)
        : 0;

    const referrerReward =
      dto.referrerReward !== undefined
        ? dto.referrerReward
        : deal.defaultReferrerReward
        ? Number(deal.defaultReferrerReward)
        : 0;

    return this.prisma.flashDealItem.upsert({
      where: {
        dealId_productId: {
          dealId,
          productId: dto.productId,
        },
      },
      update: {
        discountType,
        discountValue: new Prisma.Decimal(dto.discountValue),
        specialPrice: new Prisma.Decimal(specialPrice),
        cashbackAmount: cashbackAmount ? new Prisma.Decimal(cashbackAmount) : null,
        referrerReward: referrerReward ? new Prisma.Decimal(referrerReward) : null,
        stockLimit: dto.stockLimit ?? null,
      },
      create: {
        dealId,
        productId: dto.productId,
        discountType,
        discountValue: new Prisma.Decimal(dto.discountValue),
        specialPrice: new Prisma.Decimal(specialPrice),
        cashbackAmount: cashbackAmount ? new Prisma.Decimal(cashbackAmount) : null,
        referrerReward: referrerReward ? new Prisma.Decimal(referrerReward) : null,
        stockLimit: dto.stockLimit ?? null,
      },
      include: {
        product: true,
      },
    });
  }

  async removeItem(dealId: string, productId: string) {
    await this.findOne(dealId);
    return this.prisma.flashDealItem.delete({
      where: {
        dealId_productId: {
          dealId,
          productId,
        },
      },
    });
  }

  /**
   * Helper used by OrdersService and catalog to check if a product is currently in an active flash deal
   */
  async checkActiveDealForProduct(productId: string) {
    if (!this.configService.get<boolean>('features.flashDeals', true)) {
      return null;
    }
    const now = new Date();
    const item = await this.prisma.flashDealItem.findFirst({
      where: {
        productId,
        deal: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      },
      include: {
        deal: true,
      },
    });

    if (!item) return null;

    // Check stock limit if defined
    if (item.stockLimit !== null && item.soldCount >= item.stockLimit) {
      return null;
    }

    return {
      dealItemId: item.id,
      dealId: item.dealId,
      dealTitle: item.deal.title,
      specialPrice: Number(item.specialPrice),
      cashbackAmount: item.cashbackAmount ? Number(item.cashbackAmount) : 0,
      referrerReward: item.referrerReward ? Number(item.referrerReward) : 0,
      stockLimit: item.stockLimit,
      soldCount: item.soldCount,
    };
  }

  async recordFlashDealSale(dealItemId: string, quantity: number) {
    try {
      await this.prisma.flashDealItem.update({
        where: { id: dealItemId },
        data: {
          soldCount: { increment: quantity },
        },
      });
    } catch (err) {
      console.error('Failed to increment flash deal sold count', err);
    }
  }
}
